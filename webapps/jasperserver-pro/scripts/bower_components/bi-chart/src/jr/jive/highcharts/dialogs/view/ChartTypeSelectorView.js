/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
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
 * @version: $Id: ChartTypeSelectorView.js 3477 2015-10-06 14:15:35Z psavushc $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        i18nAdhoc = require("bundle!adhoc_messages"),
        Tooltip = require("common/component/tooltip/Tooltip"),
        chartTypeSelectorDialogContentTemplate = require("text!../template/chartTypeSelectorDialogContentTemplate.htm");

    return Backbone.View.extend({
        template: _.template(chartTypeSelectorDialogContentTemplate),


        initialize: function() {
            var self = this;

            this.$el = $(this.template({i18n: i18nAdhoc}));

            this.tooltip = Tooltip.attachTo(this.$el, {
                cssClasses: "jive_tooltip tooltip info",
                contentTemplate: '<p class="message">{{- model.msg }}</p>'
            });

            this.$el.find("[data-tooltip]").on("mouseover", function(e) {
                var msg = $($(this).attr("data-tooltip")).text();
                self.tooltip.show({msg: msg});
            });
            this.$el.find("[data-tooltip]").on("mouseout", function(e) {
                self.tooltip.hide();
            });

        },

        render: function() {
            return this;
        },

        remove: function() {
            this.tooltip.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }


    });

});