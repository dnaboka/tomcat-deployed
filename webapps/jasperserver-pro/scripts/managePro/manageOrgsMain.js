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
 * @version: $Id: admin.orgs.main.js 24 2014-07-28 16:52:56Z inesterenko $
 */

define(function(require){
    "use strict";


    require("org.mng.components");
    require("utils.common");

    var domReady = require("!domReady"),
        _ = require("underscore"),
        orgModule = require("org.mng.actions"),
        jrsConfigs = require("jrs.configs"),
        i18n = require("bundle!AttributesBundle"),
        i18n2 = require("bundle!CommonBundle"),
        TenantsTreeView = require("tenantImportExport/view/TenantsTreeView"),
        attributesTypesEnum = require("attributes/enum/attributesTypesEnum"),
        ConfirmationDialog = require("common/component/dialog/ConfirmationDialog"),
        attributesViewOptionsFactory = require("attributes/factory/attributesViewOptionsFactory"),
        scrollEventTrait = require("attributes/trait/attributesViewScrollEventTrait"),
        AttributesViewFacade = require("attributes/AttributesViewFacade");

    require("css!manageTenants.css");

    domReady(function() {

        if (typeof orgModule.messages === "undefined") {
            orgModule.messages = {};
        }

        if (typeof orgModule.Configuration === "undefined") {
            orgModule.Configuration = {};
        }

        _.extend(window.localContext, jrsConfigs.orgManagement.localContext);
        _.extend(orgModule.messages, jrsConfigs.orgManagement.orgModule.messages);
        _.extend(orgModule.Configuration, jrsConfigs.orgManagement.orgModule.Configuration);

        orgModule.orgManager.initialize({
            _: _,
            i18n: i18n,
            i18n2: i18n2,
            attributesViewOptionsFactory: attributesViewOptionsFactory,
            AttributesViewFacade: AttributesViewFacade,
            scrollEventTrait: scrollEventTrait,
            attributesTypesEnum: attributesTypesEnum,
            ConfirmationDialog: ConfirmationDialog,
            TenantsTreeView: TenantsTreeView
        });
    });
});