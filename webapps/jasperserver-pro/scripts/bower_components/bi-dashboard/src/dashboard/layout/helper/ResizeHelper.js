/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require){
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardMessageBus = require("dashboard/dashboardMessageBus"),
        dashboardMessageBusEvents = require("dashboard/enum/dashboardMessageBusEvents"),
        BasicHelper = require('./BasicHelper');

    require("jquery-ui/jquery.ui.resizable");

    return BasicHelper.extend({
        init: function(container) {
            var self = this;

            this.container = container;

            _.bindAll(this, "_onWindowResize");

            $(window).on("resize", this._onWindowResize);

            this.listenTo(this.strategy.model.currentFoundation.components.getDashboardPropertiesComponent(), "change:dashletMargin", function() {
                self.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']').each(function() {
                    self._fixResizeHandlePositions($(this));
                });
            });

            this.listenTo(this.strategy.model.foundations, "addComponent moveComponent", function(componentModel, foundationModel) {
                _.defer(function() {
                    var $dashlet = self.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + '=' + componentModel.id + ']');
                    $dashlet.length && self._initResizable($dashlet);
                });
            });

            this.listenTo(this.strategy.model.foundations, "removeComponent", function(componentModel, foundationModel) {
                self._destroyResizable(self.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + '=' + componentModel.id + ']'));
            });

            this.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']').each(function() {
                self._initResizable($(this));
            });
        },

        deinit: function() {
            var self = this;

            this.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']').each(function() {
                self._destroyResizable($(this));
            });

            $(window).off("resize", this._onWindowResize);
        },

        _onWindowResize: function (e) {
            //hack which prevent jquery ui resize event from bubbling to window.
            //See http://bugs.jquery.com/ticket/9841
            if (!e.target.tagName) {
                var self = this;

                this.resizeTimer && clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(function () {
                    var gridSize = self.strategy.gridSize(self.container);

                    self.container.find('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']').each(function () {
                        if ($(this).is('.ui-resizable')) {
                            $(this).resizable("option", {
                                minWidth: Math.floor(gridSize.x),
                                minHeight: Math.floor(gridSize.y),
                                grid: [Math.floor(gridSize.x), Math.floor(gridSize.y)]
                            });
                        }
                    });
                }, 300);
            }
        },

        _onDashletResizeStart: function(event, ui) {
            var $dashlet = $(event.target),
                componentId = $dashlet.attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE),
                position = this.strategy.model.currentFoundation.components.get(componentId).getPositionObject(),
                gridSize = this.strategy.gridSize(this.container),
                emptyArea = this.strategy.calculateEmptyArea(position, componentId),
                maxHeight = position.height,
                maxWidth = position.width,
                $handle = $(event.toElement || event.originalEvent.target);

            this.strategy.model.currentFoundation.components.selectComponent(componentId);

            if ($handle.hasClass("ui-resizable-w") || $handle.hasClass("ui-resizable-nw") || $handle.hasClass("ui-resizable-sw")) {
                maxWidth = position.x + position.width - emptyArea.x;
            }

            if ($handle.hasClass("ui-resizable-e") || $handle.hasClass("ui-resizable-ne") || $handle.hasClass("ui-resizable-se")) {
                maxWidth = emptyArea.x + emptyArea.width - position.x;
            }

            if ($handle.hasClass("ui-resizable-n") || $handle.hasClass("ui-resizable-ne") || $handle.hasClass("ui-resizable-nw")) {
                maxHeight = position.y + position.height - emptyArea.y;
            }

            if ($handle.hasClass("ui-resizable-s") || $handle.hasClass("ui-resizable-se") || $handle.hasClass("ui-resizable-sw")) {
                maxHeight = emptyArea.y + emptyArea.height - position.y;
            }

            $dashlet.resizable("option", {
                "maxHeight": Math.ceil(maxHeight * gridSize.y),
                "maxWidth": Math.ceil(maxWidth * gridSize.x)
            });
        },

        _onDashletResizeStop: function(event, ui) {
            var componentId = $(event.target).attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE),
                component = this.strategy.model.currentFoundation.components.get(componentId),
                gridSize = this.strategy.gridSize(this.container),
                position = {
                    x: Math.round(ui.position.left / gridSize.x),
                    y: Math.round(ui.position.top / gridSize.y),
                    width: Math.round(ui.size.width / gridSize.x),
                    height: Math.round(ui.size.height / gridSize.y)
                };

            this.strategy.updateLayout(componentId, position);

            if (component.hasChanged("width") || component.hasChanged("height")) {
                dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);
            }

            // always update CSS, as Backbone.Model event may not trigger (position left the same),
            // in CSS we may already have px instead of % because of resizing
            ui.element.css(component.getCssPosition());
        },

        _initResizable: function($dashlet) {
            if ($dashlet.hasClass("inputControlWrapper")) {
                return;
            }

            var gridSize = this.strategy.gridSize(this.container);

            this._destroyResizable($dashlet);

            $dashlet.resizable({
                handles: 'all',
                containment: 'parent',
                minWidth: Math.floor(gridSize.x),
                minHeight: Math.floor(gridSize.y),
                grid: [Math.floor(gridSize.x), Math.floor(gridSize.y)],
                start: _.bind(this._onDashletResizeStart, this),
                stop: _.bind(this._onDashletResizeStop, this)
            }).on('resize', function (e) {
                e.stopPropagation();
            });

            this._fixResizeHandlePositions($dashlet);
        },

        _destroyResizable: function($dashlet) {
            try {
                $dashlet.resizable("destroy");
            } catch(ex) {}
        },

        _fixResizeHandlePositions: function($dashlet) {
            var margin = this.strategy.model.currentFoundation.components.getDashboardPropertiesComponent().get("dashletMargin") - 3;

            $dashlet.find(".ui-resizable-n, .ui-resizable-ne, .ui-resizable-nw").css({ top: margin + "px" });
            $dashlet.find(".ui-resizable-e, .ui-resizable-se, .ui-resizable-ne").css({ right: margin + "px" });
            $dashlet.find(".ui-resizable-s, .ui-resizable-se, .ui-resizable-sw").css({ bottom: margin + "px" });
            $dashlet.find(".ui-resizable-w, .ui-resizable-sw, .ui-resizable-nw").css({ left: margin + "px" });
        }
    });
});
