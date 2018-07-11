/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/*
* Sandbox is an abstraction which allows us to send data between different layers of our application
* without the need to pass data through all layers
* It is designed with encapsulation principle in mind.
* It's usually should be used together with sandBoxFactory.
*
* The only thing which client should know is the key.
* Key is the unique identifier of unique sandbox instance
*
* example:
*
* //module 1
* define(function(require) {
*    var uniqueId = "id1345",
*       sandbox = require("sandboxFactory").get(uniqueId);
*
*    sandbox.set("foo", "bar");
*
* })
*
* //module 2
* define(function(require) {
*    var uniqueId = "id1345",
*       sandbox = require("sandboxFactory").get(uniqueId);
*
*    var foo = sandbox.get("foo");
*    sandbox.on("foo", function() {
*       foo = sandbox.get("foo");
*    })
* })
*
*/

 /**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone");

    var Sandbox = function() {
        this.model = new Backbone.Model();
    };

    _.extend(Sandbox.prototype, {

        /* API */

        /**
         * Get value by passed key
         * @param key
         * @returns {*}
         */
        get: function(key) {
            return this.model.get(key);
        },

        /**
         * Set passed value by passed key
         * @param key
         * @param value
         */
        set: function(key, value) {
            this.model.set(key, value);
        },

        /**
         * Ser observer to listen for property chane
         * @param path
         * @param observer
         * @returns {*}
         */
        on: function(path, observer) {
            this.model.on("change:" + path, observer);
        },

        /**
         * Disable observer for property change
         * @param path
         * @param observer
         */
        off: function(path, observer) {
            this.model.off("change:" + path, observer);
        }
    });

    return Sandbox;
});
