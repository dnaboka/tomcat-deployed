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

    var numericTrait = require("adhoc/filter/valueEditor/numericTrait"),
        InputValueEditor = require("adhoc/filter/valueEditor/InputValueEditor");

    return InputValueEditor.extend(numericTrait);
});