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


/*
 * @author inesterenko
 * @version: $Id$
 */

define(function (require, exports, module) {

    "use strict";

    var log = require("logger").register(module),
        _ = require("underscore"),
        BaseInputControlView = require("../BaseInputControlView"),
        singleValueNumberTemplate = require("text!../../template/singleValueNumberTemplate.htm");

    return BaseInputControlView.extend({

        template : singleValueNumberTemplate,

        updateValue:function (controlData) {
            this.$el.find('input').val(controlData);
        },

        bindCustomEventListeners:function () {
            this.$el.on('change keyup', 'input', _.bind(function (evt) {
                this.model.changeState(evt.target.value);
            }, this));

            this.model.state.on("change:value", function(model, value) {
                this.updateValue(value);
            }, this);
        },

        remove: function() {
            this.$el.off("change", "input");
            this.model.state.off("change:value", undefined, this);
            BaseInputControlView.prototype.remove.call(this);
        }
    });
});

