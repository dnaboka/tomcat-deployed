/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        RepositoryResourceModel = require("bi/repository/model/RepositoryResourceModel"),
        RepositoryJsonFileModel = require("./RepositoryJsonFileModel"),
        RepositoryComponentsFileModel = require("./RepositoryComponentsFileModel"),
        RepositoryHtmlFileModel = require("./RepositoryHtmlFileModel"),
        dashboardResourceReferenceTypes = require("../enum/dashboardResourceReferenceTypes"),
        dashboardResourceTypes = require("../enum/dashboardResourceTypes"),
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes"),
        dashboardSettings = require("../dashboardSettings");

    function createResource(resourceJson) {
        if (dashboardResourceReferenceTypes.FILE in resourceJson) {
            this.resourceReferenceType = dashboardResourceReferenceTypes.FILE;

            if (this.get("type") === dashboardResourceTypes.COMPONENTS) {
                this.resource = new RepositoryComponentsFileModel(resourceJson[this.resourceReferenceType], { contextPath: dashboardSettings.CONTEXT_PATH })
            } else if (this.get("type") === dashboardResourceTypes.LAYOUT) {
                this.resource = new RepositoryHtmlFileModel(resourceJson[this.resourceReferenceType], { contextPath: dashboardSettings.CONTEXT_PATH });
            } else {
                this.resource = new RepositoryJsonFileModel(resourceJson[this.resourceReferenceType], { contextPath: dashboardSettings.CONTEXT_PATH });
            }

        } else if (dashboardResourceReferenceTypes.ADHOC_VIEW in resourceJson) {
            this.resourceReferenceType = dashboardResourceReferenceTypes.ADHOC_VIEW;

            this.resource = new RepositoryResourceModel(resourceJson[this.resourceReferenceType], {
                contextPath: dashboardSettings.CONTEXT_PATH,
                type: repositoryResourceTypes.ADHOC_DATA_VIEW
            });
        } else if (dashboardResourceReferenceTypes.REPORT in resourceJson) {
            this.resourceReferenceType = dashboardResourceReferenceTypes.REPORT;

            this.resource = new RepositoryResourceModel(resourceJson[this.resourceReferenceType], {
                contextPath: dashboardSettings.CONTEXT_PATH,
                type: repositoryResourceTypes.REPORT_UNIT
            });
        } else if (dashboardResourceReferenceTypes.INPUT_CONTROL in resourceJson) {
            this.resourceReferenceType = dashboardResourceReferenceTypes.INPUT_CONTROL;

            this.resource = new RepositoryResourceModel(resourceJson[this.resourceReferenceType], {
                contextPath: dashboardSettings.CONTEXT_PATH,
                type: repositoryResourceTypes.INPUT_CONTROL
            });
        } else if (dashboardResourceReferenceTypes.RESOURCE_REFERENCE in resourceJson) {
            this.resourceReferenceType = dashboardResourceReferenceTypes.RESOURCE_REFERENCE;

            this.resource = new RepositoryResourceModel(resourceJson[this.resourceReferenceType], {
                contextPath: dashboardSettings.CONTEXT_PATH,
                type: repositoryResourceTypes.RESOURCE_LOOKUP
            });
        }
    }

    var DashboardResourceModel = Backbone.Model.extend({
        idAttribute: "name",

        defaults: {
            name: undefined,
            type: undefined,
            resource: undefined
        },

        initialize: function() {
            this.updateResource();

            this.on("change:resource", this.updateResource);
        },

        updateResource: function() {
            var resourceJson = this.get("resource");

            if (resourceJson && _.isObject(resourceJson)) {
                if (!this.resource) {
                    createResource.call(this, resourceJson);
                } else {
                    if (this.resourceReferenceType in resourceJson) {
                        this.resource.set(resourceJson[this.resourceReferenceType]);
                    } else {
                        createResource.call(this, resourceJson);
                    }
                }
            }
        },

        toJSON: function(useFullResource) {
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

            json.resource = {};

            // TODO: need additional marker to differentiate embedded and external resources
            if (this.resourceReferenceType !== dashboardResourceReferenceTypes.FILE) {
                if (this.resource.isNew() || useFullResource === true) {
                    json.resource[this.resourceReferenceType] = this.resource.toJSON();
                } else {
                    json.resource[dashboardResourceReferenceTypes.RESOURCE_REFERENCE] = { "uri": this.resource.get("uri") };
                }
            } else {
                json.resource[dashboardResourceReferenceTypes.FILE] = this.resource.toJSON();
                delete json.resource[dashboardResourceReferenceTypes.FILE].version;
                delete json.resource[dashboardResourceReferenceTypes.FILE].uri;
                delete json.resource[dashboardResourceReferenceTypes.FILE].permissionMask;
                delete json.resource[dashboardResourceReferenceTypes.FILE].creationDate;
                delete json.resource[dashboardResourceReferenceTypes.FILE].updateDate;
            }

            return json;
        }
    });

    DashboardResourceModel.createDashboardResource = function(componentObj, contextPath) {
        var resourceObj = {};

        if (componentObj.resourceType === repositoryResourceTypes.ADHOC_DATA_VIEW) {
            resourceObj[dashboardResourceReferenceTypes.ADHOC_VIEW] = componentObj;
        } else if (componentObj.resourceType === repositoryResourceTypes.REPORT_UNIT) {
            resourceObj[dashboardResourceReferenceTypes.REPORT] = componentObj;
        } else if (componentObj.resourceType === repositoryResourceTypes.INPUT_CONTROL) {
            resourceObj[dashboardResourceReferenceTypes.INPUT_CONTROL] = componentObj;
        }

        return new this({
            resource: resourceObj,
            type: componentObj.resourceType,
            name: componentObj.uri
        }, { contextPath: contextPath });
    };


    return DashboardResourceModel;
});