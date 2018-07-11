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

    var _ = require('underscore'),
        Epoxy = require("backbone.epoxy"),

        TableCommonFormatView = require("./TableCommonFormatView"),
        tableConditionTemplate = require("text!../template/tableConditionTemplate.htm"),
        TableConditionModel = require("../model/TableConditionModel");

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

    var ViewModel = Epoxy.Model.extend({
        defaults: {
            conditionIndex: 1,
            conditionOptions: [],
            dataType: "text",
            calendarPatterns: {}
        },

        computeds: {
            isNotBooleanType: function() {
                return this.get("dataType") !== "boolean";
            }
        },

        remove: function () {}
    });

    return TableCommonFormatView.extend({
        events: {
            "click div.jive_inputbutton[name='conditionRemove']": "_removeCondition",
            "click div.jive_inputbutton[name='conditionMoveUp']": "_moveConditionUp",
            "click div.jive_inputbutton[name='conditionMoveDown']": "_moveConditionDown"
        },

        el: function() {
            return _.template(tableConditionTemplate, {i18n: this.i18n});
        },

        initialize: function() {
            this.model = new TableConditionModel();
            this.viewModel = new ViewModel();

            Epoxy.View.prototype.initialize.apply(this, arguments);
        },

        computeds: {
            convertedOptions: {
                deps: ["conditionOptions"],
                get: function(conditionOptions) {
                    return toEpoxyOptions(conditionOptions);
                }
            },

            conditionValueStart: {
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
                        this.model.set({ value: modelValue }, { validate: true });
                    } else {
                        this.model.set({ value: val }, { validate: true });
                    }
                }
            },

            conditionValueEnd: {
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
                        this.model.set({ value: modelValue }, { validate: true });
                    }
                }
            },

            getColspan: function() {
                return this.getBinding("isMultiValueOperator") ? 1 : 3;
            }
        },

        _removeCondition: function(evt) {
            this.model.trigger('destroy', this.model, this.model.collection);
        },

        _moveConditionUp: function(evt) {
            var collection = this.model.collection,
                index = collection.indexOf(this.model);

            if (index > 0) {
                collection.remove(this.model, { silent: true });
                collection.add(this.model, { at: index - 1}, { silent: true });
                this.parent.render();
            }
        },

        _moveConditionDown: function(evt) {
            var collection = this.model.collection,
                index = collection.indexOf(this.model);

            if (index < collection.length - 1) {
                collection.remove(this.model, { silent: true });
                collection.add(this.model, { at: index + 1}, { silent: true });
                this.parent.render();
            }
        },

        remove: function () {
            Epoxy.View.prototype.remove.apply(this, arguments);

            this.model && this.model.remove();
            this.viewModel && this.viewModel.remove();
        }
    });
});