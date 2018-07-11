/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Sergii Kylypko, Kostiantyn Tsaregradskyi
 * @version: $Id: BasicHelper.js
 */

define(function(require){

    "use strict";

    var classUtil = require('common/util/classUtil'),
        _ = require("underscore"),
        Backbone = require("backbone");

    var BasicHelper = classUtil.extend({

        constructor: function(strategy){
            this.strategy = strategy;
        },

        init: function(container){
            this.container = container;
        },

        start: function(event){},

        drag: function(event){},

        stop: function(event){},

        drop: function(event, position){},

        deinit: function(){}

    });

    _.extend(BasicHelper.prototype, Backbone.Events);

    return BasicHelper;

});