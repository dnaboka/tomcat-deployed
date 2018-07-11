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
                    if (!Object.hasOwnProperty.call(parametersModel.attributes, keys[i])){
                        return {
                            message: "Unknown parameter: " + keys[i],
                            errorCode: "parameter.unknown",
                            parameters: [keys[i], _.keys(parametersModel.attributes)]
                        }
                    }
                }
            }
        }
    }
});
