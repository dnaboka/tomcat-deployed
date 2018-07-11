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

    var Epoxy = require("backbone.epoxy"),
        _ = require("underscore"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        DashboardWiringModel = require("./../DashboardWiringModel"),
        WiringConsumerViewModel = require("./WiringConsumerViewModel"),
        BackboneValidation = require("backbone.validation"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        WiringConsumerViewModelCollection = require("../../collection/filterManager/WiringConsumerViewModelCollection");

    var WiringProducerModel = Epoxy.Model.extend(_.extend({}, BackboneValidation.mixin, {
        defaults: {
            id: undefined,
            name: undefined,
            parameter: undefined,
            parameterPublicName: undefined,
            label: undefined
        },

        validation: {
            name: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.filterManager.error.parameter.name.required")
                },
                {
                    fn: function(value, attr, computedState){
                        if (!_.isUndefined(computedState.id)) {
                            return;
                        }

                        return this.collection.find(function(c) {
                            return c.get("name") == value && c.get("id") !== computedState.id;
                        });
                    },
                    msg: new i18nMessage("dashboard.filterManager.error.parameter.name.duplication")
                }
            ]
        },

        initialize: function(attrs, options) {
            options || (options = {});

            this.consumers = options.consumers || new WiringConsumerViewModelCollection([]);
            this.component = options.component;
        },

        isValid: function(validate) {
            return BackboneValidation.mixin.isValid.call(this, validate) && this.consumers.isValid(validate);
        },

        //isHidden: function() {
        //    return !this.component.isVisible();
        //},

        setGroupRelatedProperties: function() {
            this.set({
                "isFirstItemInGroup": this.collection.findWhere({ group: this.get("group") }) === this,
                "itemsInGroup": this.collection.where({ group: this.get("group") }).length
            });
        }
    }), {
        createFromDashboardWiringModel: function(dashboardWiringModel, components) {
            var consumers = new WiringConsumerViewModelCollection(),
                label = dashboardWiringModel.get("producer"),
                parameterPublicName = dashboardWiringModel.get("producer"),
                group,
                outputParameters = dashboardWiringModel.component.get("outputParameters");

            if (outputParameters && _.isArray(outputParameters)) {
                var outputParameter = _.findWhere(outputParameters, { id: dashboardWiringModel.get("name") });

                if (!_.isUndefined(outputParameter)) {
                    label = outputParameter.label;
                }
            } else if (dashboardWiringModel.component.get("type") === dashboardComponentTypes.VALUE) {
                label = dashboardWiringModel.component.id;
                parameterPublicName = dashboardWiringModel.component.id;
            } else if (dashboardWiringModel.component.get("type") === dashboardComponentTypes.INPUT_CONTROL) {
                label = dashboardWiringModel.component.get("name");
                parameterPublicName = dashboardWiringModel.component.id;
            }

            consumers.add(dashboardWiringModel.consumers.map(function(consumerModel) {
                var consumerParts = consumerModel.get("consumer").split(":"),
                    consumerComponentModel = components.get(consumerParts[0]);

                return new WiringConsumerViewModel({
                    id: consumerParts[0],
                    parameter: consumerParts[1],
                    name: consumerComponentModel.get("name")
                }, {
                    component: consumerComponentModel,
                    collection: consumers
                });
            }));

            if (dashboardWiringModel.component.get("type") === dashboardComponentTypes.INPUT_CONTROL) {
                group = dashboardWiringModel.component.getParent() ?
                    dashboardWiringModel.component.getParent().get("name") :
                i18n['dashboard.component.filter.group.component.name'] || "Filter Group";
            } else if (dashboardWiringModel.component.get("type") === dashboardComponentTypes.VALUE) {
                group = i18n["dashboard.filter.manager.manually.created.filters"] || "Manually Created Filters";
            } else {
                group = dashboardWiringModel.component.get("name");
            }

            return new WiringProducerModel({
                id: dashboardWiringModel.get("producer"),
                name: dashboardWiringModel.get("producer"),
                parameter: dashboardWiringModel.get("name"),
                parameterPublicName: parameterPublicName,
                label: label,
                group: group
            }, {
                component: dashboardWiringModel.component,
                consumers: consumers
            });
        }
    });

    return WiringProducerModel;
});
