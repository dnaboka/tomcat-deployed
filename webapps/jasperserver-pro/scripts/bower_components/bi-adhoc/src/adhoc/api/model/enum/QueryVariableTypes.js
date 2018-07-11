/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

/**
 * @class QueryVariableTypes
 *
 * @readonly
 * @enum {string}
 */
define(function () {
    return {
        BYTE: "byte",
        SHORT: "short",
        INTEGER: "integer",
        BIG_INTEGER: "bigInteger",
        LONG: "long",
        DOUBLE: "double",
        FLOAT: "float",
        DECIMAL: "decimal",
        BIG_DECIMAL: "bigDecimal",
        DATE: "date",
        TIME: "time",
        TIMESTAMP: "timestamp",
        STRING: "string",
        BOOLEAN: "boolean"
    }
});
