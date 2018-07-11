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
 * @version $Id: defaultSettingService.js 3204 2015-05-06 21:27:08Z yplakosh $
 */

define(["jquery", "highcharts"], function($, Highcharts) {
    /* jshint evil: true */

    var JRDefaultHighchartsSettingService = {

        perform: function(highchartsOptions, optionsArr) {
            var it = this;
            $.each(optionsArr, function(i, option) {
                if (option) {
                    it.setProperty(highchartsOptions, option.prop, option.val, option.isFunction);
                }
            });
        },

        setProperty: function(options, propertyPath, propertyValue, isFunction) {
            var tokens = propertyPath.split('.');
            var obj = options;
            var idx;
            var tokenToProp = function(token) {
            	var match = /^([a-zA-Z0-9$_]+)(?:\[(\d+)\])$/.exec(token);
            	return match ? {name: match[1], position: parseInt(match[2])}
            			: {name: token, position: -1};
            };
            var setProp = function(o, prop, valueProvider) {
            	var oValue = o[prop.name],
	                // for existing arrays we are setting the property on the first item when no position was specified
            		position = Math.max(prop.position, 0),
            		valArray,
            		setValue;
            	if ($.isArray(oValue)) {
            		setValue = oValue[position] = valueProvider(oValue[position]);
            	} else if (prop.position < 0) {
            		setValue = o[prop.name] = valueProvider(oValue);
            	} else {
            		valArray = o[prop.name] = new Array(prop.position + 1);
            		if (typeof(oValue) != 'undefined' && oValue != null) {
            			//adding existing object as first array element
            			valArray[0] = oValue;
            		}
            		setValue = valArray[position] = valueProvider(valArray[position]);
            	}
            	return setValue;
            };
            
            for (idx = 0; idx < tokens.length - 1; ++idx) {
            	obj = setProp(obj, tokenToProp(tokens[idx]), function(val) {
            		return (typeof(val) == 'undefined' || val == null) ? {} : val;
            	});
            }

            setProp(obj, tokenToProp(tokens[idx]), function() {
            	return isFunction ? eval("[" + propertyValue + "][0]") : propertyValue;
            });
        }
    }

    return JRDefaultHighchartsSettingService;
});
