/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Pavel Savushchik
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone");

     return Backbone.Model.extend({
         constructor: function(attr, options) {
             options || (options = {});
             options.parse = true;

             Backbone.Model.prototype.constructor.apply(this, [attr, options]);
         },


        initialize: function(attributes, options) {

        },

        parse: function (attr) {
            this.componentType = attr.componentType;

            return attr.properties;
        },


        toJSON: function() {
            var json = {
                properties: Backbone.Model.prototype.toJSON.call(this),
                components: this.components.toJSON(),
                componentType: this.componentType
            };

            return json;
        },

         getProperties: function() {
             return Backbone.Model.prototype.toJSON.call(this);
         },

         where: function(what){
             return this.components.where(what)
         },

         findWhere: function(what){
             return this.components.findWhere(what)
         }
    });
});