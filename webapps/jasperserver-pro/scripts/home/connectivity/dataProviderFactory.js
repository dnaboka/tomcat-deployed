/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function(require){
    "use strict";

    var _ = require("underscore"),
        config = require("home/connectivity/providers"),
        relations = require("home/connectivity/relations"),
        DefaultHalCollectionDataProvider = require("home/connectivity/provider/DefaultHalCollectionDataProvider"),
        ProviderTypes = {},
        context = {};

    ProviderTypes[relations.root] = require("home/connectivity/provider/BaseDataProvider");
    ProviderTypes[relations.resources] = DefaultHalCollectionDataProvider;
    ProviderTypes[relations.workflows] = DefaultHalCollectionDataProvider;
    ProviderTypes[relations.contentReferences] = DefaultHalCollectionDataProvider;

    return function (options) {

        var id = options, url, rel, extraRequestOptions;
        if (_.isObject(options)) {
            id = options.id;
            url = options.url;
            rel = options.rel;
			extraRequestOptions = config[id].extraRequestOptions;
            //create provider without putting it to cache
            if (url && id && rel){
                var provider = new ProviderTypes[id](id, url, extraRequestOptions);
                provider.rel = rel;
                return   provider;
            }
        }

        var dataProvider = context[id];
        if (!dataProvider) {
            if (ProviderTypes[id]) {
                var dataProviderType = ProviderTypes[id];
                var params = config[id];
                dataProvider = new dataProviderType(params.id, params.uri, params.extraRequestOptions);
                dataProvider.rel = params.rel;
                context[id] = dataProvider;
            } else {
                throw new Error("There is no DataProvider that corresponds to '" + id + "' ID.");
            }
        }

        return dataProvider;
    };
});