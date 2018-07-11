/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id: ListWithSelection.js 43947 2014-04-02 17:51:07Z sergey.prilukin $
 */

define(function (require) {
    'use strict';

    var _ = require("underscore");

    var dimNamePrefixRegexp2 = /(\[[\w\s.-]+\]\.){2}/,
        dimNamePrefixRegexp1 = /(\[[\w\s.-]+\]\.){1}/,
        dashRegexp = /\]\.\[/g,
        bracketsRegexp = /^\[([^\]]+)\]$/g;

    var OlapFilterValueFormatter = function(isFirstLevelAll) {
        _.bindAll(this, "format");
        this.dimNamePrefixRegexp = isFirstLevelAll ? dimNamePrefixRegexp2 : dimNamePrefixRegexp1;
    };

    _.extend(OlapFilterValueFormatter.prototype, {
        format: function(value) {
            //usual OLAP value is [Dimension].[All Level].[Member1]....

            //Remove dimension name and All level prefixes
            value = value.replace(this.dimNamePrefixRegexp, "");
            value = value.replace(dashRegexp, " - ");
            value = value.replace(bracketsRegexp, "$1");

            return value;
        }
    });

    return OlapFilterValueFormatter;
});
