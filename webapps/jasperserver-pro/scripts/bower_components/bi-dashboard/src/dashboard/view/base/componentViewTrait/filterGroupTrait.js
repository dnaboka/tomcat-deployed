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

    var FilterGroupView = require("./../FilterGroupView"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        LoadingOverlay = require("bi/report/view/LoadingOverlay"),
        dashboardSettings = require("../../../dashboardSettings");

    /**
     * @description Mixin that adds methods to ComponentView.
     * @mixin filterGroupTrait
     */
    return {
        /**
         * Creates FilterGroupView.
         * @memberof filterGroupTrait
         * @private
         */
        _initComponent: function() {
            this.component = new FilterGroupView({ model: this.model, el: this.$content });
            if (this.dashboardProperties && this.dashboardProperties.get("dashletFilterShowPopup")) {
                this.component.model.set("floating", true);
            }

            this._openOverlay = 0;
            this.overlay = new LoadingOverlay({
                propertiesModel: new Backbone.Model(),
                externalContainer: this.$el,
                biComponentContainer: this.component.$el.parent(),
                biComponent: this.component.$el
            });

            this.listenTo(this.model, "beforeChildUpdate", this.showOverlay);
            this.listenTo(this.model, "afterChildUpdate", this.hideOverlay);
        },

        /**
         * Renders component, toggle buttons.
         * @fires "componentRendered"
         * @memberof filterGroupTrait
         * @private
         */
        _renderComponent: function() {
            var self = this;

            this.$content.css("overflow-x", "hidden");

            this.component && this.component.render();

            // dashboardSettings.VISUALIZE_MODE is here for not show broken ICs in Viz.js mode
            if (dashboardSettings.VISUALIZE_MODE) {
                this.$content.hide();
                this.$(".filterGroupButtons").hide();
                this.showMessage({ errorCode: "not.supported.in.visualize" });
            }

            // When filter dashlet is floating, we set the dashlet's styles
            if (this.model.get("floating")) {
                if (this.component && this.component.setFloatingStyle) {
                    _.defer(_.bind(this.component.setFloatingStyle, self));
                }
            }

            this._toggleButtons();

            this.trigger("componentRendered", this);
        },


        /**
         * Resizes input controls width.
         * @memberof filterGroupTrait
         * @private
         */
        _resizeComponent: function() {
            this.component.resizeInputControlsWidth();
        },

        /**
         * Removes component.
         * @memberof filterGroupTrait
         * @private
         */
        _removeComponent: function() {
            this.component.remove();
        },

        /**
         * Enables buttons.
         * @memberof filterGroupTrait
         * @private
         */
        _toggleButtons: function() {
            this.component.enableButtons();
        },

        /**
         * Refreshes component.
         * @memberof filterGroupTrait
         */
        refreshFilterGroup: function() {
            this.component.refresh();
        },

        showOverlay: function(){
            var self = this;

            this._openOverlay++;

            setTimeout(function(){
                if (self._openOverlay){
                    self.overlay.show();
                    self.overlay.$overlayHolder.css({width:"100%", height: "100%"});
                }
            }, 700);
        },

        hideOverlay: function(){
            var self = this;

            this._openOverlay--;

            if (this._openOverlay < 0){
                this._openOverlay = 0;
            }

            _.defer(function(){
                if (!self._openOverlay){
                    self.overlay.hide();
                }
            });
        }
    };
});
