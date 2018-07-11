/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function (require) {
    var $ = require("jquery"),
        _ = require("underscore"),
        _oldStyle;

    "use strict";

    function setRequiredByPhantomPrefixes(view){
        view.$(".jrPage").each(function(index, element){
            var $element = $(element),
                style = $element.attr("style") || "",
                transform = $element.css("transform"),
                transformOrigin = $element.css("transform-origin");

            if (style.indexOf("transform") >= 0 && style.indexOf("-webkit-transform") == -1){
                $element.attr("style", [style, "-webkit-transform:", transform, "; -webkit-transform-origin:", transformOrigin,  ";"].join(""));
            }
        });
    }


    return {
        prepareForExport: function(canvasView){
            setRequiredByPhantomPrefixes(canvasView);
        },

        applyReferenceSize: function (canvasView, size) {
            var ratio,
                canvas = canvasView.$(".dashboardCanvas:first");

            _oldStyle = _oldStyle || canvas.attr("style") || false;
            ratio = Math.min(3508 / size.width, 2480 / size.height);

            // style set using attribute intentionally, because -webkit-* properties are removed sometimes,
            // while old PhantomJS versions demand exactly -webkit-* versions of selector names
            canvas.attr("style", "-webkit-transform: scale(" + ratio + "); transform-origin: left top; transform: scale(" + ratio + "); -webkit-transform-origin: left top; width: " + size.width + "px; height: " + size.height + "px;");
        },

        removeReferenceSize: function (canvasView) {
            if (!_.isUndefined(_oldStyle)) {
                canvasView.$(".dashboardCanvas:first").attr("style", _oldStyle ? _oldStyle : null);
                _oldStyle = undefined;
            }
        }
    }
});