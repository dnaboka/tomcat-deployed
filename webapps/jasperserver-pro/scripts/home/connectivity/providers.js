/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

/**
 * Mapping of uri templates to data providers,
 * data provider factory use key to generate
 * path to data provider,
 * if key 'Resource' than path would be '/home/connectivity/provider/Resources',
 * if specific data provider doesn't exist then '/home/connectivity/provider/DefaultDataProvider'
 * will be used
 *
 */
define({

    "root" : {
        id: "root",
        uri: "rest_v2/hypermedia/root"
    },

    "resources" : {
        id: "resources",
        uri: "rest_v2/hypermedia/resources",
		extraRequestOptions: {
			cache: false
		}
    },

    "workflows" : {
        id :"workflows",
        uri :"rest_v2/hypermedia/workflows",
        rel : "workflow"
    },

    "contentReferences" : {
        id: "contentReferences",
        uri: "rest_v2/hypermedia/contentReferences"
    }

});
