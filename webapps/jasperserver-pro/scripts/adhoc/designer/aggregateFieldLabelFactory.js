/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 *
 */

/**
 * @author Andriy Godovanets
 * @version $Id$
 */

define(function(require) {
    "use strict";

    var i18n = require("bundle!adhoc_messages"),
        AggregateFunctionEnum = require("adhoc/enum/AggregateFunctionEnum");

    var ADH_FUNCTION_AGGREGATE_NAME_PREFIX = "adh.function.aggregate.name.";

    function getLocalizedAggregateFunction(aggFuncName) {
        var label = i18n[ADH_FUNCTION_AGGREGATE_NAME_PREFIX + aggFuncName];
        return label || aggFuncName;
    }

    return {
        localizeAggregation: getLocalizedAggregateFunction,

        getLabel: function (field) {
            if (!field) {
                return null;
            }

            var fieldName = field.fieldDisplay || field.name;

            return field.defaultAggregateFunction === field.functionOrDefault ?
                fieldName :
            fieldName + " (" + getLocalizedAggregateFunction(field["function"]) + ")";
        }
    }
});