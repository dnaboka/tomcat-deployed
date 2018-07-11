/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        i18n = require('bundle!DashboardBundle'),
        fontSizes = require("dashboard/enum/fontSizes"),
        fonts = require("dashboard/enum/fonts"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        propertiesBasicTemplateFactory = require("dashboard/factory/propertiesBasicTemplateFactory"),
        propertiesFormattingTemplateFactory = require("dashboard/factory/propertiesFormattingTemplateFactory"),
        propertiesHyperlinkTemplateFactory = require("dashboard/factory/propertiesHyperlinkTemplateFactory");

    var basicTabFactory = function (model) {
        return {
            action: "basic",
            content: _.template(propertiesBasicTemplateFactory(model), {
                i18n: i18n,
                options: {
                    autoRefreshTitle: getAutoRefreshTitle(model),
                    filtersPerRow: dashboardSettings.DASHLET_FILTERS_PER_ROW_MAX
                }
            }),
            primary: true,
            label: i18n["dashboard.dialog.properties.tabs.basic"],
            hidden: false
        };
    };

    var formattingTabFactory = function (model) {
        return {
            action: "formatting",
            content: _.template(propertiesFormattingTemplateFactory(model), {
                i18n: i18n,
                options: {
                    autoRefreshTitle: getAutoRefreshTitle(model),
                    fonts: fonts,
                    fontSizes: fontSizes,
                    filtersPerRow: dashboardSettings.DASHLET_FILTERS_PER_ROW_MAX
                }
            }),
            label: i18n["dashboard.dialog.properties.tabs.formatting"],
            hidden: false
        };
    };

    var hyperlinkTabFactory = function (model) {
        return {
            action: "hyperlinks",
            content: _.template(propertiesHyperlinkTemplateFactory(model), {
                i18n: i18n,
                model: model.toJSON()
            }),
            label: i18n["dashboard.dialog.properties.tabs.hyperlinks"],
            hidden: false
        };
    };

    var getAutoRefreshTitle = function (model) {
        return model.get("type") === dashboardComponentTypes.DASHBOARD_PROPERTIES ?
            i18n["dashboard.dialog.properties.auto.refresh"] : i18n["dashboard.dashlet.dialog.properties.auto.refresh"];
    };

    return function (model) {
        var type = model.get('type');

        switch (type) {
            case dashboardComponentTypes.FREE_TEXT:
                return [
                    basicTabFactory(model),
                    formattingTabFactory(model),
                    hyperlinkTabFactory(model)
                ];
            case dashboardComponentTypes.IMAGE:
                return [
                    basicTabFactory(model),
                    hyperlinkTabFactory(model)
                ];
            case dashboardComponentTypes.CHART:
                return [
                    basicTabFactory(model),
                    hyperlinkTabFactory(model)
                ];
            case dashboardComponentTypes.ADHOC_VIEW:
                return model.get('isAdhocChart') ? [
                    basicTabFactory(model),
                    hyperlinkTabFactory(model)
                ] : [
                    basicTabFactory(model)
                ];
            default:
                return [
                    basicTabFactory(model)
                ];
        }
    };
});