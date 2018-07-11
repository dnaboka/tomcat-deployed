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
        defaults: {
            operator: null,
            value: null
        },

        computeds: {
            isMultiValueOperator: function() {
                var op = this.get("operator");
                return (op && op.toLowerCase().indexOf("between") !== -1) ? true : false;
            }
        },

        initialize: function() {
            this.on("change:operator", this._onOperatorChange);

            Epoxy.Model.prototype.initialize.apply(this, arguments);
        },

        reset: function() {
            this.clear({silent: false}).set(this.defaults);
            return this;
        },

        _onOperatorChange: function() {
            var currentValue = this.get("value"),
                operator = this.get("operator"),
                isMultiValue;

            isMultiValue = operator && operator.toLowerCase().indexOf("between") !== -1;

            if (isMultiValue === true) {
                if (!_.isArray(currentValue)) {
                    this.set({value: [currentValue]});
                }
            } else if (isMultiValue === false) {
                if (_.isArray(currentValue)) {
                    this.set({value: currentValue[0]});
                }
            }
        },

        remove: function() {}
    });
});