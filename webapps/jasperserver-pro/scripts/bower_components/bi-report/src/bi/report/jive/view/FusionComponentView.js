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
 * @author: Narcis Marcu
 * @version: $Id$
 */
define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        BaseJiveComponentView = require("./BaseJiveComponentView"),
        FusionCharts = require("fusioncharts");

    var FusionElement = function(config) {
        this.config = config;
        this.parent = null;
        this.loader = null;

        this.fusionInstance = null;

        this._init();
    };

    FusionElement.prototype = {

        // internal API
        _init: function() {
            var
                self = this,
                instData = this.config.instanceData,
                fcConfig;

            if(!document.getElementById(instData.id)) {
                if (typeof window.printRequest === 'function') { //FIXME: is this still necessary?
                    window.printRequest();
                }

                fcConfig = {
                    id: instData.id,
                    type: instData.type,
                    width: instData.width,
                    height: instData.height,
                    renderAt: instData.renderAt,
                    dataFormat: instData.dataFormat,
                    dataSource: instData.dataSource
                };

                //remove instance if it already exists
                //to avoid memory leaks
                FusionCharts.items[fcConfig.id] && FusionCharts.items[fcConfig.id].dispose();

                this.fusionInstance = new FusionCharts(fcConfig);

                this.fusionInstance.addEventListener('BeforeRender', function(event, eventArgs) {
                    if (eventArgs.renderer === 'javascript') {
                        event.sender.setChartAttribute('exportEnabled', '0');
                    }
                });

                this.fusionInstance.addEventListener('JR_Hyperlink_Interception', function(event, eventArgs) {
                    var handler;
                    self.config.linksOptions.events && (handler = self.config.linksOptions.events.click);
                    handler && handler.call(this, event, eventArgs);
                });

                this.fusionInstance.setTransparent(instData.transparent);
                this.fusionInstance.render();
            }
        },

        remove: function () {
            this.fusionInstance && this.fusionInstance.dispose();
        }
    };

    return BaseJiveComponentView.extend({

        render: function($el) {
            var dfd = new $.Deferred(),
                linkOptions = this.model.collection ? this.model.collection.linkOptions : null,
                data = _.extend(this.model.toJSON(), { chart: _.clone(this.stateModel.get("chart")) });

            if (linkOptions) {
                data.linkOptions = linkOptions;
            }

            this.fusionElement = new FusionElement(data);

            dfd.resolve();

            return dfd;
        },

        remove: function () {
            this.fusionElement && this.fusionElement.remove();

            BaseJiveComponentView.prototype.remove.apply(this, arguments);
        }
    });
});
