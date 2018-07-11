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

    var dataTypes = require("adhoc/filter/enum/filterDataTypes"),
        expressionTypes = require("adhoc/filter/enum/filterExpressionTypes"),
        operators = require("adhoc/filter/enum/filterOperators"),
        _ = require("underscore");

    var expressionTypeMap = {};

    expressionTypeMap[dataTypes.STRING] = {};
    expressionTypeMap[dataTypes.STRING][operators.IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.STRING][operators.NOT_IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.STRING][operators.EQUALS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.NOT_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.CONTAINS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.NOT_CONTAINS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.STARTS_WITH] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.NOT_STARTS_WITH] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.ENDS_WITH] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.STRING][operators.NOT_ENDS_WITH] = expressionTypes.LITERAL;

    expressionTypeMap[dataTypes.NUMERIC] = {};
    expressionTypeMap[dataTypes.NUMERIC][operators.IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.NUMERIC][operators.NOT_IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.NUMERIC][operators.EQUALS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.NOT_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.LESS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.GREATER] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.GREATER_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.LESS_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.NUMERIC][operators.BETWEEN] = expressionTypes.RANGE;
    expressionTypeMap[dataTypes.NUMERIC][operators.NOT_BETWEEN] = expressionTypes.RANGE;

    expressionTypeMap[dataTypes.INTEGER] = {};
    expressionTypeMap[dataTypes.LONG] = {};
    expressionTypeMap[dataTypes.DECIMAL] = {};
    _.extend(expressionTypeMap[dataTypes.INTEGER], expressionTypeMap[dataTypes.NUMERIC]);
    _.extend(expressionTypeMap[dataTypes.LONG], expressionTypeMap[dataTypes.NUMERIC]);
    _.extend(expressionTypeMap[dataTypes.DECIMAL], expressionTypeMap[dataTypes.NUMERIC]);

    expressionTypeMap[dataTypes.BOOLEAN] = {};
    expressionTypeMap[dataTypes.BOOLEAN][operators.IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.BOOLEAN][operators.NOT_IN] = expressionTypes.LIST;
    expressionTypeMap[dataTypes.BOOLEAN][operators.EQUALS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.BOOLEAN][operators.NOT_EQUAL] = expressionTypes.LITERAL;

    expressionTypeMap[dataTypes.TIMESTAMP] = {};
    expressionTypeMap[dataTypes.TIMESTAMP][operators.EQUALS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.NOT_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.LESS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.GREATER] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.GREATER_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.LESS_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.BETWEEN_DATES] = expressionTypes.DATE_RANGE;
    expressionTypeMap[dataTypes.TIMESTAMP][operators.NOT_BETWEEN_DATES] = expressionTypes.DATE_RANGE;

    expressionTypeMap[dataTypes.DATE] = {};
    _.extend(expressionTypeMap[dataTypes.DATE], expressionTypeMap[dataTypes.TIMESTAMP]);

    expressionTypeMap[dataTypes.TIME] = {};
    expressionTypeMap[dataTypes.TIME][operators.EQUALS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.NOT_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.LESS] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.GREATER] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.GREATER_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.LESS_OR_EQUAL] = expressionTypes.LITERAL;
    expressionTypeMap[dataTypes.TIME][operators.BETWEEN] = expressionTypes.RANGE;
    expressionTypeMap[dataTypes.TIME][operators.NOT_BETWEEN] = expressionTypes.RANGE;

    expressionTypeMap[dataTypes.READ_ONLY] = {};
    expressionTypeMap[dataTypes.READ_ONLY][operators.READ_ONLY] = expressionTypes.READ_ONLY;

    return function(dataType, operator) {
        if (!(dataType in expressionTypeMap)) {
            throw new Error("Filter data type '" + dataType + "' is not supported");
        }

        if (!(operator in expressionTypeMap[dataType])) {
            throw new Error("Operator '" + operator + "' is not supported by filter data type '" + dataType + "'");
        }

        return expressionTypeMap[dataType][operator];
    }
});