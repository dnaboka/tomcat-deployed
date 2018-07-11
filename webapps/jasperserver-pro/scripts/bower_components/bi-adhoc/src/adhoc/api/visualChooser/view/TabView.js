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

    var _ = require("underscore"),
        Backbone = require("backbone"),
        template = require("text!../template/tabTemplate.htm"),
        visualizationTypesManager = require("../visualizationTypesManager"),
        i18n = require("bundle!AdHocBundle");

    return Backbone.View.extend({
        tagName: "ul",
        className: "jr-mTab jr-mTabVertical jr-mTabReverse jr",
        template: _.template(template),

        events: {
            "click .jr-mTab-item": "_onClickTab",
            "mouseenter .jr-mTab-item": "_onMouseEnter",
            "mouseleave .jr-mTab-item": "_onMouseLeave"
        },

        initialize: function(options) {
            this.i18n = i18n;
        },

        render: function() {
            var allGroups = visualizationTypesManager.getAllGroups();
            this.$el.html(this.template({groups: allGroups}));

            this.$tabElements = this.$("li.jr-mTab-item");

            return this;
        },
        _onMouseEnter: function(event) {
            this.$(event.currentTarget).hasClass("jr-isActive") || this.$(event.currentTarget).addClass("jr-isHovered");
        },
        _onMouseLeave: function(event) {
            this.$(event.currentTarget).removeClass("jr-isHovered");
        },

        _onClickTab: function(click) {
            var $groupEl = this.$(click.currentTarget);

            this.trigger("change:groupSelected", $groupEl.data("groupName"));

            this.$tabElements.filter(".jr-isActive").removeClass("jr-isActive");
            this.$tabElements.filter(".jr-isHovered").removeClass("jr-isHovered");

            $groupEl.addClass("jr-isActive");
        }

    });

});
