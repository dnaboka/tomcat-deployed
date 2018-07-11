/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global console */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        filterExpressionTypes = require("adhoc/filter/enum/filterExpressionTypes"),
        filterOperators = require("adhoc/filter/enum/filterOperators");

    return {

        _expressionRValue : function() {
            return {
                type : "list",
                value : _.map(this.get("value"), function(value) {
                    value == null && console && console.warn("Value is undefined or null for some reason", value);
                    return {
                        value : encodeURIComponent(value == null ? "" : value),
                        dataType :  this.get("filterDataType"),
                        type : filterExpressionTypes.LITERAL
                    };
                }, this)
            }
        }
    };
});
