/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author amalieie
 * @version: $Id$
 */

    ////////////////////////////////////////////////////////////////
    // Advanced Section View
    ////////////////////////////////////////////////////////////////

define(function(require) {
    /* global dialogs */
    "use strict";

    var _ = require("underscore"),
        jQuery = require("jquery"),
        Backbone = require("backbone"),
        i18n = require("bundle!adhoc_messages"),
        AdvancedPropertyView = require("adhoc/intelligentChart/formattingDialog/view/AdvancedPropertyView"),
        AdvancedPropertyModel = require("adhoc/intelligentChart/formattingDialog/model/AdvancedPropertyModel"),
        EditAdvancedPropertyView = require("adhoc/intelligentChart/formattingDialog/view/EditAdvancedPropertyView"),
        ConfirmationDialog = require("common/component/dialog/ConfirmationDialog"),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        AdvancedPropertiesCollection = require("adhoc/intelligentChart/formattingDialog/collection/AdvancedPropertiesCollection"),
        templateAdvancedSection = require("text!adhoc/intelligentChart/formattingDialog/template/AdvancedSectionTemplate.htm");

    require("css!attributes.css");

    return Backbone.View.extend({
        className: 'advancedSection', template: _.template(templateAdvancedSection),

        initialize: function() {
            this._subviews = [];

            this.collection = new AdvancedPropertiesCollection();
            this.confirmationDialog = new ConfirmationDialog();

            this.listenTo(this.collection, 'add', this.addAdvancedPropertyView);
            this.listenTo(this.collection, 'reset', this.onCollectionReset);
            this.listenTo(this.collection, 'validation:invalid', this.onCollectionValidationError);
            this.listenTo(this.collection, 'validation:valid', this.onCollectionValid);
            this.listenTo(Backbone, 'advancedProperty:delete', this.onDelete);

            this.render();
        },

        events: {
            "click .addNewItem": "addNewItem"
        },

        render: function() {
            this.$el.html(this.template({i18n: i18n}));

            return this;
        },

        calculateZIndexes: function() {
            //use this dirty hook to place confirmation dialog over other dialogs.
            setTimeout(function() {
                jQuery("#chartFormatDialog").css("z-index", +jQuery("#dialogDimmer").css("z-index") - 1);
                jQuery("#chartTypeSelector").css("z-index", +jQuery("#dialogDimmer").css("z-index") - 2);
            }, 0);
        },

        reset: function(properties) {
            this.collection.reset(properties);
        },

        toJSON: function() {
            return this.collection.toJSON();
        },

        resetState: function() {
            this.isEditing = false;
            this.showAddBtn();
            this._currentPropertyView && this._currentPropertyView.$el.show();
            this._currentPropertyView = null;
            this._currentEditPropertyView && this._currentEditPropertyView.remove();
            this._currentEditPropertyView = null;
        },

        renderAdvancedProperty: function(advancedPropertyModel) {
            var advancedPropertyView = new AdvancedPropertyView({model: advancedPropertyModel});
            this.$('tbody').append(advancedPropertyView.$el);
            this.listenTo(advancedPropertyView, 'edit', this.onEdit);
            return advancedPropertyView;
        },

        addAdvancedPropertyView: function(advancedPropertyModel) {
            var view = this.renderAdvancedProperty(advancedPropertyModel);
            this._subviews.push(view);
        },

        showAddBtn: function() {
            this.$('.addNewItem').show();
        },

        hideAddBtn: function() {
            this.$('.addNewItem').hide();
        },

        onEdit: function(advancedPropertyView) {
            var self = this;

            if (this.isEditing) {
                this.confirmationDialog.setContent(i18n['ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_STOP_EDITING']);
                this.confirmationDialog.open();
                this.calculateZIndexes();
                this.listenToOnce(this.confirmationDialog, 'button:yes', function() {
                    self.showEditAdvancedPropertyView(advancedPropertyView);
                });
            } else {
                this.showEditAdvancedPropertyView(advancedPropertyView);
            }
        },

        onCancel: function(sender, model, originalValues) {
            //revert changes if any
            model.set(originalValues);

            this.removeEditAdvancedPropertyView();
        },

        onCollectionReset: function () {
            //remove all subviews
            _.invoke(this._subviews, 'remove');

            this.collection.each(this.addAdvancedPropertyView, this);
        },

        onCollectionValid: function() {
            this.removeEditAdvancedPropertyView();
        },

        onCollectionValidationError: function(collection, model, errors) {
            var self = this, alertDialog;

            if (errors.message === collection.validationMessages.DUPLICATE_MODEL_EDIT) {
                //Model name after edition is conflicting with name of the other element in collection
                //inform about this but do nothing with it
                alertDialog = new AlertDialog({
                    message: i18n["ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_PROPERTY_ALREADY_EXISTS_NO_OVERRIDE"]
                        .replace('{0}', model.get('name'))
                });
                this.listenToOnce(alertDialog, 'button:close', function() {
                    alertDialog.remove();
                });
                alertDialog.open();
                this.calculateZIndexes();
            } else if (errors.message === collection.validationMessages.DUPLICATE_MODEL_ADD) {
                //Trying to add duplicate item
                //Ask for replacement
                this.confirmationDialog.setContent(i18n['ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_PROPERTY_ALREADY_EXISTS']
                    .replace('{0}', model.get('name')));
                this.confirmationDialog.open();
                this.calculateZIndexes();
                this.listenToOnce(this.confirmationDialog, 'button:yes', function() {
                    collection.get(model).set({value: model.get('value')});
                    self.removeEditAdvancedPropertyView();
                }).listenToOnce(this.confirmationDialog, 'button:no', function() {
                    self.stopListening(self.confirmationDialog);
                });
            }
        },

        onSaveItem: function(sender, advancedPropertyModel) {
            this.collection.add(advancedPropertyModel);
        },

        onDelete: function(sender, model) {
            var self = this;

            this.confirmationDialog.setContent(i18n['ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_CONFIRM_DELETE_PROPERTY'].replace('{0}', model.get('name')));
            this.confirmationDialog.open();
            this.calculateZIndexes();
            this.listenToOnce(this.confirmationDialog, 'button:yes', function() {
                model.trigger("destroy", model);
                self._subviews = _.reject(self._subviews, function(view) {
                    return sender === view;
                });
            });
            this.listenToOnce(this.confirmationDialog, 'button:no', function() {
                self.stopListening(self.confirmationDialog);
            });
        },

        addNewItem: function() {
            this.showEditAdvancedPropertyView();
        },

        scrollTo: function($el) {
            var $tableContainer = jQuery('.table-container');

            $tableContainer.animate({
                scrollTop: $el.position().top + $tableContainer.scrollTop() - 29 //29px floating header offset
            }, 1000);

            $el.find('input:first').focus();
        },

        showEditAdvancedPropertyView: function(advancedPropertyView) {

            //Create new edit view
            var editAdvancedPropertyView = advancedPropertyView ? new EditAdvancedPropertyView({model: advancedPropertyView.model}, {editMode: true}) : new EditAdvancedPropertyView({model: new AdvancedPropertyModel()});

            //bind events
            this.listenTo(editAdvancedPropertyView, "add edit", this.onSaveItem)
                .listenTo(editAdvancedPropertyView, "cancel", this.onCancel);

            //remove previous edit view if any
            this._currentEditPropertyView && this._currentEditPropertyView.remove();

            this.isEditing = true;
            this.hideAddBtn();
            this._currentEditPropertyView = editAdvancedPropertyView;

            if (!advancedPropertyView) {
                //append new view to the end of the properties list in table
                this.$('tbody').append(editAdvancedPropertyView.$el);
            } else {
                //show any previously hidden property view
                this._currentPropertyView && this._currentPropertyView.$el.show();

                this._currentPropertyView = advancedPropertyView;

                //insert edit view instead of of property view
                editAdvancedPropertyView.$el.insertAfter(advancedPropertyView.$el);
                advancedPropertyView.$el.hide();
            }

            //scroll to newly created property view
            this.scrollTo(editAdvancedPropertyView.$el);
        },

        removeEditAdvancedPropertyView: function() {
            if (this._currentEditPropertyView) {
                //stop listening to any events on edit view
                this.stopListening(this._currentEditPropertyView);
                this._currentEditPropertyView.remove();
                this._currentEditPropertyView = null;
            }

            this.showAddBtn();
            this.isEditing = false;

            if (this._currentPropertyView) {
                //show property view if any
                this._currentPropertyView && this._currentPropertyView.$el.show();
                this._currentPropertyView = null;
            }
        },

        remove: function() {
            _.invoke(this._subviews, 'remove');
            Backbone.View.prototype.remove.call(this);
        }
    });
});