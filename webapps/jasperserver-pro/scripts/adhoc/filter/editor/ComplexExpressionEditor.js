/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        i18n = require("bundle!AdHocFiltersBundle"),
        complexExpressionTemplate = require("text!adhoc/filter/editor/template/complexExpressionTemplate.htm");

    return Backbone.View.extend({
        events : {
            "change input" : "onExpressionChange",
            "click .header .button.disclosure" : "onToggleFilter"
        },

        template: _.template(complexExpressionTemplate),

        initialize : function(options) {
            this.listenTo(this.model, "change:complexExpression", this.updateComplexExpression);
            this.listenTo(this.model, "change:filterPodMinimized", this.drawToggleFilter);
        },

        onToggleFilter: function() {
            this.model.set("filterPodMinimized", !this.model.get("filterPodMinimized"));
            this.model.trigger("toggle", this.model);
        },

        drawToggleFilter: function() {
            this.$(".expression.panel")[this.model.get("filterPodMinimized") ? "addClass" : "removeClass"]("minimized");
        },

        render : function() {
            this.$el.empty();

            var viewData = this.model.toJSON();
            viewData.i18n = i18n;

            this.$el.html(this.template(viewData));

            return this;
        },

        onExpressionChange : function() {
            this.model.set("complexExpression", this.$("input").val());
        },

        updateComplexExpression: function() {
            this.$("input").val(this.model.get("complexExpression"));
        }
    });
});
