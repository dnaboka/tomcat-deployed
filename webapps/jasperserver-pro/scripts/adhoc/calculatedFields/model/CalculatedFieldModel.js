/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

////////////////////////////////////////////////////////////////
// Calculated Fields Model
////////////////////////////////////////////////////////////////

define("adhoc/calculatedFields/model/CalculatedFieldModel", function(require) {

    "use strict";

    var _ = require('underscore'),
        Backbone = require('backbone');

    return Backbone.Model.extend({

        defaults: {
            // Calculated field attributes
            fieldName: "",
            fieldLabel: "",
            kind: "",
            expression: "",
            summaryFunction: "",
            summaryExpression: "",
            summaryParameter: null,

            // Dictionary attributes
            availableSummaryFunctions: [],
            availableFields: [],
            availableFunctions: [],
            operators: []
        },

        // set attributes from field DTO
        populateFromField : function(field) {
            this.set({
                fieldName: field.id,
                fieldLabel: field.label,
                expression: field.expression,
                kind: field.kind,
                summaryFunction: field.summaryFunction,
                summaryExpression: field.summaryExpression,
                summaryParameter: field.summaryParameter,
                availableSummaryFunctions: field.availableSummaries
            });
        },


        ////////////////
        // Validation. TODO: set up the Backbone Model validation instead
        ////////////////

        _checkForEmpty: function(attr, data) {
            if (!this.attributes[attr] || this.attributes[attr] === "") {
                this.trigger("invalid:" + attr, data);
                return false;
            } else {
                return true;
            }
        },

        _checkForRestrictedChars: function(attr, data) {
            var patt = /[<>"]/g
            if (patt.test(this.attributes[attr])) {
                this.trigger("invalid:" + attr, data);
                return false;
            } else {
                return true;
            }
        },

        _checkForReservedWords: function(attr, data) {
            if (_.contains(["NOT","AND","IN","OR"], this.attributes[attr].trim().toUpperCase())) {
                this.trigger("invalid:" + attr, data);
                return false;
            } else {
                return true;
            }
        },

        isLabelValid: function() {
            var result = true;
            result = this._checkForEmpty("fieldLabel", {errorCode: "adh.calculated.fields.name.empty"}) && result;
            result = this._checkForRestrictedChars("fieldLabel", {errorCode: "adh.calculated.fields.name.restrictedChars"}) && result;
            result = this._checkForReservedWords("fieldLabel", {errorCode: "adh.calculated.fields.name.reservedWords"}) && result;

            // others....

            return result;
        },

        isExpressionValid: function(attr) {
            if (!attr) throw "model.isExpressionValid(attr) requires an attribute!"
            var result = true;
            // check for empty
            result = this._checkForEmpty(attr, {errorCode: "adh.calculated.fields.formula.empty"}) && result;
            // others....

            return result;
        },

        isSummaryFunctionValid: function() {
            var result = true;
            if (!_.contains(this.attributes.availableSummaryFunctions, this.attributes.summaryFunction)) {
                result = false;
            }
            return result;
        },


        isSummaryParameterValid: function() {
            var result = true;
            // check for empty
            result = this._checkForEmpty("summaryParameter", {errorCode: "adh.calculated.fields.summaryParameter.empty"}) && result;
            // others....

            return result;
        },

		isValidField: function() {
            var result = true;
            result = this.isLabelValid() && result;
            result = this.isExpressionValid("expression") && result;
            if (this.attributes.summaryFunction === "WeightedAverage") result = this.isSummaryParameterValid() && result;
            if (this.attributes.summaryFunction === "Custom") result = this.isExpressionValid("summaryExpression") && result;
            return result;
        },



        // stringify model
        toRequest: function() {

            var request = {
                label: this.attributes.fieldLabel,
                display: this.attributes.fieldLabel,
                expression: this.attributes.expression,
                kind: this.attributes.kind
            };

            var summaryFunction = this.attributes.summaryFunction;

            // if we don't have a summary function because we didn't do validation yet, don't set it and it'll be set to a default.
            if (summaryFunction && summaryFunction !== "") {
                request.summaryFunction = summaryFunction;
            }

            if (summaryFunction === "WeightedAverage") {
                request.summaryParameter = this.attributes.summaryParameter;
            } else if (summaryFunction === "Custom") {
                request.summaryExpression = this.attributes.summaryExpression;
            }

            return request;
        }

    });
});
