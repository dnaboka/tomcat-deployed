/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

////////////////////////////////////////////////////////////////
// Calculated Field View
////////////////////////////////////////////////////////////////

/* global enableSelection */

define(function(require) {
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        i18n = require('bundle!adhoc_messages'),
        CalculatedFieldModel = require('adhoc/calculatedFields/model/CalculatedFieldModel'),
        templateContent = require("text!adhoc/calculatedFields/template/CalculatedFieldTemplate.htm"),
        operatorsFactory = require("adhoc/calculatedFields/factory/operatorsFactory"),
        SummaryTabView = require("adhoc/calculatedFields/view/SummaryCalculationView"),
        ExpressionEditorView = require("adhoc/calculatedFields/view/ExpressionEditorView");

    return Backbone.View.extend({
        template: _.template(templateContent),

        // view events
        events: {
            'click .formulaBuilderTab' : 'formulaTabClick',
            'click .summaryCalcTab' : 'summaryTabClick',
            'keyup .fieldLabelInput' : 'onFieldLabelChange'
        },

        initialize: function(){

            // prepare model
            this.model = new CalculatedFieldModel({operators: operatorsFactory});

            // init Formula Builder tab
            this.formulaEditor = new ExpressionEditorView({
                assignedAttribute: "expression",
                title: i18n["ADH_421_FORMULA"],
                model: this.model
            });

            // init Summary Calculation tab
            this.summaryTab = new SummaryTabView({model: this.model});

            // setup listeners
            this.listenTo(this.model, "change:fieldLabel", this.updateFieldLabel);
            this.listenTo(this.model, "change:kind", this.setNameInputLabel);
            this.listenTo(this.model, "invalid:fieldLabel", this.showFieldLabelError);
            this.listenTo(this.model, "invalid:summaryExpression", this.showSummaryTab);
            this.listenTo(this.model, "invalid:summaryParameter", this.showSummaryTab);

        },

        render : function() {
            this.$el.empty();
            this.$el.html(this.template({i18n: i18n}));

            this.formulaEditor.setElement(".formulaBuilderSection").render();
            this.summaryTab.setElement(".summaryCalcSection").render();

            // set focus to field name input
            var fieldLabelInput = this.$(".fieldLabelInput");
            enableSelection(fieldLabelInput.parent()[0]);
            setTimeout(function(){
                fieldLabelInput.focus();
            }, 500);

            return this;
        },

        setNameInputLabel: function() {
            var isMeasure = this.model.get("kind") === "MEASURE";

            var fieldNameInputLabel = isMeasure ? "ADH_402_MEASURE_NAME" : "ADH_402_FIELD_NAME";
            var fieldNameInputTooltip = isMeasure ? "ADH_402_MEASURE_NAME_TIP" : "ADH_402_FIELD_NAME_TIP";
            this.$(".measureNameSection label.control.input span.wrap").text(i18n[fieldNameInputLabel]);
            this.$(".measureNameSection label.control.input").attr("title", i18n[fieldNameInputTooltip]);

            if (!this.isEdit) {
                var fieldLabel = isMeasure ? i18n["ADH_403_NEW_MEASURE_DEFAULT_NAME"] : i18n["ADH_403_NEW_FIELD_DEFAULT_NAME"];
                this.model.set("fieldLabel", fieldLabel ? fieldLabel : "");
            }
        },

        updateFieldLabel: function() {
            var fieldLabelInput = this.$(".fieldLabelInput");
            fieldLabelInput.val(this.model.get('fieldLabel'));
            var endPos = fieldLabelInput.val().length;
            fieldLabelInput.selection('setPos', {start:endPos,end: endPos});
        },

        onFieldLabelChange: function(event){
            this.$(".measureNameSection label.control").removeClass("error");
            this.model.set('fieldLabel', $(event.target).val(), {silent: true});
            this.model.isLabelValid();
        },

        showFieldLabelError: function(data){
            var messageEl = this.$(".measureNameSection .message.warning");
            var text = data.errorCode ? i18n[data.errorCode] : data.errorMessage;

            messageEl.text(text ? text : "");
            messageEl.parent().addClass("error");
        },

        showFormulaTab: function() {
            this.$('.formulaBuilderTab').addClass("selected");
            this.$('.formulaBuilderTab a').removeClass("over");
            this.$('.summaryCalcTab').removeClass("selected");

            this.$('.summaryCalcSection').addClass("hidden");
            this.$('.formulaBuilderSection').removeClass("hidden");
        },

        showSummaryTab: function() {
            this.$('.summaryCalcTab').addClass("selected");
            this.$('.summaryCalcTab a').removeClass("over");
            this.$('.formulaBuilderTab').removeClass("selected");

            this.$('.formulaBuilderSection').addClass("hidden");
            this.$('.summaryCalcSection').removeClass("hidden");
        },

        formulaTabClick: function() {
            if (!this.$('.formulaBuilderTab.selected')[0]) {
                this.showFormulaTab();
            }
        },

        summaryTabClick: function() {
            if (this.$('.summaryCalcTab.selected')[0]) {
                return;
            }

            // TODO: avoid redundant validation trigger if expression has not changed
            if (/* expression_has_changed*/ true) {
                 this.model.trigger("validate:expression", _.bind(this.showSummaryTab,this));
            } else {
                this.showSummaryTab();
            }
        }

    });
});
