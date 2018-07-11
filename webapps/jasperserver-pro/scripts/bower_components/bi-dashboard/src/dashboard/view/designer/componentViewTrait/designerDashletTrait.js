/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require, exports, module) {
    "use strict";

    var dashletTrait = require("../../base/componentViewTrait/dashletTrait"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        PropertiesDialogController = require("dashboard/view/designer/propertiesDialog/PropertiesDialogController"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        ContextMenu = require("common/component/menu/ContextMenu"),
        _ = require("underscore"),
        $ = require("jquery"),
        log = require("logger").register(module);

    function setDataAttributes($el, componentModel) {
        var attrs = ["x", "y", "width", "height"];

        _.each(attrs, function(attr) {
            $el.attr("data-" + attr, componentModel.get(attr));
        });

        $el.attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE, componentModel.id);
    }

    return _.extend({}, dashletTrait, {
        _onViewInitialize: function() {
            dashletTrait._onViewInitialize.apply(this, arguments);

            this.listenTo(this.model, "change:x change:y", this._onComponentMove);
            this.listenTo(this.model, "change:width change:height", this._onComponentResize);
        },

        _onViewRemove: function() {
            dashletTrait._onViewRemove.apply(this, arguments);

            this.$content.off("mousedown");
        },

        _onComponentResize: function() {
            this.$el.parent().css(this.model.getCssPosition());
            setDataAttributes(this.$el.parent(), this.model);

            this.resize();

            log.debug("resized dashlet " + this.model.id);
        },

        _onComponentMove: function() {
            this.$el.parent().css(this.model.getCssPosition());
            setDataAttributes(this.$el.parent(), this.model);

            log.debug("moved dashlet " + this.model.id);
        },

        _onDashboardPropertiesChange: function(model) {
            var changedAttrs = model.changedAttributes();

            if (changedAttrs && ("showDashletBorders" in changedAttrs ||
                "dashletPadding" in changedAttrs ||
                "titleBarColor" in changedAttrs ||
                "titleTextColor" in changedAttrs ||
                "dashletMargin" in changedAttrs)) {
                this._setDashletVisualAppearance();
                this.resize();
            }
        },

        _toggleDashletToolbarButtons: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").disable();
                this.toolbar.getOptionView("maximize").disable();
                this.toolbar.getOptionView("export").disable();

                this.toolbar.getOptionView("export").enable = this.toolbar.getOptionView("export").disable;
            }
        },

        /**
         * Updates dashlet title
         * @memberof designerDashletTrait
         * @public
         */
        updateTitle: function() {
            this.toolbar && this.toolbar.$(".innerLabel > p").text(this.model.get("name"));
        }
    });
});