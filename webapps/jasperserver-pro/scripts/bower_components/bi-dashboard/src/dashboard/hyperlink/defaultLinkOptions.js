/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        log = require("logger").register(module),
        dashboardSettings = require("../dashboardSettings"),
        hyperlinkTypes = require("bi/report/jive/enum/hyperlinkTypes");

    // pre-load default hyperlink handlers
    var handlers = {};
    handlers[hyperlinkTypes.LOCAL_ANCHOR] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerLocalAnchor");
    handlers[hyperlinkTypes.LOCAL_PAGE] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerLocalPage");
    handlers[hyperlinkTypes.REMOTE_PAGE] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerRemotePage");
    handlers[hyperlinkTypes.REMOTE_ANCHOR] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerRemoteAnchor");
    handlers[hyperlinkTypes.REFERENCE] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerReference");
    handlers[hyperlinkTypes.REPORT_EXECUTION] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerReportExecution");
    handlers[hyperlinkTypes.ADHOC_EXECUTION] = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerAdhocExecution");

    function onHandlerLoaded(type, handlerDeferreds, hyperlinkHandler) {
        handlers[type] = hyperlinkHandler;
        handlerDeferreds[type].resolve();
    }

    function onLoadFailed(type, err) {
        var moduleId = err.requireModules && err.requireModules[0];
        if (moduleId) {
            log.error("Failed to load module: '" + moduleId + "' for handling hyperlinks of type: '" + type + "'!");
        }
    }

    return {
        events: (function() {
            var obj = {},
                events = dashboardSettings.DEFAULT_HYPERLINK_EVENTS;

            for (var i = 0; i < events.length; i++) {
                obj[events[i]] = function(ev, link, dashlet) {
                    // convert fusion charts click to normal event type
                    var eventName = ev.eventType === "jr_hyperlink_interception" ? "click" : ev.type.toLowerCase(),
                        type = link.type,
                        handler = handlers[type];

                    if (handler && handler.events && typeof handler.events[eventName] === "function") {
                        return handler.events[eventName].apply(this, arguments);
                    }
                }
            }

            return obj;
        })(),

        beforeRender: function (linkToElemPairs, dashlet) {
            //PRE-load hyperlink handlers

            var pairsByType = {},
                self = this;

            //get unique list of link types
            _.each(linkToElemPairs, function(pair) {
                if (!pairsByType[pair.data.type]) {
                    pairsByType[pair.data.type] = [];
                }

                pairsByType[pair.data.type].push(pair);
            });

            //load modules to handle these types
            _.each(_.keys(pairsByType), function(type) {
                if (handlers[type] && handlers[type].beforeRender) {
                    handlers[type].beforeRender.apply(self, arguments);
                }
            });
        },

        discoverHyperlinkHandlers: function(linkToElemPairs) {
            var dfd = new $.Deferred(),
                handlerDeferreds = {},
                hyperlinkTypes = _.chain(linkToElemPairs)
                    .map(function(obj) { return obj.data.type; })
                    .unique()
                    .value();

            _.each(hyperlinkTypes, function(type) {
                if (!handlers[type]) {
                    handlerDeferreds[type] = new $.Deferred();

                    require(["vizShim!" + dashboardSettings.HYPERLINK_MODULE_PREFIX + type],
                        _.partial(onHandlerLoaded, type, handlerDeferreds),
                        _.partial(onLoadFailed, type));
                }
            });

            $.when.apply($, _.values(handlerDeferreds)).always(function() { dfd.resolve(); });

            return dfd;
        }
    }
});
