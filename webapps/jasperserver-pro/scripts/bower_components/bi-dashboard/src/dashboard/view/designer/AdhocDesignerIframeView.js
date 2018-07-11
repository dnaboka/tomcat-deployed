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

    var _ = require("underscore"),
        Backbone = require("backbone"),
        $ = require("jquery"),
        dashboardSettings = require("../../dashboardSettings"),
        DashboardComponentModel = require("dashboard/model/component/DashboardComponentModel"),
        adhocDesignerIframeTemplate = require("text!dashboard/template/adhocDesignerIframeTemplate.htm"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        ResourceModel = require("bi/repository/model/RepositoryResourceModel"),
        addDashboardComponentDialogTemplateFactory = require("dashboard/factory/addDashboardComponentDialogTemplateFactory"),
        Dialog = require("common/component/dialog/Dialog"),
        AddDashboardComponentDialogController = require("dashboard/view/designer/AddDashboardComponentDialogController"),
        dashboardMessageBus = require("../../dashboardMessageBus"),
        dashboardMessageBusEvents = require("../../enum/dashboardMessageBusEvents"),
        Notification = require("common/component/notification/Notification"),
        logger = require("logger").register(module);


    var SaveDialogModel = ResourceModel.extend({
        initialize: function(atts, options) {
            options || (options = {});
            this.constructor.__super__.initialize.apply(this, arguments);

            this.set("label", "");
            if (this.get("type") === 'ichart' || this.get("type") === 'olap_ichart') {
                this.set("type", dashboardComponentTypes.CHART);
            } else if (this.get("type") === 'olap_crosstab') {
                this.set("type", dashboardComponentTypes.CROSSTAB);
            }
            this.collection = options.dashletCollection;
            this.validation.label = DashboardComponentModel.prototype.validation.name;
        }
    });

    return Backbone.View.extend({
        el: _.template(adhocDesignerIframeTemplate),

        events: {
            "load": "_onIframeLoad"
        },

        initialize: function() {
            _.bindAll(this, "_onWindowResize", "_onDesignerCancel", "_onDesignerSave");
            $(window).on("resize", this._onWindowResize);
        },


        render: function() {
            var body = $("body");
            var bannerHeight = body.find("> #banner").outerHeight(true);

            this._addDimmer();

            body.append(this.$el);

            this.$el
                .attr("src", this.model.getDesignerUri())
                .css({
                    'top': bannerHeight + 'px',
                    'height': body.find("> #frame").height() - bannerHeight + 'px',
                    'width': body.width() - dashboardSettings.DASHBOARD_ADHOC_IFRAME_MARGIN*2,
                    'background-color': body.css("background-color"),
                    'z-index': dashboardSettings.DASHBOARD_ADHOC_IFRAME_Z_INDEX
                })
                .show();

            return this;
        },

        _onIframeLoad: function() {
            // Check if we were redirected to login page. This may happen for example if session got expired.
            // In this case we will close iframe for now.
            var frame = this._getFrame();
            if (frame.location.href.indexOf("login.html") > -1) {
                //We should not deal with session expiration here
                //so just triggering dashboard wide event
                dashboardMessageBus.trigger(dashboardMessageBusEvents.SESSION_EXPIRED);
            } else if (frame && frame.jQuery) {
                var $iframeDocument = frame.jQuery(frame.document);

                $iframeDocument.
                    off("adhocDesigner:cancel errorPage:close").
                    on("adhocDesigner:cancel errorPage:close", this._onDesignerCancel);

                $iframeDocument.
                    off("adhocDesigner:save").
                    on("adhocDesigner:save", $.proxy(this._onConfirmDesignerSave, this));

                $iframeDocument.
                    off("adhocDesigner:saved").
                    on("adhocDesigner:saved", $.proxy(this._onDesignerSave, this));

                $iframeDocument.
                    off("adhocDesigner:notification").
                    on("adhocDesigner:notification", $.proxy(this._onDesignerNotification, this));
            }
        },

        _onDesignerCancel: function(ev, meta) {
            this.trigger("close", this);
            this._hideDimmer();
        },

        _onDesignerNotification: function(e, message, duration){
            this.notification = this.notification ? this.notification : new Notification();
            this.notification.show({message: message, delay: duration, type: "success"});
        },

        _hideDimmer: function() {
            this.$dimmer.addClass("hidden").hide();
        },

        _addDimmer: function() {
            if (!$(".dashboard.dimmer").length) {
                this.$dimmer = $("<div class='dashboard dimmer hidden' style='z-index:" + dashboardSettings.DASHBOARD_DIMMER_Z_INDEX + "; display: none;'></div>");
                $("body").append(this.$dimmer);
            }else{
                !this.$dimmer && (this.$dimmer = $(".dashboard.dimmer"));
            }

            var iframeZIndex = parseInt(this.$el.css("zIndex"));

            iframeZIndex > 0 && this.$dimmer.css("zIndex", iframeZIndex - 1);

            this.$dimmer.removeClass("hidden").show();
        },

        _onDesignerSave: function(ev, meta) {
            meta.label = this.model.get("name");
            this.trigger("save", this, meta);
        },

        _onConfirmDesignerSave: function(ev, meta) {

            if (this.model.isNew()) {
                var model = new SaveDialogModel(meta, {dashletCollection: this.model.collection});

                this.addComponentDialogController = new AddDashboardComponentDialogController(model, {
                    okButtonLabel: "button.save",
                    okButtonDisabled: true,
                    overElement: this.$el
                });

                this.addComponentDialogController.dialog.open();

                this.listenTo(this.addComponentDialogController.dialog, "button:ok", function() {
                    if (model.isValid()) {
                        this.model.set("name", model.get("label")); //meta.label = model.get("label");
                        this._postMessageToDesigner("adhocDesigner:save");

                        this.addComponentDialogController.closeAndRemove();
                    }
                }, this);

                this.listenTo(this.addComponentDialogController.dialog, "button:cancel", function() {
                    this.addComponentDialogController.dialog.close();
                    this._addDimmer();
                }, this);

            } else {
                this._postMessageToDesigner("adhocDesigner:save");
            }
        },

        _postMessageToDesigner: function(message) {
            this.$el[0].contentWindow.postMessage(message, '*');
        },

        _onWindowResize: function() {
            var body = $("body");
            var bannerHeight = body.find("> #banner").outerHeight(true);

            this.resizeTimer && clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(_.bind(function() {
                this.$el.height(body.find("> #frame").height() - bannerHeight);
                this.$el.width(body.width() - dashboardSettings.DASHBOARD_ADHOC_IFRAME_MARGIN*2);
            }, this), 100);
        },

        _getFrame: function() {
            return $(this.$el)[0].contentWindow;
        },

        detachEvents: function(){
            var frame = this._getFrame();
            $(window).off("resize", this._onWindowResize);

            if (frame && frame.jQuery) {
                var $iframeDocument = frame.jQuery(frame.document);

                $iframeDocument.
                    off("adhocDesigner:cancel errorPage:close").
                    off("adhocDesigner:save");
            }
        },

        hide: function(){
            this.$el.hide();
        },

        removeSubComponents: function(){
            this.addComponentDialogController && this.addComponentDialogController.remove();
            this.$dimmer && this.$dimmer.remove();
        },

        remove: function() {
            this.detachEvents();
            this.removeSubComponents();

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});