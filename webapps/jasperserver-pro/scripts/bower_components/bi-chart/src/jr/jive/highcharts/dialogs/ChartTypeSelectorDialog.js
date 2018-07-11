/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id: ChartTypeSelectorDialog.js 3544 2015-11-05 22:05:36Z psavushc $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        i18nAdhoc = require("bundle!adhoc_messages"),
        Dialog = require("common/component/dialog/Dialog"),
        ChartTypeSelectorView = require("./view/ChartTypeSelectorView"),
        chartTypeSelectorDialogTemplate = require("text!./template/chartTypeSelectorDialogTemplate.htm");


    return Dialog.extend({

        constructor: function(options) {
            this.model = options.model;
            this.chartTypeDialogState = options.chartTypeDialogStates[this.model.get("id")];

            Dialog.prototype.constructor.call(this, {
                model: options.model,
                title: i18nAdhoc["ADH_1214_ICHARTS_DIALOG_CHART_TYPE_TITLE"],
                additionalCssClasses: 'jive_chartTypeSelector jive_dialog',
                contentContainer: ".subcontainer",
                content: new ChartTypeSelectorView(),
                template: chartTypeSelectorDialogTemplate
            });
        },

        initialize: function() {
            Dialog.prototype.initialize.apply(this, arguments);

            this._setupSelections();

            this.chartTypeDialogState.opened && this.open();
            this.$el.css(this.chartTypeDialogState);
        },

        _setupSelections: function() {

            this.$el.find('div.cell').removeClass('selected');
            this.$el.find('div.cell[data-hcname="' + this.model.get("charttype") + '"]').addClass('selected');

            this.model.get("datetimeSupported")
                ? this.$el.find('div.cell[data-hcname^="TimeSeries"]').removeClass('jive_disabled')
                : this.$el.find('div.cell[data-hcname^="TimeSeries"]').addClass('jive_disabled');
            this.model.get("treemapSupported")
                ? this.$el.find('div.cell[data-hcname$="TreeMap"]').removeClass('jive_disabled')
                : this.$el.find('div.cell[data-hcname$="TreeMap"]').addClass('jive_disabled');
        },
        events: {
            "click div.closeIcon": "close",
            "touchend div.closeIcon": "close",

            "click div.cell": "selectChart",
            "touchstart div.cell": "selectChart"
        },
        selectChart: function(e) {
            var chartType,
                target = e.currentTarget;

            if ($(target).hasClass('jive_disabled')) {
                return;
            }

            chartType = target.getAttribute('data-hcname');

            if (chartType !== this.model.get("charttype")) {
                this.model.changeType({type: chartType});
            }
        },

        close: function () {
            this.chartTypeDialogState.opened = false;
            this.chartTypeDialogState.top = this.$el.css("top");
            this.chartTypeDialogState.left = this.$el.css("left");
            Dialog.prototype.close.apply(this, arguments);
        },

        remove: function() {
            this.$el.off("click touchend touchstart");
            if (this.isVisible()) {
                this.chartTypeDialogState.opened = true;
                this.chartTypeDialogState.top = this.$el.css("top");
                this.chartTypeDialogState.left = this.$el.css("left");
            }
            Dialog.prototype.remove.call(this, arguments);
        }

    });

});