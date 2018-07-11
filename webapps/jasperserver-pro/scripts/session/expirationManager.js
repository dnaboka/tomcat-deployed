/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets
 * @version: $Id$
 */

/* global confirm */

define(function(require) {
    var $ = require("jquery"),
        classUtil = require("common/util/classUtil"),
        requestSettings = require("settings!request"),
        request = require("request"),
        Time = require("common/util/datetime/Time"),
        i18n = require("bundle!CommonBundle");

    var ISO_8061_TIME_PATTERN = "hh:mm:ss",
        ONE_SEC = 1000,
        DEFAULT_TIMEOUT_WARNING_DELAY = 120 * ONE_SEC,
        maxInactiveInterval = requestSettings["maxInactiveInterval"];

    maxInactiveInterval = maxInactiveInterval <= 0 ? 0 : maxInactiveInterval * ONE_SEC;

    return function(options) {
        var timeoutWarningDelay
        if (options) {
            timeoutWarningDelay = options.timeoutWarningDelay * ONE_SEC || DEFAULT_TIMEOUT_WARNING_DELAY;
        }

        var _timeoutHandle,
            timeout = maxInactiveInterval > timeoutWarningDelay
                ? maxInactiveInterval - timeoutWarningDelay
                : maxInactiveInterval / 2,

            timeUntilExpiration = maxInactiveInterval > timeoutWarningDelay
                ? timeoutWarningDelay
                : maxInactiveInterval / 2,
            $document;

        if (maxInactiveInterval) {
            $document = $(window.document);

            $document.on("request:before", sessionExpirationHandler);
            $document.on("request:success", sessionExpirationHandler);
        }

        function sessionExpirationHandler() {
            _timeoutHandle && clearTimeout(_timeoutHandle);

            _timeoutHandle = setTimeout(function() {
                var keepAlive = showSessionExpirationWarning();

                if (keepAlive) {
                    // TODO make endpoint for session expiration (checkSession)
                    request({url: requestSettings["contextPath"] + "/rest_v2/resources/"});
                }
            }, timeout);
        }

        function showSessionExpirationWarning() {
            var expirationDate = new Date((new Date()).getTime() + timeUntilExpiration),
                expirationTime = new Time(expirationDate.getHours(), expirationDate.getMinutes(), expirationDate.getSeconds());

            return confirm(i18n["session.expiration.warning"] + " " + expirationTime.format(ISO_8061_TIME_PATTERN));
        }

        return {
            handle: sessionExpirationHandler,
            showWarning: showSessionExpirationWarning
        }

    };

});

