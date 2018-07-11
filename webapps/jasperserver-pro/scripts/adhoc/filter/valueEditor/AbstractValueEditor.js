/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        ValidationError = require("adhoc/filter/validation/ValidationError");

    require("backbone.validation");

    return Backbone.View.extend({

		constructor: function(options) {
			this.initOptions = options;
            this.template = _.template(options.template);
            Backbone.View.apply( this, arguments );
		},

        i18nModel: function(serializedModel) {
            serializedModel.i18n = this.initOptions.i18n;
            return serializedModel;
        },

        serializeModel: function() {
            return this.model.toJSON();
        },

        modelVariableName : "value",

        initialize : function(options) {

            Backbone.Validation.bind(this, {
                valid: this.validCallback,
                invalid: this.invalidCallback,
                selector: "data-validation-field"
            });

            this.init(options);
            this.render();
            this.initView(options);
            this.registerEvents();

            if (options.modelVariable) {
                this.modelVariableName =  options.modelVariable;
            }
        },

        validCallback: function(view, attr, selector) {
            view.markSingleFieldAsValid(attr, selector);
        },

        invalidCallback: function(view, attr, error, selector) {
            view.markSingleFieldAsInvalid(attr, error, selector);
        },

        markSingleFieldAsValid: function(attr, selector) {
            this.$('[' + selector + '="' + attr + '"]').text("").parent().removeClass("error");
        },

        markSingleFieldAsInvalid: function(attr, error, selector) {
            error = _.isArray(error) ? error[0] : error;
            this.$('[' + selector + '="' + attr + '"]')
                .text(error instanceof ValidationError ? error.getMessage() : error)
                .parent()
                .addClass("error");
        },

        init : function(options) {},

        initView : function(options) {},

        removeView : function() {},

        registerEvents : function() {},

        render : function() {
            this.$el.html(this.template(this.i18nModel(this.serializeModel())));
            this.trigger("rendered", this);
            return this;
        },

        convert : function(value) {
            return this.valueConverter ? this.valueConverter(value) : value;
        },

        getValue : function() {
            return this.model.get(this.modelVariableName);
        },

        setValue : function(value) {
            this.model.set(this.modelVariableName, value, {validate : true});
        },

        updateData: function() {
            this.render();
        },

        /**
         * Overrides View.remove() method to free resources.
         *
         * @returns {*}
         */
        remove : function() {
            this.removeView();
            Backbone.Validation.unbind(this);
            Backbone.View.prototype.remove.call(this);
            return this;
        }
    });
});