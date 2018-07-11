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

    var adhocFilterSettings = require("settings!adhocFilterSettings"),
        NULL_VALUE = adhocFilterSettings ? adhocFilterSettings.nullValue : null, //existence check for tests
        NULL_LABEL = adhocFilterSettings ? adhocFilterSettings.nullLabel : null;

    return function(value) {
        return value === NULL_VALUE ? NULL_LABEL : value;
    }
});
