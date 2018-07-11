/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Pavel Savushchik
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        BaseComponentModel = require("./BaseComponentModel"),
        visualizationTypesManager = require("../../visualChooser/visualizationTypesManager");

     return BaseComponentModel.extend({

         defaults: {
             "xAxisRotation": -45,
             "yAxisRotation": 0,
             "xAxisStep": 1,
             "yAxisStep": 1,
             "legend": "bottom",
             "showDataPoints": true,
             "advancedProperties": [],
             "alignment": "bottom",
             "showMeasureOnValueAxis": true,
             "legendBorder": true,
             "showSingleMeasuresLabels": true,
             "autoScaleFonts": true,
             "showScatterLine": false,
             "type": "Column"
         },

         initialize: function (attributes, options) {
             var existing = this.get("advancedProperties");
             if (!_.isArray(existing)) {
                 this.set({
                     advancedProperties: _.map(_.keys(existing), function (key) {
                         return {
                             name: key,
                             value: existing[key]
                         }
                     })
                 });
             }
         },

         getLegacyAdhocChartType: function () {
             var self = this;

             return visualizationTypesManager.findType({
                 name: self.get("type")
             })["legacyAdhoc"];

         },

         isTimeSeries: function () {
             return visualizationTypesManager.isTimeSeriesType(this.get("type"));
         }
    });
});