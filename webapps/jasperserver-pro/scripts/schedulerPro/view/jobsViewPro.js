/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: jobsView.js 9551 2015-10-13 14:09:03Z dgorbenk $
 */

/* global define, isSupportsTouch, isIPad */

define(function (require) {

    "use strict";

    var _ = require("underscore"),
        common = require("utils.common"),
        domUtil = require("common/util/domUtil"),
        jobView = require('scheduler/view/jobView'),
        jobModel = require('scheduler/model/jobModel'),
        jobsCollectionPro = require('schedulerPro/collection/jobsCollectionPro'),
        schedulerUtils = require("scheduler/util/schedulerUtils"),
        jobsViewTemplate = require("text!scheduler/template/jobsViewTemplate.htm"),
        masterViewTemplate = require("text!scheduler/template/masterViewTemplate.htm"),
        listOfJobsTemplate = require("text!scheduler/template/list/listOfJobsTemplate.htm"),
        nothingToDisplayTemplate = require("text!scheduler/template/list/nothingToDisplayTemplate.htm"),
        jobsView = require('scheduler/view/jobsView');

    return jobsView.extend({

        initialize: function (options) {
            this.options = _.omit(options, "model");

            // create collection
            this.jobsViewCollection = new jobsCollectionPro(null, this.options);

            // handle collection changes
            this.listenTo(this.jobsViewCollection, "add", this.createAndAddJobView);
            this.listenTo(this.jobsViewCollection, "reset destroy", this.renderCollection);
        }
    });

});