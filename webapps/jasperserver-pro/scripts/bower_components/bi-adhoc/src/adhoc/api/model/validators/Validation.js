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
 * @class Validation
 *
 * @readonly
 * @enum {string}
 */
define(function (require) {

    var validators = [
        require("./VisualizationTypeValidator"),
        require("./ParameterNameValidator"),
        require("./ParameterValueValidator")
    ];

    return function (adHocModel) {
        return {
            validate: function (options, settings) {
                var index = 0, res;

                while (!res && index < validators.length){
                    res = validators[index++].validate(adHocModel, options, settings);
                }

                return res;
            }
        }
    }
});
