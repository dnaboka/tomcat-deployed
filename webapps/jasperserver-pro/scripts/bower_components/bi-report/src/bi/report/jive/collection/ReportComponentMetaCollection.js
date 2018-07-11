/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
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
 * @author: Narcis Marcu
 * @version: $Id$
 */

define(function (require) {

    var Backbone = require("backbone"),
        _ = require("underscore"),
        BaseComponentMetaModel = require("../model/BaseComponentMetaModel"),
        log = require("logger").register("ReportComponentMetaCollection");

    var pagesRegexp = new RegExp("^(\\d+)(\\-\\d+)?$");

    function getPageIndex(pages) {
        var pageIndex = 1;

        if (pages) {
            if (_.isNumber(pages)) {
                pageIndex = pages;
            } else {
                try {
                    pageIndex = parseInt(pagesRegexp.exec(pages)[1], 10);
                } catch(ex) {}
            }
        }

        pageIndex--;

        return pageIndex;
    }

    return Backbone.Collection.extend({
        initialize: function(models, options){
            this.report = options.report;
        },

        model : function(attrs, options) {
            return new BaseComponentMetaModel(attrs, options);
        },

        url: function() {
            var url = this.report.contextPath;

            if (url[url.length-1] !== "/") {
                url += "/";
            }

            url += "getReportComponents.html";

            return url;
        },

        fetch: function() {
            if (!this.report.has("requestId")) {
                throw new Error("You must run report first before fetching components.");
            }

            return Backbone.Collection.prototype.fetch.call(this, {
                type: "POST",
                reset: true,
                headers: {
                    "Accept": "application/json",
                    "x-jrs-base-url" : this.report.contextPath
                },
                data : {
                    jasperPrintName : this.report.get("requestId"),
                    pageIndex: getPageIndex(this.report.execution.get("pages"))
                }
            });
        },

        parse: function(response) {
            // each component meta is bound to a property in the response object
            return _.values(response);
        }
    });
});

