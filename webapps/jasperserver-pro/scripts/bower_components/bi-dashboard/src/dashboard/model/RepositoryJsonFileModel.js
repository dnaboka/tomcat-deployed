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

    var RepositoryFileModel = require("bi/repository/model/RepositoryFileModel"),
        repositoryFileTypes = require("bi/repository/enum/repositoryFileTypes"),
        _ = require("underscore");

    return RepositoryFileModel.extend({
        stringifyContent: true,

        defaults: (function() {
            return _.extend({}, RepositoryFileModel.prototype.defaults, {
                type: repositoryFileTypes.JSON
            });
        })()
    });
});