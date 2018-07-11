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
 * @version $Id$
 */

/**
 * Just a stub for r.js to have ability
 * to get all jive dependencies included at build time
 * */

 define(function (require) {

    require("jquery");

    require("async");

	require("../model/TableComponentModel");
	require("../model/ColumnComponentModel");
    require("../model/GooglemapComponentModel");
    require("../model/TibcomapComponentModel");
	require("../model/FusionComponentModel");
	require("../model/CrosstabComponentModel");
	require("../model/WebfontsComponentModel");
	require("../model/HyperlinksComponentModel");
	require("../model/BookmarksComponentModel");
	require("../model/ReportPartsComponentModel");
	require("../model/CustomComponentModel");

    require("../view/CrosstabJiveComponentView");
    require("../view/CustomJiveComponentView");
    require("../view/FusionComponentView");
    require("../view/GooglemapComponentView");
    require("../view/TibcomapComponentView");
    require("../view/TableJiveComponentView");

	return {};
});
