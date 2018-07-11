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

define(function (require) {

    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        $ = require("jquery"),
        _ = require("underscore"),
        DateAndTimePicker = require("components/dateAndTime/DateAndTimePicker"),
        singleValueDatetimeTemplate = require("text!../../template/singleValueDatetimeTemplate.htm"),
        dateTimeSettings = require("settings/dateTimeSettings"),
        dateUtil = require("common/util/parse/date");

    function getNormalizedDatetimeValue(rawValue) {
        var normalizedValue = rawValue.toUpperCase().replace(/([\s]+$|^[\s]+)/g, "");
        return normalizedValue.replace(/[\s]*(\+|\-)[\s]*/g, "$1");
    }

    return BaseInputControlView.extend({

        template: singleValueDatetimeTemplate,

        initialize:function () {
            this.renderStructure();
            this.renderState();
            if (this.model.get("visible")) {
                this.setupCalendar();
                this.bindCustomEventListeners();
            }
            this.model.get("readOnly") && this.disable();
            this.updateWarningMessage();
        },

	    setupCalendar:function () {
            var self = this,
                input = this.$el.find('input'),
                dataType = this.model.get("dataType"),
                minDate = dataType && dateUtil.iso8601TimestampToDateObject(dataType.minValue) || null,
                maxDate = dataType && dateUtil.iso8601TimestampToDateObject(dataType.maxValue) || null;

            if (dataType && dataType.strictMin && minDate) {
                minDate.setSeconds(minDate.getSeconds() + 1);
            }
            if (dataType && dataType.strictMax && maxDate) {
                maxDate.setSeconds(maxDate.getSeconds() - 1);
            }

            this.picker = new DateAndTimePicker({
                el: input,
                currentText: dateTimeSettings.timepicker.currentText,
                dateFormat:dateTimeSettings.datepicker.dateFormat,
                timeFormat:dateTimeSettings.timepicker.timeFormat,
                disabled:input[0].disabled,
                onSelect:_.bind(this.updateState, this),
                minDateTime: minDate,
                maxDateTime: maxDate
            });

            input.change(_.bind(function (evt) {
                //prevent triggering of global control change event
                evt.stopPropagation();

                var $target = $(evt.target);
                //remove all spaces an  d convert to upper case
                var value = getNormalizedDatetimeValue($target.val());
                $target.val(value);

                this.updateState(value);
            }, this));

            this.$el.find(".jr-mInput-datetrigger").on("click", function(){
                self.picker.show();
            });
        },

        updateValue:function (controlData) {
            var value = dateUtil.isoTimestampToLocalizedTimestamp(controlData);
            this.$el.find('input').attr('value', value);
        },

        updateState: function(inputValue) {
            this.model.changeState(dateUtil.localizedTimestampToIsoTimestamp(inputValue));
        },

        bindCustomEventListeners:function () {
            this.listenTo(this.model.state, "change:value", function(model, value) {
                this.updateValue(value);
            }, this);
            this.listenTo(this.model.state, "reset change", this.updateWarningMessage, this);
        },

        remove: function() {
            this.picker.remove();
            BaseInputControlView.prototype.remove.call(this);
        }
    });
});

