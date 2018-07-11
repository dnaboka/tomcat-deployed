/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * Generic Backbone CollectionView component.
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore");

    return Backbone.View.extend({
        /**
         * @method el
         * @description Generates HTML for view's root element from template.
         * @returns {string}
         */
        el: function() {
            return this._template(this._templateOptions);
        },

        /**
         * @constructor CollectionView
         * @classdesc Generic Backbone CollectionView component.
         * @param options
         * @param {Backbone.Collection} [options.collection=new Backbone.Collection()] - collection to render subviews for.
         * @param {string} [options.template="<div></div>"] - template.
         * @param {object} [options.templateOptions="{}"] - additional options to path to template when view's root element is created.
         * @param {function} [options.modelView=Backbone.View] - constructor for subviews.
         * @param {object} [options.modelViewOptions={}] - additional options to path to subview constructor.
         * @param {string} [options.contentContainer] - CSS selector to the base place where subviews will be rendered.
         */
        constructor: function(options) {
            options || (options = {});

            this.collection = options.collection || new Backbone.Collection();

            this._template = _.template(options.template || "<div></div>");
            this._templateOptions = options.templateOptions || {};
            this._modelView = options.modelView || Backbone.View;
            this._modelViewOptions = options.modelViewOptions || {};

            this._subviews = [];

            Backbone.View.apply(this, arguments);

            this._$subviewsContainer = options.contentContainer ? this.$(options.contentContainer) : this.$el;

            this.initCollectionEventHandlers();
        },

        /**
         * @method initCollectionEventHandlers
         * @description Initializes event handlers for collection events.
         */
        initCollectionEventHandlers: function() {
            this.listenTo(this.collection, "add", this.addSubview);
            this.listenTo(this.collection, "remove", this.removeSubview);
        },

        /**
         * @method addSubview
         * @description Creates new view for passed model, renders it and appends to DOM.
         * @param {Backbone.Model} model - model to create view for.
         * @returns {Backbone.View}
         */
        addSubview: function(model) {
            var subview = new this._modelView(_.extend({}, this._modelViewOptions, { model: model }));

            this._$subviewsContainer.append(subview.render().$el);

            this._subviews.push(subview);

            return subview;
        },

        /**
         * @method removeSubview
         * @description Removes view for passed model from DOM and internal subviews collection.
         * @param {Backbone.Model} model - model to remove view for.
         */
        removeSubview: function(model) {
            var subview = this.getSubviewByModel(model);

            if (subview) {
                var index = _.indexOf(this._subviews, subview);

                this._subviews.splice(index, 1);

                subview.remove();
            }
        },

        /**
         * @method getSubviewByModel
         * @description Finds view for passed model in internal subview collection and returns it.
         * @param {Backbone.Model} model - model to get view for.
         * @returns {Backbone.View}
         */
        getSubviewByModel: function(model) {
            return _.find(this._subviews, function(subview) { return subview.model === model; });
        },

        /**
         * @method render
         * @description Creates views for all models in collection, renders them and appends to DOM.
         * @returns {Backbone.View}
         */
        render: function() {
            _.invoke(this._subviews, "remove");
            this._subviews = [];

            this._$subviewsContainer.empty();

            this.collection.forEach(_.bind(this.addSubview, this));

            return this;
        },

        /**
         * @method remove
         * @description Removes subviews and main view from DOM.
         */
        remove: function() {
            _.invoke(this._subviews, "remove");
            this._subviews = [];

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});
