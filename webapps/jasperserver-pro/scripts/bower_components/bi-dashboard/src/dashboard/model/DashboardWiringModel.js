/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        DashboardWiringConsumerCollection = require("../collection/DashboardWiringConsumerCollection"),
        _ = require("underscore");

    return Backbone.Model.extend({
        idAttribute : "producer",

        initialize: function(attrs, options) {
            options || (options = {});

            this.component = options.component;

            this.consumers = options.consumers && options.consumers instanceof DashboardWiringConsumerCollection
                ? options.consumers
                : new DashboardWiringConsumerCollection(options.consumers || []);

            this.listenTo(this.component, this.get("name"), function(value) {
                this.value = value;
            }, this);

            this.listenTo(this.consumers, "add", function(model, collection, options) {
                this.trigger("add:consumers", this, model, collection, options);
            }, this);

            this.listenTo(this.consumers, "remove", function(model, collection, options) {
                this.trigger("remove:consumers", this, model, collection, options);
            }, this);

            this.listenTo(this.consumers, "reset", function(collection, options) {
                this.trigger("reset:consumers", this, collection, options);
            }, this);
        },

        toJSON: function() {
            var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

            data.consumers = this.consumers.toJSON();

            return data;
        }
    });
});
