/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        // Browser globals.
        globalScope.hcDateTimeFormats = factory();
    }
}(function () {
    "use strict";

    return {

        dateTimeLabelFormatsMap: {
            "day": {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%b %e, %Y',
                week: '%b %e, %Y',
                month: '%b %e, %Y',
                year: '%b %e, %Y'
            },

            "hour_by_day": {
                millisecond: '%b %e, %Y %H:%M:%S.%L',
                second: '%b %e, %Y %H:%M:%S',
                minute: '%b %e, %Y %H:%M',
                hour: '%b %e, %Y %H:%M',
                day: '%b %e, %Y %H:%M',
                week: '%b %e, %Y %H:%M',
                month: '%b %e, %Y %H:%M',
                year: '%b %e, %Y %H:%M'
            },

            "minute_by_day": {
                millisecond: '%b %e, %Y %H:%M:%S.%L',
                second: '%b %e, %Y %H:%M:%S',
                minute: '%b %e, %Y %H:%M',
                hour: '%b %e, %Y %H:%M',
                day: '%b %e, %Y %H:%M',
                week: '%b %e, %Y %H:%M',
                month: '%b %e, %Y %H:%M',
                year: '%b %e, %Y %H:%M'
            },

            "second_by_day": {
                millisecond: '%b %e, %Y %H:%M:%S.%L',
                second: '%b %e, %Y %H:%M:%S',
                minute: '%b %e, %Y %H:%M:%S',
                hour: '%b %e, %Y %H:%M:%S',
                day: '%b %e, %Y %H:%M:%S',
                week: '%b %e, %Y %H:%M:%S',
                month: '%b %e, %Y %H:%M:%S',
                year: '%b %e, %Y %H:%M:%S'
            },

            "millisecond_by_day": {
                millisecond: '%b %e, %Y %H:%M:%S.%L',
                second: '%b %e, %Y %H:%M:%S.%L',
                minute: '%b %e, %Y %H:%M:%S.%L',
                hour: '%b %e, %Y %H:%M:%S.%L',
                day: '%b %e, %Y %H:%M:%S.%L',
                week: '%b %e, %Y %H:%M:%S.%L',
                month: '%b %e, %Y %H:%M:%S.%L',
                year: '%b %e, %Y %H:%M:%S.%L'
            },

            "hour": {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%b %e, %Y',
                month: '%b %e, %Y',
                year: '%b %e, %Y'
            },

            "minute": {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%b %e, %Y',
                month: '%b %e, %Y',
                year: '%b %e, %Y'
            },

            "second": {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M:%S',
                hour: '%H:%M:%S',
                day: '%H:%M:%S',
                week: '%b %e, %Y',
                month: '%b %e, %Y',
                year: '%b %e, %Y'
            },

            "millisecond": {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S.%L',
                minute: '%H:%M:%S.%L',
                hour: '%H:%M:%S.%L',
                day: '%H:%M:%S.%L',
                week: '%b %e, %Y',
                month: '%b %e, %Y',
                year: '%b %e, %Y'
            }
        },

        dateTimeTooltipFormatsMap: {
            "day": '%b %e, %Y',
            "hour_by_day": '%b %e, %Y %H:%M',
            "minute_by_day": '%b %e, %Y %H:%M',
            "second_by_day": '%b %e, %Y %H:%M:%S',
            "millisecond_by_day": '%b %e, %Y %H:%M:%S.%L',
            "hour": '%H:%M',
            "minute": '%H:%M',
            "second": '%H:%M:%S',
            "millisecond": '%H:%M:%S.%L'
        }
    };
}, this));