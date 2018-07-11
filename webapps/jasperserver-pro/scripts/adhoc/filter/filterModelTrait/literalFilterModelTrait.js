/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        filterExpressionTypes = require("adhoc/filter/enum/filterExpressionTypes"),
        filterOperators = require("adhoc/filter/enum/filterOperators"),
        filterDataTypes = require("adhoc/filter/enum/filterDataTypes"),
        jrsConfigs = require("jrs.configs");

    return {

        _expressionRValue : function() {
            var value = this.get("value");

            return {
                value : encodeURIComponent(value),
                dataType : this.get("filterDataType"),
                type : filterExpressionTypes.LITERAL
            };
        }
    };
});
