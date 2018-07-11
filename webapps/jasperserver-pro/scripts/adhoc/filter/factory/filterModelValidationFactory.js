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

    var filterDataTypes = require("adhoc/filter/enum/filterDataTypes"),
        filterOperators = require("adhoc/filter/enum/filterOperators"),
        _ = require("underscore");

    var validation = {};

    validation[filterDataTypes.INTEGER] = {};
    validation[filterDataTypes.INTEGER][filterOperators.IN] = { value: { listWithTrueAll: true } };
    validation[filterDataTypes.INTEGER][filterOperators.NOT_IN] = { value: { list: true } };
    validation[filterDataTypes.INTEGER][filterOperators.EQUALS] = { value: { required: true, nullable: true, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.LESS] = { value: { required: true, nullable: false, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.GREATER] = { value: { required: true, nullable: false, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, integer: true } };
    validation[filterDataTypes.INTEGER][filterOperators.BETWEEN] = { value: { integerRange: true } };
    validation[filterDataTypes.INTEGER][filterOperators.NOT_BETWEEN] = { value: { integerRange: true } };

    validation[filterDataTypes.DECIMAL] = {};
    validation[filterDataTypes.DECIMAL][filterOperators.IN] = { value: { listWithTrueAll: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.NOT_IN] = { value: { list: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.EQUALS] = { value: { required: true, nullable: true, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.LESS] = { value: { required: true, nullable: false, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.GREATER] = { value: { required: true, nullable: false, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, decimal: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.BETWEEN] = { value: { decimalRange: true } };
    validation[filterDataTypes.DECIMAL][filterOperators.NOT_BETWEEN] = { value: { decimalRange: true } };

    validation[filterDataTypes.LONG] = {};
    validation[filterDataTypes.LONG][filterOperators.IN] = { value: { listWithTrueAll: true } };
    validation[filterDataTypes.LONG][filterOperators.NOT_IN] = { value: { list: true } };
    validation[filterDataTypes.LONG][filterOperators.EQUALS] = { value: { required: true, nullable: true, long: true } };
    validation[filterDataTypes.LONG][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, long: true } };
    validation[filterDataTypes.LONG][filterOperators.LESS] = { value: { required: true, nullable: false, long: true } };
    validation[filterDataTypes.LONG][filterOperators.GREATER] = { value: { required: true, nullable: false, long: true } };
    validation[filterDataTypes.LONG][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, long: true } };
    validation[filterDataTypes.LONG][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, long: true } };
    validation[filterDataTypes.LONG][filterOperators.BETWEEN] = { value: { longRange: true } };
    validation[filterDataTypes.LONG][filterOperators.NOT_BETWEEN] = { value: { longRange: true } };

    validation[filterDataTypes.NUMERIC] = {};
    _.extend(validation[filterDataTypes.NUMERIC], validation[filterDataTypes.INTEGER]);

    validation[filterDataTypes.STRING] = {};
    validation[filterDataTypes.STRING][filterOperators.IN] = { value: { listWithTrueAll: true } };
    validation[filterDataTypes.STRING][filterOperators.NOT_IN] = { value: { list: true } };
    validation[filterDataTypes.STRING][filterOperators.EQUALS] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.NOT_EQUAL] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.CONTAINS] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.NOT_CONTAINS] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.STARTS_WITH] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.NOT_STARTS_WITH] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.ENDS_WITH] = { value: { required: false, string: true } };
    validation[filterDataTypes.STRING][filterOperators.NOT_ENDS_WITH] = { value: { required: false, string: true } };

    validation[filterDataTypes.BOOLEAN] = {};
    validation[filterDataTypes.BOOLEAN][filterOperators.IN] = { value: { listWithTrueAll: true } };
    validation[filterDataTypes.BOOLEAN][filterOperators.NOT_IN] = { value: { list: true } };
    validation[filterDataTypes.BOOLEAN][filterOperators.EQUALS] = { value: { required: true, boolean: true } };
    validation[filterDataTypes.BOOLEAN][filterOperators.NOT_EQUAL] = { value: { required: true, boolean: true } };

    validation[filterDataTypes.TIME] = {};
    validation[filterDataTypes.TIME][filterOperators.EQUALS] = { value: { required: true, nullable: true, time: true } };
    validation[filterDataTypes.TIME][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, time: true } };
    validation[filterDataTypes.TIME][filterOperators.LESS] = { value: { required: true, nullable: false, time: true } };
    validation[filterDataTypes.TIME][filterOperators.GREATER] = { value: { required: true, nullable: false, time: true } };
    validation[filterDataTypes.TIME][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, time: true } };
    validation[filterDataTypes.TIME][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, time: true } };
    validation[filterDataTypes.TIME][filterOperators.BETWEEN] = { value: { timeRange: true } };
    validation[filterDataTypes.TIME][filterOperators.NOT_BETWEEN] = { value: { timeRange: true } };

    validation[filterDataTypes.TIMESTAMP] = {};
    validation[filterDataTypes.TIMESTAMP][filterOperators.EQUALS] = { value: { required: true, nullable: true, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.LESS] = { value: { required: true, nullable: false, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.GREATER] = { value: { required: true, nullable: false, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, timestamp: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.BETWEEN_DATES] = { value: { timestampRange: true } };
    validation[filterDataTypes.TIMESTAMP][filterOperators.NOT_BETWEEN_DATES] = { value: { timestampRange: true } };

    validation[filterDataTypes.DATE] = {};
    validation[filterDataTypes.DATE][filterOperators.EQUALS] = { value: { required: true, nullable: true, date: true } };
    validation[filterDataTypes.DATE][filterOperators.NOT_EQUAL] = { value: { required: true, nullable: true, date: true } };
    validation[filterDataTypes.DATE][filterOperators.LESS] = { value: { required: true, nullable: false, date: true } };
    validation[filterDataTypes.DATE][filterOperators.GREATER] = { value: { required: true, nullable: false, date: true } };
    validation[filterDataTypes.DATE][filterOperators.GREATER_OR_EQUAL] = { value: { required: true, nullable: false, date: true } };
    validation[filterDataTypes.DATE][filterOperators.LESS_OR_EQUAL] = { value: { required: true, nullable: false, date: true } };
    validation[filterDataTypes.DATE][filterOperators.BETWEEN_DATES] = { value: { dateRange: true } };
    validation[filterDataTypes.DATE][filterOperators.NOT_BETWEEN_DATES] = { value: { dateRange: true } };

    return function(dataType, operator) {
        return dataType in validation && operator in validation[dataType]
            ? validation[dataType][operator]
            : {};
    }

});
