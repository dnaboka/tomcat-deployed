/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: SchedulerApp.js 9551 2015-10-13 14:09:03Z dgorbenk $
 */

/* global ControlsBase, JSCookie, dialogs */

define(function(require) {

	"use strict";

    var $ = require('jquery'),
        _ = require("underscore"),
        domReady = require('!domReady'),
        Backbone = require('backbone'),
        jrsConfigs = require('jrs.configs'),
	    schedulerUtils = require('scheduler/util/schedulerUtils'),
		SchedulerApp = require('scheduler/view/SchedulerApp'),

		jobModelPro = require('schedulerPro/model/jobModelPro'),

		resourceType = require('schedulerPro/enum/scheduledResourceTypeEnum'),

	    jobsViewPro = require('schedulerPro/view/jobsViewPro'),
        jobEditorViewPro = require('schedulerPro/view/jobEditorViewPro');

    domReady(function(){
        _.extend(ControlsBase, jrsConfigs.inputControlsConstants);
    });

    return SchedulerApp.extend({

        initialize: function(options) {

	        this.options = _.extend({}, options);

	        // check if we have a mark which says "simply create a job to execute immediately and exit"
	        this.runInBackgroundMode = document.location.hash.indexOf("#runInBackground@") === 0;

	        // saving the URL from which we came - we need this url when user would like to get back
	        schedulerUtils.saveCurrentLocation();

	        // not, get our parameters from URL
	        this.schedulerStartupParams = schedulerUtils.getParamsFromUri();

	        // Master View Mode (MVM) is a mode then we only able to see the list of scheduled jobs for all
	        // reports. In this mode we can't create new jobs, but we can control them: stop, continue, remove.
	        this.masterViewMode = !this.schedulerStartupParams["reportUnitURI"];

	        // we have two child views: job editor and list of jobs views.
	        // let's prepare the object to initialize them later
			this.childViewInitParams = {
				model: new jobModelPro(),
				runInBackgroundMode: this.runInBackgroundMode,
				masterViewMode: this.masterViewMode,
				isDashboard: this.schedulerStartupParams["resourceType"] === "DashboardModelResource",
				reportUri: this.schedulerStartupParams["reportUnitURI"],
				parentReportURI: this.schedulerStartupParams["parentReportURI"] || null
			};

			this.childViewInitParams.model.resourceType = this.schedulerStartupParams["resourceType"];

            // suppress http basic auth for all requests
            $.ajaxSetup({ headers: { 'X-Suppress-Basic': true } });

            // handle ajax errors and reload page if request unauthorized
            $(document).on('ajaxError', function(e, xhr, settings, exception) {
                if (401 === xhr.status || 'Unauthorized' === exception) {
	                location.reload();
                }
            });

	        // by default we open list of jobs unless we are in the 'runInBackground' mode
	        if (this.runInBackgroundMode) {
		        this.runNowRequest();
	        } else {
		        this.openJobsListInterface();
	        }
        },

	    prepareJobsView: function() {
		    if (this.jobsView) {
			    return;
		    }
		    this.jobsView = new jobsViewPro(this.childViewInitParams);

		    this.listenTo(this.jobsView, "createNewJobRequest", this.createNewJobRequest);
		    this.listenTo(this.jobsView, "runNowRequest", this.runNowRequest);
		    this.listenTo(this.jobsView, "backButtonPressed", this.backButtonPressed);
		    this.listenTo(this.jobsView, "editJobPressed", this.openEditJobInterface);
	    },

	    prepareJobEditorView: function() {
		    if (this.jobEditorView) {
			    this.jobEditorView.remove();
		    }

		    this.jobEditorView = new jobEditorViewPro(this.childViewInitParams);

		    this.listenTo(this.jobEditorView, "errorEditingJob", this.errorEditingJob);
		    this.listenTo(this.jobEditorView, "cancelJobCreation", this.cancelJobCreation);
		    this.listenTo(this.jobEditorView, "jobHasBeenCreated", this.jobHasBeenCreated);
	    },

		openEditJobInterface: function (jobId) {
            var self = this, model;


            if (this.childViewInitParams.masterViewMode) {
				model = new Backbone.Model();

				model.urlRoot = self.childViewInitParams.model.urlRoot;
                model.set({id: jobId});
                model.fetch({headers:{
					"Accept" : "application/job+json"
				}}).done(function () {
                    var source = model.get('source');
                    self.childViewInitParams.isDashboard = !_.isUndefined(source.referenceWidth) && !_.isUndefined(source.referenceHeight);
                    self.childViewInitParams.model.resourceType = self.childViewInitParams.isDashboard ? resourceType.DASHBOARD : "";
					self.childViewInitParams.model._fetched = model.attributes;
                    SchedulerApp.prototype.openEditJobInterface.call(self, jobId);
                });
            } else {
                SchedulerApp.prototype.openEditJobInterface.apply(this, arguments);
            }
		}
    });
});
