/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Sergii Kylypko
 * @version: $Id: EmptySpaceDropHelper.js
 */

define(function(require){

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes"),
        BasicHelper = require('./BasicHelper');

    return BasicHelper.extend({

        init: function(container){
            this.container = container;

            this.helper = $('<div>').addClass('helper empty-space-drop').appendTo(container).hide();
            this.helper.position = {};
        },

        drag: function(event, data){
            var position,
                componentId = data ? data.componentId : undefined,
                element = $(event.toElement || event.originalEvent.target);

            if (!element.is('.content > .body')){
                if (element.attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE) ||
                    element.parents('[' + dashboardSettings.COMPONENT_ID_ATTRIBUTE + ']').length) {
                    this.stop();
                    return;
                } else if (element.hasClass("dashboardLevelPropertiesDialog") ||
                    element.parents('.dashboardLevelPropertiesDialog').length ||
                    element.hasClass("inputControlWrapper")) {
                    this.stop();
                    return;
                } else if (element[0] === this.helper[0]){
                    element = element.siblings('.content').find('> .body');
                } else {
                    if (element.parents(".dashboardCanvas").length || element.is(".dragHelper") || element.is(".overlay")) {
                        return;
                    } else {
                        this.stop();
                        return;
                    }
                }
            }

            if (data.resourceType === repositoryResourceTypes.INPUT_CONTROL
                && this.strategy.model.currentFoundation.components.findWhere({ type: dashboardComponentTypes.FILTER_GROUP })) {

                if (this.strategy.model.currentFoundation.components.getDashboardPropertiesComponent().get("dashletFilterShowPopup")) {

                    // TODO:
                    // Instead of stopping, lets place an overlay over the Dialog where the IC will be placed.
                    this.stop();
                    return;
                }

                if (!element.parents(".dashboardCanvas").length) {
                    this.stop();
                    return;
                }

                position = this.strategy.model.currentFoundation.components.findWhere({ type: dashboardComponentTypes.FILTER_GROUP }).getPositionObject();
            } else {
                position = element[0].getBoundingClientRect();

                position = this.strategy.preciseCoordsToCell(
                    element,
                        event.clientX - position.left,
                        event.clientY - position.top
                );

                if (_.isUndefined(position.x)
                    || _.isUndefined(position.y)
                    || (this.helper.position.x === position.x && this.helper.position.y === position.y)) {
                    return;
                }

                this.helper.position.x = position.x;
                this.helper.position.y = position.y;

                position.width = position.height = 1;

                position = this.strategy.calculateEmptyArea(position, componentId);

                if (!position) {
                    this.stop();
                    return;
                }
            }

            this.helper.css(this.strategy.cellCSS(position)).show();
        },

        stop: function(event){
            this.helper.hide();
            this.helper.position.x = undefined;
            this.helper.position.y = undefined;
        },

        drop: function(event, ui, position){
            var componentId = ui.helper.data("data") ? ui.helper.data("data").componentId : undefined,
                pos = this.strategy.calculateEmptyArea(position, componentId);

            for(var i in pos){
                if (pos.hasOwnProperty(i)){
                    position[i] = pos[i];
                }
            }
        },

        deinit: function(){
            this.helper.remove();
        }
    });

});