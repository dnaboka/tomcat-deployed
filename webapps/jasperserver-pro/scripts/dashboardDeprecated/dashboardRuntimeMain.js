/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global Hash, JRS, alert, pageDimmer, getTextAfterSubstring */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        dashboardRuntime = require("dashboard.runtime"),
        baseControls = require("controls.base"),
        jrsConfigs = require("jrs.configs"),
        jQuery = require("jquery"),
        _ = require("underscore");

    require("utils.common");

    domReady(function() {
        if(window.Prototype) {
            delete Object.prototype.toJSON;
            delete Array.prototype.toJSON;
            delete Hash.prototype.toJSON;
            delete String.prototype.toJSON;
        }

        if (jrsConfigs.dashboardRuntime.isRunInFrame) {
            if (typeof JRS === "undefined") {
                JRS = {}; // jshint ignore: line
            }

            JRS.number_of_charts = 0;
            JRS.charts_rendered = 0;

            /*
             Enlarge text container frame by 3px:
             */
            jQuery('div[id^="textFrameContainer_text_"]').each(function(){
                var it = jQuery(this);
                var ov = it.width();
                it.css('width',ov+3+'px');
            });

            /*
             Wait for all charts to be rendered by FusionCharts managed print then remove modal window:
             */
            jQuery(window).bind('chart_rendered',function(){
                JRS.charts_rendered++;
                if(JRS.charts_rendered == JRS.number_of_charts){
                    jQuery('#managedPrintLoader').hide();
                    pageDimmer.hide();
                    alert('Page is ready to print.');
                }
            });

            /*
             If there are Fusion Charts to be rendered show modal window. Track number of
             Fusion Charts to be rendered.
             */
            jQuery(window).bind('managed_print_request',function(){
                JRS.number_of_charts++;
                pageDimmer.show();
                jQuery('#managedPrintLoader').show();
            });

            window.requestBrowserUpdate = function(){
                if(JRS.number_of_charts === 0){
                    alert('To print our Flash based charts please update to a HTML5 capable browser such as IE9.');
                }
                JRS.number_of_charts++;
            }
        }

        _.extend(dashboardRuntime, jrsConfigs.dashboardRuntime.localContext);
        _.extend(baseControls, jrsConfigs.inputControlConstants);

        // assign onload event handlers to each of iframes in order to hide loading image
        // when frame is fully loaded
        _.each(jrsConfigs.dashboardRuntime.frames, function (frameName) {
            jQuery("#contentFrame_" + frameName).on("load", function () {
                dashboardRuntime._updateIFrameLoadingStatus("containerOverlay_" + frameName);
            });
        });

        _.each(jrsConfigs.dashboardRuntime.contentFrames, function (frame) {
            var urlContext = frame.resourceType === "customResourceType" ? "" : jrsConfigs.contextPath;
            var fidParam =   (urlContext === "" && frame.uri === "") ? "" : "&fid=contentFrame_" + frame.frameName;
            frame.src = urlContext + frame.source + encodeURI(frame.uri) + fidParam;
            if (frame.autoRefresh) {
                dashboardRuntime.setRefreshTimer(frame.frameName, frame.autoRefresh);
            }
        });

        if (_.isArray(jrsConfigs.dashboardRuntime.hiddenParams)) {
            _.each(jrsConfigs.dashboardRuntime.hiddenParams, function (param) {
                param.paramName = getTextAfterSubstring(param.originalParamName, dashboardRuntime.HIDDEN_PARAM_PREFIX);
            });
        }

        dashboardRuntime.loadDashboard();
    });
});