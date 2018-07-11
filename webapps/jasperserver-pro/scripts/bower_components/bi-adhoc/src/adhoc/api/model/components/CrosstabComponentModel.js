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
            mergeCrosstabCells: true
        },

        initialize: function(attributes, options) {

        }
    });
});