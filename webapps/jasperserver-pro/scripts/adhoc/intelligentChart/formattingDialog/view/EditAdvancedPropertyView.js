/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author amalieie
 * @version: $Id$
 */

////////////////////////////////////////////////////////////////
// Edit Admanced Property View
////////////////////////////////////////////////////////////////

define(function (require) {
    /* global dialogs */
    "use strict";


    var _ = require("underscore"),
        Backbone = require("backbone"),
        i18n = require("bundle!adhoc_messages"),
        templateEditAdvancedProperty = require("text!adhoc/intelligentChart/formattingDialog/template/EditAdvancedPropertyTemplate.htm");


    return Backbone.View.extend({
        template: _.template(templateEditAdvancedProperty),
        tagName: "tr",
        className: "edit",

        initialize: function(attrs, options) {
            options = options || {};
            this.editMode = options.editMode;
            this.render();
            this.originalModelValues = this.model.toJSON();

            this.listenTo(this.model, "validated", this._onValidated);
        },

        events: {
            "click .save.button": "_save",
            "click .cancel.button": "_cancel"
        },

        render: function () {
            this.$el.html(this.template(_.extend({}, this.model.attributes, {i18n: i18n})));

            return this;
        },

        _save: function () {
            var values = this._getValues();

            this.model.set(values, {validate:true});

            if (this.model.isValid()) {
                this.trigger(this.editMode ? 'edit' : 'add', this, this.model);
            }
        },

        _onValidated: function() {
            if (this.model.validationError && this.model.validationError.name) {
                this.$('td.name').addClass('error');
                this.$('td.name .warning').removeClass('hidden');
            } else {
                this.$('td.name').removeClass('error');
                this.$('td.name .warning').addClass('hidden');
            }
            if (this.model.validationError && this.model.validationError.value) {
                this.$('td.value').addClass('error');
                this.$('td.value .warning').removeClass('hidden');
            } else {
                this.$('td.value').removeClass('error');
                this.$('td.value .warning').addClass('hidden');
            }
        },

        _getValues: function () {
            return {
                name: this.$("input").val(),
                value: this.$("textarea").val()
            };
        },

        _cancel: function () {
            this.trigger('cancel', this, this.model, this.originalModelValues);
        }
    });
});