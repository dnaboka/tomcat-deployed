/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: jobEditorView.js 9608 2015-11-04 19:32:56Z dgorbenk $
 */

/* global dialogs */

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        jobModel = require('scheduler/model/jobModel'),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        SaveDialogView = require("scheduler/saveDialog/SaveDialogView"),
        schedulerUtils = require("scheduler/util/schedulerUtils"),
        editorScheduleTabView = require('scheduler/view/editor/scheduleTabView'),
        parametersTabViewPro = require('schedulerPro/view/editor/parametersTabViewPro'),
        editorOutputTabViewPro = require('schedulerPro/view/editor/outputTabViewPro'),
        editorNotificationsTabViewPro = require('schedulerPro/view/editor/notificationsTabViewPro'),
        jobEditorView = require('scheduler/view/jobEditorView');

    return jobEditorView.extend({

        _initializeTabs: function(options) {
            var tabParams = {
                model: this.model,
                isDashboard: options.isDashboard,
                reportUri: options.reportUri,
                parentReportURI: options.parentReportURI
            };

            this.tabs.scheduleTab = new editorScheduleTabView(tabParams);
            this.tabs.parametersTab = new parametersTabViewPro(tabParams);
            this.tabs.outputTab = new editorOutputTabViewPro(tabParams);
            this.tabs.notificationsTab = new editorNotificationsTabViewPro(tabParams);
        }
    });
});
