/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {

    var webHelpModule = require("components.webHelp"),
        _ = require("underscore"),
        dashboardSettings = require('dashboard/dashboardSettings'),
        config = require("jrs.configs"),
        DashboardViewer = require("dashboard/DashboardViewer");

    var DASHBOARD_QUERY_STRING_NAME = "dashboardResource";

    var hash = window.location.hash.toString(),
        href = window.location.href.toString(),
        searchString = window.location.search.toString(),
        url = href.indexOf("?") > -1
            ? href.split("?")[0]
            : href.split("#")[0],
        hashParts = hash.split("&"),
        resultingUrl = url,
        newQueryStringParts = [],
        dashboardParams = DashboardViewer.parseDashboardParamsFromString(searchString.substring(1));

    if (hash === "" && searchString.indexOf(DASHBOARD_QUERY_STRING_NAME + "=") > -1) {
        var searchStringParts = searchString.substring(1).split("&"),
            dashboardResourceUri;

        _.each(searchStringParts, function(pair) {
            if (pair.indexOf(DASHBOARD_QUERY_STRING_NAME + "=") > -1) {
                dashboardResourceUri = pair.split(DASHBOARD_QUERY_STRING_NAME + "=")[1];
            } else {
                newQueryStringParts.push(pair);
            }
        });

        window.location.replace(url + "?" + newQueryStringParts.join("&") + "#" + dashboardResourceUri);

        return;
    }

    if (hashParts.length > 1) {
        var hashParams = [hashParts[0]];

        resultingUrl += (searchString === "" ? "?" : searchString + "&") + hashParts.slice(1).join("&") + hashParams[0];

        _.extend(dashboardParams, DashboardViewer.parseDashboardParamsFromString(hashParts.slice(1).join("&")));

        window.location.replace(resultingUrl);
    }

    dashboardSettings.CONTEXT_PATH = config.contextPath;
    webHelpModule.setCurrentContext("dashboard");

    function getValueOfUrlParam(paramName){
        var regExp = new RegExp(paramName + "=([^&?]*)"),
            result, match;

        if (searchString){
            match = searchString.match(regExp);
            if (match && match.length > 1){
                result = match[1];
            }
        }
         return result;
    }

    require(["!domReady"], function(){
        var dashboardViewer = new DashboardViewer({
                el: '#display',
                toolbar: searchString.indexOf("viewAsDashboardFrame=true") === -1,
                params: dashboardParams,
                contextPath: config.contextPath,
                referenceWidth: getValueOfUrlParam("dashboardReferenceWidth"),
                referenceHeight: getValueOfUrlParam("dashboardReferenceHeight")
            });
    });
});
