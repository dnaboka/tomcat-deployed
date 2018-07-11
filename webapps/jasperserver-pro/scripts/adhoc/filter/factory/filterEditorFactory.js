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

    var FilterEditor = require("adhoc/filter/editor/FilterEditor"),
        ReadOnlyFilterEditor = require("adhoc/filter/editor/ReadOnlyFilterEditor"),
        OlapFilterEditor = require("adhoc/filter/editor/OlapFilterEditor"),
        filterDataTypes = require("adhoc/filter/enum/filterDataTypes");

    return function(filterDataType, isOlap) {
        var editorConstructor;

        if (isOlap) {
            editorConstructor = OlapFilterEditor;
        } else {
            editorConstructor = filterDataType === filterDataTypes.READ_ONLY ? ReadOnlyFilterEditor : FilterEditor;
        }

        return function(model) {
            return new editorConstructor({
                model: model
            });
        };
    }

});
