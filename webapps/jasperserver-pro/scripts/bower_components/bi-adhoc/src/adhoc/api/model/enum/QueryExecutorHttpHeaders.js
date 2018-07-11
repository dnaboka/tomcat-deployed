/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

/**
 * @class QueryExecutorHttpHeaders
 *
 * @readonly
 * @enum {string}
 */
define(function(){
    var QueryExecutionHttpHeaders = {};

    QueryExecutionHttpHeaders.ACCEPT_FLAT_DATA = "application/flatData+json";
    QueryExecutionHttpHeaders.ACCEPT_MULTI_LEVEL_DATA = "application/multiLevelData+json";
    QueryExecutionHttpHeaders.ACCEPT_MULTI_AXES_DATA = "application/multiAxesData+json";
    QueryExecutionHttpHeaders.ACCEPT_ALL_DATA = [QueryExecutionHttpHeaders.ACCEPT_FLAT_DATA, QueryExecutionHttpHeaders.ACCEPT_MULTI_LEVEL_DATA, QueryExecutionHttpHeaders.ACCEPT_MULTI_AXES_DATA].join(", ");
    QueryExecutionHttpHeaders.ACCEPT_NO_FLAT = [QueryExecutionHttpHeaders.ACCEPT_MULTI_LEVEL_DATA, QueryExecutionHttpHeaders.ACCEPT_MULTI_AXES_DATA].join(", ");


    QueryExecutionHttpHeaders.CONTENT_TYPE_PROVIDED_QUERY = "application/execution.providedQuery+json";
    QueryExecutionHttpHeaders.CONTENT_TYPE_MULTI_LEVEL_QUERY = "application/execution.multiLevelQuery+json";
    QueryExecutionHttpHeaders.CONTENT_TYPE_MULTI_AXES_QUERY = "application/execution.multiAxesQuery+json";

    return QueryExecutionHttpHeaders;
});
