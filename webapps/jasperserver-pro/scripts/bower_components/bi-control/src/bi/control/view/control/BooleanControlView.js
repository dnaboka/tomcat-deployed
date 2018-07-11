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

    var BaseInputControlView = require("../BaseInputControlView"),
        _ = require("underscore"),
        log = require("logger").register(module),
        substitutions = require("../../enum/substitutionConstants"),
        singleBooleanTemplate = require("text!../../template/singleBooleanTemplate.htm");

    return BaseInputControlView.extend({

        template : singleBooleanTemplate,

        updateValue: function (controlData) {
            var input = this.$el.find("input");
            if (controlData === substitutions.NULL_SUBSTITUTION_VALUE || controlData === "false") {
                input[0].checked = false;
            } else {
                input[0].checked = Boolean(controlData);
            }

            if (this.model.state.get("error")) {
                this.updateWarningMessage();
            }
        },

        bindCustomEventListeners: function () {
            this.$el.on("change", "input", _.bind(function (evt) {
                var value = evt.target.checked ? "true" : "false";

                this.model.changeState(value);
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

