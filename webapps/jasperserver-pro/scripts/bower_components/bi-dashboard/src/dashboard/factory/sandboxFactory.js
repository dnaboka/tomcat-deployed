/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    /**
     * @constructor
     * @alias factory:sandboxFactory
     * @classdesc returns sandbox factory object. Can be used for different purposes.
     * @returns {Sandbox}
     */


    var Sandbox = require("dashboard/Sandbox"),
        _ = require("underscore");

    return {

        /**
         * @memberof  factory:sandboxFactory
         * @param {string|number} key - sandbox instance key. Used for cache.
         * @desc gets Sandbox instance by given key.
         * @returns {Sandbox} - new Sandbox instance. If key was not passed, returns null.
         */

        get: _.memoize(function(key) {
            if (!key) {
                return null;
            }

            return new Sandbox();
        })
    }
});
