/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author amalieie
 * @version: $Id: HyperlinkParameterView.js 3513 2015-10-18 20:42:23Z amalieie $
 */

////////////////////////////////////////////////////////////////
// Hyperlink Parameter View
////////////////////////////////////////////////////////////////

define(function (require) {
    /* global dialogs */
    "use strict";


    var _ = require("underscore"),
        jQuery = require("jquery"),
        Backbone = require("backbone"),
        Tooltip = require("common/component/tooltip/Tooltip"),
        i18n = require("bundle!DashboardBundle"),
        templateHyperlinkParameterTooltip = require("text!../template/HyperlinkParameterTooltipTemplate.htm"),
        templateHyperlinkParameter = require("text!../template/HyperlinkParameterTemplate.htm");


    return Backbone.View.extend({
        template: _.template(templateHyperlinkParameter),
        tagName: 'tr',

        initialize: function() {
            this.listenTo(this.model, "destroy", this.remove);
            this.listenTo(this.model, "change", this.render);

            this.render();
        },

        events: {
            "click .edit.button": "_edit",
            "click .delete.button": "_delete",
            "mouseover [data-tooltip]": "showTooltip"
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            this.tooltip = new Tooltip({
                attachTo: this.$el,
                i18n: i18n,
                contentTemplate: templateHyperlinkParameterTooltip
            });

            return this;
        },

        showTooltip: function (event) {
            var options = {};
            options[jQuery(event.target).data('bind')] = true;
            this.tooltip.show(this.model, options);
        },

        _edit: function () {
            this.trigger('edit', this);
        },

        _delete: function () {
            this.trigger("delete", this, this.model);
        },

        remove: function () {
            this.tooltip && this.tooltip.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});