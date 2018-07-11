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
     * @mixin webPageTrait
     * @description Object that extends DesignerComponentView object, mixes webPage component specific behaviour.
     */

    var $ = require("jquery"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        WebPageView = require("common/component/webPageView/WebPageView");

    function signalHandler(payload){
        if (payload.name === dashboardWiringStandardIds.REFRESH_SLOT) {
            this.applyUrl(true);
        } else if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            this.applyUrl(false);
        }
    }

    return {

        /**
         * @memberof webPageTrait
         * @access protected
         * @desc initializes component sets url of webPage from model.
         * @listens change:url
         */

        _initComponent: function() {
            this.component = new WebPageView({ url: this.model.get("url"), scrolling: this.model.get("scroll")});

            this.$el.addClass("dashboardVisualization");
            this.listenTo(this.component, "load", function(){
                this.$el.addClass("rendered");
            }, this);

            this.listenTo(this.model, "signal", signalHandler);
            if (this.model.lastPayload) {
                for (var key in this.model.lastPayload){
                    signalHandler.call(this, {name: key, value: this.model.lastPayload[key]}, this.model.lastSender[key]);
                }
            }

            this.listenTo(this.model, "change:url", this.applyUrl, this);
        },


        /**
         * @memberof webPageTrait
         * @access protected
         * @desc renders component.
         * @fires componentRendered
         */

        _renderComponent: function() {
            this.component.render(this.$content);
            this.trigger("componentRendered", this);
        },


        /**
         * @memberof webPageTrait
         * @access protected
         * @desc on component properties change event handler. Refreshes web page if scroll property was changed.
         */

        _onComponentPropertiesChange: function() {
            var changedAttrs = this.model.changedAttributes();

            if (changedAttrs && "scroll" in changedAttrs) {
                this.component.setScrolling(this.model.get("scroll"));
                this.refresh();
            }
        },

        /**
         * @memberof webPageTrait
         * @access protected
         * @desc removes component.
         */

        _removeComponent: function() {
            this.component.remove();
        },

        /**
         * @memberof webPageTrait
         * @access protected
         * @desc Refreshes component.
         */

        refresh: function() {
            this.component.refresh();
            return $.Deferred().resolve();
        },

        /**
         * @memberof webPageTrait
         * @access public
         * @desc Refreshes url depending on template and already passed values. If some values are missing, shows error popup.
         */
        applyUrl: function (alwaysRefresh) {
            try {
                var url = this.model.getParametrizationResult("url", this.paramsModel.attributes);

                if (this.component.url !== url){
                    this.hideMessage();
                    this.component.setUrl(url);
                    this.component.$el.show();
                } else {
                    alwaysRefresh && this.component.refresh();
                }
            } catch(errors){
                this.showMessage({errorCode: "parameter.not.specified"});
                this.component.$el.hide();
            }
        }
    };
});
