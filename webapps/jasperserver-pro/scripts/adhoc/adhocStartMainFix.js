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
 * @version: $Id: adhoc.start.main.js 21 2014-07-25 09:57:36Z inesterenko $
 */

/* global alreadyEditing */

define(function (require) {
    "use strict";

    var $ = require("jquery"),
        FixFieldsDialog = require("./fixfields/view/FixFieldsDialogView");

    function initFixFieldsDialog() {
        var fixFieldsDialog = new FixFieldsDialog();
        fixFieldsDialog.open();

    }

    require(["!domReady"], function(){
            initFixFieldsDialog();
/*
        if (window.isEmbeddedDesigner){
            datachooserDialog.listenTo(fixFieldsDialog, "close", function(){
                if (typeof alreadyEditing !== "undefined" && document.referrer.indexOf("login.html") === -1) {
                    window.history.back();
                } else {
                    document.location = 'flow.html?_flowId=homeFlow';
                }
            });
        }

        fixFieldsDialog.open();
*/
    });
});
