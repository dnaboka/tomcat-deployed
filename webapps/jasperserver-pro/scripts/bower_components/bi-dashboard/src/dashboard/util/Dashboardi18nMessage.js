/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require){
    "use strict";

    var i18nMessage = require("common/util/i18nMessage");

    /*
     * Class to wrap Dashboard i18n messages.
     */
    return i18nMessage.extend({
        bundle: require("bundle!DashboardBundle")
    });
});