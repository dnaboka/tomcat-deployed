/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/* global webHelpModule */
define(function(require) {

    "use strict";

    require("prototype");
    require("commons.main");


    var domReady = require("domReady"),
        CreateReport = require("create.report"),
        _ = require("underscore");

    var home = {

        _locationMap: {},

        initialize: function(options) {
            webHelpModule.setCurrentContext("bi_overview");

            if (options.locationMap) {
                this._locationMap = options.locationMap;
            }

            this._initHandlers();
        },

        _initHandlers: function() {
            var buttons = $(document.body).select('.button.action.jumbo');

            buttons.each(function(button) {
                $(button).observe('click', function(e) {
                    var buttonId = button.identify();

                    if (this._locationMap[buttonId]) {
                        if(_.isFunction(this._locationMap[buttonId])) {
                            (this._locationMap[buttonId])();
                        } else {
                            document.location = this._locationMap[buttonId];
                        }
                    }
                }.bindAsEventListener(home));
            });
        }
    };

    domReady(function(){

        home.initialize({
            //Map button IDs to some location. If location is string then browser is redirected to that URL,
            //if location is a function then this function is executed on button click.
            locationMap: {
                'viewReports':'flow.html?_flowId=searchFlow&mode=search&filterId=resourceTypeFilter&filterOption=resourceTypeFilter-reports&searchText=',
                'createView':'flow.html?_flowId=adhocFlow',
                'createReport': CreateReport.selectADV,
                'createDashboard':'flow.html?_flowId=dashboardDesignerFlow&createNew=true',
                'analyzeResults':'flow.html?_flowId=searchFlow&mode=search&filterId=resourceTypeFilter&filterOption=resourceTypeFilter-view&searchText=',
                'manageServer':'flow.html?_flowId=adminHomeFlow'
            }
        });
    });

});
