/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function(require) {

    "use strict";

    require("home/util/standardTypeExtensions");

    var  _ = require("underscore");

    return function(srcType){

        var resultType = function (){
            srcType.apply(this, arguments);
        };

        resultType.prototype = Object.create(srcType.prototype);
        resultType.prototype.constructor = resultType;

        return {
            extend : function(extention){
                _.extend(resultType.prototype, extention);
                return resultType;
            }
        }
    }

});