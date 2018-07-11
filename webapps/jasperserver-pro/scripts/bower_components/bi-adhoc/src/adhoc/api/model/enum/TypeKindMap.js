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
 * @class TypeKindMap
 *
 * @readonly
 * @enum {string}
 */
define(function (require) {

    var queryVariableTypes = require("./QueryVariableTypes");

    var kindMap = {};

    kindMap[queryVariableTypes.BYTE] = "integer";
    kindMap[queryVariableTypes.SHORT] = "integer";
    kindMap[queryVariableTypes.INTEGER] = "integer";
    kindMap[queryVariableTypes.BIG_INTEGER] = "integer";
    kindMap[queryVariableTypes.LONG] = "integer";
    kindMap[queryVariableTypes.DOUBLE] = "float";
    kindMap[queryVariableTypes.DECIMAL] ="float";
    kindMap[queryVariableTypes.FLOAT] ="float";
    kindMap[queryVariableTypes.BIG_DECIMAL] ="float";
    kindMap[queryVariableTypes.DATE] = "date";
    kindMap[queryVariableTypes.TIME] = "time";
    kindMap[queryVariableTypes.TIMESTAMP] = "timestamp";
    kindMap[queryVariableTypes.STRING] = "string";
    kindMap[queryVariableTypes.BOOLEAN] = "boolean";

    return kindMap;
});
