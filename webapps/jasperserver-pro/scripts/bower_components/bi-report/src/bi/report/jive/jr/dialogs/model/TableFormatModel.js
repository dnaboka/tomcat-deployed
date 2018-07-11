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

    var Epoxy = require('backbone.epoxy'),
        _ = require('underscore');

    return Epoxy.Model.extend({
        defaults: function() {
            return {
                columnLabel: undefined,

                backgroundColor: undefined,
                align: undefined,
                pattern: undefined,
                font: {
                    bold: false,
                    italic: false,
                    underline: false,
                    size: 9,
                    name: undefined,
                    color: "000000"
                }
            }
        },

        computeds: function() {
            var ctds = {};

            // dinamically create computeds for each font property
            _.each(this.defaults().font, function(val, key) {
                ctds["font" + key.charAt(0).toUpperCase() + key.substring(1, key.length)] = {
                    deps: ["font"],
                    get: function(font) {
                        return font[key];
                    },
                    set: function(value) {
                        this.modifyObject("font", key, value);
                        return value;
                    }
                };
            });

            return ctds;
        },

        reset: function() {
            this.clear({silent: true}).set(this.defaults());
            return this;
        },

        remove: function() {}
    });
});