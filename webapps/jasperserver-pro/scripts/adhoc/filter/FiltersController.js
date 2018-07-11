/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        BaseFiltersController = require("adhoc/filter/BaseFiltersController"),
        ComplexExpressionEditor = require("adhoc/filter/editor/ComplexExpressionEditor"),
        logger = require("logger").register(module),
        ComplexExpressionModel = require("adhoc/filter/ComplexExpressionModel");

    var FiltersController = BaseFiltersController.extend({
        isOlap: false,

        initialize: function() {
            BaseFiltersController.prototype.initialize.apply(this, arguments);

            this.expressionModel = new ComplexExpressionModel({id: "complexFilter", complexExpression : "", filterPodMinimized: true});
            this.complexExpressionEditor = new ComplexExpressionEditor({
                el : this.$("#expression-container"),
                model: this.expressionModel
            });

            this.on("invalid:complexExpression", this.showComplexExpressionServerError);

            this.listenTo(this.collection, "change:value", this.updateFilter);
            this.listenTo(this.collection, "change:isAnyValue", this.updateFilter);

            this.listenTo(this.expressionModel, "toggle", this.toggleFilter);
            this.listenTo(this.expressionModel, "change:complexExpression", _.partial(this.setFiltersChanged, true));
            this.listenTo(this.expressionModel, "change:complexExpression", this.clearComplexExpressionServerError);
            this.listenTo(this.expressionModel, "change:filterPodMinimized", this.changeFilterPanelHeight);

        },

        changeFilterPanelHeight: function() {
            var body = this.$("> .content > .body"),
                footer = this.$("> .content > .footer");

            body[this.expressionModel.get("filterPodMinimized") ? "addClass" : "removeClass"]("complexExpressionMinimized");
            footer[this.expressionModel.get("filterPodMinimized") ? "addClass" : "removeClass"]("complexExpressionMinimized");
            body[this.expressionModel.get("filterPodMinimized") ? "removeClass" : "addClass"]("complexExpressionMaximized");
            footer[this.expressionModel.get("filterPodMinimized") ? "removeClass" : "addClass"]("complexExpressionMaximized");
        },

        render: function() {
            BaseFiltersController.prototype.render.apply(this, arguments);

            this.complexExpressionEditor.render();
            this.changeFilterPanelHeight();

            return this;
        },

        clearComplexExpressionServerError: function() {
            if (this.complexExpressionEditor.$("label.control.input").hasClass("error")) {
                this.$("#filterMessage span").empty();
                this.complexExpressionEditor.$("label.control.input").removeClass("error");
            }
        },

        showComplexExpressionServerError : function(model, message) {
            this.$("#filterMessage span").html(message);
            this.complexExpressionEditor.$("label.control.input").addClass("error");
        },

        setFilters: function(response) {
            this.expressionModel.set("complexExpression", response.complexExpression);
            this.expressionModel.set("filterPodMinimized", response.isComplexFilterPodMinimized);

            BaseFiltersController.prototype.setFilters.apply(this, arguments);
        },

        _deleteFilterDoneCallback: function(filter, response) {
            this.expressionModel.set("complexExpression", response.complexExpression);

            BaseFiltersController.prototype._deleteFilterDoneCallback.apply(this, arguments);
        },

        _deleteAllFiltersDoneCallback: function(filters, response) {
            this.expressionModel.set("complexExpression", response.complexExpression);

            BaseFiltersController.prototype._deleteAllFiltersDoneCallback.apply(this, arguments);
        },

        applyFilters : function() {
            // todo: refactor the error clean-up
            this.$("#filterMessage span").empty();

            this.setFiltersChanged(false);

            return this.service
                .applyFiltersAndExpression(this.collection.toExpression(), this.expressionModel.get("complexExpression"))
                .done(_.bind(function(response, status, xhr) {
                    var errorMessage = xhr.getResponseHeader("adhocException");
                    if (errorMessage) {
                        logger.error(errorMessage);
                        return;
                    }
                    this.setFilters(response);
                    this.onApply(response);
                }, this))
                .fail(_.bind(function(response) {
                    var errors = JSON.parse(response.responseText);

                    if (errors.editFilterError) {
                        this.trigger('invalid:filters', this.collection,  errors.editFilterError);
                    }

                    if (errors.complexFilterError) {
                        this.trigger('invalid:complexExpression', this.collection, errors.complexFilterError);
                    }
                }, this));
        }
    });

    // workaround for non-AMD modules
    window.FiltersController = FiltersController;

    return FiltersController;
});