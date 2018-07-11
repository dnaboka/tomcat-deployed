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
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        jiveDataConverter = require("../util/jiveDataConverter");

    return Backbone.Model.extend({
        defaults: function() {
            return {
                "operator": null,
                "value": null,
                "backgroundColor": null,
                "font": {
                    "bold": null,
                    "italic": null,
                    "underline": null,
                    "color": null
                }
            }
        },

        parse: function(jiveObj) {
            var valueAndOperator = jiveDataConverter.operatorAndValueToSchemaFormat.call(this.collection.parent,
                jiveObj.conditionTypeOperator, this.collection.dataType, jiveObj.conditionStart, jiveObj.conditionEnd,
                this.collection.conditionPattern);

            return {
                operator: valueAndOperator.operator,
                value: valueAndOperator.value,
                backgroundColor: jiveObj.conditionMode === "Transparent"
                    ? "transparent"
                    : jiveObj.conditionFontBackColor,
                font: {
                    "italic": jiveObj.conditionFontItalic,
                    "bold": jiveObj.conditionFontBold,
                    "underline": jiveObj.conditionFontUnderline,
                    "color": jiveObj.conditionFontColor
                }
            };
        },

        toJiveFormat: function(genericProperties) {
            var conditionPattern = this.collection.conditionPattern;
            var dataType = this.collection.dataType;
            var operator = this.get("operator");
            var value = this.get("value");
            var conditionStart = jiveDataConverter.filterStartValue(operator, value, dataType, genericProperties, conditionPattern);
            var conditionEnd = jiveDataConverter.filterEndValue(operator, value, dataType, genericProperties, conditionPattern);
            var conditionTypeOperator = jiveDataConverter.schemaFormatOperatorToFilterOperator(operator, value, dataType);
            var backgroundColor = this.get("backgroundColor");
            var isTransparent = backgroundColor === "transparent";
            var conditionMode = isTransparent ? "Transparent" : (backgroundColor === null ? null : "Opaque");
            var conditionFontBackColor = isTransparent ? null : backgroundColor;
            var font = this.get("font");

            return {
                "conditionStart": conditionStart,
                "conditionEnd": conditionEnd,
                "conditionTypeOperator": conditionTypeOperator,
                "conditionFontBold": font.bold,
                "conditionFontItalic": font.italic,
                "conditionFontUnderline": font.underline,
                "conditionFontColor": font.color,
                "conditionFontBackColor": conditionFontBackColor,
                "conditionMode": conditionMode
            }
        }
    });
});
