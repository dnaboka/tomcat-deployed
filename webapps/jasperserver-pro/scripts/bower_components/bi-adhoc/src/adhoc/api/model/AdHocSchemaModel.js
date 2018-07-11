/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore");

    function findInGroup(group, reference) {
        var res;
        for (var i = group.length - 1; i > -1 && !res; i--) {
            if (group[i].group) {
                res = findInGroup(group[i].group.elements, reference)
            } else if (group[i].element) {
                if (group[i].element.hierarchicalName === reference) {
                    res = group[i].element;
                }
            } else {
                throw new Error("Unknown element type in schema");
            }
        }
        return res;
    }
    
    var AdHocSchemaModel = Backbone.Model.extend({

        initialize: function (arr, args) {
            this.contextPath = args.contextPath;
        },

        getByReference: function(reference){
            return findInGroup(this.get("presentation"), reference);
        }
    });

    return AdHocSchemaModel;
});
