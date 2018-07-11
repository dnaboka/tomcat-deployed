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
        _ = require('underscore'),
        Dialog = require("common/component/dialog/Dialog"),
        tableFilterTemplate = require("text!../template/tableFilterTemplate.htm"),
        TableFilterModel = require("../model/TableFilterModel"),
        datePickerBindingHandler = require("./dateTimePickerEpoxyBindingHandler");


    function toEpoxyOptions(jiveOptions) {
        var epoxyOptions = [];

        _.each(jiveOptions, function(o) {
            epoxyOptions.push({
                label: o.val,
                value: o.key
            });
        });

        return epoxyOptions;
    }

    var TableFilterViewModel = Epoxy.Model.extend({
        defaults: {
            columnLabel: "",
            clearFilter: "true",
            filterOptions: [],
            dataType: "text",
            emptyFilterOption: "..."
        },

        computeds: {
            isNotClearFilter: function() {
                return this.get("clearFilter") !== "true";
            },

            isNotBooleanType: function() {
                return this.get("dataType") !== "boolean";
            },

            transformedFilterOptions: {
                deps: ["clearFilter", "filterOptions"],
                get: function(clearFilter, filterOptions) {
                    if (clearFilter === "true") {
                        return [];
                    } else {
                        return toEpoxyOptions(filterOptions);
                    }
                }
            }
        },

        remove: function () {}
    });

    return Epoxy.View.extend({
        constructor: function(options) {
            this.i18n = options.i18n;
            Epoxy.View.prototype.constructor.call(this, options);
        },

        initialize: function() {
            this.model = new TableFilterModel();
            this.viewModel = new TableFilterViewModel();

            this.listenTo(this.viewModel, "change:clearFilter", this._onClearFilterChanged);

            Epoxy.View.prototype.initialize.apply(this, arguments);
        },

        el: function() {
            return _.template(tableFilterTemplate, { i18n: this.i18n });
        },

        computeds: {
            filterValueStart: {
                deps: ["value"],
                get: function(value) {
                    if (_.isArray(value)) {
                        return value[0];
                    } else {
                        return value;
                    }
                },
                set: function(val) {
                    var modelValue = this.getBinding("value");
                    if (_.isArray(modelValue)) {
                        modelValue[0] = val;
                    } else {
                        this.setBinding("value", val);
                    }
                }
            },
            filterValueEnd: {
                deps: ["value"],
                get: function(value) {
                    if (_.isArray(value)) {
                        return value[1];
                    }
                },
                set: function(val) {
                    var modelValue = this.getBinding("value");
                    if (_.isArray(modelValue)) {
                        modelValue[1] = val;
                    }
                }
            }
        },

        bindingHandlers: {
            dateTimePicker: datePickerBindingHandler
        },

        _onClearFilterChanged: function() {
            // reset filter on show all rows
            if (this.viewModel.get("clearFilter") === "true") {
                this.model.reset();
            }
            // set the operator to the first value from filterOptions
            else {
                this.model.set("operator", this.viewModel.get("filterOptions")[0].key);
            }
        },

        remove: function () {
            Epoxy.View.prototype.remove.apply(this, arguments);

            this.model && this.model.remove();
            this.viewModel && this.viewModel.remove();
        }
    });
});
