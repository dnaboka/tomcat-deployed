/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var ReportDashletModel = require("./ReportDashletModel");

    return ReportDashletModel.extend({
        changeType: function(type) {
            this.set("type", type);
        }
    });
});