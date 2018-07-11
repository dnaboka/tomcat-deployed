/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Zakhar Tomchenko, Sergii Kylypko
 * @version: $Id$
 */

define(function(require, exports, module){
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require("backbone"),
        request = require("common/transport/request"),
        browserDetection = require("common/util/browserDetection"),
        LoadingDialog = require("common/component/dialog/LoadingDialog"),
        Notification = require("common/component/notification/Notification"),
        ViewerToolbarView = require('./view/viewer/ViewerToolbarView'),
        DashboardMessageView = require('./view/base/DashboardMessageView'),
        DashboardModel = require('./model/DashboardModel'),
        Dashboard = require('bi/dashboard/Dashboard'),
        DashboardExportUtils = require('dashboard/util/DashboardExportUtils'),
        Dialog = require("common/component/dialog/Dialog"),
        dashboardSettings = require("./dashboardSettings"),
        i18n = require('bundle!DashboardBundle'),
        viewerDashboardContainerTemplate = require("text!./template/viewerDashboardContainerTemplate.htm");

    require("css!dashboard/viewer.css");

    function wait(id, dfd){
        var self = this;
        request({
            url: this.contextPath + "/rest_v2/dashboardExecutions/" + id + "/status",
            headers: {
                "Accept": "application/json"
            },
            dataType: "json"
        }).done(function (status) {
            if (status.status === "execution"){
                dfd.notifyWith(self, [status.progress]);
                setTimeout(_.bind(wait, self, id, dfd), 1000);
            } else {
                dfd.resolve(status);
            }
        }).fail(_.bind(dfd.reject, dfd));

        return dfd;
    }

    var DashboardViewer = Backbone.View.extend({
        constructor: function(options) {
            options || (options = {});

            if (!options.el || !$(options.el)[0] || !$(options.el)[0].tagName) {
                throw new Error("Container for Dashboard is not specified");
            }

            Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            this.params = options.params || {};

            if (options.referenceWidth && options.referenceHeight){
                this._referenceSize = {
                    width: options.referenceWidth,
                    height: options.referenceHeight
                };
            }

            this.contextPath = options.contextPath || dashboardSettings.CONTEXT_PATH;

            (_.isUndefined(options.toolbar) || options.toolbar === true) && (this.toolbar = new ViewerToolbarView());

            if (this.toolbar){
                this.listenTo(this.toolbar, "button:undo", this.undoParameters, this);
                this.listenTo(this.toolbar, "button:undoAll", this.undoAllParameters, this);
                this.listenTo(this.toolbar, "button:redo", this.redoParameters, this);
                this.listenTo(this.toolbar, "button:export",  this.exportDashboard, this);
                this.listenTo(this.toolbar, "button:back",  this.goBack, this);
            }

            this.message = new DashboardMessageView();

            this._initAdditionalVisualComponents();

            this.render();

            $(window).on(window.onpagehide || window.onpagehide === null ? 'pagehide' : "unload", _.bind(this._stopHistory, this));

            this._startHistory();
            this._initPreventTextSelection('#banner', '#frame');
        },

        render: function(){
            this.$el.empty();

            this.toolbar && this.$el.append(this.toolbar.render().el);
            this.$el.append(viewerDashboardContainerTemplate);
            this.$(".dashboardContainer").append(this.message.$el);

            this.showInitialMessage();

            return this;
        },

        showInitialMessage: function() {
            this.message.show(i18n["dashboard.canvas.error.not.found"]);
        },

        _initAdditionalVisualComponents: function(){
            this.exportLoading = new LoadingDialog({
                cancellable: true
            });

            this.initialLoading = new LoadingDialog({
                cancellable: true
            });

            this.exportLoading.on("button:cancel", this.cancelExportDashboard, this);
            this.initialLoading.on("button:cancel", function(){
                window.history.back();
            }, this);
        },

        _handleDashboardError: function(errorObj) {
            var errorMsg = i18n["dashboard.canvas.error." + errorObj.errorCode]
                || i18n[errorObj.xmlHttpRequest && errorObj.xmlHttpRequest.status === 404
                        ? "dashboard.canvas.error.not.found"
                        : "dashboard.canvas.error.unexpected.error"];

            this.message.show(errorMsg);
            this.initialLoading && this.initialLoading.close();
        },

        _startHistory: function() {
            this.history = new Backbone.History();
            this.history.route(/.*/, _.bind(this._onLocationHashChange, this));
            this.history.start();
        },

        _stopHistory: function () {
            this.history && this.history.stop();
        },

        _initDashboard: function(uri, params) {
            var self = this;

            this.message.hide();

            if (this.model) {
                this.stopListening(this.model, "change:label");
            }

            // hack to get access to model to get dashboard label. Saves one REST server call.
            var origModelInitialize = DashboardModel.prototype.initialize;

            DashboardModel.prototype.initialize = function() {
                self.model = this;

                return origModelInitialize.apply(this, arguments);
            };

            this.dashboard = new Dashboard({
                server: this.contextPath,
                container: this.$(".dashboardContainer > .content > .body"),
                resource: uri,
                params: params || this.params,
                report: {
                    chart: {
                        animation: !this._referenceSize
                    }
                }
            }).events({
                canUndo:function(val){
                    if (self.toolbar) {
                        self.toolbar.setEnabled({undo: val, undoAll: val});
                    }
                },
                canRedo: function(val){
                    if (self.toolbar) {
                        self.toolbar.setEnabled({redo: val});
                    }
                },
                __canvasReady__: function(){
                    self.initialLoading.close();
                }
            });

            DashboardModel.prototype.initialize = origModelInitialize;

            if (self.toolbar) {
                this.listenTo(this.model, "change:label", function() {
                    self.toolbar.setTitle(self.model.get("label"));
                });

                this.listenTo(self.toolbar, "button:filterPopup", function() {
                    this.model.currentFoundation.trigger("toggle:filterDialog");
                });

                this.listenTo(this.model.currentFoundation, "close:filterDialog", function() {
                    self.toolbar.closeFilterPopupDialog();
                });

            }

            this.initialLoading.open();

            this.dashboard.run()
                .done(function() {
                    if (self.toolbar){
                        self.toolbar.setTitle(self.model.get("label"));

                        var properties = self.model.currentFoundation.components.getDashboardPropertiesComponent(),
                            hasUserWiring = self.model.currentFoundation.wiring.hasUserWiring() && self.model.currentFoundation.components.getValueProducers().length;
                        self.toolbar.setVisibility({
                            "export": properties.get("showExportButton"),
                            "filterPopup": properties.get("dashletFilterShowPopup"),
                            "undo": hasUserWiring,
                            "undoAll": hasUserWiring,
                            "redo": hasUserWiring
                        });
                    } else {
                        self._referenceSize && DashboardExportUtils.applyReferenceSize(self, self._referenceSize);
                    }

                    checkReadyness.call(self);
                })
                .fail(_.bind(this._handleDashboardError, this));
        },

        _initPreventTextSelection: function(){
            var selector = Array.prototype.slice.call(arguments, 0).join(",");

            if(browserDetection.isIE8() || browserDetection.isIE9()){
                $(selector).on("selectstart", function(e){
                    var tagName = e.target.tagName;
                    if (tagName != "INPUT" && tagName != "TEXTAREA") {
                        return false;
                    }
                });
            }
        },

        _onLocationHashChange: function(hash) {
            if (!hash) {
                return;
            }

            var params = _.extend({}, this.params, DashboardViewer.parseDashboardParamsFromString(hash)),
                uri = hash.split("&")[0];

            try {
                uri = decodeURIComponent(uri);
            } catch(ex) {
                uri = undefined;
            }

            if (!uri) {
                return;
            }

            if (uri.indexOf("/") !== 0) {
                uri = "/" + uri;
            }

            if (this.dashboard) {
                if (this.model.get("uri") !== uri) {
                    this.dashboard.destroy().always(_.bind(this._initDashboard, this, uri, params));
                } else {
                    this.dashboard.params(params).run().fail(_.bind(this._handleDashboardError, this));
                }
            } else {
                this._initDashboard(uri, params);
            }
        },

        remove: function(){
            $(window).off('pagehide unload');

            this._stopHistory();
            this.dashboard && this.dashboard.destroy();
            this.message && this.message.remove();
            this.toolbar && this.toolbar.remove();

            Backbone.View.prototype.remove.apply(this, arguments);
        },

        goBack: function () {
            window.history.back();
        },

        undoParameters: function(){
            this.dashboard.undoParams();
        },

        undoAllParameters: function(){
            this.dashboard.undoAllParams();
        },

        redoParameters: function(){
            this.dashboard.redoParams();
        },

        exportDashboard: function(type) {
            var self = this,
                res = new $.Deferred();

            this.exportLoading.open();
            res.progress(this.exportLoading.progress);

            request({
                url: this.contextPath + "/rest_v2/dashboardExecutions",
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                contentType: "application/json",
                processData: false,
                dataType: "json",
                data: JSON.stringify(createExportDto.call(this, type))
            }).done(function (descriptor) {
                self.currentExportId = descriptor.id;
                wait.call(self, descriptor.id, res).done(function (status) {
                    self.exportLoading.close();

                    if (status.status === "ready") {
                        self._download(self.contextPath + "/rest_v2/dashboardExecutions/" + status.id + "/outputResource");
                    } else {
                        Notification.show({message: i18n["dashboard.export.unexpected.error"]});
                    }

                    self.currentExportId = undefined;
                });
            }).fail(function(result){
                self.exportLoading.close();
                Notification.show({message: i18n["dashboard.export.renderer.fail"], delay: 5000});
            });

            return res;
        },

        cancelExportDashboard: function(){
            if (this.currentExportId){
                return request({
                    url: this.contextPath + "/rest_v2/dashboardExecutions/" + this.currentExportId,
                    method: "DELETE"
                }).done(function(){
                    this.currentExportId = undefined;
                }).fail(function(){
                    this.currentExportId = undefined;
                });
            }

            return new $.Deferred().resolve();
        },

        _checkReadyness: checkReadyness,

        _download: function(url){
            window.location.href = url;
        }
    }, {
        parseDashboardParamsFromString: function(paramsSourceString) {
            var dashboardParams,
                paramsString = paramsSourceString,
                paramValuePairs = paramsString.split("&");

            if (window.dashboardParams){
                dashboardParams = JSON.parse(window.dashboardParams);
            } else {
                dashboardParams = {};
                for (var i = 0; i < paramValuePairs.length; i++) {
                    var param = decodeURIComponent(paramValuePairs[i].split("=")[0]),
                        value = decodeURIComponent(paramValuePairs[i].split("=")[1]);

                    dashboardParams.hasOwnProperty(param)
                        ? dashboardParams[param].push(value)
                        : dashboardParams[param] = [ _.isUndefined(value) ? "" : value ];
                }
            }

            return dashboardParams;
        }
    });

    return DashboardViewer;


    function createExportDto(type){
        var markup, width, height, content,
            restoreJive = hideJive(),
            canvas = this.$(".dashboardCanvas:first");

        embedImages();
        embedValues();

        DashboardExportUtils.prepareForExport(this);

        if (type == "pdf") {
            content = canvas.children(".content");
            DashboardExportUtils.applyReferenceSize(this, {
                width: content.width(),
                height: content.height()
            });

            width = 3508;
            height = 2480;
        } else {
            width = canvas.width();
            height = canvas.height();
        }

        markup = canvas.parent().html();

        restoreJive();

        DashboardExportUtils.removeReferenceSize(this);

        return {
            uri: this.model.get("uri"),
            width: width,
            height: height,
            format: type,
            markup: markup,
            jrStyle: style()
        }
    }

    function embedImages() {
        try {
            var canvas = document.createElement("canvas"), ctx;

            if (canvas && canvas.getContext) {
                $("img").each(function (index, img) {
                    if (img.src.substring(0, 3) !== "data") {
                        if (!canvas) {
                            canvas = document.createElement("canvas");
                        }

                        try {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            ctx = canvas.getContext("2d");

                            ctx.drawImage(img, 0, 0);

                            img.src = canvas.toDataURL("image/png");
                        } catch (e) {}
                        canvas = null;
                    }
                });
            }
        } catch (e) { }
    }

    function embedValues(){
        $("input").each(function (index, inp) {
            var input = $(inp),
                type = input.attr("type");

            if (type == "text"){
                input.attr("value", input.val());
            } else if (type == "radio" || type == "checkbox"){
                input.attr("checked", inp.checked ? "checked" : null);
            }
        });
    }

    function style() {
        return _.reduce(document.styleSheets, function (memo, stylesheet) {
            var str = "/reportresource?",
                index = stylesheet.href ? stylesheet.href.indexOf(str) : -1;
            if (index >= 0) {
                memo.push(stylesheet.href.substring(index + str.length));
            }
            return memo;
        }, []);
    }

    function hideJive(){
        var jive_overlay = $("#jive_overlay").css("display"),
            jive_marker = $("#jive_marker").css("display"),
            jive_foobar = $("#jive_marker").css("display");

        $("#jive_overlay").css("display", "none");
        $("#jive_marker").css("display", "none");
        $("#jive_foobar").css("display", "none");

        return function (){
            $("#jive_overlay").css("display", jive_overlay);
            $("#jive_marker").css("display", jive_marker);
            $("#jive_foobar").css("display", jive_foobar);
        }
    }

    function checkReadyness(){
        var ready = !_.filter(this.$(".dashboardVisualization"), function(element){
            return !($(element).hasClass("rendered") && $(element).find(".fusionRendering").length === 0);
        }).length;

        if (ready){
            if (this.toolbar){
                this.toolbar.setEnabled({export: true});
            } else {
                if (this._referenceSize){
                    DashboardExportUtils.prepareForExport(this);
                }
            }

            $(document.body).addClass("rendered");
        } else {
            setTimeout(_.bind(checkReadyness, this), 1000);
        }
    }
});