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
            return _.map(this.get("value"), function(val) {
                val == null && console && console.warn("Value is undefined or null for some reason", val);
                return {
                    value : encodeURIComponent(val == null ? "" : val),
                    type : filterExpressionTypes.LITERAL,
                    dataType : this.get("filterDataType")
                }
            }, this);
        }
    };
});
