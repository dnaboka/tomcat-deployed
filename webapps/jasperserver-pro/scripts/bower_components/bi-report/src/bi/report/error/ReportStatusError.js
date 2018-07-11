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


    var BiComponentError = require("common/bi/error/BiComponentError"),
        _ = require("underscore"),
        reportStatuses = require("../enum/reportStatuses"),
        errorCodes = require("common/bi/error/enum/biComponentErrorCodes"),
        messages = require("common/bi/error/enum/biComponentErrorMessages");

    return BiComponentError.extend({
        constructor: function (errorObj) {
            var code, msg, parameters;
            _.extend(this, errorObj);

            if (errorObj.source === "execution") {
                code = errorCodes[errorObj.status === reportStatuses.CANCELLED ? "REPORT_EXECUTION_CANCELLED" : "REPORT_EXECUTION_FAILED"];
            } else {
                code = errorCodes[errorObj.status === reportStatuses.CANCELLED ? "REPORT_EXPORT_CANCELLED" : "REPORT_EXPORT_FAILED"];
            }

            msg = (errorObj.errorDescriptor && errorObj.errorDescriptor.message) || messages[code];
            if (errorObj.errorDescriptor
                && errorObj.errorDescriptor.errorCode === "webservices.error.errorExportingReportUnit"
                && errorObj.errorDescriptor.parameters && errorObj.errorDescriptor.parameters.length) {
                    msg += (" : " + errorObj.errorDescriptor.parameters[0]);
            }

            if (errorObj.errorDescriptor && errorObj.errorDescriptor.parameters) {
                parameters = errorObj.errorDescriptor.parameters;
            }

            BiComponentError.prototype.constructor.call(this, code, msg, parameters);

        }
    });
});