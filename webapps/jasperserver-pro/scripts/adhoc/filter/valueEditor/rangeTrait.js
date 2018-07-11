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

    var $ = require("jquery"),
        _ = require("underscore"),
        ValidationError = require("adhoc/filter/validation/ValidationError");

    return {
        onChange : function() {
            var inputs = this.$(this.inputSelector);

            var values = inputs.map(function() {
                return $(this).val();
            }).get();

            var convertedValues = this.convert(values);

            this.setValue(convertedValues);
        },

        convert : function(values) {
            var self = this;

            return _.map(values, function(v) {
                return self.valueConverter ? self.valueConverter(v) : v;
            });
        },

        getValue : function(i) {
            var values = this.model.get("value");
            if (!_.isNumber(i)) {
                return  values;
            }
            return values[i];
        },

        validCallback: function(view, attr, selector) {
            view.markAllFieldsAsValid(attr, selector);
        },

        invalidCallback: function(view, attr, error, selector) {
            view.markAllFieldsAsValid(attr, selector);

            if (!_.isArray(error)) {
                error = [error];
            }
            _.each(error, function(validationError) {
                view.markSingleFieldAsInvalid(validationError instanceof ValidationError ? validationError.getAttr() : attr, validationError, selector);
            });
        },

        markAllFieldsAsValid: function(attr, selector) {
            this.$('[' + selector + ']').text("").parent().removeClass("error");
        }
    };
});