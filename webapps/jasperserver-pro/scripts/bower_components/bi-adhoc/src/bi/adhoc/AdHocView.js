/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var  _ = require("underscore"),
         $ = require("jquery"),
        log = require("logger").register(module),
        
        BiComponent = require("common/bi/component/BiComponent"),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        biComponentErrorFactoryAdHocViewProxy = require("./error/biComponentErrorFactoryAdHocViewProxy"),

        AdHocViewFacade = require("adhoc/api/AdHocViewFacade"),
        AdHocPropertiesModel = require("adhoc/api/model/AdHocPropertiesModel"),

        request = require("request"),

        schema = JSON.parse(require("text!./schema/AdHocView.json")),

        componentSchema = {
            _dataset_internal_: JSON.parse(require("text!./schema/AdHocViewDatasetComponent.json"))
        },

        propertyNames = _.keys(schema.properties),
        fieldNames = ['properties'],
        readOnlyFieldNames = ['data'],

    AdHocView = function(properties) {
        var instanceData = {
                properties: _.extend({}, properties),
                data: {}
            },
            stateModel = new AdHocPropertiesModel(_.cloneDeep(properties)),
            objectContainer = {
                stateModel: stateModel
            };

        biComponentUtil.createInstancePropertiesAndFields(this, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);

        _.extend(this, {
            validate: biComponentUtil.createValidateAction(instanceData, schema, stateModel),
            run: biComponentUtil.createDeferredAction(run, stateModel, instanceData, objectContainer),
            refresh: biComponentUtil.createDeferredAction(refresh, stateModel, instanceData, objectContainer),
            destroy: biComponentUtil.createDeferredAction(destroy, stateModel, objectContainer),
            resize: biComponentUtil.createDeferredAction(resize, stateModel, objectContainer),
            /* This API was hidden in Moonstone 2 and will be restored later
            updateComponent: createUpdateComponentAction(objectContainer, stateModel, instanceData)*/
            _updateComponent_internal_: createUpdateComponentAction(objectContainer, stateModel, instanceData)
        });
    };

    AdHocView.prototype = new BiComponent();

    return AdHocView;

    function run(dfd, instanceData, objectContainer){
        var validationResult = this.validate();

        if (validationResult){
            dfd.reject(biComponentErrorFactoryAdHocViewProxy.validationError(validationResult));
        } else {
            if (instanceData.properties.container && $(instanceData.properties.container).length === 0) {
                var err = biComponentErrorFactoryAdHocViewProxy.containerNotFoundError(instanceData.properties.container);

                log.error(err.toString());
                dfd.reject(err);
                return;
            }

            objectContainer.adv || (objectContainer.adv = new AdHocViewFacade(instanceData, {stateModel: objectContainer.stateModel}));

            objectContainer.adv.run(dfd, instanceData);
        }
    }
    
    function refresh(dfd, instanceData, objectContainer) {
        var validationResult = this.validate();

        if (validationResult){
            dfd.reject(biComponentErrorFactoryAdHocViewProxy.validationError(validationResult));
        } else {
            if ($(instanceData.properties.container).length === 0) {
                var err = biComponentErrorFactoryAdHocViewProxy.containerNotFoundError(instanceData.properties.container);

                log.error(err.toString());
                dfd.reject(err);
                return;
            }

            objectContainer.adv || (objectContainer.adv = new AdHocViewFacade(instanceData.properties, {stateModel: objectContainer.stateModel}));

            objectContainer.adv.refresh(dfd);
        }
    }

    function destroy(dfd, objectContainer) {
        objectContainer.stateModel.set("_destroyed", true);
        if(objectContainer.adv) {
            objectContainer.adv.destroy(dfd);
        } else {
            dfd.resolve();
        }
    }

    function resize(dfd, objectContainer) {
        if (!objectContainer.adv) {
            var err = biComponentErrorFactoryAdHocViewProxy.notYetRenderedError();
            log.error(err.toString());
            dfd.reject(err);
        } else {
            objectContainer.adv.resize();

            dfd.resolve();
        }
    }

    function createUpdateComponentAction(objContainer, stateModel, instanceData) {
        return function() {
            var dfd = new $.Deferred(),
                err,
                componentsToUpdate,
                successCallback,
                errorCallback,
                completeCallback;

            if (stateModel.get("_destroyed")) {
                err = biComponentErrorFactoryAdHocViewProxy.alreadyDestroyedError();
                log.error(err.toString());

                dfd.reject(err);
            } else {
                try {
                    if (_.isArray(arguments[0])) {
                        componentsToUpdate = arguments[0];
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    } else if (_.isString(arguments[0])) {
                        componentsToUpdate = [ _.extend({}, arguments[1], { id: arguments[0] }) ];
                        successCallback = arguments[2];
                        errorCallback = arguments[3];
                        completeCallback = arguments[4];
                    } else if (_.isFunction(arguments[0]) || _.isUndefined(arguments[0])) {
                        throw new Error("Invalid arguments supplied. No component to update");
                    } else {
                        componentsToUpdate = [ arguments[0] ];
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    }

                    successCallback && _.isFunction(successCallback) && dfd.done(successCallback);
                    errorCallback && _.isFunction(errorCallback) && dfd.fail(errorCallback);
                    completeCallback && _.isFunction(completeCallback) && dfd.always(completeCallback);

                    var validationError = _.reduce(componentsToUpdate, function (memo, component) {
                        if (!memo) {
                            var error = biComponentUtil.validateObject(componentSchema[component.id], _.omit(component, "id"));
                            if (error) {
                                memo = biComponentErrorFactoryAdHocViewProxy.validationError(error);
                            }
                        }
                        return memo;
                    }, false);
                    
                    if (validationError) {
                        dfd.reject(validationError);
                    } else {
                        var results = _.compact(_.map(componentsToUpdate, function(componentToUpdate) {
                            var componentModel = objContainer.adv.dataComponents[componentToUpdate.id];

                            if (componentModel && componentModel.updateFromDataComponent){
                                return componentModel.updateFromDataComponent(componentToUpdate);
                            }
                        }));

                        $.when.apply($, results).then(function(){
                            dfd.resolve(instanceData.data);
                        }).fail(function(err){
                            dfd.reject(err);
                        });
                    }
                }
                catch (ex) {
                    err = biComponentErrorFactoryAdHocViewProxy.javaScriptException(ex);

                    log.error(err.toString());
                    dfd.reject(err);
                }
            }

            return dfd;
        };
    }
});