/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var rangeTrait = require("adhoc/filter/valueEditor/rangeTrait"),
        NumericValueEditor = require("adhoc/filter/valueEditor/NumericValueEditor");

    return NumericValueEditor.extend(rangeTrait);
});