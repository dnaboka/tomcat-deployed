/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function() {
    "use strict";

    var cookieFunctions = {};

    cookieFunctions.get = function (name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    cookieFunctions.set = function (name, value, options) {
        options = options || {};

        if(options.expires && options.expires.toUTCString) {
            options.expires = options.expires.toUTCString();
        } else {
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate()+30);
            options.expires = currentDate;
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for(var optionName in options){
            updatedCookie += "; " + optionName;

            var optionValue = options[optionName];
            if(optionValue !== true){
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    };

    cookieFunctions.remove = function(name) {
        cookieFunctions.set(name, null, { expires: new Date(1970, 0, 1) });
    };

    return cookieFunctions;
});