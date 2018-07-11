/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function() {
    "use strict";

    /**
     * DataProvider
     * @param {String} id - ID of DataProvider
     * @constructor
     */
    var DataProvider = function (id, url, extraRequestOptions){
        this.id = id;
        this.url = url;
		this.extraRequestOptions = extraRequestOptions;
    };
    /**
     * Get entity
     * @param {Object} options - key-value pairs of request parameters (params - query and uri params)
     * @returns {Promise} Promises/A - object
     * @public
     */
    DataProvider.prototype.fetch = function(options){
        throw new Error("Method not implemented");
    };
    /**
     * Create new entity
     * @param {Object} options - key-value pairs of request parameters (params - query and uri params, dto - data transfer object to create)
     * @returns {Promise} Promises/A - object
     * @public
     */
    DataProvider.prototype.save = function(options){
        throw new Error("Method not implemented");
    };
    /**
     * Update existing entity or create new if it doesn't exist yet
     * @param {Object} options - key-value pairs of request parameters (params - query and uri params, dto - data transfer object to update/create)
     * @returns {Promise} Promises/A - object
     * @public
     */
    DataProvider.prototype.update = function(options){
        throw new Error("Method not implemented");
    };
    /**
     * Delete entity
     * @param {Object} options - key-value pairs of request parameters (params)
     * @returns {Promise} Promises/A - object
     * @public
     */
    DataProvider.prototype.remove = function(options){
        throw new Error("Method not implemented");
    };

    return DataProvider;
});
