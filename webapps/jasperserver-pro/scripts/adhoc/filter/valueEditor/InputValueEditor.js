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

    var _ = require("underscore"),
        $ = require("jquery"),
        jrsConfigs = require("jrs.configs"),
        AbstractValueEditor = require("adhoc/filter/valueEditor/AbstractValueEditor");

    var CORRUPTED_SUFFIX = "_corrupted";

    return AbstractValueEditor.extend({
        inputSelector : "input[type='text']",

        events : function() {
            var eventsObj = {};

            eventsObj["change " + this.inputSelector] = "onChange";

            return eventsObj;
        },

        registerEvents: function() {
            this.listenTo(this.model, "change:" + this.modelVariableName, this.render);
        },

        onChange : function() {
            var $inputElement = $(this.$(this.inputSelector)[0]);
            var convertedValue = this.convert($inputElement.val());
            this.setValue(convertedValue);
        },

        serializeModel: function() {
            var viewModel = this.model.toJSON();

            viewModel.value = this._replaceValue(viewModel.value);

            return viewModel;
        },

        _replaceValue: function(value) {
            if (value === jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE) {
                value = "";
            }

            if (_.isString(value)
                && (value.toLowerCase() === jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE.toLowerCase() + CORRUPTED_SUFFIX
                    || value.toLowerCase() === jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_LABEL.toLowerCase() + CORRUPTED_SUFFIX)) {
                value = value.split(CORRUPTED_SUFFIX)[0];
            }

            return value;
        },

        // we do not allow users to input ~NULL~ and [NULL] constants manually, so we intentionally corrupt value
        _basicValueConverter: function(value) {
            // we do not allow users to input ~NULL~ and [NULL] constants manually, so we intentionally corrupt value
            if (value.toLowerCase() === jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE.toLowerCase()
                || value.toLowerCase() === jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_LABEL.toLowerCase()) {
                value = value + CORRUPTED_SUFFIX;
            }

            if (value === "") {
                value = jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE;
            }

            return value;
        }
    });
});