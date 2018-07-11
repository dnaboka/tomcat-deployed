/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";


    /**
     * @constructor
     * @alias factory:propertiesTitleFactory
     * @param {object} model - component model
     * @classdesc returns properties title factory. Allows to get properties title by model type.
     * @returns {string} title
     */

    var i18n = require('bundle!DashboardBundle'),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var titleByType = {};

    var baseTitle = i18n["dashboard.dashlet.dialog.properties.title"];

    titleByType[dashboardComponentTypes.DASHBOARD_PROPERTIES] = i18n["dashboard.dialog.properties.title"];
    titleByType[dashboardComponentTypes.INPUT_CONTROL] = i18n["dashboard.component.filter.properties.title"];

    return function(model) {
        var type;
        var title = (type = model.get("type")) in titleByType
            ? titleByType[type]
            : baseTitle;

        return title;
    };
});