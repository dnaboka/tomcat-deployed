/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        log = require("logger").register(module),
        _ = require("underscore"),
        $ = require("jquery"),
        dashboardSettings = require("../dashboardSettings"),
        DashletModel = require("../model/component/DashletModel"),
        dashboardComponentTypes = require("../enum/dashboardComponentTypes"),
        dashboardComponentModelFactory = require("../factory/dashboardComponentModelFactory");

    function onComponentRemove(model) {
        if (model.isVisualization() &&
            model.get("type") !== dashboardComponentTypes.WEB_PAGE_VIEW && model.get("type") !== dashboardComponentTypes.IMAGE) {
            // after saving dashboard model.resource.resource.get("uri") will point to new URL, which won't work for already added controls
            var resource = model.get("resource"),
                inputControlsModels = this.where({ownerResourceId: resource}),
                otherReportsModels = this.where({resource: resource, type: model.get("type")});

            _.each(inputControlsModels, function(inputControlModel) {
                if (!otherReportsModels.length) {
                    this.remove(inputControlModel);
                }
            }, this);
        }
    }

    function checkUndoRedoOperationFinished(){
        if (!this.find(function(component){
            return component.isValueDeferred && component.isValueDeferred();
        })){
            this.trigger("parametersState:operationFinished", this);
        }
    }

    return Backbone.Collection.extend({
        model: dashboardComponentModelFactory,

        initialize: function() {
            this.enableParametersStateStack();
            
            this.on("remove", _.bind(onComponentRemove, this));

            this.on("change:maximized", function(model) {
                if (model.get("maximized")) {
                    this.each(function(component) {
                        if (component !== model && component.has("maximized")) {
                            component.set("maximized", false);
                        }
                    });
                }
            });

            this.on("parametersState:deferredValueApplied", checkUndoRedoOperationFinished, this);
            this.on("parametersState:operationFinished", function(){
                this.enableParametersStateStack();
                this.trigger("parametersState:canUndo", this.canPopParametersState(-1));
                this.trigger("parametersState:canRedo", this.canPopParametersState(1));
            }, this);
        },

        pushParametersState: function(){
            if (this.isEnabledParametersStateStack()){
                this.invoke("pushParametersState");

                this.trigger("parametersState:canUndo", true);
                this.trigger("parametersState:canRedo", false);
            }
        },

        popParametersState: function(n){
            this.disableParametersStateStack();
            this.invoke("popParametersState", n);
            checkUndoRedoOperationFinished.call(this);
        },

        resetParametersState: function(){
            this.disableParametersStateStack();
            this.invoke("resetParametersState");
            checkUndoRedoOperationFinished.call(this);
        },

        setCurrentParametersStateAsDefault: function(){
            this.invoke("setCurrentParametersStateAsDefault");
        },

        canPopParametersState: function(n){
            return this.reduce(function(memo, component){
                return memo || component.paramsModel.canPopState(n);
            }, false);
        },

        disableParametersStateStack: function () {
            this._enablePush = false;
        },

        enableParametersStateStack: function () {
            this._enablePush = true;
        },
        
        isEnabledParametersStateStack: function(){
            return this._enablePush;
        },

        getValueProducers: function(){
            return this.filter(function(component){
                return component.isValueProducer();
            })
        },

        setMuteFilterPanels: function(mute){
            this.each(function(component){
                if (component.get("type") == dashboardComponentTypes.FILTER_GROUP){
                    component.isMute = mute;
                }
            })
        },

        setEnabledCascading: function(mute){
            this.each(function(component){
                if (component.get("type") == dashboardComponentTypes.INPUT_CONTROL){
                    component.isCascadeEnabled = mute;
                }
            })
        },

        getSelectedComponent: function() {
            return this.findWhere({ selected: true });
        },

        selectComponent: function(componentId) {
            var componentModel = this.get(componentId);

            this.forEach(function(model) {
                if (model !== componentModel) {
                    model.set("selected", false);
                }
            });

            if (componentModel) {
                componentModel.set("selected", true);
            }
        },

        setPositionFromHtml: function(html) {
            try {
                var $html = $("<div></div>").html(html),
                    positionObjects = _.map($html.find("[" + dashboardSettings.COMPONENT_ID_ATTRIBUTE + "]"), DashletModel.htmlToPositionObject);

                this.forEach(function (model) {
                    var position = _.findWhere(positionObjects, {id: model.id});

                    if (position) {
                        model.set(position, {silent: true});
                    }
                });
            } catch (e) {
                log.error(e);
            }
        },

        toHTML: function(setCssPosition) {
            var result = "";

            this.forEach(function(model) {
                if (model instanceof DashletModel) {
                    result += model.toHTML(setCssPosition);
                }
            });

            return result;
        },

        getComponents: function () {
            return this.reduce(function(memo, model) {
                if (model.toDashboardComponentObject && model.get("type") !== dashboardComponentTypes.DASHBOARD_PROPERTIES) {
                    memo.push(model.toDashboardComponentObject());
                }

                return memo;
            },[]);
        },

        getDashboardPropertiesComponent: function() {
            return this.findWhere({ type: dashboardComponentTypes.DASHBOARD_PROPERTIES });
        },

        isOutOfCanvasBounds: function(position) {
            return position.x < 0
                || position.y < 0
                || (position.x + position.width) > dashboardSettings.GRID_WIDTH
                || (position.y + position.height) > dashboardSettings.GRID_HEIGHT;
        },

        overlaps: function(position, ignoreComponentId) {
            return this.some(function(componentModel) {
                if (componentModel instanceof DashletModel) {
                    if (ignoreComponentId === componentModel.get("id")) {
                        return false;
                    }

                    if (componentModel.get("floating")) {
                        return false;
                    }

                    return !(componentModel.get("x") >= position.x + position.width ||
                        componentModel.get("x") + componentModel.get("width") <= position.x ||
                        componentModel.get("y") >= position.y + position.height ||
                        componentModel.get("y") + componentModel.get("height") <= position.y);
                } else {
                    return false;
                }
            });
        }
    });
});