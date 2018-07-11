/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @version: $Id: jobsCollection.js 9551 2015-10-13 14:09:03Z dgorbenk $
 */

define(function (require) {

    "use strict";

    var config = require('jrs.configs'),
        jobModel = require('scheduler/model/jobModel'),
        jobsCollection = require('scheduler/collection/jobsCollection');

    return jobsCollection.extend({

        fetch: function () {

            //initialize the list of the reports which jobs we might need to fetch
            this.urlsOfReportsToFetchJobs = [];

            // In Master View mode we don't work with specific report so we can't fetch
            // report options, so we need simply skip this part and fetch all jobs we have
            if (this.options.masterViewMode) {
                this.getJobsWithPagination();
                return;
            }

            // in other case we have to be sure we have an Report Uri
            if (!this.getReportUri()) {
                return;
            }

            // Add the url of the report itself which we working with
            this.urlsOfReportsToFetchJobs.push(this.getReportUri());

            // If we are running CE version we don't need to have deal with report options,
            // so we need to fetch only jobs of the report itself.
            if (!config.isProVersion) {
                this.getJobsOfAllReportsWeHave();
                return;
            }

            //Skip options fetching when we are working with dashboard
            if (this.options.isDashboard) {
                this.getJobsOfAllReportsWeHave();
                return;
            }

            // in PRO version get the report options first and then jobs
            var self = this;
            this.getReportOptions().always(function () {
                self.getJobsOfAllReportsWeHave();
            });
        }

    });

});