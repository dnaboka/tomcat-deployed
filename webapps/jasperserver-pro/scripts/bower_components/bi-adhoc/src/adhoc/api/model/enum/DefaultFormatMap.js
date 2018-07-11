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
 * @class DefaultFormatMap
 *
 * @readonly
 * @enum {string}
 */
define(function (require) {

    var queryVariableTypes = require("./QueryVariableTypes");

    var defaultFormatMap = {};

    defaultFormatMap[queryVariableTypes.BYTE] = "ADH_100_MASK_int_0";
    defaultFormatMap[queryVariableTypes.SHORT] = "ADH_100_MASK_int_0";
    defaultFormatMap[queryVariableTypes.INTEGER] = "ADH_100_MASK_int_0";
    defaultFormatMap[queryVariableTypes.BIG_INTEGER] = "ADH_100_MASK_int_0";
    defaultFormatMap[queryVariableTypes.LONG] = "ADH_100_MASK_int_0";
    defaultFormatMap[queryVariableTypes.FLOAT] = "ADH_100_MASK_dec_0";
    defaultFormatMap[queryVariableTypes.DOUBLE] = "ADH_100_MASK_dec_0";
    defaultFormatMap[queryVariableTypes.DECIMAL] ="ADH_100_MASK_dec_0";
    defaultFormatMap[queryVariableTypes.BIG_DECIMAL] ="ADH_100_MASK_dec_0";
    defaultFormatMap[queryVariableTypes.DATE] = "ADH_100_MASK_date_0";
    defaultFormatMap[queryVariableTypes.TIME] = "ADH_100_MASK_time_0";
    defaultFormatMap[queryVariableTypes.TIMESTAMP] = "ADH_100_MASK_timestamp_0";
    defaultFormatMap[queryVariableTypes.STRING] = "";
    defaultFormatMap[queryVariableTypes.BOOLEAN] = "";

    return defaultFormatMap;
});
