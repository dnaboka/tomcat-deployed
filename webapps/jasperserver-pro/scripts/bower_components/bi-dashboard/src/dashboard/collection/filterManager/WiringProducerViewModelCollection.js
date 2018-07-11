/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        WiringProducerViewModel = require("../../model/filterManager/WiringProducerViewModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes");

    var WiringProducerCollection = Backbone.Collection.extend({
        model: WiringProducerViewModel,

        comparator: function(model1, model2) {
            if (model1.get("group").toLowerCase() < model2.get("group").toLowerCase()) {
                return -1;
            } else if (model1.get("group").toLowerCase() > model2.get("group").toLowerCase()) {
                return 1;
            } else {
                if (_.isUndefined(model1.get("label")) && !_.isUndefined(model2.get("label"))) {
                    return -1;
                } else if (!_.isUndefined(model1.get("label")) && _.isUndefined(model2.get("label"))) {
                    return 1;
                } else if (_.isUndefined(model1.get("label")) && _.isUndefined(model2.get("label"))) {
                    return 0;
                } else if (model1.get("label").toLowerCase() < model2.get("label").toLowerCase()) {
                    return -1;
                } else if (model1.get("label").toLowerCase() > model2.get("label").toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },

        isValid: function(validate) {
            return _.every(this.invoke("isValid", validate), _.identity);
        },

        initialize: function() {
            this.on("sort remove add reset", _.partial(this.invoke, "setGroupRelatedProperties"));
        }
    }, {
        createFromDashboardWiringCollection: function(dashboardWiringCollection, dashboardComponentCollection) {
            var inputControlProducers = dashboardWiringCollection.filter(function(wiringModel) {
                    return wiringModel.component.isValueProducer();
                }),
                producerModels = _.map(inputControlProducers, function(wiringModel) {
                    return WiringProducerViewModel.createFromDashboardWiringModel(wiringModel, dashboardComponentCollection);
                });

            return new WiringProducerCollection(producerModels);
        }
    });

    return WiringProducerCollection;
});
