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
 * @author: psavushchik
 * @version: $Id$
 */

define(function (require) {


    var BiComponentError = require("common/bi/error/BiComponentError"),
        _ = require("underscore"),
        errorCodes = require("common/bi/error/enum/biComponentErrorCodes"),
        messages = require("common/bi/error/enum/biComponentErrorMessages");

    return BiComponentError.extend({
        constructor: function (errorObj) {
            if (_.isString(errorObj)){
                errorObj = {
                    parameters: [errorObj]
                }
            }

            var code = errorCodes["AD_HOC_VIEW_RENDER_ERROR"],
                msg = messages[code];

            if (errorObj.type === "highchartsInternalError") {
                code = errorCodes["REPORT_RENDER_HIGHCHARTS_ERROR"];
                msg = errorObj.data.error + " " + errorObj.data.message;
            }

            BiComponentError.prototype.constructor.call(this, code, msg, errorObj.parameters || []);
        }
    });
});