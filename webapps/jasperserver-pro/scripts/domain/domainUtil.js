/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        jrsConfigs = require("jrs.configs"),
        domainUsedResourcesTemplate = _.template(require("text!./template/domainUsedResourcesTemplate.htm"));

    function usedResourceMessagePatternToRegexp(usedResourceMessagePattern) {
        return new RegExp(usedResourceMessagePattern
            .replace(".", "\\.")
            .replace("]", "\\]")
            .replace("[", "\\[")
            .replace("{0}", "(\\S+)")
            .replace("{1}", "(\\S+)"), "g");
    }

    window.domainUtil = {
        getUsedResourcesList: function(errorMessage, usedResourceMessagePattern) {
            var usedResourceRegExp = usedResourceMessagePatternToRegexp(usedResourceMessagePattern),
                usedResources = [],
                result;

            while (result = usedResourceRegExp.exec(errorMessage)) { // jshint ignore: line
                usedResources.push({
                    field: result[1],
                    resource: result[2]
                });
            }

            return usedResources;
        },

        indexOfNoAccessMessage: function(errorMessage, resourcesWithNoAccessMessagePattern) {
            return errorMessage.indexOf(resourcesWithNoAccessMessagePattern);
        },

        getUsedResourcesFormattedMessage: function(usedResources, originalErrorMessage, i18n) {
            if (!usedResources.length) {
                return originalErrorMessage;
            }

            var message = i18n['ITEM_BEING_USED_BY_RESOURCE'].split("{0}")[0],
                firstPartOfErrorMessage = originalErrorMessage.split(message)[0],
                resultMsg = (firstPartOfErrorMessage + domainUsedResourcesTemplate({
                    contextPath: jrsConfigs.contextPath,
                    usedResources: usedResources,
                    resourceLabel: i18n["resource.label"],
                    fieldLabel: i18n["field.label"]
                }));

            if (this.indexOfNoAccessMessage(originalErrorMessage, i18n["resourcesWithNoAccess"]) > -1) {
                resultMsg += ("<br/>" + i18n["resourcesWithNoAccess"]);
            }

            return resultMsg;
        }
    };

    return window.domainUtil;
});