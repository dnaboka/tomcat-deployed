/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author bkolesnikov
 * @version: $Id$
 */

////////////////////////////////////////////////////////////////
// Formatting Dialog View
////////////////////////////////////////////////////////////////

define(function (require) {
    /* global dialogs */
    "use strict";


    var _ = require('underscore'),
        jQuery = require("jquery"),
        Backbone = require('backbone'),
        i18n = require('bundle!adhoc_messages'),
        FormattingDialogModel = require('adhoc/intelligentChart/formattingDialog/model/FormattingDialogModel'),
        AdvancedSectionView = require("adhoc/intelligentChart/formattingDialog/view/AdvancedSectionView"),
        templateContent = require("text!adhoc/intelligentChart/formattingDialog/template/FormattingDialogTemplate.htm"),
        templateContentAxis = require("text!adhoc/intelligentChart/formattingDialog/template/AxisSectionTemplate.htm"),
        templateContentLabels = require("text!adhoc/intelligentChart/formattingDialog/template/LabelsSectionTemplate.htm"),
        templateContentData = require("text!adhoc/intelligentChart/formattingDialog/template/DataSectionTemplate.htm");
        //templateContentRanges = require("text!adhoc/intelligentChart/formattingDialog/template/RangesSectionTemplate.htm");


    return Backbone.View.extend({
        template: _.template(templateContent),
        el: "#chartFormatDialog",

        initialize: function() {
            this._subviews = [];

            this.render();

            this.model.on("change", this._renderFields, this);
        },
        events: {
            'click .applyButton': '_apply',
            'click .okButton': '_ok',
            'click .cancelButton': '_cancel',
            'click ul.tabSet .tab': '_switchTab',
            "change select#legend": "_disableLegendBorderControl",
            "change input#showSingleMeasuresLabels": "_disableMeasureNamesControl"
        },
        render: function () {
            this.$el.empty();
            this.$el.html(this.template({i18n: i18n}));

            this.advancedSectionView = new AdvancedSectionView();

            this.$el.find("#axisSection").html(_.template(templateContentAxis)({i18n: i18n}));
            this.$el.find("#labelsSection").html(_.template(templateContentLabels)({i18n: i18n}));
            this.$el.find("#dataSection").html(_.template(templateContentData)({i18n: i18n}));
            //this.$el.find("#rangesSection").html(_.template(templateContentRanges)({i18n: i18n}));
            this.$el.find("#advancedSection").html(this.advancedSectionView.$el);

            this._subviews.push(this.advancedSectionView);

            this._renderFields();

            return this;
        },

        _renderFields: function () {
            this.inputFields = {};
            _.each(this.model.attributes, function (param, name) {
                var input = this.$el.find("#" + name);
                if (input.attr('type') == 'checkbox') {
                    this.inputFields[name] = input.prop("checked", param);
                    if (name === "showMeasureOnValueAxis") {
                        if (this.model.get("showSingleMeasuresLabels")) {
                            this.inputFields[name].prop("disabled", false).parent().removeClass("disabled");
                        } else {
                            this.inputFields[name].prop("disabled", true).parent().addClass("disabled");
                        }
                    }
                } else if (name === "advancedProperties") {
                    this.advancedSectionView.reset(param);
                } else {
                    this.inputFields[name] = input.val(param);
                }
            }, this);
        },

        _updateModel: function() {
            var options = this._extractData();
            this.model.set(options, {validate: true});

            this.$el.find(".error").removeClass("error");
            if(this.model.isValid()) {
                return true;
            } else {
                // revert invalid inputs and set attr again
                _.each(this.model.validationError, function(msg, target) {
                    this.$el.find("#" + target).val(this.model.get(target));
                }, this);
                return this._updateModel();
            }
        },

        _apply: function () {
            this._updateModel();
            this.model.applyModel();
        },

        _ok: function () {
            this._updateModel();
            this.model.applyModel();
            this._switchToFirstTab();
            dialogs.popup.hide(this.el);
        },
        _cancel: function () {
            // reset attributes to server state and set first tab active
            this.model.set(this.model._savedAttributes, {silent: true});
            this._renderFields();
            this._switchToFirstTab();
            dialogs.popup.hide(this.el);
        },

        _switchTab: function (e) {
            if(this._updateModel()) {
                var tabs = this.$el.find('ul.tabSet li.tab');
                tabs.removeClass("selected");

                var currentTab = this.$el.find(e.currentTarget);
                currentTab.addClass("selected");
                currentTab.children("a").removeClass("over");

                var tabId = currentTab.attr('id');
                var sectionName = tabId.substring(0, tabId.indexOf('Tab'));

                this.$el.find('div.body.section.noTitle').addClass('hidden');
                this.$el.find('#' + sectionName + "Section").removeClass("hidden");
            }
            this._resetAdvancedTab();
        },

        _resetAdvancedTab: function () {
            this.advancedSectionView.resetState();
        },

        // switch to first tab
        _switchToFirstTab: function() {
            var tabs = this.$el.find('ul.tabSet li.tab');
            tabs.removeClass("selected");

            var currentTab = this.$el.find('ul.tabSet li.tab.first');
            currentTab.addClass("selected");

            var tabId = currentTab.attr('id');
            var sectionName = tabId.substring(0, tabId.indexOf('Tab'));

            this.$el.find('div.body.section.noTitle').addClass('hidden');
            this.$el.find('#' + sectionName + "Section").removeClass("hidden");

        },


        _extractData: function () {

            var options = {};

            _.each(this.model.attributes, function (param, name) {
                var input = this.inputFields[name];
                if (name === "advancedProperties") {
                    options[name] = this.advancedSectionView.toJSON();
                    return;
                }
                if(input.length){
                    if (input.attr('type') == 'checkbox') {
                        options[name] = input.prop("checked");
                    } else {
                        options[name] = input.val();
                    }
                }
            }, this);

            return options;
        },

        _disableMeasureNamesControl: function(e) {
            var $showMeasureOnValueAxis = this.$el.find("input#showMeasureOnValueAxis");
            if (jQuery(e.currentTarget).is(":checked")) {
                $showMeasureOnValueAxis.prop("checked", this._tmpPreviousStateShowMeasureOnValueAxis).prop("disabled", false).parent().removeClass("disabled");
            } else {
                this._tmpPreviousStateShowMeasureOnValueAxis = $showMeasureOnValueAxis.prop("checked");
                $showMeasureOnValueAxis.prop("checked", false).prop("disabled", true).parent().addClass("disabled");
            }
        },
        _disableLegendBorderControl: function(e) {
            var $legendBorder = this.$el.find("input#legendBorder");
            if (jQuery(e.currentTarget).val() === "none") {
                $legendBorder.prop("disabled", true).parent().addClass("disabled");
            } else {
                $legendBorder.prop("disabled", false).parent().removeClass("disabled");
            }
        },

        remove: function () {
            _.invoke(this._subviews, 'remove');
            Backbone.View.prototype.remove.call(this);
        }
    });
});