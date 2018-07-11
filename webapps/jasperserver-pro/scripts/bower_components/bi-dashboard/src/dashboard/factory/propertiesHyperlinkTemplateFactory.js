/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    /**
     * @constructor
     * @alias factory:propertiesHyperlinkTemplateFactory
     * @param {object} model - component model
     * @classdesc returns properties template factory. Allows to get properties template by model type.
     * @returns {string} template
     */

    var dashletHyperlinkTemplate = require("text!dashboard/template/properties/controls/dashletHyperlinkTemplate.htm"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var templateByType = {};

    templateByType[dashboardComponentTypes.DASHBOARD_PROPERTIES] = [].join("\n");

    templateByType[dashboardComponentTypes.WEB_PAGE_VIEW] = [].join("\n");

    templateByType[dashboardComponentTypes.REPORT] = [].join("\n");

    templateByType[dashboardComponentTypes.FREE_TEXT] = [dashletHyperlinkTemplate].join("\n");

    templateByType[dashboardComponentTypes.IMAGE] = [dashletHyperlinkTemplate].join("\n");

    templateByType[dashboardComponentTypes.FILTER_GROUP] = [].join("\n");

    templateByType[dashboardComponentTypes.INPUT_CONTROL] = [].join("\n");

    templateByType[dashboardComponentTypes.ADHOC_VIEW] = [dashletHyperlinkTemplate].join("\n");

    templateByType[dashboardComponentTypes.CROSSTAB] = [].join("\n");

    templateByType[dashboardComponentTypes.TABLE] = [].join("\n");

    templateByType[dashboardComponentTypes.CHART] = [dashletHyperlinkTemplate].join("\n");


    /**
     * @description wraps template into div
     * @access private
     * @memberof factory:propertiesTemplateFactory
     */
    function wrapTemplate(template){
        return '<div>' + template + '</div>';
    }

    return function(model) {
        var type,
            template = (type = model.get("type")) in templateByType  ? templateByType[type] : "";

        return wrapTemplate(template);
    };
});