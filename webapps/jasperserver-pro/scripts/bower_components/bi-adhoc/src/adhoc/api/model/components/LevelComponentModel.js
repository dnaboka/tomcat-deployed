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
        BaseComponentModel = require("./BaseComponentModel");

    return BaseComponentModel.extend({

        defaults: {
            includeAll: true
        },

        initialize: function(attributes, options) {
            // TODO fix on server 
            this.unset("label", {silent: true});
        },

        isMeasure: function() {
            return this.get("reference") === "Measures";
        },

        hasSummary: function(){
            return this.attributes.includeAll;
        },

        prevLevel: function(){
            for (var i = 1; i< this.collection.length; i++){
                if (this.collection.models[i] === this){
                    return this.collection.models[i - 1];
                }
            }
        },

        nextLevel: function(){
            for (var i = 0; i< this.collection.length - 1; i++){
                if (this.collection.models[i] === this){
                    return this.collection.models[i + 1];
                }
            }
        }
    });
});