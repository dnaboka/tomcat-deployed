/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function (require) {

    return function (type) {
        var prefix = "jr-mDatatable-cell-";

        switch (type) {
            case "bigDecimal":
            case "byte":
            case "short":
            case "float":
            case "integer":
            case "long":
            case "double":
            case "decimal":
                return prefix + "number";
            case "date":
            case "time":
            case "timestamp":
                return prefix + "date";
            default:
                return prefix + "text";
        }
    }
});


