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
            if (options.canvas && options.canvas.type){
                var enabled = adHocModel.dataSet.query.getAllowedTypesList();

                if (!_.contains(enabled, options.canvas.type)){
                    return {
                        message: "The specified visualization type is invalid.",
                        errorCode: "visualization.type.invalid",
                        parameters: [options.canvas.type]
                    }
                }
            }
        }
    }
});
