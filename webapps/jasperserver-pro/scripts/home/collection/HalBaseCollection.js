/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function (require) {

    var BaseCollection = require("home/collection/BaseCollection"),
        HalBaseModel = require("home/model/HalBaseModel");

    return BaseCollection.extend({

        model: HalBaseModel,

        initialize: function(options){
            BaseCollection.prototype.initialize.apply(this, arguments);
            if (options && options.modelRel){
                this.modelRel = options.modelRel;
            }
        },

        reset :  function(){
            var options = arguments[0],
                args = arguments;
            if (options && options._embedded){
                if (!this.modelRel){
                    throw new Error("Relation to model not defined");
                }
                options = options._embedded[this.modelRel];
                args = [options];
            }
            BaseCollection.prototype.reset.apply(this, args);
        }

    });
});