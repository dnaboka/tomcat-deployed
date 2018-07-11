/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
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
 * @author: Igor Nesterenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        BaseComponentModel = require("./BaseComponentModel"),
        log = require("logger").register("FusionChartsComponent"),
        jiveTypes = require("../enum/jiveTypes");

    return BaseComponentModel.extend({
        defaults: {
            id: null,
            instanceData: null,
            module: "jive.fusion",
            type: jiveTypes.FUSION_WIDGET,
            linksOptions: {}
        },

        initialize: function(attr, options){
            this.on("change:linksOptions", processLinkOptions);
            options.linkOptions && this.set("linksOptions", options.linkOptions);
        }
    });

    function processLinkOptions(model, linkOptions){
        if (linkOptions.events && !model.collection.fusionChartsLinkOptionsProcessed){
            model.collection.fusionChartsLinkOptionsProcessed = true;

            linkOptions.events.mouseout && log.info("Fusion charts does not support mouseout events for hyperlinks");
            linkOptions.events.mouseover && log.info("Fusion charts does not support mouseover events for hyperlinks");

            linkOptions.events.click && (linkOptions.events.click = _.wrap(linkOptions.events.click, function(func, ev, link){
                // handle case when we receive event from fusion charts - it's not a jQuery.Event instance
                if (link instanceof $.Event) {
                    func.call(this, ev, link);
                } else {
                    func.call(this, link.id, ev);
                }
            }));
        }
    }
});