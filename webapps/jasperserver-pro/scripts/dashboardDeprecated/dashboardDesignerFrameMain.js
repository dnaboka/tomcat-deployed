/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global Hash, JRS, FusionCharts, FusionChartsEvents, isIPad, __jrsConfigs__ */

define(function(require){
    "use strict";

    require("ReportRequireJsConfig");
    require("commons.bare.main");
    require("components.dialogs");
    require("touchcontroller");
    require("core.events.bis");
    require("core.ajax");
    require("jquery.urldecoder");

    var domReady = require("domReady"),
        Report = require("report.view.runtime"),
        jrsConfigs = require("jrs.configs"),
        jQuery = require("jquery");

    domReady(function() {
        if(window.Prototype) {
            delete Object.prototype.toJSON;
            delete Array.prototype.toJSON;
            delete Hash.prototype.toJSON;
            delete String.prototype.toJSON;
        }

        if (typeof JRS.vars == "undefined") {
            JRS.vars = {};
        }

        JRS.fid = jrsConfigs.dashboardDesignerFrame.fid;

        window.printRequest = function() {
            try {
                if (parent.document.getElementById('fusioncharts_managed_print')) {
                    if (parent.getIEVersion() > 0 && parent.getIEVersion() < 9) {
                        parent.requestBrowserUpdate();
                    } else {
                        window.parent.jQuery(parent).trigger('managed_print_request');
                        FusionCharts.printManager.enabled(true);
                        FusionCharts.addEventListener(FusionChartsEvents.PrintReadyStateChange, function (identifier, parameter) {
                            if (parameter.ready) {
                                window.parent.jQuery(parent).trigger('chart_rendered');
                            }
                        });
                    }
                }
            } catch (error) {
                //we trying to access parent from iframe from different domain,port,protocol
                //prevent failing of fusion chart
            }
        };

        window.FC_Rendered = function(DOMId) {
            jQuery('#' + DOMId).hide().show();
        };

        jQuery(function () {
            try {
                if (window.parent.document.body.id == 'dashboardViewer' && window.parent.document.getElementById(JRS.fid).getAttribute('scrolling') == 'no') {
                    document.body.style.overflow = 'hidden';
                }
            } catch (error) {
                //we trying to access parent from iframe from different domain,port,protocol
                //prevent failing of fusion chart
            }

            if (isIPad()) {
                document.addEventListener('touchstart', function (e) {
                    if (window.parent.TouchController.proxy) {
                        window.parent.TouchController.proxy.onTouchStart(e);
                    }
                }, false);
                document.body.addEventListener('touchmove', function (e) {
                    if (window.parent.TouchController.proxy && e.touches.length == 1) {
                        window.parent.TouchController.proxy.onTouchMove(e);
                    }
                    e.preventDefault();
                }, false);
            }
        });

        Report.allRequestParameters = jrsConfigs.dashboardDesignerFrame.reportRequestParams;

        if (!jrsConfigs.dashboardDesignerFrame.isAdhocReportUnit) {
            require(["ReportRequireJsConfig"], function() {
                //We can start load report viewer only when additional requirejs config is loaded
                //so check that additional config is for sure loaded

                require(['reportViewer/viewer'], function(Viewer) {
                    window.viewer = new Viewer({
                        at: '#reportContainer',
                        reporturi: Report.allRequestParameters.reportUnit,
                        async: true,
                        page: 0,
                        contextPath: __jrsConfigs__.contextPath
                    });

                    window.jasperreports = {
                        reportviewertoolbar: window.viewer
                    };

                    Report.initialize();
                });
            });
        } else {
            var frame = jQuery('#' + JRS.fid, window.parent.document);

            frame.removeClass('hidden').show();
            if (!isIPad()) {
                frame.parents('.iframe').css('background-image', 'none');
            }
        }
    });
});