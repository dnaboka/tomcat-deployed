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

    var ViewWithEpoxy = require("common/view/ViewWithEpoxy"),
        WiringConsumerCollectionView = require("./WiringConsumerCollectionView"),
        _ = require("underscore"),
        i18n = require("bundle!DashboardBundle"),
        i18n2 = require("bundle!CommonBundle"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes"),
        WiringSelectConsumerView = require("./WiringSelectConsumerView"),
        WiringConsumerViewModel = require("../../../model/filterManager/WiringConsumerViewModel"),
        WiringRemoveConsumerView = require("./WiringRemoveConsumerView"),
        wiringProducerTemplate = require("text!../../../template/filterManager/wiringProducerTemplate.htm");

    return ViewWithEpoxy.extend({
        events: {
            "blur > .filterColumn > input": "checkNewProducerName",
            "click > .addConsumerColumn > button.add": "addConsumer",
            "click > .removeConsumerColumn > button.delete": "removeProducer"
        },

        computeds: {
            isHidden: function(){
                return !this.model.component.isVisible();
            }
        },

        constructor: function(options) {
            options.template = wiringProducerTemplate;
            options.i18n = _.extend(i18n2, i18n);

            ViewWithEpoxy.prototype.constructor.call(this, options);
        },

        initialize: function(options) {
            var self = this;

            ViewWithEpoxy.prototype.initialize.call(this, options);

            this.selectConsumersCollectionView = new WiringConsumerCollectionView({
                collection: this.model.consumers,
                el: this.$(".selectConsumerColumn > .consumerTable > tbody"),
                modelView: WiringSelectConsumerView,
                modelViewOptions: { consumers: options.consumers }
            });

            this.removeConsumersCollectionView = new WiringConsumerCollectionView({
                collection: this.model.consumers,
                el: this.$(".removeConsumerColumn > .consumerTable > tbody"),
                modelView: WiringRemoveConsumerView
            });

            this.listenTo(this.model.consumers, "add remove", this.toggleRemoveProducerButton);
            this.listenTo(this.model, "change", function() {
                self.model.isValid(true);
            });
        },

        render: function() {
            ViewWithEpoxy.prototype.render.apply(this, arguments);

            this.selectConsumersCollectionView.render();
            this.removeConsumersCollectionView.render();

            this.toggleRemoveProducerButton();

            return this;
        },

        checkNewProducerName: function() {
            if (this.model.isValid(true)) {
                this.model.component.set("name", this.model.component.generateName(this.model.get("name")));

                var id = this.model.component.generateId();

                this.model.component.set("id", id);

                this.model.set({
                    parameter: id,
                    id: id + ":" + id,
                    label:  this.model.component.get("name"),
                    parameterPublicName: id
                });
            }
        },

        removeProducer: function() {
            this.model.trigger('destroy', this.model, this.model.collection);
        },

        addConsumer: function() {
            this.model.consumers.add(new WiringConsumerViewModel({}, { collection: this.model.consumers }));
        },

        toggleRemoveProducerButton: function() {
            this.$("> .removeConsumerColumn > button.delete")[
                (this.model.component.get("type") === dashboardComponentTypes.VALUE && !this.model.consumers.length)
                    ? "show"
                    : "hide"
                ]();
        },

        remove: function() {
            this.selectConsumersCollectionView.remove();
            this.removeConsumersCollectionView.remove();

            ViewWithEpoxy.prototype.remove.apply(this, arguments);
        }
    });
});
