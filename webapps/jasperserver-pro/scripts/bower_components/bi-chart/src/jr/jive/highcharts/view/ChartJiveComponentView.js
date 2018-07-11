/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: ChartJiveComponentView.js 3544 2015-11-05 22:05:36Z psavushc $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        browserDetection = require("common/util/browserDetection"),
        $ = require("jquery"),
        ChartTypeSelectorDialog = require("../dialogs/ChartTypeSelectorDialog"),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        chartMenuTemplate = require("text!../template/chartMenuTemplate.htm"),
        reportCreators = {
            AD_HOC_DESIGNER: "adhoc designer",
            JSS_IREPORT_STUDIO: "JSS/iReport studio"
        },
        i18nAdhoc = require("bundle!adhoc_messages"),

        Highcharts = require("highcharts-heatmap"),
        services = {
            "dataSettingService": "../services/dataSettingService",
            "defaultSettingService": "../services/defaultSettingService",
            "dualPieSettingService": "../services/dualPieSettingService",
            "treemapSettingService": "../services/treemapSettingService",
            "itemHyperlinkSettingService": "../services/itemHyperlinkSettingService",
            "yAxisSettingService": "../services/yAxisSettingService"
        };

    require("highcharts-more");
    require("csslink!../theme/highcharts.css");

    function setAnimation(hcConfig, animation) {
        hcConfig.chart.animation = animation;

        hcConfig.plotOptions || (hcConfig.plotOptions = {});
        hcConfig.plotOptions.series || (hcConfig.plotOptions.series = {});
        hcConfig.plotOptions.series.animation = animation;

        hcConfig.legend || (hcConfig.legend = {});
        hcConfig.legend.navigation || (hcConfig.legend.navigation = {});
        hcConfig.legend.navigation.animation = animation;

        hcConfig.tooltip || (hcConfig.tooltip = {});
        hcConfig.tooltip.animation = animation;
    }


    var JiveHighcharts = function (config) {
        this.rdy = new $.Deferred();
        this.config = config;
        this.parent = null;
        this.loader = null;
        this.highchartsInstance = null;
        this.services = services;

        this._init();
    };

    JiveHighcharts.prototype = {
        render: function ($el) {
            var it = this, msg,
                dfd = new $.Deferred();

            it.rdy.then(function () {
                try {
                    it.hcConfig.chart.renderTo = $("#" + it.hcConfig.chart.renderTo, $el)[0];

                    if (!_.isUndefined(it.config.chart.animation)) {
                        setAnimation(it.hcConfig, it.config.chart.animation);
                    }

                    if (!_.isUndefined(it.config.chart.zoom)) {
                        it.hcConfig.chart.zoomType = it.config.chart.zoom;
                    }

                    it.highchartsInstance = new Highcharts.Chart(it.hcConfig);
                    dfd.resolve();
                } catch (e) {
                    if (/\#19/.test(e)) {
                        msg = i18nAdhoc["ADH_1214_ICHARTS_ERROR_TOO_MANY_VALUES"];
                    } else {
                        msg = i18nAdhoc["ADH_1214_ICHARTS_ERROR_UNCAUGHT"];
                    }

                    _.each(Highcharts.charts, function (chart) {
                        chart && it.hcConfig.chart.renderTo === chart.renderTo && chart.destroy();
                    });
                    if (it.highchartsInstance && it.highchartsInstance.destroy) {
                        it.highchartsInstance.destroy();
                        it.highchartsInstance = undefined;
                    }

                    dfd.reject({
                        name: "error",
                        type: "highchartsInternalError",
                        data: {
                            error: e,
                            message: msg
                        }
                    });
                }
            });
            return dfd;
        },

        // internal functions
        _init: function () {
            var it = this,
                instanceData = JSON.parse(JSON.stringify(this.config.hcinstancedata)), // object full clone
                allServicesDFD = new $.Deferred();

            this.config.globalOptions && Highcharts.setOptions(this.config.globalOptions);

            it.hcConfig = {};

            allServicesDFD.resolve();

            $.each(instanceData.services, function (idx, entry) {
                var srvName = entry.service,
                    srv = services[entry.service] || srvName,
                    srvData = entry.data;

                allServicesDFD = allServicesDFD.then(function () {
                    var dfd = new $.Deferred();

                    require([srv], function (Service) {
                        if ('itemHyperlinkSettingService' === srvName) {
                            var extData = _.extend({}, srvData, {linkOptions: it.config.linkOptions}),
                                hService = new Service(it, it.hcConfig, extData);

                            hService.perform();
                        } else {
                            Service.perform(it.hcConfig, srvData, it.config.linkOptions);
                        }
                        dfd.resolve();
                    });

                    return dfd;
                });
            });

            // create the actual Highcharts chart
            allServicesDFD.then(function () {
                it.hcConfig.chart.renderTo = instanceData.renderto;
                it.hcConfig.chart.width = instanceData.width;
                it.hcConfig.chart.height = instanceData.height;

                it.rdy.resolve();
            });
        }
    };

    var opacityCssTransparent = {
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)",
            "filter": "alpha(opacity=30)",
            "opacity": "0.3"
        },
        opacityCssVisible = {
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "alpha(opacity=100)",
            "opacity": "1"
        };

    return Backbone.View.extend({

        initialize: function (options) {
            this.stateModel = options.stateModel;
            this.report = options.report;
            this.chartTypeDialogStates = options.chartTypeDialogStates;
            this.chartTypeDialogStates[this.model.get("id")] = this.chartTypeDialogStates[this.model.get("id")] || {
                opened: false,
                top: "",
                left: ""
            };
        },


        render: function ($el) {
            if (this.model.get("creator") === reportCreators.AD_HOC_DESIGNER) {
                this.model.set("hcinstancedata", _.extend({}, this.model.get("hcinstancedata"), {
                    width: $el.width(),
                    height: $el.height() || 400
                }), {silent: true});
            }

            var dfd = this._renderComponent($el);

            if (this.model.get("hcinstancedata").services && _.findWhere(this.model.get("hcinstancedata").services, {service: "adhocHighchartsSettingService"})) {
                var service = this.component.services.adhocHighchartsSettingService,
                    isOlap = _.findWhere(this.model.get("hcinstancedata").services, {service: "adhocHighchartsSettingService"}).data.queryData.metadata.isOLAP,
                    hyperlinks = [];

                if (service) {
                    _.each(this.component.hcConfig.series, function (serie) {
                        hyperlinks = hyperlinks.concat(_.map(serie.data, function (point) {
                            return service.getHyperlink(serie, point, isOlap);
                        }));
                    });

                    this.model.set("hyperlinks", hyperlinks);
                }
            }


            this.errorDialog = new AlertDialog({
                additionalCssClasses: 'jive_dialog'
            });
            this.listenTo(this.model, "serverError", this.showError);


            if (!this.model.get("interactive") || !this.stateModel.isDefaultJiveUiEnabled()) {
                dfd.resolve();
                return dfd;
            }

            this.dialog && this.dialog.remove();
            this.dialog = new ChartTypeSelectorDialog({
                model: this.model,
                chartTypeDialogStates: this.chartTypeDialogStates
            });

            // append menu and setup listeners
            this._renderMenu();

            return dfd;
        },

        _renderComponent: function ($el) {
            var dfd = new $.Deferred(),
                linkOptions = this.model.collection ? this.model.collection.linkOptions : null,
                data = _.extend(this.model.toJSON(), {chart: _.clone(this.stateModel.get("chart"))});

            if (linkOptions) {
                data.linkOptions = linkOptions;
            }

            this.component = new JiveHighcharts(data, $el);

            var componentRenderDfd = this.component.render($el);

            var renderFailed = _.bind(function(reason){
                dfd.reject(reason);

                if (reason.type === "highchartsInternalError") {

                    var errorMessage = i18nAdhoc["ADH_1214_ICHARTS_ERROR_CANT_RENDER_CHART"] + ":<br/>" + reason.data.error;

                    this.showError({
                        devmsg: errorMessage
                    });
                }
            }, this);

            if (!this.component.rdy) {
                dfd.resolve();
            } else {
                this.component.rdy.done(function () {
                    componentRenderDfd.then(dfd.resolve, renderFailed);
                });
            }

            return dfd;
        },

        _renderMenu: function () {
            var self = this,
                $menu;

            this.$menu = $menu = $(_.template(chartMenuTemplate, {i18n: i18nAdhoc}));


            $menu.insertBefore("#" + this.component.config.hcinstancedata.renderto);
            $menu.css({"top": "0"});
            if (!browserDetection.isIE8()) {
                $menu.css(opacityCssTransparent);
            }


            // make Chart Type selection button visible when active
            $menu.find('.jive_chartSettingsIcon').on('mouseenter', function () {
                if (!browserDetection.isIE8()) {
                    $(this).parent().css(opacityCssVisible);
                }
            });

            // make Chart Type selection button transparent when not active
            $menu.find('.jive_chartMenu').on('mouseleave touchend', function () {
                if (!browserDetection.isIE8()) {
                    $(this).parent().css(opacityCssTransparent);
                }
            });

            // expand menu on mouse over
            $menu.find('.jive_chartSettingsIcon').on('mouseenter', function () {
                var jo = $(this);
                jo.addClass('over');
                jo.next('.jive_chartMenu').show().position({
                    top: jo.height(),
                    left: 0
                })
            });

            // hide menu on mouse leave
            $menu.find('.jive_chartMenu').on('mouseleave touchend', function () {
                var jo = $(this);
                jo.prev('.jive_chartSettingsIcon').removeClass('over');
                jo.hide();
            });

            // highlighting selected element in menu
            $menu.find('.jive_chartMenu').on('mouseenter touchstart', 'p.wrap', function () {
                $(this).addClass('over');
            });
            $menu.find('.jive_chartMenu').on('mouseleave touchend', 'p.wrap', function () {
                $(this).removeClass('over');
            });

            // open chart type selection dialog on click on that element
            $menu.find('.jive_chartMenu').on(
                'click touchend',
                'li.jive_chartTypeMenuEntry',
                _.bind(self.dialog.open, self.dialog)
            );
        },

        showError: function (result) {
            this.errorDialog.setMessage(result.devmsg);
            this.errorDialog.open();
        },

        setSize: function (width, height, animation) {
            this.component && this.component.highchartsInstance && this.component.highchartsInstance.setSize(width, height, animation);
        },

        remove: function () {
            this.$menu && this.$menu
                .find('.jive_chartMenu')
                .off('click mouseenter touchstart mouseleave touchend')
                .find('.jive_chartSettingsIcon')
                .off('mouseenter');

            this.$menu && this.$menu.remove();
            this.dialog && this.dialog.remove();
            this.errorDialog && this.errorDialog.remove();

            Backbone.View.prototype.remove.call(this, arguments);
        }
    });
});

