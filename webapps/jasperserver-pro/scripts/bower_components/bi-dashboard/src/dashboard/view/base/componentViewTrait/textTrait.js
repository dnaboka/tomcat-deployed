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

    /**
     * @mixin textTrait
     * @description Object that extends DesignerComponentView object, mixes text component specific behaviour.
     */
        
    var _ = require("underscore"),
        hyperlinkHandler = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerAdhocExecution"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        FreeTextView = require("../FreeTextView");

    function signalHandler(payload){
        if (payload.name === dashboardWiringStandardIds.REFRESH_SLOT) {
            this._renderComponent();
        } else if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            this._renderComponent();
        }
    }

    return {

        notify: function(signals){
            this.model.notify(signals);
            this.model.collection.getDashboardPropertiesComponent().applyParameters();
        },

        /**
         * @memberof textTrait
         * @access protected
         * @desc initializes FreeTextView component
         */

        _initComponent: function() {
            var self = this;

            this.component = new FreeTextView({
                model: this.model,
                el: this.$content
            });

            this.$content.click(function(ev){
                hyperlinkHandler.events.click(ev, _.reduce(self.model.get("outputParameters"), function(memo, param){
                    memo.parameters[param.id] = param.defaultValue;
                    return memo;
                }, {parameters: {}}), self);
            });

            this.listenTo(this.model, "signal", signalHandler);
            if (this.model.lastPayload) {
                for (var key in this.model.lastPayload){
                    signalHandler.call(this, {name: key, value: this.model.lastPayload[key]}, this.model.lastSender[key]);
                }
            }

            this.on("componentAttached", this.component.applyFontSize, this.component);

            this.listenTo(this.model.collection.getDashboardPropertiesComponent(), "change:dashletPadding", function(props, padding){
                this.component.applyFontSize(padding);
            }, this);
        },


        /**
         * @memberof textTrait
         * @access protected
         * @desc on component properties change event handler. re-Renders component after properties were changed through properties dialog.
         */

        _onComponentPropertiesChange: function(){
            this._renderComponent();
        },

        /**
         * @memberof textTrait
         * @desc renders component
         * @access protected
         * @fires componentRendered
         */

        _renderComponent: function() {
            var text = this.model.getParametrizationResult("text", this.paramsModel.attributes, {tolerateMissing: true});
            this.component.render(text);
            this.trigger("componentRendered", this);
        },

        /**
         * @memberof textTrait
         * @access protected
         * @desc removes component.
         */

        _removeComponent: function() {
            this.component.remove();

            this.off("componentAttached");
            this.stopListening(this.model.collection.getDashboardPropertiesComponent());
        }
    };
});
