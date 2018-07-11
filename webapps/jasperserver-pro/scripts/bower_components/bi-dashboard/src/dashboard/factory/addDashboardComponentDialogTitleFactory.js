/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";


    /**
     * @constructor
     * @alias factory:addDashboardComponentDialogTitleFactory
     * @param {object} model - component model
     * @classdesc returns add properties dialog title factory. Allows to get add properties dialog title by model type.
     * @returns {string} title
     */

    var i18n = require('bundle!DashboardBundle'),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var titleByType = {};

    var baseTitle = i18n["dashboard.base.dialog.properties.title"];

    titleByType[dashboardComponentTypes.WEB_PAGE_VIEW] = i18n["dashboard.component.web.page.view.add.component.dialog.title"];
    titleByType[dashboardComponentTypes.FREE_TEXT] = i18n["dashboard.component.text.add.component.dialog.title"];
    titleByType[dashboardComponentTypes.IMAGE] = i18n["dashboard.component.image.add.component.dialog.title"];
    titleByType[dashboardComponentTypes.CROSSTAB] = i18n["dashboard.component.crosstab.save.title"];
    titleByType[dashboardComponentTypes.TABLE] = i18n["dashboard.component.table.save.title"];
    titleByType[dashboardComponentTypes.CHART] = i18n["dashboard.component.chart.save.title"];
    titleByType[dashboardComponentTypes.ICHART] = i18n["dashboard.component.ichart.save.title"];

    return function(model) {
        var type;
        var title = (type = model.get("type")) in titleByType
            ? titleByType[type]
            : baseTitle;

        return title;
    };
});
