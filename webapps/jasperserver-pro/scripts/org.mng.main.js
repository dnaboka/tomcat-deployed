/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global orgModule, _, layoutModule, webHelpModule, localContext, invokeClientAction,
 invokeServerAction */

function invokeOrgAction(actionName, options) {
    var action = orgModule.orgActionFactory[actionName](options);
    action.invokeAction();
}

function invokeOrgManagerAction(actionName, options) {
    var action = orgModule.orgManager.actionFactory[actionName](options);
    action.invokeAction();
}

function canAddOrg() {
    return !_.isUndefined(orgModule.manager.tenantsTree.getTenant());
}

function canDeleteAll() {
    return orgModule.entityList.getSelectedEntities().length > 0;
}

function canDeleteUser() {
    return orgModule.entityList.getSelectedEntities().length > 0;
}

orgModule.orgManager = {
    NAME_REG_EXP: null,
    ID_REG_EXP: null,
    ID_REG_EXP_FOR_REPLACEMENT: null,
    ALIAS_REG_EXP: null,
    ALIAS_REG_EXP_FOR_REPLACEMENT: null,

    Event: {},

    Action: {
        ALIAS_EXIST: "aliasExist"
    },

    initialize: function(opt) {
        layoutModule.resizeOnClient('folders', 'organizations', 'properties');
        webHelpModule.setCurrentContext("admin");

        var options = _.extend(opt, localContext.orgMngInitOptions);

        this.NAME_REG_EXP = new RegExp(orgModule.Configuration.tenantNameNotSupportedSymbols),    
        this.ID_REG_EXP = new RegExp(orgModule.Configuration.tenantIdNotSupportedSymbols),
        this.ID_REG_EXP_FOR_REPLACEMENT = new RegExp(orgModule.Configuration.tenantIdNotSupportedSymbols, "g"),
        this.ALIAS_REG_EXP = new RegExp(orgModule.Configuration.tenantIdNotSupportedSymbols),
        this.ALIAS_REG_EXP_FOR_REPLACEMENT = new RegExp(orgModule.Configuration.tenantIdNotSupportedSymbols, "g"),

        // Manager customization.
        orgModule.manager.initialize(options);
        orgModule.manager.entityJsonToObject = function(json) {
            return new orgModule.Organization(json);
        };

        this.orgList.initialize({
            toolbarModel: this.actionModel,
            text: orgModule.manager.state.text
        });

        // Dialogs customization.
        orgModule.addDialog.show = function(org) {
            this.addDialog.show(org);
        }.bind(this);
        // Dialogs customization.
        orgModule.addDialog.hide = function(org) {
            this.addDialog.hide(org);
        }.bind(this);

        this.properties.initialize(opt);
        this.addDialog.initialize();

        orgModule.observe("entity:created", function(event) {
            var tenant = orgModule.orgManager.addDialog.organization,
                entityJson = JSON.parse(event.memo.inputData.entity),
                id = tenant.isRoot() ? "organizations" : tenant.id;

            entityJson.tenantFolderUri = tenant.isRoot() ? ("/" + id + "/" + entityJson.tenantName) : (tenant.uri + "/" + entityJson.tenantName);
            entityJson.parentId = entityJson.parentId || id;

            orgModule.manager.tenantsTree.addTenant(id, entityJson);
        }.bindAsEventListener(this));

        orgModule.observe("entity:updated", function(event) {
            var entityJson = JSON.parse(event.memo.inputData.entity);

            if (entityJson) {
                var tenantsTree = orgModule.manager.tenantsTree,
                    selectedEntities = orgModule.entityList.getSelectedEntities(),
                    selectedTenant = tenantsTree.getTenant(),
                    parentId = (_.isObject(selectedTenant.parentId) ? selectedTenant.parentId.parentId : selectedTenant.parentId),
                    tenantId = !selectedEntities.length
                        ? parentId
                        : entityJson.tenantId !== selectedTenant.id ? selectedTenant.id : parentId,
                    selectTenant = !selectedEntities.length || entityJson.tenantId === selectedTenant.id;

                orgModule.manager.tenantsTree.setTenant("name", entityJson.tenantName);
                orgModule.properties.setValuesProperty("name", entityJson.tenantName);

                entityJson.tenantName !== selectedTenant.name && orgModule.manager.tenantsTree.updateTenant(tenantId, entityJson, selectTenant);
            }
        }.bindAsEventListener(this));

        orgModule.observe("searchAssigned:loaded", function(event) {
            var data = event.memo.responseData;

            this.properties.setAssigned(data.usersCount, data.rolesCount);
        }.bindAsEventListener(this));

        orgModule.observe("entity:detailsLoaded", function(event) {
            invokeServerAction(orgModule.ActionMap.SEARCH_ASSIGNED, {text: ""});            
        }.bindAsEventListener(this));

        orgModule.observe("entity:deleted", function(event) {
            var tenantsTree = orgModule.manager.tenantsTree,
                inputData = event.memo.inputData,
                entityId = inputData.entity,
                isEntityEvent = inputData.entityEvent;

            var tenant = tenantsTree.getTenant(),
                parentTenantId = isEntityEvent ? tenant.id : tenant.parentId;

            tenantsTree.removeTenant(entityId, parentTenantId);
            !isEntityEvent && tenantsTree.selectTenant(parentTenantId);

            orgModule.fire(orgModule.Event.ENTITY_SELECT_AND_GET_DETAILS, {
                entityId: parentTenantId,
                entityEvent: false
            });

        }.bindAsEventListener(this));

        orgModule.observe("entities:deleted", function(event) {
            var tenantsTree = orgModule.manager.tenantsTree,
                tenantId = tenantsTree.getTenant().id,
                orgIds = JSON.parse(event.memo.inputData.entities);

            tenantsTree.removeTenant(orgIds, tenantId);

            orgModule.fire(orgModule.Event.ENTITY_SELECT_AND_GET_DETAILS, {
                entityId: tenantId,
                entityEvent: true
            });

        }.bindAsEventListener(this));

        orgModule.observe("server:unavailable", function(event) {
            var tenantsTree = orgModule.manager.tenantsTree,
                id = tenantsTree ? tenantsTree.getTenant().id : null,
                tenant = new orgModule.Organization({ tenantId: id });

            tenant.navigateToManager();
        }.bindAsEventListener(this));
    },

    actionModel: {
        ADD: {
            buttonId: "addNewOrgBtn",
            action: invokeClientAction,
            actionArgs: "create",
            test: canAddOrg
        },

        DELETE: {
            buttonId: "deleteAllOrgsBtn",
            action: invokeClientAction,
            actionArgs: "deleteAll",
            test: canDeleteAll
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (typeof require === "undefined"){
    // prevent conflict with domReady plugin in RequireJS environment
    document.observe('dom:loaded', orgModule.orgManager.initialize.bind(orgModule.orgManager));
}
