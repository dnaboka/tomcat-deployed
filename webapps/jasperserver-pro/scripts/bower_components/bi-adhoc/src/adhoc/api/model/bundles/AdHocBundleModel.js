/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: DashboardResourceModel.js 1983 2016-04-26 12:04:37Z inestere $
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        RepositoryBundleFileModel = require("./RepositoryBundleFileModel"),
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes");

    function createResource(resourceJson) {
        if (repositoryResourceTypes.FILE in resourceJson) {
            this.resource = new RepositoryBundleFileModel(resourceJson[repositoryResourceTypes.FILE], {contextPath: this.collection.CONTEXT_PATH});
        } else if (resourceJson.fileReference) {
            this.resource = new RepositoryBundleFileModel(resourceJson.fileReference, {contextPath: this.collection.CONTEXT_PATH});
        } else {
            throw new Error("Unknown value", resourceJson);
        }
    }

    var AdhocBundleModel = Backbone.Model.extend({

        idAttribute: "locale",

        defaults: {
            locale: undefined,
            file: undefined
        },

        initialize: function() {
            this.updateResource();

            this.on("change:file", this.updateResource);
            this.on("change:fileReference", this.updateResource);
        },

        updateResource: function() {
            var resourceJson = this.get("file") || this.get("fileReference");

            if (resourceJson && _.isObject(resourceJson)) {
                if (!this.resource) {
                    createResource.call(this, resourceJson);
                } else {
                    this.resource.set(resourceJson);
                }
            }
        },

        toJSON: function (useFullResource) {
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

            json.file = {};

            if (this.resource.isNew() || useFullResource === true) {
                json.file.file = this.resource.toJSON(true);
            } else {
                json.file.fileReference = {"uri": this.resource.get("uri")};
            }

            return json;
        },

        toLabel: function(key){
            return this.resource.contentJSON[key];
        }
    });

    return AdhocBundleModel;
});