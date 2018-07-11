/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        visualizationTypesManager = require("../visualizationTypesManager"),
        template = require("text!../template/bodyTemplate.htm"),
        i18n = require("bundle!AdHocBundle");

    return Backbone.View.extend({
        tagName: "ul",
        className: "jr-mVisualchooser-menu jr",
        template: _.template(template),

        events: {
            "click li.jr-mVisualchooser-menu-item": "_onClickItem"
        },

        initialize: function(options) {
            this.i18n = i18n;

            this.on("change:groupSelected", _.bind(this._onTabChange, this));
        },

        render: function() {
            this.$el.html(this.template({types: visualizationTypesManager.getAllTypes()}));

            this.$typeElements = this.$("li.jr-mVisualchooser-menu-item");

            return this;
        },
        
        setSelectedType: function(type) {
            this.$typeElements.filter(".jr-isSelected").removeClass("jr-isSelected");
            this.$typeElements.filter("[data-chart-type=" + type + "]").addClass("jr-isSelected");
        },

        setDisabledTypes: function(types) {
            this.$typeElements.each(function() {
                var $el = $(this);
                if (_.contains(types, $el.data("chartType"))) {
                    $el.addClass("jr-isDisabled");
                } else {
                    $el.removeClass("jr-isDisabled");
                }
            });
        },

        _onClickItem: function(click) {
            var $itemEl = this.$(click.currentTarget);
            if (!$itemEl.hasClass("jr-isDisabled")) {
                this.trigger("change:visualizationType", $itemEl.data("chartType"));
            }
        },


        _onTabChange: function(groupType) {
            if (groupType === "all") {
                this.$typeElements.removeClass("jr-isHidden");
            } else {
                var selectedTypesArray = _.pluck(visualizationTypesManager.getAllTypesInGroup(groupType), "name");

                this.$typeElements.each(function() {
                    var $el = $(this);

                    if (_.contains(selectedTypesArray, $el.data("chartType")) ) {
                        $el.removeClass("jr-isHidden");
                    } else {
                        $el.addClass("jr-isHidden");
                    }
                });
            }
        }

    });

});