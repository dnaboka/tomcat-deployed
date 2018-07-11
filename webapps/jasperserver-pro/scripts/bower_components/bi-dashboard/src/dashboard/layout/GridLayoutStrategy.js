/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Sergii Kylypko, Kostiantyn Tsaregradskyi
 * @version: $Id: GridLayoutStrategy.js 4 2014-08-15 14:51:00Z ktsaregradskyi $
 */

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require("jquery"),
        dashboardSettings = require("dashboard/dashboardSettings"),

        MoveHelper = require('./helper/MoveHelper'),
        ResizeHelper = require('./helper/ResizeHelper'),
        EmptySpaceDropHelper = require('./helper/EmptySpaceDropHelper'),
        SplitDropHelper = require('./helper/SplitDropHelper'),
        FilterDialogHelper = require('./helper/FilterDialogHelper');

    var GridLayoutStrategy = function(dashboardModel) {
        this.model = dashboardModel;

        this.helpers = _.map([MoveHelper, ResizeHelper, EmptySpaceDropHelper, FilterDialogHelper, SplitDropHelper], function(helper){
            return new helper(this);
        }, this);
    };

    GridLayoutStrategy.prototype = {
        coordsToCell: function(el, x, y){
            return {
                x: x !== el.width()
                    ? Math.floor(x / (el.width() / dashboardSettings.GRID_WIDTH))
                    : dashboardSettings.GRID_WIDTH,
                y: y !== el.height()
                    ? Math.floor(y / (el.height() / dashboardSettings.GRID_HEIGHT))
                    : dashboardSettings.GRID_HEIGHT
            };
        },

        preciseCoordsToCell: function(el, x, y){
            return {
                x: parseInt(x * dashboardSettings.GRID_WIDTH / el.width()),
                y: parseInt(y * dashboardSettings.GRID_HEIGHT / el.height())
            };
        },

        cellToCoord: function(x, y){
            return {
                x: x * 100 / dashboardSettings.GRID_WIDTH,
                y: y * 100 / dashboardSettings.GRID_HEIGHT
            };
        },

        gridSize: function(el){
            return {
                x: el.width() / dashboardSettings.GRID_WIDTH,
                y: el.height() / dashboardSettings.GRID_HEIGHT
            };
        },

        cellCSS: function(position){
            var pos = this.cellToCoord(position.x, position.y),
                size = this.cellToCoord(position.width, position.height);

            return {
                left: pos.x + '%',
                top: pos.y + '%',
                width: size.x + '%',
                height: size.y + '%'
            }
        },

        onDashletDragStart: function(componentObj, event){
            _.each(this.helpers, function(helper){
                helper.start && helper.start(event, componentObj);
            }, this);
        },

        onDashletDrag: function(componentObj, event) {
            _.each(this.helpers, function(helper){
                helper.drag && helper.drag(event, componentObj);
            }, this);
        },

        onDashletDragStop: function(componentObj, event) {
            _.each(this.helpers, function(helper){
                helper.stop && helper.stop(event, componentObj);
            }, this);
        },

        onDashletDrop: function(componentModel, event, ui, container) {
            var position;

            position = container[0].getBoundingClientRect();

            position = this.coordsToCell(
                container,
                event.clientX - position.left,
                event.clientY - position.top
            );

            position.width = position.height = 1;

            _.each(this.helpers, function(helper){
                helper.drop && helper.drop(event, ui, position, componentModel.id);
            }, this);

            if (!position) {
                return;
            }

            this.updateLayout(componentModel.id, position);
        },

        initVisualHelpers: function(container){
            _.each(this.helpers, function(helper){
                helper.init && helper.init(container);
            }, this);
        },

        updateLayout: function(componentId, position){
            var componentModel = this.model.currentFoundation.components.get(componentId);

            componentModel && componentModel.set(position);
        },

        getDashletDropTarget: function(event) {
            var element = $(event.toElement || event.originalEvent.target);

            if (element.hasClass('dragHelper')){
                element = this.lastTarget;
            } else {
                this.lastTarget = element;
            }

            element = element.parents('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']');

            if (!element || !element.length) {
                return undefined;
            }

            return element;
        },

        calculateEmptyArea: function(position, ignoreComponentId){
            var stretch, test;

            position = _.clone(position);

            stretch = function(step, position){
                var result = _.clone(position);

                if (step & 1) result.x--;
                if (step & 2) result.y--;
                if (step & 4) result.width++;
                if (step & 8) result.height++;

                return result;
            };

            if (this.overlapsOrIsOutOfBounds(position, ignoreComponentId)) {
                return false;
            }

            for(var step=15; step; step--){
                while (!this.overlapsOrIsOutOfBounds(test = stretch(step, position), ignoreComponentId)){
                    position = test;
                }
            }

            return position;
        },

        overlapsOrIsOutOfBounds: function(position, ignoreComponentId) {
            if (this.model.currentFoundation.components.isOutOfCanvasBounds(position)) {
                return true;
            }

            return this.model.currentFoundation.components.overlaps(position, ignoreComponentId);
        },

        remove: function(){
            _.each(this.helpers, function(helper){
                helper.deinit && helper.deinit();
            }, this);
        }
    };

    return GridLayoutStrategy;
});