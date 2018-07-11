/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        ComponentView = require("../base/ComponentView"),
        dashboardMessageBus = require("dashboard/dashboardMessageBus"),
        dashboardMessageBusEvents = require("dashboard/enum/dashboardMessageBusEvents"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        sandboxFactory = require('dashboard/factory/sandboxFactory'),
        ParameterMenu = require("dashboard/view/designer/ParameterMenu"),
        PropertiesDialogController = require("dashboard/view/designer/propertiesDialog/PropertiesDialogController"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        ContextMenu = require("common/component/menu/ContextMenu"),
        _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!DashboardBundle");

    return ComponentView.extend({
        events: _.extend({}, ComponentView.prototype.events, {
            "click": "_selectComponent",
            "dblclick": "_showPropertiesDialog",
            "contextmenu": "_showContextMenu"
        }),

        initialize: function(){
            ComponentView.prototype.initialize.apply(this, arguments);

            this._initContextMenu();

            if (this.model.get("type") !== dashboardComponentTypes.FILTER_GROUP) {
                this.addOverlay();
            }

            this.on("componentRendered", _.bind(this._onComponentRendered, this));

            this.listenTo(this.model, "change:selected", this._onComponentSelect);
            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.TOGGLE_PREVIEW_MODE, _.bind(this._onTogglePreviewMode, this));

            this.listenTo(this.dashboardProperties, "change", this._onDashboardPropertiesChange);
        },

        remove: function() {
            this.propertiesDialogController && this.propertiesDialogController.remove();

            ComponentView.prototype.remove.apply(this, arguments);
        },

        _initContextMenu: function() {
            var contextMenuOptions = [
                { label: i18n["dashboard.context.menu.option.properties"], action: "properties"},
                { label: i18n["dashboard.context.menu.option.delete"], action: "delete"}
            ];

            if (this.additionalContextMenuOptions) {
                contextMenuOptions = contextMenuOptions.concat(this.additionalContextMenuOptions);
            }

            this.contextMenu = new ContextMenu(contextMenuOptions);

            this.listenTo(this.contextMenu, "option:properties", this._showPropertiesDialog);
            this.listenTo(this.contextMenu, "option:delete", this._deleteComponent);

            this._initComponentSpecificContextMenuEvents && this._initComponentSpecificContextMenuEvents();
        },

        _onTogglePreviewMode: function(previewIsOn){
            if(this.propertiesDialogController && this.propertiesDialogController.dialog){
                var dialog = this.propertiesDialogController.dialog;
                var coordinates = this.propertiesDialogController.lastCoordinates;

                this.propertiesDialogController.dialogIsOpened && !previewIsOn ? dialog.open(_.extend({silent: true}, coordinates)) : dialog.close({silent: true});
            }
        },

        _onComponentRendered: function() {},

        _onComponentSelect: function() {
            if (this.model.get("selected")) {
                this.$el.addClass("selected");
            } else {
                this.$el.removeClass("selected");
                this.contextMenu.hide();
            }
        },

        _onDashboardPropertiesChange: function(model) {},

        _deleteComponent: function() {
            this.trigger("delete", this.model);
        },

        _selectComponent: function(e) {
            e && e.stopPropagation && e.stopPropagation();

            this.model && this.model.collection && this.model.collection.selectComponent($(e.target).attr("id") || this.model.id);
        },

        _showPropertiesDialog: function(e){
            var coordinates = {};

            if (e instanceof Backbone.View) {
                var offset = e.$el.offset();
                coordinates = { top: offset.top, left: offset.left };
            } else {
                e.stopPropagation && e.stopPropagation();

                coordinates = { top: e.pageY, left: e.pageX };
            }

            this.contextMenu.hide();

            ParameterMenu.useModel(sandboxFactory.get(this.model.dashboardId).get("dashboardModel"));

            if (!this.propertiesDialogController) {
                this.propertiesDialogController = new PropertiesDialogController(this.model);
                this.listenTo(this.propertiesDialogController.dialog, "properties:dialog:select", this._selectComponent);
            }

            this.propertiesDialogController.lastCoordinates = coordinates;
            this.propertiesDialogController.dialog.open(_.extend({renderContent: false}, coordinates));
        },

        _showContextMenu: function(e){
            e.preventDefault();

            this._selectComponent(e);

            this.contextMenu.show({
                left: e.pageX,
                top: e.pageY
            }, this.$el);
        }
    });
});
