/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:
 * @version: $Id$
 */

define(function (require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        Highcharts = require("highcharts"),

        biComponentErrorFactoryAdHocViewProxy = require("bi/adhoc/error/biComponentErrorFactoryAdHocViewProxy"),

        visualizationTypesManager = require("../visualChooser/visualizationTypesManager"),
        AdHocBundle = require("bundle!AdHocBundle"),
        chartDataConverter = require("./model/chartDataConverter"),
        AdhocHighchartsAdapter = require("adhoc/api/chart/adhocToHighchartsAdapter"),
        chartTemplate = require("text!./template/chart.htm"),

        HyperlinkService =  require("./HyperlinkChartHelper");

    function dualPieSpecificChecks(adHocModel){
        if (adHocModel.component.get("visualizationType") === "DualLevelPie"){
            var query = adHocModel.dataSet.query,
                axis = query.rows.axis.multiAxisMap(function(obj){
                    return obj;
                });

            if (axis[0].isMeasure()){
                var measuresExpansion = query.rows.expansions.find(function (exp) {
                    return exp.get("level") && exp.get("level").aggregation && !exp.get("level").expanded;
                });

                if (measuresExpansion){
                    var level = _.clone(measuresExpansion.get("level"));
                    level.expanded = true;
                    measuresExpansion.set({
                        level: level
                    })
                }
            }
        }
    }

    return Backbone.View.extend({

        initialize: function (options) {
            this.$el = $(_.template(chartTemplate)({i18n: AdHocBundle}));
            this._initElements();

            this.adHocModel = options.dataModel;
            this.options = options.options;
            this.hyperlinkService = new HyperlinkService();
        },

        render: function ($canvas) {
            var dfd = $.Deferred(),
                self = this;

            $canvas && $canvas.append(this.$el);

            this.adHocModel.trigger("component:busy", true);

            this.adHocModel.dataSet.set({
                "params": {
                    "offset": [0, 0],
                    "pageSize": [2147483647, 2147483647]
                }
            });

            // this must be moved to specific view in future
            dualPieSpecificChecks(this.adHocModel);

            var dataDfd = this.adHocModel.dataSet.data().fail(_.bind(dfd.reject, dfd)),
                bundleDfd = this.adHocModel.bundles.bundle().fail(_.bind(dfd.reject, dfd));

            $.when(dataDfd, bundleDfd).done(function () {
                try {
                    self._checkData() && self._renderChart(dfd);

                    self.adHocModel.trigger("component:busy", false);

                    dfd.resolve();
                } catch (err) {
                    return dfd.reject(biComponentErrorFactoryAdHocViewProxy.adHocViewRender(err));
                }
            });

            return dfd;
        },

        _initElements: function () {
            this.$emptyMessage = this.$(".jr-jEmptyMessage");
            this.$canvas = this.$(".jr-mChart");
        },

        _renderChart: function (dfd) {
            var msg;
            // TODO: this conversion should be removed after refactoring chart datamapper

            var self = this;
            var state = JSON.parse(JSON.stringify(this.adHocModel.toJSON()));
            var dataset = JSON.parse(JSON.stringify(this.adHocModel.dataSet.toJSON()));
            var linkOptions = this.options.linkOptions;

            var oldState = chartDataConverter(state, dataset, this.adHocModel, this.hyperlinkService);

            var highchartsOptions = AdhocHighchartsAdapter.generateOptions(
                oldState.queryData,
                oldState.chartState, {
                    width: this._getContainerWidth() || 400,
                    height: this._getContainerHeight() || 300,
                    messages: {
                        totalsLabelForChart: AdHocBundle["adhoc.node.total.node"],
                        allLabelForChart: AdHocBundle["adhoc.node.total.node"]
                    },
                    isTimeSeries: this.adHocModel.component.getChartComponent().isTimeSeries()
                });

            this.hyperlinkService.perform(this, highchartsOptions);

            try {
                highchartsOptions.chart.renderTo = this.$(".jr-mChart")[0];

                //Set chart width and height if need.
                if (!highchartsOptions.chart.height) {
                    highchartsOptions.chart.height = this._getContainerHeight();
                }
                if (!highchartsOptions.chart.width) {
                    highchartsOptions.chart.width = this._getContainerWidth();
                }

                if (linkOptions && linkOptions.beforeRender) {
                    linkOptions.beforeRender(self.hyperlinkService.getHyperlinks(highchartsOptions, self));
                }

                this.highchartsInstance = new Highcharts.Chart(highchartsOptions);
            } catch (e) {

                _.each(Highcharts.charts, function (chart) {
                    chart && self.$el === chart.renderTo && chart.destroy();
                });
                if (this.highchartsInstance && this.highchartsInstance.destroy) {
                    this.highchartsInstance.destroy();
                    this.highchartsInstance = undefined;
                }

                if (/\#19/.test(e)) {
                    msg = AdHocBundle["adhoc.error.highcharts.19"];
                } else if (/\#13/.test(e)) {
                    msg = AdHocBundle["adhoc.error.highcharts.13"];
                } else {
                    msg = AdHocBundle["adhoc.error.highcharts.default"];
                }
                throw {
                    name: "error",
                    type: "highchartsInternalError",
                    data: {
                        error: e,
                        message: msg
                    }
                };
            }
        },

        _getContainerWidth: function () {
            return this.$el.parent().width();
        },

        _getContainerHeight: function () {
            return this.$el.parent().height();
        },

        _checkData: function () {
            var hasData = !this.adHocModel.dataSet.get("dataset").empty;

            if (hasData) {
                this.$emptyMessage.addClass("jr-isHidden");
                this.$canvas.removeClass("jr-isHidden");
            } else {
                this.$emptyMessage.removeClass("jr-isHidden");
                this.$canvas.addClass("jr-isHidden");
            }

            return hasData;
        },

        refresh: function (dfd) {
            this.adHocModel.dataSet.resetDataset();

            this.render().done(_.bind(dfd.resolve, dfd)).fail(_.bind(dfd.reject, dfd));

            return dfd;
        },

        resize: function(){
            this.highchartsInstance && this.highchartsInstance.setSize(this._getContainerWidth(), this._getContainerHeight());
        },

        isAcceptable: function (type) {
            return type !== "Table" && type !== "Crosstab";
        }
    });
});
