/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        DashboardWiringConsumerModel = require("../model/DashboardWiringConsumerModel");

    return Backbone.Collection.extend({
        model: DashboardWiringConsumerModel
    });
});
