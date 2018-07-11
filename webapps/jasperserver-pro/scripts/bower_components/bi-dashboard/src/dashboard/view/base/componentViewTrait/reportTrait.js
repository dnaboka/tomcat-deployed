/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    /**
     * @mixin reportTrait
     * @description Object that extends DesignerComponentView object, mixes report component specific behaviour.
     */


    var _ = require("underscore"),
        $ = require("jquery"),
        i18n = _.extend(require('bundle!jasperserver_messages'),require("bundle!DashboardBundle")),
        log = require("logger").register(module),
        Report =  require("bi/report/Report"),
        HoverMenu = require('common/component/menu/HoverMenu'),
        Notification = require('common/component/notification/Notification'),
        LoadingDialog = require('common/component/dialog/LoadingDialog'),
        PaginationView = require("common/component/pagination/Pagination"),
        WebPageView = require("common/component/webPageView/WebPageView"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        dashboardSettings = require("../../../dashboardSettings"),
        dashletTrait = require("./dashletTrait"),
        defaultLinkOptions = require("dashboard/hyperlink/defaultLinkOptions"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),
        hyperlinkTypes = require("bi/report/jive/enum/hyperlinkTypes"),
        sandboxFactory = require("dashboard/factory/sandboxFactory"),
        reportOutputFormats = require("bi/report/enum/reportOutputFormats"),
        browserDetection = require("common/util/browserDetection"),
        menuContainerTemplate = require('text!dashboard/template/menuContainerTemplate.htm'),
        menuOptionTemplate = require('text!dashboard/template/menuOptionTemplate.htm'),

        exportOptions = [
            {
                label: i18n['jasper.report.view.hint.export.pdf'],
                action: 'pdf',
                params:{outputFormat: "pdf"}
            },
            {
                label: i18n['jasper.report.view.hint.export.excel'],
                action: 'excel',
                params:{outputFormat: "xls"}
            },
            {
                label: i18n['jasper.report.view.hint.export.excel.nopag'],
                action: 'excel.nopag',
                params:{outputFormat: "xls", ignorePagination: true}
            },
            {
                label: i18n['jasper.report.view.hint.export.rtf'],
                action: 'rtf',
                params:{outputFormat: "rtf"}
            },
            {
                label: i18n['jasper.report.view.hint.export.csv'],
                action: 'csv',
                params:{outputFormat: "csv"}
            },
            {
                label: i18n['jasper.report.view.hint.export.odt'],
                action: 'odt',
                params:{outputFormat: "odt"}
            },
            {
                label: i18n['jasper.report.view.hint.export.ods'],
                action: 'ods',
                params:{outputFormat: "ods"}
            },
            {
                label: i18n['jasper.report.view.hint.export.docx'],
                action: 'docx',
                params:{outputFormat: "docx"}
            },
            {
                label: i18n['jasper.report.view.hint.export.xlsx'],
                action: 'xlsx',
                params:{outputFormat: "xlsx"}
            },
            {
                label: i18n['jasper.report.view.hint.export.xlsx.nopag'],
                action: 'xlsx.nopag',
                params:{outputFormat: "xlsx", ignorePagination: true}
            },
            {
                label: i18n['jasper.report.view.hint.export.pptx'],
                action: 'pptx',
                params:{outputFormat: "pptx"}
            }
        ];

    /**
     * @memberof reportTrait
     * @access private
     * @desc calculates scale factor, depends on scale strategy.
     * @param {string} scaleStrategy - container, page, width or height
     * @param {number} jrWidth - component width
     * @param {number} jrHeight - component height
     * @param {number} cWidth - container width
     * @param {number} cHeight - container height
     * @returns {number} scale
     */

    function getScaleFactor(scaleStrategy, jrWidth, jrHeight, cWidth, cHeight) {
        var scale;
        if (scaleStrategy === scaleStrategies.WIDTH) {
            scale = cWidth / jrWidth;
        } else if (scaleStrategy === scaleStrategies.HEIGHT) {
            scale = cHeight / jrHeight;
        } else {
            var scaleV = cWidth / jrWidth, scaleH = cHeight / jrHeight;
            scale = (scaleV * jrHeight) < cHeight ? scaleV : scaleH;
        }

        return scale;
    }

    /**
     * @memberof reportTrait
     * @access private
     * @desc initializes pagination, if report has two or more pages. If pagination already initialized, refreshes then.
     * @param {object} options
     * @param {object} options.resetCurrent - reset current page on refresh
     */

    function initPagination(options){
        var self = this;

        // request export of 2 pages to know if pagination is needed. (array like func access due to IE8 issue)
        this.component && this.component["export"]({ outputFormat: "html", pages: 2 })
            .done(function() {
                var totalPages = self.component.data().totalPages;
                // pagination initialization with validation and event firing off. Needed in case of not fully loaded report so we can switch the pages in process of loading.
                if(!self.paginationView && totalPages !== 0 ){
                    self._initPagination({total: totalPages, silent: true, validate: false});
                    // make next buttons available
                    self.paginationView.$el.find(".next, .prev, .first").prop("disabled", false);
                }else{
                    totalPages > 1 && self._refreshPagination(totalPages, options);
                }
            });
    }


    /**
     * @memberof reportTrait
     * @access private
     * @desc checks if report is Ad Hoc Chart Report
     * @param {object} reportView
     * @returns {boolean}
     */

    function isAdhocChartReport(reportView) {
        return reportView.$("> .dashletContent > .content > ._jr_report_container_ > .highcharts_parent_container").length > 0;
    }

    function signalHandler(payload, sender){
        if (payload.name === dashboardWiringStandardIds.REFRESH_SLOT) {
            if (this.paramsModel.paramsChanged) {
                this.paramsModel.paramsChanged = false;
                this.component.params(extractExecutionParams(this));
            }
            this.refresh();
        } else if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            if (this.paramsModel.paramsChanged) {
                this.paramsModel.paramsChanged = false;
                this.component.params(extractExecutionParams(this));
                this.paginationView && this.paginationView.model.set("current", this.paginationView.model.defaults.current);
                this.refresh();
            }
        }
    }

    function extractExecutionParams(self){
        var fromProps = _.reduce(self.model.get("parameters"), function(memo, parameter){
            if (parameter.parametrizeProperty){
                memo.push(parameter.id);
            }
            return memo;
        }, []);

        return _.omit(self.paramsModel.attributes, fromProps);
    }

    function convertHyperlinksParamsToVizJsApi(params) {
        var convertedParams = {};

        for (var param in params) {
            convertedParams[param] = _.isArray(params[param]) ? params[param] : [ params[param] ];
        }

        return convertedParams;
    }

    function processLinkOptions(report) {
        if (!report) {
            return;
        }

        var linkOptions = this.dashboardId  ? (sandboxFactory.get(this.dashboardId).get("linkOptions") || {}) : {},
            processedOptions = { events: {} },
            self = this;

        for (var event in linkOptions.events) {
            processedOptions.events[event] = function (ev, link) {
                var eventName = ev.eventType === "jr_hyperlink_interception" ? "click" : ev.type.toLowerCase();

                linkOptions.events[eventName] && linkOptions.events[eventName].call(self.component, ev, link, _.bind(defaultLinkOptions.events[eventName], self.component, ev, link, self));
            }
        }

        for (var event in defaultLinkOptions.events) {
            if (!processedOptions.events.hasOwnProperty(event)) {
                processedOptions.events[event] = function (ev, link) {
                    var eventName = ev.eventType === "jr_hyperlink_interception" ? "click" : ev.type.toLowerCase();

                    defaultLinkOptions.events[eventName] && defaultLinkOptions.events[eventName].call(self.component, ev, link, self);
                }
            }
        }

        processedOptions.beforeRender = function(pairs) {
            defaultLinkOptions.discoverHyperlinkHandlers(pairs).done(function() {
                if (linkOptions.beforeRender) {
                    linkOptions.beforeRender.call(self.component, pairs, _.bind(defaultLinkOptions.beforeRender, self.component, pairs, self));
                } else {
                    defaultLinkOptions.beforeRender.call(self.component, pairs, self);
                }
            });
        };

        return processedOptions;
    }

    function destroyDrilldownComponent() {
        if (this.drilldownComponent) {
            this.drilldownComponent instanceof WebPageView ? this.drilldownComponent.remove() : this.drilldownComponent.destroy();
            this.drilldownComponent = null;
        }
    }

    function onReportCompleted(paginationView) {
        try {
            // if pagination was changed not through pagination control, but through another source (e.g. hyperlink),
            // we need to sync up pagination control with report
            if (!_.isUndefined(this.pages()) && paginationView && paginationView.model && this.pages() !== paginationView.model.get("current")) {
                var page = parseInt(_.isObject(this.pages()) ? this.pages().pages : this.pages(), 10);

                !isNaN(page) && paginationView.model.set("current", page);
            }
        } catch(ex) {
            // ignore "already.destroyed.error"
            if (ex.errorCode !== "already.destroyed.error") {
                log.error(ex.toString());
            }
        }
    }

    function onTotalPagesChange(totalPages) {
        if( totalPages > 1) {
            !this.paginationView
                ? this._initPagination({ total: totalPages })
                : this._refreshPagination(totalPages);
        } else {
            this.paginationView && this.paginationView.hide();
        }
    }

    function createReportInstance(resourceUri, params, pages) {
        var self = this,
            report = new Report({
                resource: resourceUri,
                container: this.$content,
                params: params,
                autoresize: false,
                server: dashboardSettings.CONTEXT_PATH,
                showAdhocChartTitle: true,
                scale: this.model.get("scaleToFit"),
                pages: ((_.isObject(pages) && _.isUndefined(pages.pages) && _.isUndefined(pages.anchor)) || _.isUndefined(pages)) ? 1 : pages,
                events: {
                    changeTotalPages: _.bind(onTotalPagesChange, self),
                    changePagesState: function(page) {
                        if (self.paginationView) {
                            self.paginationView.model.set("current", page);
                        } else {
                            !_.isUndefined(this.data().totalPages) && this.data().totalPages > 1 && self._initPagination({ current: page });
                        }

                        // update pages of current component to match inner state of report
                        var oldPages = this.pages(),
                            newPages = _.isObject(oldPages) ? { pages: page } : page;

                        // do not loose anchor if it was set before
                        if (_.isObject(oldPages) && !_.isUndefined(oldPages.anchor)) {
                            newPages.anchor = oldPages.anchor;
                        }

                        this.pages(newPages);
                    },
                    reportCompleted: function() {
                        onReportCompleted.call(this, self.paginationView);
                    },
                    beforeRender: function() {
                        self.hideMessage();

                        if (self.component === this && self.drilldownComponent) {
                            destroyDrilldownComponent.call(self);

                            onTotalPagesChange.call(self, this.data().totalPages);
                            onReportCompleted.call(this, self.paginationView);
                        }
                    }
                },
                defaultJiveUi: {
                    floatingTableHeadersEnabled: true,
                    floatingCrosstabHeadersEnabled: true
                }
            });

        this.dashboardId && report.properties(sandboxFactory.get(this.dashboardId).get("reportSettings") || {});

        return report;
    }

    function onReportSuccessfulRun(triggerComponentRendered) {
        this.hideMessage();

        triggerComponentRendered !== false && this.trigger("componentRendered", self); //jshint ignore: line

        !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow(this));

        !this.$content.find(".jrPage").length && this.showMessage({ errorCode: "report.empty.error" });
    }

    function onReportFailedRun(errorObj) {
        if(errorObj.errorCode !== "report.execution.cancelled"){
            this.paginationView && this.paginationView.hide();
            this.$content.empty();
            this.showMessage(errorObj);

            this.ready.resolve();
        }
    }

    function changeReportPages(component, pages) {
        if (!_.isUndefined(pages)) {
            component.pages(pages).run()
                .done(_.bind(onReportSuccessfulRun, this))
                .fail(_.bind(onReportFailedRun, this));
        }
    }

    function buildOutputUrl(resource, output, pages, params) {
        var queryParams = _.extend({}, params),
            template = _.template("{{= contextPath }}/rest_v2/reports{{= resource }}.{{= output }}{{= params }}");

        !_.isUndefined(pages.pages) && (queryParams.pages = pages.pages);
        !_.isUndefined(pages.anchor) && (queryParams.anchor = pages.anchor);

        if (output === "xlsNoPag") {
            queryParams.ignorePagination = true;
            output = "xls";
        }

        if (output === "xlsxNoPag") {
            queryParams.ignorePagination = true;
            output = "xlsx";
        }

        return template({
            contextPath: dashboardSettings.CONTEXT_PATH,
            resource: resource,
            output: output,
            params: !_.isEmpty(queryParams) ? ("?" + $.param(queryParams, true)) : ""
        });
    }

    function buildOutputExportOptions(output, pages) {
        var exportOptions = {
                outputFormat: output,
                pages: pages
            };

        if (output === "xlsNoPag") {
            exportOptions.outputFormat = "xls";
        }

        if (output === "xlsxNoPag") {
            exportOptions.outputFormat = "xlsx";
        }

        return exportOptions;
    }

    /**
     * Factory to format error messages depending on error code
     */
    var reportErrorMessageFactory = (function() {
        var errorMessageFormatters = {};

        errorMessageFormatters["input.controls.validation.error"] = function(messageObj) {
            return [i18n["dashboard.dashlet.error." + messageObj.errorCode]].concat(messageObj.parameters).join("<br/>");
        };

        return function(messageObj) {
            var formatter = errorMessageFormatters[messageObj.errorCode];

            return formatter
                ? formatter(messageObj)
                : (i18n["dashboard.dashlet.error." + messageObj.errorCode] || i18n["dashboard.dashlet.error.unexpected.error"]);
        };
    })();

    return {

        _onViewInitialize: function() {
            var self = this;
            this.$el.addClass("dashboardVisualization");

            this.paramsModel.on("change", function (model){
                var fromProps = _.reduce(self.model.get("parameters"), function(memo, parameter){
                        if (parameter.parametrizeProperty){
                            memo.push(parameter.id);
                        }
                        return memo;
                    }, []);

                if (_.difference(_.keys(model.changed), fromProps).length){
                    this.paramsChanged = true;
                }
            });

            this.listenTo(this.model, "signal", _.bind(signalHandler, this));

            if (this.model.lastPayload) {
                for (var key in this.model.lastPayload){
                    signalHandler.call(this, {name: key, value: this.model.lastPayload[key]}, this.model.lastSender[key]);
                }
            }
        },

        updateReportLinkOptions: function() {
            this.component && this.component.linkOptions(processLinkOptions.call(this, this.component) || {});
            this.drilldownComponent && this.drilldownComponent instanceof Report
                && this.drilldownComponent.linkOptions(processLinkOptions.call(this, this.drilldownComponent) || {});
        },

        updateReportSettings: function() {
            this.component && this.component.properties(sandboxFactory.get(this.dashboardId).get("reportSettings") || {});
            this.drilldownComponent && this.drilldownComponent instanceof Report
                && this.drilldownComponent.properties(sandboxFactory.get(this.dashboardId).get("reportSettings") || {});
        },

        exportAs: function (options) {
            var component = this.drilldownComponent && this.drilldownComponent instanceof Report ? this.drilldownComponent : this.component,
                loading = new LoadingDialog({cancellable: false});

            loading.open();
            component["export"](options).done(function (result) {
                window.open(result.href);
            }).fail(function(){
                Notification.show({message: i18n["dashboard.dashlet.error.report.export.failed"]});
            }).always(function(){
                loading.close();
                loading.remove();
            });
        },

        /**
         * @memberof reportTrait
         * @access protected
         * @desc initializes report component specific behavior
         */

        _initComponent: function () {
            var self = this;

            _.bindAll(this, "updateReportLinkOptions", "updateReportSettings");

            if (this.dashboardId) {
                var sandbox = sandboxFactory.get(this.dashboardId);
                sandbox.on("linkOptions", this.updateReportLinkOptions);
                sandbox.on("reportSettings", this.updateReportSettings);
            }

            this.model.getReportResourceUri().done(function (uri, error) {
                if (error){
                    self._broken = true;
                    onReportFailedRun.call(self, error);
                } else {
                    self.component = createReportInstance.call(self, uri, {});

                    //set linkOptions manually first time
                    self.updateReportLinkOptions();
                }
            });
        },

        /**
         * @memberof reportTrait
         * @access protected
         * @desc remove component, sign off all events remove sub components
         */

        _removeComponent: function (options) {
            var sessionExpired = options ? options.sessionExpired : false;
            !sessionExpired && this.isReportRan && this.component.destroy();
            this.component = null;
            destroyDrilldownComponent.call(this);
            this.isReportRan = false;

            if (this.dashboardId) {
                var sandbox = sandboxFactory.get(this.dashboardId);
                sandbox.off("linkOptions", this.updateReportLinkOptions);
                sandbox.off("reportSettings", this.updateReportSettings);
            }
            
            this._removePagination();

            this.exportMenu && this.exportMenu.remove();
        },

        _renderComponent: function () {
            if (this.drilldownComponent && this.drilldownComponent instanceof WebPageView) {
                if (this.paginationView) {
                    this.paginationView.hide();
                    this.resizeContentContainer();
                }

                this.drilldownComponent.render(this.$content);
                this.trigger("componentRendered", this);
            } else if (this.drilldownComponent && this.drilldownComponent instanceof Report) {
                this.drilldownComponent.render(_.bind(this.trigger, this, "componentRendered", this));
                !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow());
            } else {
                // usually initial run triggered after wiring is initialized and initial parameters for reports are set
                if (this.isReportRan) {
                    this.component.render(_.bind(this.trigger, this, "componentRendered", this));
                    !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow());
                }
            }

            if (this.toolbar) {
                var self = this;
                //TODO: remove object with 'menuContainerTemplate' and 'menuOptionTemplate' when designing new JS component
                // required fix for JRS-10104
                this.exportMenu = new HoverMenu(exportOptions, this.toolbar.getOptionView('export').$el, null, {
                    menuContainerTemplate: menuContainerTemplate,
                    menuOptionTemplate: menuOptionTemplate
                });

                _.each(exportOptions, function(option){
                    self.listenTo(self.exportMenu, "option:" + option.action, function(){
                        self.exportMenu.hide();
                        self.exportAs(option.params);
                    });
                });
            }
        },

        _resizeComponent: function () {
            if (this.drilldownComponent) {
                if (this.drilldownComponent instanceof Report) {
                    if (this.isReportRan) {
                        this.drilldownComponent.resize();
                        !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow());
                    }
                }
                // we do nothing when we have active web page drilldown
            } else if (this.component) {
                if (this.isReportRan) {
                    this.component.resize();
                    !isAdhocChartReport(this) && this._resetContentOverflow(this._calculateContentOverflow());
                }
            }
        },

        notify: function(parameters){
            var signals = _.reduce(this.model.get("outputParameters"), function(memo, param){
                var value = parameters[param.id];
                if (value){
                    memo || (memo = {});
                    memo[param.id] = _.isArray(value) ? value : [value];
                }
                return memo;
            }, false);

            if (signals){
                this.model.notify(signals);
                this.model.collection.getDashboardPropertiesComponent().applyParameters();
            }
        },

        drilldown: function(drilldownInfo) {
            var params = drilldownInfo.parameters ? convertHyperlinksParamsToVizJsApi(drilldownInfo.parameters) : undefined,
                output = drilldownInfo.parameters && !_.isUndefined(drilldownInfo.parameters._output) ? drilldownInfo.parameters._output : undefined,
                pages,
                self = this;

            if (!_.isUndefined(drilldownInfo.pages)) {
                pages = {
                    pages: drilldownInfo.pages
                }
            }

            if (!_.isUndefined(drilldownInfo.anchor)) {
                pages = _.extend({
                    anchor: drilldownInfo.anchor
                }, pages);
            }

            if (drilldownInfo.type === hyperlinkTypes.REFERENCE) {
                destroyDrilldownComponent.call(this);

                // URLs can contain javascript functions. Ignore them in this case
                if (drilldownInfo.href.indexOf("javascript:") > -1) { //jshint ignore: line
                    return;
                } else {
                    this.drilldownComponent = new WebPageView({url: drilldownInfo.href});

                    this.render();
                }
            } else if (drilldownInfo.type === hyperlinkTypes.REPORT_EXECUTION) {
                if (!_.isUndefined(output) && output !== reportOutputFormats.HTML) {
                    // iOS doesn't support downloading files. So instead we open a new browser tab with file to give user
                    // ability to decide what to do with this file.
                    // To open a new tab, we emulate click on <a href="...">. We cannot wait for Viz.js export, so we
                    // are using rest_v2/reports service here.
                    if (_.isUndefined(pages)){
                        pages = {};
                    }

                    if (browserDetection.isIOS()) {
                        var a = document.createElement('a');
                        a.setAttribute("href", buildOutputUrl(drilldownInfo.resource, output, pages, params));
                        a.setAttribute("target", "_blank");

                        var dispatch = document.createEvent("HTMLEvents");
                        dispatch.initEvent("click", true, true);
                        a.dispatchEvent(dispatch);
                    } else {
                        var exportOptions = buildOutputExportOptions(output, pages),
                            report = new Report({
                                resource: drilldownInfo.resource,
                                params: params,
                                server: dashboardSettings.CONTEXT_PATH,
                                showAdhocChartTitle: true,
                                ignorePagination: output === "xlsNoPag" || output === "xlsxNoPag",
                                pages: _.isUndefined(pages.pages) && _.isUndefined(pages.anchor) ? 1 : pages
                            });

                        report
                            .run()
                            .done(function() {
                                report["export"](exportOptions)
                                    .done(function(link) {
                                        var url = link.href || link;

                                        if (self.dashboardId && sandboxFactory.get(self.dashboardId).get("previewMode")) {
                                            sandboxFactory.get(self.dashboardId).set("disablePageLeaveConfirmation", true);
                                        }

                                        window.location.href = url;

                                        if (self.dashboardId && sandboxFactory.get(self.dashboardId).get("previewMode")) {
                                            _.defer(function () {
                                                sandboxFactory.get(self.dashboardId).set("disablePageLeaveConfirmation", false);
                                            });
                                        }
                                    })
                                    .always(function() { report.destroy(); })
                            });
                    }
                } else {
                    if (drilldownInfo.resource === this.component.resource()) {
                        destroyDrilldownComponent.call(this);

                        if (params) {
                            this.component.params(params);

                            this.refresh()
                                .done(_.bind(changeReportPages, this, this.component, pages));
                        } else {
                            changeReportPages.call(this, this.component, pages);
                        }
                    } else if (this.drilldownComponent && this.drilldownComponent instanceof Report && drilldownInfo.resource === this.drilldownComponent.resource()) {
                        if (params) {
                            this.drilldownComponent.params(params).refresh()
                                .done(_.bind(changeReportPages, this, this.drilldownComponent, pages))
                                .fail(_.bind(onReportFailedRun, this));
                        } else {
                            changeReportPages.call(this, this.drilldownComponent, pages);
                        }
                    } else {
                        destroyDrilldownComponent.call(this);

                        this.paginationView && this.paginationView.hide();
                        this.paginationView && this.resizeContentContainer();

                        this.drilldownComponent = createReportInstance.call(this, drilldownInfo.resource, params, pages);

                        this.updateReportLinkOptions();

                        this.drilldownComponent.run()
                            .done(_.bind(onReportSuccessfulRun, this))
                            .fail(_.bind(onReportFailedRun, this));
                    }
                }
            }
        },

        refresh: function () {
            this.toolbar && this.toolbar.getOptionView("export").disable();

            var self = this,
                res = new $.Deferred(),
                dfd = this.cancel();

            dfd.always(function() {
                if (self.isReportRan) {
                    self.ready.done(function() {
                        self.isReportRunning = true;

                        destroyDrilldownComponent.call(self);

                        self.component
                            .refresh()
                            .fail(res.reject)
                            .done(function () {
                                initPagination.call(self, {resetCurrent: true});
                                onReportSuccessfulRun.call(self, false);

                                res.resolve();
                            });
                    });
                } else {
                    self.isReportRunning = true;

                    // in some cases, like Undo All, component may not exist at this time, so need additional checks
                    if (self.component) {
                        self.component
                            .run()
                            .fail(res.reject)
                            .done(function () {
                                self.isReportRan = true;
                                initPagination.call(self);
                                self.resizeContentContainer();
                                onReportSuccessfulRun.call(self);

                                res.resolve();
                            });
                    } else {
                        self._broken || self.hideMessage();
                        res.resolve();
                    }
                }
            });

            res
                .fail(_.bind(onReportFailedRun, this))
                .always(_.bind(this._onReportRunFinished, this));

            return res;
        },

        cancel: function () {
            return this.isReportRunning && this.component
                ? this.component.cancel()
                : (new $.Deferred()).resolve();
        },

        /**
         * @memberof reportTrait
         * @access protected
         * @param {object} options - pagination options.
         * @desc initializes pagination. Renders it, and attaches events.
         */

        _initPagination: function (options) {
            var self = this;
            var pagination = this.paginationView = new PaginationView(options);

            this.listenTo(pagination, "pagination:change", function (currentPage) {
                var report = self.drilldownComponent && self.drilldownComponent instanceof Report ? self.drilldownComponent : self.component;

                report.pages(currentPage).run().done(_.bind(function(){
                    // when event firing is off we still need to update pagination input.
                    pagination.options.silent && pagination.$el.find(".current").val(currentPage);
                }, this)).fail(_.bind(function(){
                    pagination.model.set("current", pagination.model.defaults.current);
                }, this)).always(_.bind(this._onReportRunFinished, this));
            });

            this.$content.before(pagination.render().$el);

            !this.model.get("showPaginationControl") && pagination.hide();
        },

        /**
         * @memberof reportTrait
         * @access protected
         * @param {number} totalPages - set total pages
         * @param {object} options
         * @param {boolean} [options.resetCurrent] - reset or not current page
         * @desc Refreshes pagination.
         */

        _refreshPagination: function (totalPages, options) {
            var setOptions = {
                "total": totalPages
            };

            if(options && options.resetCurrent){
                setOptions.current = this.paginationView.model.defaults.current
            }
            // returns pagination validation into default state
            this.paginationView.resetSetOptions();
            this.paginationView.model.set(setOptions);
            this.model.get("showPaginationControl") && this.paginationView.show();
        },


        /**
         * @memberof reportTrait
         * @access protected
         * @param {object} [overflow]
         * @param {string} [overflow.overflowX=auto]
         * @param {string} [overflow.overflowY=auto]
         * @desc Resets content overflow.
         */
        _resetContentOverflow: function(overflow){
            var overflow = overflow || {};
            this.$content.css({
                "overflow-x": overflow.overflowX || "auto",
                "overflow-y": overflow.overflowY || "auto"
            });
        },


        /**
         * @memberof reportTrait
         * @access protected
         * @desc Calculates if overflow is needed.
         */

        _calculateContentOverflow: function(){
            var overflowX = "auto";
            var overflowY = "auto";

            var jrPage = this.$content.find(".jrPage");
            var jrPageW = jrPage.outerWidth();
            var jrPageH = jrPage.outerHeight();

            var contentW = this.$content.outerWidth();
            var contentH = this.$content.outerHeight();

            var scaleStrategy = this.model.get("scaleToFit");

            var scaleFactor = scaleStrategy !== 1 ? getScaleFactor(scaleStrategy, jrPageW, jrPageH, contentW, contentH) : 1;

            (contentW >= Math.floor(jrPageW * scaleFactor)) && (overflowX = "hidden");
            (contentH >= Math.floor(jrPageH * scaleFactor)) && (overflowY = "hidden");

            return {
                overflowX: overflowX,
                overflowY: overflowY
            }

        },

        /**
         * @memberof reportTrait
         * @access protected
         * @desc Removes pagination.
         */

        _removePagination: function () {
            if (this.paginationView) {
                this.stopListening(this.paginationView);
                this.paginationView.remove();
                this.paginationView = null;
            }
        },


        /**
         * @memberof reportTrait
         * @access protected
         * @desc on component rendered event handler. If report is a chart, then scale stategy sets to container. Else content overflow is being calculated.
         */

        _onComponentRendered: function(){
            this.model.set("isAdhocChart", isAdhocChartReport(this));
        },

        _onReportRunFinished: function () {
            this.isReportRunning = false;
            this.$el.addClass("rendered");
            this.toolbar && this.toolbar.getOptionView("export").enable();
        },

        /**
         * @memberof reportTrait
         * @access protected
         * @desc on component properties change event handler. Triggers after some properties were changed through properties dialog.
         */

        _onComponentPropertiesChange: function () {
            // Re-render report only when visual props have changed
            if (this.model.hasChanged("scaleToFit")) {
                this.component.scale(this.model.get("scaleToFit"));
                this._renderComponent();

                this._resetContentOverflow(this._calculateContentOverflow());
            }

            if (this.model.hasChanged("showPaginationControl") && this.paginationView) {
                if (this.model.get("showPaginationControl") && this.paginationView.model.get("total") > 1) {
                    this.paginationView.show();
                    this.resizeContentContainer();
                } else if (!this.model.get("showPaginationControl")) {
                    this.paginationView.hide();
                    this.resizeContentContainer();
                }
            }
        },

        _errorMessageFactory: reportErrorMessageFactory
    }
});
