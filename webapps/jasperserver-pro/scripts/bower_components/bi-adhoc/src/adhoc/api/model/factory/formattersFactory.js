/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id: chartTypes.js 1025 2016-08-11 12:58:43Z psavushc $
 */

define(function(require) {
    var _ = require("underscore"),
        i18n = require("bundle!AdHocBundle"),
        dateFormatter = require("adhoc/api/model/formatters/dateFormatter"),
        timeFormatter = require("adhoc/api/model/formatters/timeFormatter"),
        timestampFormatter = require("adhoc/api/model/formatters/timestampFormatter"),
        numberFormatter = require("adhoc/api/model/formatters/numberFormatter");

    var defaultFormatter = {
            format: function (val, format, opts) {

                if (val === null || val === "") {
                    return "";
                }
                if (val === i18n["node.other.node"]) {
                    return val;
                }

                return val;
            }
        },

        formatters = {
            "java.math.BigDecimal": numberFormatter,
            "java.lang.Byte": numberFormatter,
            "java.lang.Short": numberFormatter,
            "java.lang.Integer": numberFormatter,
            "java.math.BigInteger": numberFormatter,
            "java.lang.Long": numberFormatter,
            "java.lang.Float": numberFormatter,
            "java.lang.Double": numberFormatter,
            "java.lang.Decimal": numberFormatter,
            "java.util.Date": dateFormatter,
            "java.sql.Date": dateFormatter,
            "java.sql.Time": timeFormatter,
            "java.sql.Timestamp": timestampFormatter,

            "bigDecimal": numberFormatter,
            "byte": numberFormatter,
            "short": numberFormatter,
            "integer": numberFormatter,
            "bigInteger": numberFormatter,
            "long": numberFormatter,
            "float": numberFormatter,
            "double": numberFormatter,
            "decimal": numberFormatter,
            "date": dateFormatter,
            "time": timeFormatter,
            "timestamp": timestampFormatter
        };
    
    return function(type){
        return formatters[type] || defaultFormatter;
    }
});


