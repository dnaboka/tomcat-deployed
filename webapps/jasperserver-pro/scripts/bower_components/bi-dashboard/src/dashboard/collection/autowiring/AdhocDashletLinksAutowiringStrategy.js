/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: RunReportAutowiringStrategy.js 4 2014-08-15 14:51:00Z ktsaregradskyi $
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        BaseAutowiringStrategy = require("./BaseAutowiringStrategy"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes");

    return BaseAutowiringStrategy.extend({
        autowire: function(collection, component, metadata){
            if (component.parametersFromProperties){
                var parametrizeProperty = _.filter(component.get("parameters"), function (parameter) {
                        return _.indexOf(component.parametersFromProperties, parameter.id) > -1;
                    }),
                    urlParam = _.filter(component.get("outputParameters"), function (parameter) {
                        return _.findWhere(parametrizeProperty, {id: parameter.id});
                    });

                collection.each(function(connection){
                   if (connection.get("component") === component.id){
                       var param = _.findWhere(urlParam, {id: connection.get("name")});
                       if (param){
                           connection.consumers.add({consumer: component.id + ":" + param.id});
                       }
                   }
                });
            }
        }
    });
});
