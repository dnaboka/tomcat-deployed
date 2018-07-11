/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

/**
 *  Extend Highcharts with plugin and extensions,
 */
//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
            "highcharts",
            "highcharts-grouped-categories",
            "adhoc/api/chart/adhocToHighchartsAdapter/ext/multiplePieTitlesExt",
            "adhoc/api/chart/adhocToHighchartsAdapter/ext/escapeUtilsExt",
            "highcharts-more",
            "highcharts-heatmap",
            "highcharts-treemap",
            "highcharts-solid-gauge",
            "highcharts-3d"
        ], factory);
    } else {
        // Browser globals.
        factory(Highcharts); // jshint ignore: line
    }
}(function (Highcharts) {
    "use strict";

    return Highcharts;

}));
