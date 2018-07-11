/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: CascadeInputControlsAutowiringStrategy.js 11 2014-08-22 13:49:12Z ktsaregradskyi $
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        BaseAutowiringStrategy = require("./BaseAutowiringStrategy"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes");

    return BaseAutowiringStrategy.extend({
        autowire: function(collection, component, metadata){
            if (component.resource && component.resource.resource && component.resource.resource.type === dashboardComponentTypes.INPUT_CONTROL){

                wireWithAlreadyRegisteredConnections(this, collection, component, metadata);
                wireWithAlreadyRegisteredOwners(this, collection, component, metadata);
            }
        }
    });

    function wireWithAlreadyRegisteredConnections (self, collection, component, metadata) {
        var dependent = component.collection.filter(function(candidate){
                return candidate.getOwnerUri && candidate.getOwnerUri() == component.getOwnerUri() &&
                    _.contains(candidate.get("masterDependencies") || [], component.getOwnerParameterName());
            }),
            connection = collection.find(function(conn) {
                return conn.component.resource && conn.component.resource.id === component.resource.id;
            });

        _.each(dependent, function(dependentControl){
            connection.consumers.add({ consumer: dependentControl.id + ":" + component.getOwnerParameterName() });
        });
    }

    function wireWithAlreadyRegisteredOwners(self, collection, component, metadata) {
        _.each(_.keys(metadata.slots), function(key){
            var connection = collection.find(function(conn){
                return conn.get("name") == key && conn.component.get("ownerResourceId") == component.get("ownerResourceId");
            });

            connection && connection.consumers.add({consumer: component.id + ":" + key});
        });
    }

});
