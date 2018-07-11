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

    var _ = require("underscore");

    var FormatModelCache = function() {
        this.map = {};
        this.keyInfo = {};
    };

    FormatModelCache.prototype = {
        get: function(key) {
            if (this.map[key]) {
                return this.map[key].current;
            }
            return null;
        },

        set: function(key, stateJSON) {
            if (!this.map[key]) {
                this.map[key] = {
                    original: _.cloneDeep(stateJSON),
                    current: _.cloneDeep(stateJSON)
                };
            } else {
                this.map[key].current = _.cloneDeep(stateJSON);
            }
        },

        createKey: function(applyTo, model, isGroup) {
            var key;

            if (!isGroup) {
                key = applyTo + "-column-" + model.get("columnIndex");
            } else {
                key = applyTo + "-column-" + model.get("forColumns").join("_");
            }

            if (!this.keyInfo[key]) {
                this.keyInfo[key] = {
                    applyTo: applyTo,
                    model: model
                }
            }

            return key;
        },

        clear: function() {
            this.map = {};
            this.keyInfo = {};
        },

        remove: function() {}
    };

    return FormatModelCache;
});