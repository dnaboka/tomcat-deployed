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

        initialize: function(attributes, options) {

        },

        hasMeasures: function(){
            return this.components.find(function(component){
                return component.get("reference") === "Measures";
            })
        }
    });
});