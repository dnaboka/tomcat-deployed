/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    /**
     * @constructor
     * @alias factory:propertiesBasicTemplateFactory
     * @param {object} model - component model
     * @classdesc returns properties template factory. Allows to get properties template by model type.
     * @returns {string} template
     */

    var dashboardSettings = require("dashboard/dashboardSettings"),

        dashboardPropertiesDialogTemplate = require("text!dashboard/template/properties/dashboardPropertiesDialogTemplate.htm"),
        filterPropertiesDialogTemplate = require("text!dashboard/template/properties/filterPropertiesDialogTemplate.htm"),

        // controls
        autoRefreshControlTemplate = require("text!dashboard/template/properties/controls/autoRefreshControlTemplate.htm"),
        showTitleBarElementsControlTemplateFactory = require("dashboard/factory/showTitleBarElementsControlTemplateFactory"),
        addressControlTemplate = require("text!dashboard/template/properties/controls/addressControlTemplate.htm"),
        webRepoAddressControlTemplate = require("text!dashboard/template/properties/controls/webRepoAddressControlTemplate.htm"),
        scrollBarsControlTemplate = require("text!dashboard/template/properties/controls/scrollBarsControlTemplate.htm"),
        bordersControlTemplate = require("text!dashboard/template/properties/controls/bordersControlTemplate.htm"),
        sourceDataControlTemplate = require("text!dashboard/template/properties/controls/sourceDataControlTemplate.htm"),
        sourceReportControlTemplate = require("text!dashboard/template/properties/controls/sourceReportControlTemplate.htm"),
        sourceAdHocViewControlTemplate = require("text!dashboard/template/properties/controls/sourceAdHocViewControlTemplate.htm"),
        scaleToFitControlTemplate = require("text!dashboard/template/properties/controls/scaleToFitControlTemplate.htm"),
        filtersPerRowControlTemplate = require("text!dashboard/template/properties/controls/filter/filtersPerRowControlTemplate.htm"),
        filterButtonsPositionControlTemplate = require("text!dashboard/template/properties/controls/filter/filterButtonsPositionControlTemplate.htm"),
        applyResetButtonControlTemplate = require("text!dashboard/template/properties/controls/applyResetButtonControlTemplate.htm"),
        textInputControlTemplate = require("text!dashboard/template/properties/controls/text/textInputControlTemplate.htm"),
        textFormattingControlTemplate = require("text!dashboard/template/properties/controls/text/textFormattingControlTemplate.htm"),

        basePropetiesDialogTemplate = require("text!dashboard/template/properties/basePropertiesDialogTemplate.htm"),

        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var templateByType = {};

    templateByType[dashboardComponentTypes.DASHBOARD_PROPERTIES] = [dashboardPropertiesDialogTemplate,
                                                                    autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.WEB_PAGE_VIEW] = [basePropetiesDialogTemplate,
                                                             addressControlTemplate,
                                                             showTitleBarElementsControlTemplateFactory(dashboardComponentTypes.WEB_PAGE_VIEW),
                                                             scrollBarsControlTemplate,
                                                             autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.REPORT] = [basePropetiesDialogTemplate,
                                                      sourceReportControlTemplate,
                                                      showTitleBarElementsControlTemplateFactory(dashboardComponentTypes.REPORT),
                                                      scaleToFitControlTemplate,
                                                      autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.FREE_TEXT] = [basePropetiesDialogTemplate,
                                                         textInputControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.IMAGE] = [basePropetiesDialogTemplate,
                                                     webRepoAddressControlTemplate,
                                                     showTitleBarElementsControlTemplateFactory(dashboardComponentTypes.IMAGE),
                                                     bordersControlTemplate,
                                                     scaleToFitControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.FILTER_GROUP] = [basePropetiesDialogTemplate,
                                                            filtersPerRowControlTemplate,
                                                            applyResetButtonControlTemplate,
                                                            filterButtonsPositionControlTemplate

    ].join("\n");

    templateByType[dashboardComponentTypes.INPUT_CONTROL] = filterPropertiesDialogTemplate;

    templateByType[dashboardComponentTypes.ADHOC_VIEW] = [basePropetiesDialogTemplate,
                                                        sourceAdHocViewControlTemplate,
                                                        showTitleBarElementsControlTemplateFactory(dashboardComponentTypes.ADHOC_VIEW),
                                                        scaleToFitControlTemplate,
                                                        autoRefreshControlTemplate
    ].join("\n");

    templateByType[dashboardComponentTypes.CROSSTAB] = [basePropetiesDialogTemplate,
                                                        sourceDataControlTemplate,
                                                        showTitleBarElementsControlTemplateFactory(dashboardComponentTypes.CROSSTAB),
                                                        scaleToFitControlTemplate,
                                                        autoRefreshControlTemplate
    ].join("\n");
    templateByType[dashboardComponentTypes.TABLE] = templateByType[dashboardComponentTypes.CROSSTAB];
    templateByType[dashboardComponentTypes.CHART] = templateByType[dashboardComponentTypes.CROSSTAB];


    /**
     * @description wraps template into div
     * @access private
     * @memberof factory:propertiesTemplateFactory
     */
    function wrapTemplate(template){
        return '<div>' + template + '</div>';
    }

    return function(model) {
        var type;
        var template = (type = model.get("type")) in templateByType
                ? templateByType[type]
                : basePropetiesDialogTemplate;

        return wrapTemplate(template);
    };
});