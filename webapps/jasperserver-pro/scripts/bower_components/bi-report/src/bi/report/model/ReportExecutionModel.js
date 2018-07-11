/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
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
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        reportStatuses = require("../enum/reportStatuses");

    var ATTACHMENT_PREFIX_PATTERN = "{contextPath}/rest_v2/reportExecutions/{reportExecutionId}/exports/{exportExecutionId}/attachments/";

    return Backbone.Model.extend({
        defaults: function() {
            return {
                "reportUnitUri": undefined,
                "async": true,
                //TODO: remove 'allowInlineScripts' after merging with report executor extention
                "allowInlineScripts": false,
                "markupType": "embeddable",
                "outputFormat": undefined,
                "interactive": true,
                "freshData": false,
                "saveDataSnapshot": false,
                "transformerKey": null,
                "ignorePagination": false,
                "pages": 1,
                "anchor": undefined,
                "attachmentsPrefix": undefined,
                "baseUrl": undefined,
                "parameters": undefined
            };
        },

        urlRun: function() {
            var url = this.get("baseUrl");

            if (url[url.length-1] !== "/") {
                url += "/";
            }

            url += "rest_v2/reportExecutions";

            return url;
        },

        urlUpdate: function() {
            if (!this.report.has("requestId")) {
                throw new Error("You must execute report before requesting it's execution details or status.");
            }

            return this.urlRun() + "/" + this.report.get("requestId");
        },

        urlParameters: function(refresh) {
            return this.urlUpdate() + "/parameters?freshData=" + !!refresh;
        },

        urlStatus: function() {
            return this.urlUpdate() + "/status";
        },

        initialize: function(attrs, options) {
            options || (options = {});

            this.report = options.report;

            this.on("change:baseUrl", function() {
                this.set("attachmentsPrefix", ATTACHMENT_PREFIX_PATTERN.replace("{contextPath}", this.get("baseUrl")));
            }, this);
        },

        run: function() {
            return Backbone.ajax({
                url: this.urlRun(),
                type: "POST",
                processData: false,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "x-jrs-base-url" : this.get("baseUrl")
                },
                data: JSON.stringify(this.toJSON())
            });
        },

        status: function() {
            return Backbone.ajax({
                type: "GET",
                url: this.urlStatus(),
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "Accept": "application/status+json",
                    "x-jrs-base-url" : this.get("baseUrl")
                }
            });
        },

        update: function() {
            return Backbone.ajax({
                url: this.urlUpdate(),
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "x-jrs-base-url" : this.get("baseUrl")
                }
            });
        },

        cancel: function() {
            return Backbone.ajax({
                url: this.urlStatus(),
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "x-jrs-base-url" : this.get("baseUrl")
                },
                data: JSON.stringify({
                    value: reportStatuses.CANCELLED
                })
            });
        },

        applyParameters: function(refresh) {
            return Backbone.ajax({
                url: this.urlParameters(refresh),
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "Accept": "application/json",
                    "x-jrs-base-url" : this.get("baseUrl")
                },
                data: JSON.stringify(this.has("parameters") ? this.get("parameters").reportParameter : [])
            });
        }
    });

});