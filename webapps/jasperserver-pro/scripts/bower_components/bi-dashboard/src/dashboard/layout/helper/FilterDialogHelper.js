/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Grant Bacon
 * @version: $Id: $
 */

define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes"),
        BasicHelper = require('./BasicHelper');

    return BasicHelper.extend({

        init: function (container) {
            this.container = container;

            this.helper = $('<div>').addClass('helper filter-dialog-drop').appendTo($("body#dashboard")).hide();
            this.helper.position = {};
        },

        drag: function (event, data) {
            if (!this.strategy.model.currentFoundation.components.getDashboardPropertiesComponent().get("dashletFilterShowPopup")) {
                return;
            }

            var position,
                componentId = data ? data.componentId : undefined,
                element = $(event.toElement || event.originalEvent.target),
                dialog = $(".filterGroup.dialog.open");

            if (data.resourceType === dashboardComponentTypes.INPUT_CONTROL && (element.is(this.helper) || element.parents(".dashboardCanvas").length || element.is(".filterGroup.dialog.open") || element.parents(".filterGroup.dialog.open").length)) {
                if (!dialog.length) {
                    this.strategy.model.currentFoundation.trigger("open:filterDialog");
                    return;
                }
                var dialogRect = dialog[0].getBoundingClientRect();

                this.helper.element = dialog;

                this.helper.css(
                    _.extend({zIndex: parseInt(dialog.css("zIndex")) + 2}, _.pick(dialogRect, ["top", "left", "width", "height"]))
                );
                this.helper.show();
            } else {
                this.helper.hide();
            }

        },

        stop: function() {
            this.helper.hide();
        }

    });

});