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
        jrsConfigs = require("jrs.configs"),
        _ = require("underscore"),
        calendar2 = require("calendar2/calendar2");

    var REMOVE_SPACES_REGEX = /([\s]+$|^[\s]+)/g,
        // plus OR minus sign
        TRIM_PLUS_OR_MINUS_REGEX = /[\s]*(\+|\-)[\s]*/g;

    return {
        init : function(options) {
            this._calendars = [];
            this.pickerType = options.pickerType;
        },

        render : function() {
            this._destroyCalendars();
            this.$el.html(this.template(this.i18nModel(this.serializeModel())));
            this._setupCalendar(this.$(this.inputSelector), this.pickerType);
            this.trigger("rendered", this);
            return this;
        },

        // Remove all spaces and convert the date value to upper case
        valueConverter : function(value) {
            var normalizedValue = (value || "").toUpperCase().replace(REMOVE_SPACES_REGEX, "");
            normalizedValue = normalizedValue.replace(TRIM_PLUS_OR_MINUS_REGEX, "$1");
            return this._basicValueConverter(normalizedValue);
        },

        removeView : function() {
            this._destroyCalendars();
            this._calendars = null;
        },

        _setupCalendar : function($inputs, calendarType) {
            var self = this;

            $inputs.each(function() {
                var $input =  $(this);

                self._calendars.push(calendar2.instance({
                    inputField: $input,
                    calendarType: calendarType,
                    jqueryPickerOptions: jrsConfigs.calendar.timepicker
                }));
            });
        },

        _destroyCalendars: function() {
            _.invoke(this._calendars, "destroy");
            this._calendars = [];
        }
    };
});
