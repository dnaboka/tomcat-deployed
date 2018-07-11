/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        BiComponent = require("common/bi/component/BiComponent"),
        InputControlPropertiesModel = require("./model/InputControlPropertiesModel"),
        InputControlCollection = require("./collection/InputControlCollection"),
        InputControlCollectionView = require("./view/InputControlCollectionView"),
        biComponentErrorFactoryInputControlsProxy = require("./error/biComponentErrorFactoryInputControlsProxy"),
        schema = JSON.parse(require("text!./schema/InputControls.json")),
        log = require("logger").register(module);

    var propertyNames = _.keys(schema.properties),
        fieldNames = ['properties'],
        readOnlyFieldNames = ['data'];

    function run(dfd, instanceData, inputControlCollection, inputControlCollectionView) {
        var validationResult = this.validate(),
            self = this,
            options = {};

        if (validationResult) {
            dfd.reject(biComponentErrorFactoryInputControlsProxy.validationError(validationResult));
            return;
        }

        var stateValidationResult = inputControlCollection.validate();
        if (stateValidationResult) {
            dfd.reject(biComponentErrorFactoryInputControlsProxy.inputControlsValidationError(stateValidationResult));
            return;
        }

        extendCollectionWithOptions(instanceData, inputControlCollection);

        options.params = _.cloneDeep(instanceData.properties.params) || {};
        _.defaults(options.params, inputControlCollection.getState());

        var method = _.isEmpty(options.params) ? "fetch" : "update";

        if (instanceData.properties.container) {
            var $container = $(instanceData.properties.container);
            if (!($container.length && $container[0].nodeType == "1")) {
                dfd.reject(biComponentErrorFactoryInputControlsProxy.containerNotFoundError(instanceData.properties.container));
            }
            inputControlCollectionView.setContainer($container);
        }

        inputControlCollection[method](options)
            .done(function (response) {
                instanceData.data = inputControlCollection.toJSON();
                instanceData.data.parameters = inputControlCollection.getState();
                dfd.resolve(self.data());
            })
            .fail(function(xhr) {

                if (xhr.responseJSON.errorCode === "generic.error.message" && xhr.responseJSON.message.search(/Parameter [\S]+ does not exist/) != -1) {
                    dfd.reject(biComponentErrorFactoryInputControlsProxy.inputControlParameterNotFound(xhr.responseJSON.message));
                } else {
                    dfd.reject(biComponentErrorFactoryInputControlsProxy.requestError(xhr));
                }
            });
    }

    function reset(dfd, instanceData, inputControlCollection) {
        var self = this;
        instanceData.properties.params = {};

        inputControlCollection.fetch()
            .done(function (response) {
                instanceData.data = inputControlCollection.toJSON();
                instanceData.data.parameters = inputControlCollection.getState();
                dfd.resolve(self.data());
            })
            .fail(function(xhr) {

                if (xhr.responseJSON.errorCode === "generic.error.message" && xhr.responseJSON.message.search(/Parameter [\S]+ does not exist/) != -1) {
                    dfd.reject(biComponentErrorFactoryInputControlsProxy.inputControlParameterNotFound(xhr.responseJSON.message));
                } else {
                    dfd.reject(biComponentErrorFactoryInputControlsProxy.requestError(xhr));
                }
            });
    }

    function extendCollectionWithOptions(instanceData, inputControlCollection) {
        _.extend(inputControlCollection, {
            resourceUri: instanceData.properties.resource,
            contextPath: instanceData.properties.server
        });
    }

    var InputControls = function(properties) {
        var instanceData = {
            properties: _.extend({}, properties),
            data: []
        };

        var stateModel = new InputControlPropertiesModel(properties || {});
        biComponentUtil.createInstancePropertiesAndFields(this, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);

        var inputControlCollection = new InputControlCollection([], {
            stateModel: stateModel
        });

        var inputControlCollectionView = new InputControlCollectionView({
            collection: inputControlCollection,
            stateModel: stateModel
        });

        var eventManager = _.extend({}, Backbone.Events);

        eventManager.listenTo(inputControlCollection, "changeState", function() {
            instanceData.data = inputControlCollection.toJSON();
            instanceData.data.parameters = inputControlCollection.getState();
        });

        _.extend(this, {
            validate: biComponentUtil.createValidateAction(instanceData, schema, stateModel),
            run: biComponentUtil.createDeferredAction(run, stateModel, instanceData, inputControlCollection, inputControlCollectionView),
            reset: biComponentUtil.createDeferredAction(reset, stateModel, instanceData, inputControlCollection)
        });
    };

    InputControls.prototype = new BiComponent();

    return InputControls;
});