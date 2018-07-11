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
 * @version $Id: jive.all.deps.js 3544 2015-11-05 22:05:36Z psavushc $
 */

/**
 * Just a stub for r.js to have ability
 * to get all highcharts dependencies included at build time
 * */

define(function (require) {
   require("./model/ChartComponentModel");
   require("./view/ChartJiveComponentView");

   // services
   require("./services/dataSettingService");
   require("./services/defaultSettingService");
   require("./services/dualPieSettingService");
   require("./services/treemapSettingService");
   require("./services/itemHyperlinkSettingService");
   require("./services/yAxisSettingService");

   return {};
});
