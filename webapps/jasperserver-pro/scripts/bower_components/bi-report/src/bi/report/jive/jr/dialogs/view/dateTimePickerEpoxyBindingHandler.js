/**
 /*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
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

    var DateAndTimePicker = require("components/dateAndTime/DateAndTimePicker");

    function cleanUpFromDateTimePicker(inputId){

        this.view.pickers.forEach(function(picker){
            if (picker.$el.prop("id") == inputId){
                picker.remove();
            }
        });

        this.view.pickers = this.view.pickers.filter(function(picker){
            return inputId != picker.$el.prop("id");
        });

    }

    return function($element, dataType) {
        var previousDataType = this.view.viewModel.previous("dataType"),
            patterns = this.view.viewModel.get("calendarPatterns");

        if (!this.view.pickers) {
            this.view.pickers = [];
        }

        if (previousDataType != dataType) {
            if (previousDataType === "date" || previousDataType === "time") {
                cleanUpFromDateTimePicker.call(this,$element.prop("id"));
            }

            if (dataType === "date") {
                this.view.pickers.push(new DateAndTimePicker({
                    el : $element[0],
                    dateFormat: patterns.date,
                    timeFormat: patterns.time,
                    skipMoving: true
                }));
            } else if (dataType === "time") {
                this.view.pickers.push(new DateAndTimePicker({
                    el : $element[0],
                    timeFormat: patterns.time,
                    skipMoving: true
                }));
            }

        }
    };
});
