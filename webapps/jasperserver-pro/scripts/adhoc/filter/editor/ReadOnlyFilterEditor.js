/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var FilterEditor = require("adhoc/filter/editor/FilterEditor"),
        _ = require("underscore"),
        readOnlyFilterTemplate = require("text!adhoc/filter/editor/template/readOnlyFilterTemplate.htm");


    return FilterEditor.extend({
        template: _.template(readOnlyFilterTemplate),

        resizeTitle: function() {},

        render : function() {
            return this;
        }
    });
});
