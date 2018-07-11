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
        filterExpressionTypes = require("adhoc/filter/enum/filterExpressionTypes");

    return {

        _expressionRValue : function() {
            var start = this.get("value")[0],
                end = this.get("value")[1];

            start == null && console && console.warn("Value is undefined or null for some reason", start);
            end == null && console && console.warn("Value is undefined or null for some reason", end);

            return {
                start : encodeURIComponent(start == null ? "" : start),
                end : encodeURIComponent(end == null ? "" : end),
                dataType : this.get("filterDataType"),
                type : filterExpressionTypes.RANGE
            };
        }
    };
});
