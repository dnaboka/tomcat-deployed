/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Zakhar Tomchenko
 * @version: $Id: $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore");

    return {
        getColumnsComponent: function(axis) {
            return _.find(this.components.findComponentDeep("axis"), function(component) {
                return component.get("name") === "columns";
            });
        },

        getRowsComponent: function() {
            return _.find(this.components.findComponentDeep("axis"), function(component) {
                return component.get("name") === "rows";
            });
        },

        getMeasuresComponent: function() {
            return this.components.findComponentDeep("measures")[0];
        }
    }
});