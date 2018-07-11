/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require){
    "use strict";

    var domReady = require("!domReady"),
        jrsConfigs = require("jrs.configs"),
        Report = require("report.view.base"),
        _ = require("underscore"),
        $ = require("jquery");

    // loading core modules
    var ControlsBase = require("controls.base");
    require("domain.chooser.fields");
    require("components.customTooltip");
    require("components.dependent.dialog");
    require("components.pickers");
    require("core.key.events");
    require("builder");
    require("dragdrop");
    require("tools.drag");
    require("dialog.definitions");
    require("./DynamicTreeSearch");

    // adhoc designer itself
    var adhocDesigner = require("adhoc/designer.contextmenu");

    // some modules of adhoc designer: table, crosstab, chart, ichart, etc.
    var AdHocTable = require("adhoc/table.init");
    var AdHocChart = require("adhoc/chart.observers");

    domReady(function(){
        _.extend(ControlsBase, jrsConfigs.inputControlsConstants);

        _.extend(adhocDesigner, jrsConfigs.adhocDesigner);

        _.extend(adhocDesigner, jrsConfigs.adhoc.adhocDesigner);
        adhocDesigner.messages = adhocDesigner.messages || {};
        _.extend(adhocDesigner.messages, jrsConfigs.adhoc.adhocDesignerMessages);
        _.extend(AdHocChart, jrsConfigs.adhoc.AdHocChart);
        _.extend(AdHocTable, jrsConfigs.adhoc.AdHocTable);

        Report.reportUnitURI = jrsConfigs.Report.reportUnitURI;

        adhocDesigner.run(jrsConfigs.adhoc.adhocDesignerViewModelViewType);

        //workraround to make jquery-ui work properly in adhoc designer because of 'jr' prefix
        $("body").addClass("jr");
    });
});
