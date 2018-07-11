/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Zakhar Tomchenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        request = require("request"),
        AdHocDataSetModel = require("./AdHocDataSetModel"),
        AdHocSchemaModel = require("./AdHocSchemaModel"),
        ResourceModel = require("bi/repository/model/RepositoryResourceModel"),
        biComponentErrorFactory = require("common/bi/error/biComponentErrorFactory"),
        AdHocBundlesCollection = require("./bundles/AdHocBundlesCollection"),
        componentsFactory = require("./factory/componentsFactory"),
        classUtil = require("common/util/classUtil");

    /**
     * @class AdHocModel
     */
    var AdHocModel = ResourceModel.extend({
        initialize: function(attributes, options){
            this.contextPath = options && options.server;

            this.schema =  new AdHocSchemaModel({}, {contextPath: this.contextPath});
            this.bundles = new AdHocBundlesCollection([], {contextPath: this.contextPath});

            this.dataSet = new AdHocDataSetModel({
                dataSourceUri: attributes.uri
            }, _.extend({adHocModel: this}, options));

            this.componentsFactory = componentsFactory(this);

            this.listenTo(this.dataSet.query, "query:componentsDataChange", function(query){
                this.component.parseQuery(query);
            }, this);

            this.on("change:uri", function(){
                this._metadata = false;
            }, this);
        },

        parse: function (response) {
            if (response.schema){
                this.schema.set(response.schema);
                response.schema = undefined;
            }

            if (response.component){
                this.component = this.componentsFactory.create(response.component, {adHocModel: this});
                response.component = undefined;
            }

            if (response.query){
                this.dataSet.query.acquire(response.query);
                response.query = undefined;
            }

            if (response.bundles){
                this.bundles.set(response.bundles);
                response.bundles = undefined;
            }

            return response;
        },

        metadata: function(){
            if (!this._metadata) {
                this._metadata = new $.Deferred();
                this.fetch().done(_.bind(onMetadataFetched, this)).fail(_.bind(onMetadataError, this));
            }

            return this._metadata;
        },

        toJSON: function() {
            var json = ResourceModel.prototype.toJSON.call(this);

            json.query = this.dataSet.query.toJSON();
            json.component = this.component.toJSON();
            json.schema = this.schema.toJSON();
            json.bundles = this.bundles.toJSON();

            return json;
        }
    });

    return AdHocModel;

    function onMetadataFetched(data, result, xhr) {
        var error,
            contentType = xhr.getResponseHeader("Content-Type");

        if (!contentType || contentType.indexOf("application/repository.adhocDataView") !== 0){
            error = {
                message: "Resource " + data.uri + " is not an Ad Hoc View.",
                errorCode: "resource.not.adhoc",
                parameters: [data.uri]
            }
        } else if (contentType.indexOf("application/repository.adhocDataView") === 0 && !Object.prototype.hasOwnProperty.call(data, "query")){
            // Data.query has been set to undefined during parse, but it still exist as a property. For OLAP based views it is not present at all.
            error = {
                message: "OLAP based Ad Hoc view is not supported",
                errorCode: "resource.is.olap.adhoc",
                parameters: [data.uri]
            }
        }

        if (error) {
            this._metadata.reject(error);
        } else {
            // start load locale bundle if any
            if (this.bundles.length) {
                this.bundles.bundle();
            }
            this._metadata.resolve();
        }
    }

    function onMetadataError(xhr){
        var err = biComponentErrorFactory.requestError(xhr);

        this._metadata.reject(err);
    }
});