/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        jrsConfigs = require("jrs.configs"),
        $ = require("jquery"),
        hyperlinkTargets = require("bi/report/jive/enum/hyperlinkTargets"),
        hyperlinkTypes = require("bi/report/jive/enum/hyperlinkTypes");

    var JRS_REPORT_VIEWER_URL = _.template("{{=context}}/flow.html?{{=parameters}}");

    function buildReportViewerUrl(link) {
        var resultingParams = _.extend({ _flowId: "viewReportFlow" }, link.parameters);

        resultingParams.reportUnit = link.resource;

        if (link.parameters && !_.isUndefined(link.parameters._output)) {
             resultingParams.output = link.parameters._output;
        }

        if (!_.isUndefined(link.pages)) {
            resultingParams.pageIndex = link.pages;
        }

        if (!_.isUndefined(link.anchor)) {
            resultingParams.anchor = link.anchor;
        }

        // do not show UI and back button for Report Viewer hyperlink with target Parent
        if ((link.target === hyperlinkTargets.PARENT || link.target === hyperlinkTargets.TOP) && !resultingParams.hasOwnProperty("decorate")) {
            resultingParams.decorate = "no";
        }

        return JRS_REPORT_VIEWER_URL({
            context: jrsConfigs.contextPath,
            parameters: !_.isEmpty(resultingParams) ? $.param(resultingParams, true) : ""
        });
    }

    return {
        events: {
            click: function (ev, link, dashlet) {
                if (link.target !== hyperlinkTargets.SELF) {
                    window.open(buildReportViewerUrl(link),
                        _.contains(_.values(hyperlinkTargets), link.target) ? "_" + link.target.toLowerCase() : link.target);
                } else {
                    dashlet && dashlet.drilldown && dashlet.drilldown(_.extend({}, link, { type: hyperlinkTypes.REPORT_EXECUTION }));
                }
            }
        }
    }
});
