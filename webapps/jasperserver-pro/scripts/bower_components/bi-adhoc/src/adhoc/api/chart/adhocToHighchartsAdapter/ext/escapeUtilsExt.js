/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Dmitriy Litvak
 * @version: $Id$
 */

//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(["highcharts", "xssUtil"],factory);
    } else {
        // Browser globals.
        factory(Highcharts, xssUtil); // jshint ignore: line
    }
}(function (Highcharts, xssUtil) {
    "use strict";

    /*
     Escape javascript in the chart HTML
     */
    Highcharts.wrap(Highcharts, 'escapeXSS', function (proceed, str) {
        // Run the original proceed method
        return proceed.apply(this, [xssUtil.escape(str, {softHTMLEscape: true})]);

    });

    return Highcharts;

}));