/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),

        dashboardComponentTypes = require("../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../enum/dashboardWiringStandardIds"),
        DashboardWiringCollection = require("../collection/DashboardWiringCollection"),
        DashboardComponentCollection = require("../collection/DashboardComponentCollection");

    return Backbone.Model.extend({
        defaults: {
            id: undefined,
            description: undefined,
            wiring: undefined,
            layout: undefined,
            components: undefined
        },

        initialize: function(attrs, options) {
            this.components = new DashboardComponentCollection();
            this.wiring = new DashboardWiringCollection();

            this.listenTo(this.components, "add", _.bind(function(model, collection, options) {
                this.trigger("addComponent", model, this);
                model.acceptWiringVisitor(this.wiring);
            }, this));

            this.listenTo(this.components, "remove", _.bind(function(model, collection, options) {
                this.trigger("removeComponent", model, this);

                if (model.get("type") === dashboardComponentTypes.INPUT_CONTROL) {
                    this.wiring.unregister(model);
                    if (model.getParent()){
                        if (model.getParent().getChildren().length){
                            model.getParent().notify(true);
                        } else {
                            this.components.remove(model.getParent());
                        }
                    }
                } else if (model.get("type") === dashboardComponentTypes.FILTER_GROUP) {
                    this.components.remove(model.getChildren());
                    model.notify(true);
                    this.wiring.unregister(model);
                } else {
                    this.wiring.unregister(model);
                }

            }, this));

            this.listenTo(this.components, "change", _.bind(function(model, collection, options) {
                var changedAttributes = model.changedAttributes();

                if (changedAttributes) {
                    if ("width" in changedAttributes || "height" in changedAttributes) {
                        this.trigger("resizeComponent", model, this);
                    }

                    if ("x" in changedAttributes || "y" in changedAttributes) {
                        this.trigger("moveComponent", model, this);
                    }

                    if ("selected" in changedAttributes) {
                        this.trigger("selectComponent", model, this);
                    }
                }

                if (_.contains(_.values(dashboardComponentTypes), model.get("type"))) {
                    this.trigger("changeProperties", model, this);
                }
            }, this));

            this.listenTo(this.components, "edit", _.bind(function(model){
                this.trigger("editComponent", model, this);
            }, this));

            this.listenTo(this.components, "changedControlProperties", _.bind(function(control){
                this.trigger("changedControlProperties", control, this);
            }, this));

            this.listenTo(this.wiring, "add change remove", _.bind(function(model, collection, options) {
                this.trigger("changeWiring", model, this);
            }, this));
        },

        startLoadingSequence: function(){
            var wiring = this.wiring,
                self = this,
                propsModel = this.components.getDashboardPropertiesComponent();

            $.when.apply(null, this.components.reduce(function(memo, componentModel){
                componentModel.componentInitializedDfd && memo.push(componentModel.componentInitializedDfd);
                return memo;
            }, [])).then(function(){

                $.when.apply(null, self.components.reduce(function(memo, componentModel){
                    componentModel.paramsDfd && memo.push(componentModel.paramsDfd);
                    return memo;
                }, [])).then(function() {
                    wiring.initialized = true;
                    wiring.trigger("init");
                });

                self.components.setEnabledCascading(true);
                self.components.setMuteFilterPanels(false);
                self.components.setCurrentParametersStateAsDefault();
                propsModel.trigger(dashboardWiringStandardIds.INIT_SIGNAL, {});
                wiring.enableAutowiring();
            });
        },

        hasVisualComponents: function() {
            return this.components.any(function(component) { return component.isVisible() })
        }
    });
});