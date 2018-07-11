/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

////////////////////////////////////////////////////////////////
// Calculated Fields Controller
////////////////////////////////////////////////////////////////

define(function(require) {
    "use strict";

    var _ = require('underscore'),
        Backbone = require('backbone'),
        CalculatedFieldView = require("adhoc/calculatedFields/view/CalculatedFieldView");

    return Backbone.View.extend({

        initialize: function(options){
            this.service = options.service;

            // create Calculated Field View
            this.view = new CalculatedFieldView({
                el: options.element
            });

            this.view.listenTo(this.view.model, "validate:expression", _.bind(this._validateExpression, this));
            this.view.listenTo(this.view.model, "validate:summaryExpression", _.bind(this._validateCustomSummary, this));
        },

        start : function(options) {
            options = options || {};

            this.view.isEdit = options.editingMode;

            this.view.render();

            // Retrieve the available fields and functions from server
            this._fetchFieldsAndFunctions();

            // Populate the model with field metadata
            this._setFieldMetadata(options);
        },

        stop : function() {
            this.view.stopListening(this.view.model);
            this.view.undelegateEvents();
        },


        applyField: function(){
            if (!this.view.model.isValidField()) {
                return;
            }

            var applyAction = this.view.isEdit ? this.service.update.bind(this.service) : this.service.add.bind(this.service);

            return applyAction(this.view.model.toRequest(), this.view.model.get("fieldName"))
                .done(_.bind(function(response) {
                    this.trigger('field:applied', response);
                }, this))
                .fail(_.bind(this._handleServerError, this));
        },

        _setFieldMetadata : function(options) {
            if (this.view.isEdit && options.selectedFieldName) {
                // populate the model with editing field metadata
                this.service.get(options.selectedFieldName)
                    .done(_.bind(function(response) {
                        var field = response;
                        this.view.model.populateFromField(field);
                        this.trigger('field:loaded', field.kind === "MEASURE", true);
                    }, this));

            } else {
                // populate the model with only 'kind' attribute for new field
                this.view.model.set("kind", options.kind);
                this.trigger('field:loaded', options.kind === "MEASURE", false);
            }
        },

        _fetchFieldsAndFunctions : function() {
            // Fetch the available Fields
            this.service.fetchFieldsList().done(_.bind(function(response) {
                this.view.model.set("availableFields", response);
            }, this));

            // Fetch the available Functions
            this.service.fetchFunctionsList().done(_.bind(function(response) {
                this.view.model.set("availableFunctions", response);
            }, this));
        },


        _handleServerError: function(response) {
            if (response.status === 500) {
                // If status is 500 then the failure is not related to Calculated Field expression and should not appear in our dialog.
                // In this case the standard JRS error dialog will pop-up. Do nothing here...
                return;
            }
            var jsonError = JSON.parse(response.responseText);
            if (jsonError && jsonError.parameters && jsonError.parameters[0]) {
                var failedAttr = jsonError.parameters[0];

                // TODO: rename the model attribute fieldLabel to label and drop this hack:
                failedAttr = failedAttr == "label" ? "fieldLabel" : failedAttr;

                this.view.model.trigger('invalid:' + failedAttr, {errorMessage: jsonError.message});
            }
        },

        _validateExpression: function(callback){
            if (!this.view.model.isExpressionValid("expression")) {
                return;
            }

            var field = {
                expression : this.view.model.get("expression"),
                kind: this.view.model.get("kind")
            };
            this.service.validate(field)
                .done(_.bind(function(response) {

                    // set the resolved summary functions metadata
                    this.view.model.set('availableSummaryFunctions', response.availableSummaries);

                    if (!this.view.model.isSummaryFunctionValid()) {
                        this.view.model.set('summaryFunction', response.summaryFunction);
                    }

                    callback && callback();

                }, this)).fail(_.bind(function(response) {
                    this._handleServerError(response);
                }, this));
        },

        _validateCustomSummary: function(callback){
            if (!this.view.model.isExpressionValid("summaryExpression")) {
                return;
            }

            var field = {
                expression : this.view.model.get("expression"),
                summaryFunction: this.view.model.get("summaryFunction"),
                summaryExpression : this.view.model.get("summaryExpression")
            };

            this.service.validate(field)
                .done(_.bind(function(response) {

                    callback && callback(response);

                }, this)).fail(_.bind(function(response) {
                    this._handleServerError(response);
                }, this));
        }

    });
});
