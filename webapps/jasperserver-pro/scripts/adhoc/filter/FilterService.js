/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var controllerMap = {
        table :'adhoc/table.html',
        crosstab :'adhoc/crosstab.html',
        olap_crosstab :'adhoc/crosstab.html',
        ichart : 'adhoc/intelligentChart.html',
        olap_ichart : 'adhoc/intelligentChart.html'
    };

    var classUtil = require("common/util/classUtil"),
        _ = require("underscore"),
        $ = require("jquery"),
        dialogs = require("components.dialogs"),
        jrsConfigs = require("jrs.configs");

    var FilterService = classUtil.extend({
        constructor : function(options) {
            this.clientKey = options.clientKey;
            this.mode = options.mode;
        },

        createUrl : function(action, baseUrl) {
            return (baseUrl || controllerMap[this.mode()]) + "?action=" + action;
        },

        _request: function(ajaxParams, showLoading, callbacks) {
            showLoading = typeof showLoading === "undefined" ? true : showLoading;
            callbacks = callbacks || FilterService.defaultCallbacks;

            var dfd = $.ajax(ajaxParams)
                .done(callbacks.done || FilterService.defaultCallbacks.done)
                .fail(callbacks.fail || FilterService.defaultCallbacks.fail)
                .always(callbacks.always || FilterService.defaultCallbacks.always);

            if (showLoading) {
                setTimeout(function() {
                    if (dfd.state() === "pending") {
                        dialogs.popup.show($("#loading")[0], false, {focus: false});
                    }
                }, FilterService.SLOW_REQUEST_TIMEOUT);
            }

            return dfd;
        },

        get: function() {
            return this._request({
                url : this.createUrl("generateFilterPanel"),
                data : {
                    clientKey : this.clientKey
                }
            });
        },

        add : function(fieldNames) {
            return this._request({
                url : this.createUrl("addAdhocFilter"),
                type : "POST",
                data : {
                    addAdhocFilterFields :  _.map(fieldNames, encodeURIComponent),
                    clientKey : this.clientKey
                }
            });
        },

        addOlapFilter : function(dimensionId, levelId) {
            return this._request({
                url : this.createUrl("addOLAPFilter", controllerMap.olap_crosstab),
                type : "POST",
                data : {
                    dim : dimensionId,
                    child : levelId,
                    clientKey : this.clientKey
                }
            });
        },

        addSlice : function(axis, includeOrExclude, pathes) {
            return this._request({
                url : this.createUrl("addQuickSliceFilter", controllerMap.crosstab),
                type : "POST",
                data : {
                    axis : axis,
                    includeOrExclude : includeOrExclude,
                    pathList : JSON.stringify(_.map(pathes, function(p) {return encodeURIComponent(p);})),
                    clientKey : this.clientKey
                }
            });
        },

        update : function(id, filterExpression) {
            return this._request({
                url : this.createUrl("editAdhocFilter"),
                type : "POST",
                data : {
                    filterId : id,
                    editAdhocFilter : JSON.stringify(filterExpression),
                    clientKey : this.clientKey
                }
            });
        },

        remove : function(filterId) {
            return this._request({
                url : this.createUrl("deleteAdhocFilter"),
                type : "POST",
                data : {
                    filterId : filterId,
                    clientKey : this.clientKey
                }
            });
        },

        removeAll : function() {
            return this._request({
                url : this.createUrl("deleteAllAdhocFilters"),
                type : "POST",
                data : { clientKey : this.clientKey }
            });
        },

        reorder : function(oldIndex, newIndex) {
            return this._request({
                url : this.createUrl("reorderFilters"),
                type : "POST",
                data : {
                    oldIndex : oldIndex,
                    newIndex : newIndex,
                    clientKey : this.clientKey
                }
            });
        },

        toggleVisibility : function(filterId) {
            return this._request({
                url : this.createUrl("toggleFilterPodState"),
                type : "POST",
                data : {
                    filterId : filterId,
                    clientKey : this.clientKey
                }
            });
        },

        minimizeAll : function() {
            return this._request({
                url : this.createUrl("minimizeAllAdhocFilterPods"),
                type : "POST",
                data : {clientKey : this.clientKey}
            });
        },

        maximizeAll : function() {
            return this._request({
                url : this.createUrl("maximizeAllAdhocFilterPods"),
                type : "POST",
                data : {clientKey : this.clientKey}
            });
        },

        /**
         * Method to fetch values from the server
         * @param fieldName
         * @param additionalData - usually pagination and search criteria
         * @returns {*}
         */
        fetchValues : function(fieldName, additionalData, showLoading) {
            additionalData = additionalData || {};
            if (additionalData.criteria) {
                //search criteria should be uri encoded
                additionalData.criteria = encodeURIComponent(additionalData.criteria);
            }

            return this._request({
                url : this.createUrl("getFieldValues"),
                data : _.extend({
                    fieldName : encodeURIComponent(fieldName),
                    clientKey : this.clientKey
                }, additionalData)
            }, showLoading);
        },

        applyFiltersAndExpression : function(adhocFilters, complexFilterExpression) {
            return this._request(
                {
                    url : this.createUrl("applyAdhocFiltersAndExpression"),
                    type : "POST",
                    data : {
                        complexFilterExpression : complexFilterExpression,
                        adhocFilters: JSON.stringify(adhocFilters),
                        clientKey : this.clientKey
                    }
                });
        },

        getMaxMinValues: function(fieldName) {
            return this._request({
                url : this.createUrl("getMaxMinValues"),
                data : {
                    fieldName : encodeURIComponent(fieldName),
                    clientKey : this.clientKey
                }
            });
        }
    });

    FilterService.defaultCallbacks = {
        fail: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.getResponseHeader("LoginRequested")) {
                document.location = jrsConfigs.urlContext;
            } else if (jqXHR.getResponseHeader("adhocException")){
                var errorMessage = jqXHR.getResponseHeader("adhocException")
                errorMessage = decodeURIComponent(errorMessage);
                // @@ used as delimiter to replace whitespaces before encoding on server side. Need to replace them
                errorMessage = errorMessage.replace(/@@/g, " ");

                dialogs.errorPopup.show(errorMessage);
            } else if (jqXHR.status == 500 || (jqXHR.getResponseHeader("JasperServerError") && !jqXHR.getResponseHeader("SuppressError"))) {
                dialogs.errorPopup.show(jqXHR.responseText);
            }
        },
        always: function() {
            dialogs.popup.hide($("#loading")[0]);
        }
    };

    FilterService.SLOW_REQUEST_TIMEOUT = 2000;

    // workaround for non-AMD modules
    window.FilterService = FilterService;

    return FilterService;
});
