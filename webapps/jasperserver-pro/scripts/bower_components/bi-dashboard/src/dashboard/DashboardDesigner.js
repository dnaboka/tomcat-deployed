/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi, Sergii Kylypko
 * @version: $Id: DashboardDesigner.js 125 2014-09-16 15:25:38Z sergey.prilukin $
 */

define(function(require, exports, module){
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        SidebarView = require('./view/designer/SidebarView'),
        DashboardViewer = require('./DashboardViewer'),
        DesignerCanvasView = require('./view/designer/DesignerCanvasView'),
        Dialog = require("common/component/dialog/Dialog"),
        httpStatusCodes = require("common/enum/httpStatusCodes"),
        DesignerToolbarView = require('./view/designer/DesignerToolbarView'),
        CanvasView = require('./view/base/CanvasView'),
        DashboardModel = require('./model/DashboardModel'),
        PropertiesDashboardComponentModel = require('./model/component/PropertiesDashboardComponentModel'),
        DashboardStateCollection = require('./collection/DashboardStateCollection'),
        GridLayoutStrategy = require("./layout/GridLayoutStrategy"),
        dashboardMessageBus = require("./dashboardMessageBus"),
        dashboardMessageBusEvents = require("./enum/dashboardMessageBusEvents"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        sandboxFactory = require("./factory/sandboxFactory"),
        welcomeTextTemplate = require('text!dashboard/template/welcomeTextTemplate.htm'),
        dashboardSettings = require("./dashboardSettings"),
        i18n = require('bundle!DashboardBundle');

    require("css!dashboard/designer.css");

    return DashboardViewer.extend({
        initialize: function(options){
            _.bindAll(this, "_onPageLeave", "_onSessionExpired", "_onUnload");

            this.contextPath = options.contextPath || dashboardSettings.CONTEXT_PATH;

            this.model = new DashboardModel({}, { contextPath: this.contextPath });
            this.dashboardId = this._generateDashboardId();

            sandboxFactory.get(this.dashboardId).set("dashboardModel", this.model);

            this.state = new DashboardStateCollection([], { model: this.model });
            this.strategy = new GridLayoutStrategy(this.model);

            this.sidebar = new SidebarView({
                model: this.model,
                strategy: this.strategy,
                dashboardId: this.dashboardId
            });

            this.designerCanvas = new DesignerCanvasView({
                model: this.model,
                strategy: this.strategy,
                state: this.state,
                dashboardId: this.dashboardId
            });

            this.toolbar = new DesignerToolbarView({
                model: this.model,
                state: this.state,
                dashboardId: this.dashboardId
            });

            this.canvas = new CanvasView({
                model: this.model,
                dashboardId: this.dashboardId
            });

            this._initAdditionalVisualComponents();

            // canvas will work as preview, we need only render functionality from it, that is why we
            // unsubscribe from from other events to improve performance and hide it
            this.canvas.stopListening();
            this.canvas.$el.hide();
            this.canvas.model = undefined;

            this.listenTo(this.toolbar, "preview:on", _.bind(function() { this.enterPreviewMode(); }, this));
            this.listenTo(this.toolbar, "preview:off", _.bind(function() { this.exitPreviewMode(); }, this));
            this.listenTo(this.toolbar, "grid:on", _.bind(function() { this.showLayoutGrid(); }, this));
            this.listenTo(this.toolbar, "grid:off", _.bind(function() { this.hideLayoutGrid(); }, this));
            this.listenTo(this.toolbar, "dashboard:save", this._onDashboardSave);
            this.listenTo(this.toolbar, "button:filterPopup", _.bind(function() {this.toggleFilterPopup(); }, this));
            this.listenTo(this.toolbar, "button:undo", this.undoParameters, this);
            this.listenTo(this.toolbar, "button:undoAll", this.undoAllParameters, this);
            this.listenTo(this.toolbar, "button:redo", this.redoParameters, this);


            this.listenTo(this.model, "error:all", this._onAllModelErrors);
            this.listenTo(this.model, "propertiesAvailable", _.bind(this._onDashboardPropertiesAvailable, this));

            this.listenTo(this.sidebar, "open", _.bind(this._onSidebarToggle, this, false));
            this.listenTo(this.sidebar, "close", _.bind(this._onSidebarToggle, this, true));
            this.listenTo(this.sidebar, "resize", _.bind(this._onSidebarResize, this));
            this.listenTo(this.sidebar, "resizeStop", _.bind(this._resizeComponents, this));

            this.listenTo(this.designerCanvas.model.currentFoundation, "open:filterDialog", this.openDesignerFilterDialog);
            this.listenTo(this.designerCanvas.model.currentFoundation, "close:filterDialog", this.closeFilterDialog);

            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.SAVE_DASHBOARD_STATE, _.bind(this.state.saveState, this.state));
            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);

            this.listenTo(this.toolbar, "button:export",  this.exportDashboard, this);

            this.render();

            this._startHistory();
            this._initPreventTextSelection('#banner', '#frame');
            this._checkPreviewMode();

            $(window).on(window.onpagehide || window.onpagehide === null ? 'pagehide' : "unload", this._onUnload);
            $(window).on("beforeunload", this._onPageLeave);
            $(window).on(dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);
        },

        showInitialMessage: function() {
            this.designerCanvas.message.show(_.template(welcomeTextTemplate, { i18n: i18n }));
        },

        hideMessageBox: function() {
            this.designerCanvas.message.hide();
        },

        enterPreviewMode: function() {
            var hasUserWiring = this.model.currentFoundation.wiring.hasUserWiring() && this.model.currentFoundation.components.getValueProducers().length;
            sandboxFactory.get(this.getDashboardId()).set("previewMode", true);

            this.$el.removeClass("twoColumn").addClass("oneColumn");

            this.sidebar.$el.hide();
            this.designerCanvas.filterDialog.close();
            this.designerCanvas.$el.hide();
            this.canvas.$el.show();

            this.canvas.model = this.model.clone(this.dashboardId);

            if (hasUserWiring){
                this.canvas.model.currentFoundation.components.on("parametersState:canUndo", _.bind(this.canUndo, this));
                this.canvas.model.currentFoundation.components.on("parametersState:canRedo", _.bind(this.canRedo, this));
                this.canRedo(false);
                this.canUndo(false);
            }

            this.toolbar.setVisibility({
                undo: hasUserWiring,
                redo: hasUserWiring,
                undoAll: hasUserWiring
            });
            
            this.canvas.render();

            this.canvas.applyCanvasSize();
            this.canvas.applyCanvasColor();

            this.designerCanvas.$rootEl.addClass("previewMode");

            this.canvas.model.currentFoundation.startLoadingSequence();

            this._checkReadyness();
            this._modifyUri();
        },

        exitPreviewMode: function() {
            sandboxFactory.get(this.getDashboardId()).set("previewMode", false);

            this.$el.removeClass("oneColumn").addClass("twoColumn");

            this.designerCanvas.$rootEl.removeClass("previewMode");

            if (!this.model.currentFoundation.wiring.hasUserWiring()){
                this.toolbar.setVisibility({
                    undo: true,
                    redo: true,
                    undoAll: true
                });
            }

            this.canvas.$el.removeClass("previewMode");
            this.history.navigate(this.history.getFragment().replace(/previewMode&/g,""));
            this.canvas.filterDialog.close();
            this.canvas.$el.hide();
            this.canvas.disableAutoRefresh();
            this.canvas.removeAllComponentViews();

            this.sidebar.$el.show();
            this.designerCanvas.$el.show();

            delete this.canvas.model;

            this._resizeComponents();
            this.sidebar.accordion.fit();
        },
        
        isPreviewMode: function() {
            return sandboxFactory.get(this.getDashboardId()).get("previewMode");
        },

        showLayoutGrid: function(){
            this.designerCanvas.$el.find('.grid').show();
        },

        hideLayoutGrid: function(){
            this.designerCanvas.$el.find('.grid').hide();
        },

        toggleFilterPopup: function() {
            if (this.isPreviewMode()) {
                this.canvas.filterDialog.isVisible() ? this.canvas.filterDialog.close() : this.canvas.filterDialog.open()
            } else {
                this.designerCanvas.filterDialog.isVisible() ? this.designerCanvas.filterDialog.close() : this.designerCanvas.filterDialog.open();
            }
        },

        // openDesignerFilterDialog is used to only open the dialog.
        // This prevents us from maintaining unnecessary state in FilterDialogHelper
        openDesignerFilterDialog: function() {
            if (!this.designerCanvas.filterDialog.isVisible()) {
                this.designerCanvas.filterDialog.open();
                this.toolbar.trigger("filterButtonStyle:open");
            }
        },

        closeFilterDialog: function() {
            (this.isPreviewMode()) ? this.canvas.filterDialog.close() : this.designerCanvas.filterDialog.close();
            this.toolbar.trigger("filterButtonStyle:close");
        },

        canUndo: function (val){
            if (this.toolbar) {
                this.toolbar.setEnabled({undo: val, undoAll: val});
            }

            if (this.toolbar && val) {
                this.toolbar.$("#undo, #undoAll").removeAttr("disabled").removeClass("over disabledButton");
            } else if (this.toolbar && !val) {
                this.toolbar.$("#undo, #undoAll").attr("disabled", "disabled").addClass("disabledButton").removeClass("over");
            }
        },

        canRedo: function (val) {
            if (this.toolbar) {
                this.toolbar.setEnabled({redo: val});
            }

            if (this.toolbar && val) {
                this.toolbar.$("#redo").removeAttr("disabled").removeClass("over disabledButton");
            } else if (this.toolbar && !val) {
                this.toolbar.$("#redo").attr("disabled", "disabled").addClass("disabledButton").removeClass("over");
            }
        },

        undoParameters: function(){
            if (this.isPreviewMode()) {
                this.canvas.model.currentFoundation.components.popParametersState(-1);
                this.canvas.model.currentFoundation.components.getDashboardPropertiesComponent().applyParameters(true);
            } else {
                this.state.setPreviousState();
            }
        },

        undoAllParameters: function(){
            if (this.isPreviewMode()) {
                this.canvas.model.currentFoundation.components.resetParametersState();
                this.canvas.model.currentFoundation.components.getDashboardPropertiesComponent().applyParameters(true);
            } else {
                this.state.setFirstState();
            }
        },

        redoParameters: function(){
            if (this.isPreviewMode()) {
                this.canvas.model.currentFoundation.components.popParametersState(1);
                this.canvas.model.currentFoundation.components.getDashboardPropertiesComponent().applyParameters(true);
            } else {
                this.state.setNextState();
            }
        },

        _onPageLeave: function(e) {
            if (this.sessionExpired) {
                //force reload without any check in case of session expiration
                return undefined;
            }

            if (this.downloading) {
                // skip checks if downloading
                this.downloading = false;
                return undefined;
            }

            if (sandboxFactory.get(this.getDashboardId()).get("disablePageLeaveConfirmation")) {
                return undefined;
            }

            if ((!this.model.isNew() && this.state.hasPreviousState()) ||
                (this.model.isNew() && this.model.currentFoundation.hasVisualComponents())) {
                (e || window.event).returnValue = i18n["dashboard.dialog.unsaved.changes"];
                return i18n["dashboard.dialog.unsaved.changes"];
            }
        },

        _onDashboardPropertiesAvailable: function(propertiesModel) {
            this.toolbar.setVisibility({
                "filterPopup": propertiesModel.get("dashletFilterShowPopup")
            });
        },

        _generateDashboardId: function() {
            return this.model.cid;
        },

        getDashboardId: function() {
            return this.dashboardId;
        },

        _onDashboardSave: function() {
            this.state.init();

            this._updateLocationHash();
        },

        _updateLocationHash: function() {
            if (this.model.has('uri')) {
                var encodedUri = encodeURIComponent(this.model.get('uri'));
                if (this.isPreviewMode()) {
                    this.history.navigate("previewMode&" + encodedUri, { trigger: false, replace: false });
                } else {
                    this.history.navigate(encodedUri, { trigger: false, replace: false });
                }
            }
        },

        _loadModelByUri: function(uri) {
            var self = this;

            try {
                uri = decodeURIComponent(uri);
            } catch(ex) {
                uri = undefined;
            }

            if (uri && uri.indexOf("/") !== 0) {
                uri = "/" + uri;
            }

            if (uri == this.model.get("uri")) {
                return;
            }

            this.model.resetToInitialCondition();

            if (!uri) {
                this.showInitialMessage();

                this.model.currentFoundation.startLoadingSequence();

                this.state.init();
            } else {
                this.hideMessageBox();

                this.model.set({ uri: uri });

                this.model
                    .fetch()
                    .fail(function() { self.model.currentFoundation.startLoadingSequence(); })
                    .always(function () { self.state.init(); });
            }
        },

        _onLocationHashChange: function(uri){
            var uri = uri.replace(/previewMode&/g, "");

            if ((!this.model.isNew() && this.state.hasPreviousState()) ||
                (this.model.isNew() && this.model.currentFoundation.hasVisualComponents())) {
                if (window.confirm(i18n["dashboard.dialog.unsaved.changes"])) {
                    this._loadModelByUri(uri);
                } else {
                    this.history.navigate(this.model.get('uri'), { trigger: false, replace: true });
                }
            } else {
                this._loadModelByUri(uri);
            }
        },

        _modifyUri: function () {
            if (this.history.getFragment()) {
                this.history.navigate("previewMode&" + this.history.getFragment().replace(/previewMode&/g,""));
            }
        },

        _checkPreviewMode: function () {
            var self = this;

            function togglePreviewMode () {
                if (self.model.currentFoundation.hasVisualComponents()) {
                    self.enterPreviewMode();
                } else {
                    setTimeout(togglePreviewMode, 100);
                }
            }

            if (/previewMode&/.test(this.history.getFragment())) {
                self.toolbar.togglePreviewMode();
                togglePreviewMode();
            }
        },

        _onAllModelErrors: function(model, errorObj, xhr) {
            this.model.unset("uri");

            var errorMsg = i18n["dashboard.canvas.error." + errorObj.errorCode]
                || i18n[xhr.status === 404 ? "dashboard.canvas.error.not.found" : "dashboard.canvas.error.unexpected.error"];

            this.designerCanvas.message.show(errorMsg);
        },

        _onSidebarToggle: function(sidebarIsHided) {
            var $designerCanvasEl = this.designerCanvas.$el,
                left = this.sidebar.$contentContainer[sidebarIsHided ? "outerWidth" : "width"]() -
                    (sidebarIsHided ? parseInt($designerCanvasEl.css("marginLeft")) / 2 : 0);

            this.designerCanvas.$rootEl.css({left: left});
            this.toolbar.$el.css({left: left});

            this._resizeComponents();
        },

        _onSidebarResize: function(e, ui) {
            var left = ui.size.width;

            this.designerCanvas.$rootEl.css({left: left});
            this.toolbar.$el.css({left: left});
        },

        _onSessionExpired: function() {
            this.sessionExpired = true;
            window.location.reload();
        },

        _onUnload: function() {
            var options = _.pick(this, "sessionExpired");
            this.designerCanvas.remove(options);
            this.canvas.remove(options);
        },

        _resizeComponents: function() {
            _.invoke(this.designerCanvas.componentViews, "resize");
        },

        _download: function(url){
            this.downloading = true;
            DashboardViewer.prototype._download.call(this, url);
        },

        render: function(){
            this.$el.empty();

            // do not render viewer canvas, because it's hidden by default. it will be rendered only when preview mode
            // will be enabled
            this.designerCanvas.render().$rootEl.prepend(this.canvas.$el);

            this.$el.append(this.toolbar.render().$el);
            this.canvas.$el.addClass("column decorated primary");
            this.$el.append( this.designerCanvas.$rootEl);
            this.$el.append(this.sidebar.render().$el);

            return this;
        },

        remove: function(){
            this.sidebar.remove();
            this.strategy.remove();
            this.designerCanvas.remove();

            $(window).off(dashboardMessageBusEvents.SESSION_EXPIRED, this._onSessionExpired);
            $(window).off("beforeunload", this._onPageLeave);
            $(window).off('pagehide unload');

            DashboardViewer.prototype.remove.apply(this, arguments);
        }
    });
});