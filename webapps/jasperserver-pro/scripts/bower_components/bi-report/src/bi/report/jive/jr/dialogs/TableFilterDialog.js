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

    var _ = require("underscore"),
        Dialog = require("common/component/dialog/Dialog"),
        tableFilterTemplate = require("text!./template/tableFilterDialogTemplate.htm"),
        TableFilterView = require("./view/TableFilterView"),
        jiveDataConverter = require("../../util/jiveDataConverter"),
        i18n2 = require("bundle!CommonBundle");

    function schemaFilterToJiveFilter(schemaFilter, schemaDataType) {
        var jiveFilter = {},
            genericProperties;

        if (schemaFilter.operator) {
            jiveFilter.operator = jiveDataConverter.schemaFormatOperatorToFilterOperator(schemaFilter.operator, schemaFilter.value, schemaDataType);
            genericProperties = this.columnComponentModel.parent.config.genericProperties;

            if (schemaDataType === "datetime") {
                if (_.isArray(schemaFilter.value)) {
                    jiveFilter.value = [];
                    jiveFilter.value[0] = jiveDataConverter.isoTimestampTojQueryUiTimestamp(schemaFilter.value[0], genericProperties);
                    jiveFilter.value[1] = jiveDataConverter.isoTimestampTojQueryUiTimestamp(schemaFilter.value[1], genericProperties);
                } else {
                    jiveFilter.value = jiveDataConverter.isoTimestampTojQueryUiTimestamp(schemaFilter.value, genericProperties);
                }
            } else if (schemaDataType === "time") {
                if (_.isArray(schemaFilter.value)) {
                    jiveFilter.value = [];
                    jiveFilter.value[0] = jiveDataConverter.isoTimeTojQueryUiTime(schemaFilter.value[0], genericProperties);
                    jiveFilter.value[1] = jiveDataConverter.isoTimeTojQueryUiTime(schemaFilter.value[1], genericProperties);
                } else {
                    jiveFilter.value = jiveDataConverter.isoTimeTojQueryUiTime(schemaFilter.value, genericProperties);
                }
            } else {
                jiveFilter.value = schemaFilter.value;
            }
        }

        return jiveFilter;
    }

    return Dialog.extend({
        defaultTemplate: tableFilterTemplate,

        constructor: function(options) {
            this.tableFilterView = new TableFilterView({
                i18n: options.i18n
            });

            Dialog.prototype.constructor.call(this, {
                buttons: [
                    { label: i18n2["button.cancel"], action: "cancel", primary: false, float: "right" },
                    { label: i18n2["button.ok"], action: "ok", primary: true, float: "right" }
                ],
                additionalCssClasses: 'tableFilterDialog',
                modal: true,
                resizable: false,
                contentContainer: ".dialogContent",
                content: this.tableFilterView
            });

            this.on("button:ok", this._applyFilter);
            this.on("button:cancel", this.close);
        },

        open: function(columnComponentModel) {
            this.columnComponentModel = columnComponentModel;

            var reportComponentObject = this.columnComponentModel.toReportComponentObject();

            this.tableFilterView.viewModel.set({
                columnLabel: reportComponentObject.label ? reportComponentObject.label: "#" + (this.columnComponentModel.get("columnIndex") + 1),
                clearFilter: reportComponentObject.filter.operator ==  null ? "true" : "false",
                filterOptions: this.columnComponentModel.parent.config.genericProperties.operators[this.columnComponentModel.get("dataType").toLowerCase()],
                dataType: this.columnComponentModel.get("dataType").toLowerCase(),
                calendarPatterns: this.columnComponentModel.parent.config.genericProperties.calendarPatterns
            });

            this.tableFilterView.model.reset().set(schemaFilterToJiveFilter.call(this, reportComponentObject.filter, reportComponentObject.dataType));

            Dialog.prototype.open.call(this);
        },

        _applyFilter: function(evt) {
            var jiveFilter = this.tableFilterView.model.toJSON();
            if (jiveFilter.operator) {
                var componentObj = this.columnComponentModel.toReportComponentObject(),
                    valueStart = _.isArray(jiveFilter.value) ? jiveFilter.value[0] : jiveFilter.value,
                    valueEnd = _.isArray(jiveFilter.value) ? jiveFilter.value[1] : undefined;

                componentObj.filter = jiveDataConverter.operatorAndValueToSchemaFormat.call(
                    this.columnComponentModel,
                    jiveFilter.operator,
                    componentObj.dataType,
                    valueStart,
                    valueEnd,
                    componentObj.detailsRowFormat.pattern
                );

                this.columnComponentModel.updateFromReportComponentObject(componentObj);
            } else {
                this.columnComponentModel.set({filterValue: null, filterOperator: null}, {silent: true});
            }

            var filterAction = this.columnComponentModel.actions["change:filter"].call(this.columnComponentModel);

            this.columnComponentModel.filter(filterAction.filterData);

            this.close();
        },

        remove: function () {
            Dialog.prototype.remove.call(this);

            this.tableFilterView && this.tableFilterView.remove();
        }
    });
});