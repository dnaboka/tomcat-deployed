/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

////////////////////////////////////////////////////////////////
// Summary Calculation View
////////////////////////////////////////////////////////////////

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require('jquery'),
        Backbone = require("backbone"),
        i18n = require('bundle!adhoc_messages'),
        ExpressionEditorView = require("adhoc/calculatedFields/view/ExpressionEditorView"),
        SimpleSelectListView = require("adhoc/calculatedFields/view/SimpleSelectListView"),
        templateContent = require("text!adhoc/calculatedFields/template/SummaryTabTemplate.htm");

    return Backbone.View.extend({

        template: _.template(templateContent),

        events : {
            'change .availableSummaries' : 'summaryFunctionsChange'
        },


        initialize: function(){

            // create Custom Summary editor
            this.customSummaryEditor = new ExpressionEditorView({
                assignedAttribute: "summaryExpression",
                model: this.model
            });

            this.listenTo(this.model, "change:availableFields", this.renderWeightedOnFields);
            this.listenTo(this.model, "change:availableSummaryFunctions", this.renderAvailableSummaries);
            this.listenTo(this.model, "change:summaryFunction", this.updateSummaryFunction);
            this.listenTo(this.model, "change:summaryParameter", this.updateSummaryParameter);
            this.listenTo(this.model, "change:availableFields", this.updateSummaryParameter);

            this.listenTo(this.model, "invalid:summaryParameter", this.showSummaryParameterError);
        },

        summaryFunctionsChange: function(event){
            this.model.set('summaryFunction', $(event.target).val());
            this.updateLayout();
        },

        render : function() {
            this.$el.empty();
            this.$el.html(this.template({i18n: i18n}));

            this.customSummaryEditor.setElement(".customSummaryEditor").render();
            return this;
        },

        // Populate the Weighted On Fields list
        renderWeightedOnFields : function() {
            var fieldsList = new SimpleSelectListView({el : this.$el.find(".weightedOnFieldsList ul")});

            var self = this;
            this.listenTo(fieldsList, "item:click", function(fieldName) {
                self.model.set("summaryParameter", fieldName);
            });

            var fields = this.model.get('availableFields');
            if (fields.length > 0) {
                var numericsList = _.filter(fields, function(f){
                    return _.contains([
                        'java.lang.Double',
                        'java.math.BigDecimal',
                        'java.lang.Long',
                        'java.lang.Integer',
                        'java.lang.Short',
                        'java.lang.Byte'], f.type);
                });
                fieldsList.render(_.map(numericsList, function(f){
                    return {
                        name: f.id,
                        label: f.label,
                        tooltip: f.tooltip,
                        nodeClass: f.expression ? "calculated" : "",
                        iconClass: f.kind === "DIMENSION" ? "field" : "measure"
                    }
                }).sortBy(function(el) {return el.label}));
            }
        },

        renderAvailableSummaries: function(){
            var summaryList = _.sortBy(this.model.get('availableSummaryFunctions'), function(fun){
                // set None to the top of list
                return fun === "None" ? "AAA" : fun;
            });

            var selectControl = this.$(".availableSummaries").empty();
            _.each(summaryList, function(sfun) {
                selectControl.append("<option value='" + sfun + "'>" + sfun + "</option>");
            });

            selectControl.val(this.model.get('summaryFunction'));
            this.updateLayout();
        },

        updateSummaryFunction: function() {
            this.renderAvailableSummaries();
//            this.$(".availableSummaries").val(this.model.get('summaryFunction'));
//            this.updateLayout();
        },

        updateSummaryParameter: function() {
            this.$("label.weightedOnInput.control").removeClass("error");
            var id = this.model.get('summaryParameter');
            var field = _.find(this.model.get('availableFields'), function(f){
                return f.id === id;
            });
            field && this.$(".weightedOnInput input").val(field.label);
        },

        showSummaryParameterError: function(data){
            var messageEl = this.$(".weightedOnInput .message.warning");
            var text = data.errorCode ? i18n[data.errorCode] : data.errorMessage;

            messageEl.text(text ? text : "");
            messageEl.parent().addClass("error");
        },

        updateLayout: function(){
            var summaryFunction = this.model.get("summaryFunction");

            if (summaryFunction === "WeightedAverage") {
                this.$('.weightedOnFieldsList').removeClass("hidden");
                this.$('.customSummaryEditor').addClass("hidden");

            } else if (summaryFunction === "Custom") {
                this.$('.weightedOnFieldsList').addClass("hidden");
                this.$('.customSummaryEditor').removeClass("hidden");

            } else {
                this.$('.weightedOnFieldsList').addClass("hidden");
                this.$('.customSummaryEditor').addClass("hidden");
            }
        }

    });
});
