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

/*
 * Mapping server-side IC types to javascript UI types
 */

define(function (require) {

    "use strict";

    return {
        "bool" : require("../view/control/BooleanControlView"),
        "singleValueText" : require("../view/control/SingleValueTextControlView"),
        "singleValueNumber" : require("../view/control/SingleValueNumberControlView"),

        "singleValueDate" : require("../view/control/SingleValueDateControlView"),
        "singleValueDatetime" : require("../view/control/SingleValueDatetimeControlView"),
        "singleValueTime" : require("../view/control/SingleValueTimeControlView"),

        "singleSelect" : require("../view/control/SingleSelectControlView"),
        "singleSelectRadio" : require("../view/control/SingleSelectRadioControlView"),

        "multiSelect" : require("../view/control/MultiSelectControlView"),
        "multiSelectCheckbox" : require("../view/control/MultiSelectCheckboxControlView")
    }
});

