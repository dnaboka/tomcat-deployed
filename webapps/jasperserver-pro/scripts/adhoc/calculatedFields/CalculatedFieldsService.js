/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        classUtil = require("common/util/classUtil"),
        $ = require("jquery"),
        requestSettings = require("requestSettings"),
        dialogs = require("components.dialogs"),
        jrsConfigs = require("jrs.configs");

    var CalculatedFieldsService = classUtil.extend({
        constructor : function(options) {
            this.clientKey = options.clientKey;
        },

        createRestUrl : function(actionUrl) {
            return "rest_v2/metadata/_temp/" + this.clientKey + actionUrl;
        },

        _request: function(ajaxParams, showLoading, callbacks) {
            showLoading = typeof showLoading === "undefined" ? true : showLoading;
            callbacks = callbacks || CalculatedFieldsService.defaultCallbacks;

            var dfd = $.ajax(_.defaults(ajaxParams, requestSettings))
                .done(callbacks.done || CalculatedFieldsService.defaultCallbacks.done)
                .fail(callbacks.fail || CalculatedFieldsService.defaultCallbacks.fail)
                .always(callbacks.always || CalculatedFieldsService.defaultCallbacks.always);

            if (showLoading) {
                setTimeout(function() {
                    if (dfd.state() === "pending") {
                        dialogs.popup.show($("#loading")[0], false);
                    }
                }, CalculatedFieldsService.SLOW_REQUEST_TIMEOUT);
            }

            return dfd;
        },

        fetchFieldsList: function() {
            return this._request({
                url : this.createRestUrl("/fields"),
                type : "GET",
                dataType : "json"
            });
        },

        fetchFunctionsList: function() {
            return this._request({
                url : this.createRestUrl("/functions"),
                type : "GET",
                dataType : "json"
            });
        },

        validate : function(field) {
            return this._request({
                url : this.createRestUrl("/action/validate"),
                type : "POST",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(field)
            });
        },


        get : function(fieldId) {
            return this._request({
                url : this.createRestUrl("/fields/" + fieldId),
                type : "GET",
                dataType : "json"
            });
        },


        add : function(field) {
            return this._request({
                url : this.createRestUrl("/fields"),
                type : "POST",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(field)
            });
        },

        update : function(field, fieldId) {
            return this._request({
                url : this.createRestUrl("/fields/" + fieldId),
                type : "PUT",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(field)
            });
        },

        remove : function(fieldId) {
            return this._request({
                url : this.createRestUrl("/fields/" + fieldId),
                type : "DELETE",
                contentType : "application/json"
            });
        }

    });

    CalculatedFieldsService.defaultCallbacks = {
        fail: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401 || jqXHR.getResponseHeader("LoginRequested")) {
                document.location = jrsConfigs.urlContext;
            } else if (jqXHR.getResponseHeader("adhocException")){
                dialogs.errorPopup.show(jqXHR.getResponseHeader("adhocException"));
            } else if (jqXHR.status == 500 || (jqXHR.getResponseHeader("JasperServerError") && !jqXHR.getResponseHeader("SuppressError"))) {
                // TODO: Use some JRS standard way to handle 500 status.
                var jsonError = JSON.parse(jqXHR.responseText)
                var errorMessage = "<p>" + errorThrown +"</p><p>" + jsonError.message + "</p><p>" + jsonError.parameters[0] + "</p>";
                dialogs.errorPopup.show(errorMessage);
            }
        },
        always: function() {
            dialogs.popup.hide($("#loading")[0]);
        }
    };

    CalculatedFieldsService.SLOW_REQUEST_TIMEOUT = 2000;

    // workaround for non-AMD modules
    window.CalculatedFieldsService = CalculatedFieldsService;

    return CalculatedFieldsService;
});
