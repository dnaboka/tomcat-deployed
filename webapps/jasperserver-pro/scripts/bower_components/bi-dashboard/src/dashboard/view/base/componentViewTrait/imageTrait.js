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
 *
 *
 * @author: Grant Bacon
 */
define(function (require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        hyperlinkHandler = require("dashboard/hyperlink/handler/dashboardHyperlinkHandlerAdhocExecution"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        ImageView = require("../ImageView");

    function signalHandler(payload) {
        if (payload.name === dashboardWiringStandardIds.REFRESH_SLOT) {
            this._renderComponent();
        } else if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            this._renderComponent();
        }
    }

    return {

        notify: function(signals){
            this.model.notify(signals);
            this.model.collection.getDashboardPropertiesComponent().applyParameters();
        },

        _initComponent: function() {
            var self = this;

            this.component = new ImageView({
                model: this.model,
                el: this.$content
            });

            this.$content.click(function(ev){
                hyperlinkHandler.events.click(ev, _.reduce(self.model.get("outputParameters"), function(memo, param){
                    memo.parameters[param.id] = param.defaultValue;
                    return memo;
                }, {parameters: {}}), self);
            });

            this.listenTo(this.model, "signal", signalHandler);

            if (this.model.lastPayload) {
                for (var key in this.model.lastPayload) {
                    signalHandler.call(this, {name: key, value: this.model.lastPayload[key]}, this.model.lastSender[key]);
                }
            }
        },

        /**
         * @memberof imageTrait
         * @access protected
         * @desc on component properties change event handler. re-Renders component after properties were changed through properties dialog.
         */

        _onComponentPropertiesChange: function(changedProperties) {
            if (!_.isEmpty(_.omit(changedProperties, "selected"))) {
                this._renderComponent();
            }
        },


        _renderComponent: function() {
            var uri = this.model.getParametrizationResult("url", this.paramsModel.attributes, {tolerateMissing: true});
            this.component.render(uri);
            this.trigger("componentRendered", this);
        },

        _onRefreshClick: function() {
            this._renderComponent();
        }

    };

});
