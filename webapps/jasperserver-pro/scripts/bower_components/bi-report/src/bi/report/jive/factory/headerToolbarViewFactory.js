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
 * @author Taras Bidyuk
 */

define(function(require){

    var _ = require("underscore"),
        i18n = require("bundle!jasperreports_messages"),
        jiveTypes = require("bi/report/jive/enum/jiveTypes"),
        sortOrder = require("bi/report/jive/enum/sortOrder"),
        jiveActions = require("bi/report/jive/enum/jiveActions"),
        HeaderToolbarView = require("bi/report/jive/view/overlay/HeaderToolbarView");

    var typeToToolbarOptionsMap = {};

    var noop = function(){};

    function generateOptions(type, options){

        typeToToolbarOptionsMap[jiveTypes.CROSSTAB] = {
            buttons: [{
                icon: "sortAscIcon",
                title: i18n["net.sf.jasperreports.components.headertoolbar.label.sortasc"],
                message: jiveActions.SORT,
                order: sortOrder.ASC,
                action: "select"
            }, {
                icon: "sortDescIcon",
                title: i18n["net.sf.jasperreports.components.headertoolbar.label.sortdesc"],
                message: jiveActions.SORT,
                order: sortOrder.DESC,
                action: "select"
            }]
        };

        typeToToolbarOptionsMap[jiveTypes.TABLE] = {
            buttons: [{
                title: i18n["net.sf.jasperreports.components.headertoolbar.condition.format"],
                icon: "formatIcon",
                hoverMenuOptions: [{
                    message: jiveActions.FORMAT,
                    label: i18n["net.sf.jasperreports.components.headertoolbar.label.formatting"],
                    action: "select"
                }, {
                    message: jiveActions.HIDE_COLUMN,
                    label: i18n["net.sf.jasperreports.components.headertoolbar.label.hidecolumn"],
                    action: "select"
                }, {
                    message: jiveActions.SHOW_COLUMN,
                    label: i18n["net.sf.jasperreports.components.headertoolbar.label.showcolumns"],
                    test: options.testFn || noop,
                    children: options.children || []
                }]
            }, {
                title: i18n["net.sf.jasperreports.components.headertoolbar.label.columnfilters"],
                icon: "filterIcon",
                message: jiveActions.FILTER,
                action: "filter"
            }, {
                title: i18n["net.sf.jasperreports.components.headertoolbar.label.sortasc"],
                icon: "sortAscIcon",
                message: jiveActions.SORT,
                order: "Asc",
                action: "sortAsc"
            }, {
                title: i18n["net.sf.jasperreports.components.headertoolbar.label.sortdesc"],
                icon: "sortDescIcon",
                message: jiveActions.SORT,
                order: "Desc",
                action: "sortDesc"
            }]
        };

        return typeToToolbarOptionsMap[type];
    }

    return function(type, options){
        options = _.extend({}, generateOptions(type, options), options);
        return new HeaderToolbarView(options);
    };
});