/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets
 * @version: $Id$
 */

define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        request = require("request");

    // workaround for optimizer which usually runs in Node env without document defined
    if (typeof document === "undefined") {
        return {};
    }

    var $document = $(document);

    function triggerEvent() {
        $document.trigger.apply($document, arguments);
    }

    return function() {
        _.partial(triggerEvent, "request:before").apply(null, arguments);
        return request.apply(request, arguments)
            .done(_.partial(triggerEvent, "request:success"))
            .fail(_.partial(triggerEvent, "request:failure"));
    }
});

