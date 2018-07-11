/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Olesya Bobruyko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var filterGroupTrait = require("../../base/componentViewTrait/filterGroupTrait"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        _ = require("underscore");

    /**
     * @description Mixin that adds methods to DesignerComponentView.
     * @mixin designerFilterGroupTrait
     * @augments filterGroupTrait
     */
    return _.extend(
        /** @lends designerFilterGroupTrait */
        {}, filterGroupTrait, {

            /**
             * @description Calls _initComponent method of filterGroupTrait and initializes events.
             * @memberof designerFilterGroupTrait
             * @private
             */
            _initComponent: function() {
                this.model.isDesigner = true;
                filterGroupTrait._initComponent.apply(this, arguments);

                _.bindAll(this, "_onMouseDown");
                this.$content.on("mousedown", this._onMouseDown);
            },

            /**
             * @description Disables draggable if mousedown was fired on vertical scrollbar.
             * @listens "mousedown"
             * @memberof designerFilterGroupTrait
             * @param {object} e - jQuery event.
             * @private
             */
            _onMouseDown: function(e) {
                var $component = this.$el.parent();

                if ($component.hasClass('ui-draggable')) {
                    var contentOffsetLeft = this.$content.offset().left,
                        isScrollClick = e.pageX > contentOffsetLeft + this.scrollBarPosition.x2
                            && e.pageX < contentOffsetLeft + this.scrollBarPosition.x1;

                    $component.draggable("option", "disabled", isScrollClick);
                }
            },

            /**
             * @description Calls _resizeComponent method of filterGroupTrait and gets the vertical scrollbar position.
             * @memberof designerFilterGroupTrait
             * @private
             */
            _resizeComponent: function() {
                filterGroupTrait._resizeComponent.apply(this, arguments);

                this._getScrollBarPosition();

                var self = this;
                _.chain(this.component.componentViews || []).filter(function(componentView) {
                    return componentView.model.get("type") === dashboardComponentTypes.INPUT_CONTROL
                        && componentView.model.getParent() === self.model;
                }).invoke("_resizeComponent");
            },

            /**
             * @description Gets vertical scrollbar's position.
             * @memberof designerFilterGroupTrait
             * @private
             */
            _getScrollBarPosition: function() {
                var initialOverflow = this.$content.css('overflow-y');
                this.scrollBarPosition = {
                    x1: this.$content.css('overflow-y', 'hidden')[0].clientWidth,
                    x2: this.$content.css('overflow-y', initialOverflow)[0].clientWidth
                };
            },

            /**
             * @description Disables component's buttons.
             * @memberof designerFilterGroupTrait
             * @private
             */
            _toggleButtons: function() {
                this.component.disableButtons();
            },

            _onDashboardPropertiesChange: function(propertiesModel) {
                var changedAttrs = propertiesModel.changedAttributes();

                if ("dashletFilterShowPopup" in changedAttrs) {
                    this.model.set("floating", changedAttrs.dashletFilterShowPopup);
                }
            },

            /**
             * @description Calls _removeComponent method of filterGroupTrait and unsubscribes from events.
             * @memberof designerFilterGroupTrait
             * @private
             */
            _removeComponent: function() {
                filterGroupTrait._removeComponent.apply(this, arguments);

                this.$content.off("mousedown", this._onMouseDown);
            }
        });
});
