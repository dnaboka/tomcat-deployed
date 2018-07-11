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
 * @author Igor Nesterenko
 * @version $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        FormatModel = require("./FormatModel"),
        jiveDataConverter = require("../util/jiveDataConverter"),
        ConditionCollection = require("../collection/ConditionCollection");

    return Backbone.Model.extend({
        defaults: function() {
            return {
                id: null,
                groupType: "",
                groupName: "",
                dataType: "",
                forColumns: [],
                conditionalFormattingData: null,
                groupData: {}
            };
        },

        constructor: function() {
            this.format = new FormatModel();
            this.conditions = new ConditionCollection();

            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        parse: function(response) {
            if (response.groupData) {
                this.format.dataType = jiveDataConverter.dataTypeToSchemaFormat[response.dataType];
                this.format.set(this.format.parse(response.groupData), { silent: true });
            }

            if (response.conditionalFormattingData) {
                this.conditions.dataType = jiveDataConverter.dataTypeToSchemaFormat[response.dataType];
                this.conditions.conditionPattern = response.conditionalFormattingData.conditionPattern;
                this.conditions.reset(response.conditionalFormattingData.conditions, { silent: true, parse: true });
            }

            return response;
        },

        actions: {
            "change:format": function() {
                return {
                    "actionName":"editTextElement",
                    "editTextElementData": {
                        "applyTo": this.get("groupType"),
                        "tableUuid": this.parent.get("id"),
                        "columnIndex": this.get("forColumns")[0],
                        "groupName": this.get("groupName"),

                        "fontName": this.format.get("font").name,
                        "fontSize": this.format.get("font").size + "",
                        "fontBold": this.format.get("font").bold,
                        "fontItalic": this.format.get("font").italic,
                        "fontUnderline": this.format.get("font").underline,
                        "fontColor": this.format.get("font").color,

                        "formatPattern": this.format.toJiveFormat(),

                        "fontHAlign": (this.format.get("align").charAt(0).toUpperCase() + this.format.get("align").slice(1)),
                        "fontBackColor": this.format.get("backgroundColor") === "transparent" ? "000000" : this.format.get("backgroundColor"),
                        "mode": this.format.get("backgroundColor") === "transparent" ? "Transparent" : "Opaque"
                    }
                }
            },
            "change:conditions": function() {
                var genericProperties = this.parent && this.parent.config ? this.parent.config.genericProperties : undefined;

                return {
                    "actionName": "conditionalFormatting",
                    "conditionalFormattingData":{
                        "applyTo": this.get("groupType"),
                        "tableUuid": this.parent.get("id"),
                        "columnIndex": this.get("forColumns")[0],
                        "groupName": this.get("groupName"),

                        "conditionPattern": this.get("conditionalFormattingData").conditionPattern,
                        "conditionType": this.get("conditionalFormattingData").conditionType,
                        "conditions": this.conditions.map(function(conditionModel) {
                            return conditionModel.toJiveFormat(genericProperties);
                        })
                    }
                }
            }
        },

        updateFromReportComponentObject: function(obj) {
            var setterObj = {};

            if (obj.format) {
                obj.format.font = _.extend({}, this.format.get("font"), obj.format.font || {});

                if (_.isObject(this.format.get("pattern"))) {
                    if (!("Numeric" === this.get("dataType") && jiveDataConverter.DURATION_PATTERN === obj.format.pattern)) {
                        obj.format.pattern = _.extend({}, this.format.get("pattern"), obj.format.pattern || {});
                    }
                }

                if (obj.format.backgroundColor && obj.format.backgroundColor !== "transparent") {
                    obj.format.backgroundColor = obj.format.backgroundColor.toUpperCase();
                }

                if (obj.format.font && obj.format.font.color) {
                    obj.format.font.color = obj.format.font.color.toUpperCase();
                }

                this.format.set(obj.format);
            }

            if (obj.conditions) {
                this.conditions.reset(obj.conditions);
            }

            this.set(setterObj);
        }
    });
});

