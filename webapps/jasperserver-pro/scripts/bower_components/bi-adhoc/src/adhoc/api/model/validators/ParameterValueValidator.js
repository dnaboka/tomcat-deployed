/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id: $
 */

/**
 * @class Validation
 *
 * @readonly
 * @enum {string}
 */
define(function (require) {

    var _ = require("underscore");

    return {
        validate: function (adHocModel, options, settings) {
            if (options.params) {
                var parametersModel = adHocModel.dataSet.query.parameters,
                    keys = _.keys(options.params);

                for (var i = 0; i < keys.length; i++){
                    if (parametersModel._singular[keys[i]] && !options.params[keys[i]].length){
                        return {
                            message: "The parameter " + keys[i] + " must have value.",
                            errorCode: "parameter.value.missing",
                            parameters: [keys[i]]
                        }
                    }
                }
            }
        }
    }
});
