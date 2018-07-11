/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author amalieie
 * @version: $Id: HyperlinkParametersSectionView.js 3572 2015-11-27 14:14:26Z amalieie $
 */

    ////////////////////////////////////////////////////////////////
    // Hyperlink Parameters Section View
    ////////////////////////////////////////////////////////////////

define(function(require) {
    /* global dialogs */
    "use strict";

    var _ = require("underscore"),
        jQuery = require("jquery"),
        Backbone = require("backbone"),
        i18n = require("bundle!DashboardBundle"),
        HyperlinkParameterView = require("./HyperlinkParameterView"),
        HyperlinkParameterModel = require("../model/HyperlinkParameterModel"),
        EditHyperlinkParameterView = require("./EditHyperlinkParameterView"),
        ConfirmationDialog = require("common/component/dialog/ConfirmationDialog"),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        HyperlinkParametersCollection = require("../collection/HyperlinkParametersCollection"),
        templateHyperlinkParametersSection = require("text!../template/HyperlinkParametersSectionTemplate.htm");

    require("css!attributes.css");

    return Backbone.View.extend({
        className: 'hyperlinkPropertiesSection', template: _.template(templateHyperlinkParametersSection),

        initialize: function() {
            this._subviews = [];

            this.collection = new HyperlinkParametersCollection();
            this.confirmationDialog = new ConfirmationDialog();

            this.listenTo(this.collection, 'add', this.addHyperlinkParameterView);
            this.listenTo(this.collection, 'reset', this.onCollectionReset);
            this.listenTo(this.collection, 'validation:invalid', this.onCollectionValidationError);
            this.listenTo(this.collection, 'validation:valid', this.onCollectionValid);

            this.render();
        },

        events: {
            "click .addNewItem": "addNewItem"
        },

        render: function() {
            this.$el.html(this.template({i18n: i18n}));

            return this;
        },

        /**
         * Fills parameters view with provided data
         * @public
         */
        reset: function(properties) {
            this.collection.reset(_.map(properties, function(element){
                return {name: element.id, value: element.defaultValue && element.defaultValue[0]};
            }));
        },

        /**
         * Returns json-like representation of parameters
         * @public
         */
        toJSON: function() {
            return _.map(this.collection.toJSON(), function(element){
                return {id: element.name, label: element.name, defaultValue: [element.value]};
            });
        },

        /**
         * Resets state of parameters view
         * @public
         */
        resetState: function() {
            this.isEditing = false;
            this.showAddBtn();
            this._currentPropertyView && this._currentPropertyView.$el.show();
            this._currentPropertyView = null;
            this._currentEditPropertyView && this._currentEditPropertyView.remove();
            this._currentEditPropertyView = null;
        },

        renderHyperlinkParameter: function(hyperlinkParameterModel) {
            var hyperlinkParameterView = new HyperlinkParameterView({model: hyperlinkParameterModel});
            this.$('tbody').append(hyperlinkParameterView.$el);
            this.listenTo(hyperlinkParameterView, 'edit', this.onEdit);
            this.listenTo(hyperlinkParameterView, 'delete', this.onDelete);
            return hyperlinkParameterView;
        },

        addHyperlinkParameterView: function(hyperlinkParameterModel) {
            var view = this.renderHyperlinkParameter(hyperlinkParameterModel);
            this._subviews.push(view);
        },

        showAddBtn: function() {
            this.$('.addNewItem').show();
        },

        hideAddBtn: function() {
            this.$('.addNewItem').hide();
        },

        onEdit: function(hyperlinkParameterView) {
            var self = this;

            if (this.isEditing) {
                this.confirmAbort(function () {
                    self.showEditHyperlinkParameterView(hyperlinkParameterView);
                });
            } else {
                this.showEditHyperlinkParameterView(hyperlinkParameterView);
            }
        },

        confirmAbort: function (onOk, onCancel) {
            var self = this;

            this.confirmationDialog.setContent(i18n['dashboard.component.dialog.properties.hyperlinks.stop.editing']);
            this.confirmationDialog.open();
            this.listenToOnce(this.confirmationDialog, 'button:yes', function() {
                self.stopListening(self.confirmationDialog, 'button:no');
                self.resetState();
                onOk && onOk();
            });
            this.listenToOnce(this.confirmationDialog, 'button:no', function() {
                self.stopListening(self.confirmationDialog, 'button:yes');
                onCancel && onCancel();
            });
        },

        onCancel: function(sender, model, originalValues) {
            //revert changes if any
            model.set(originalValues);

            this.removeEditHyperlinkParameterView();
        },

        onCollectionReset: function () {
            //remove all subviews
            _.invoke(this._subviews, 'remove');

            this.collection.each(this.addHyperlinkParameterView, this);
        },

        onCollectionValid: function() {
            this.removeEditHyperlinkParameterView();
        },

        onCollectionValidationError: function(collection, model, errors) {
            var self = this, alertDialog;

            if (errors.message === collection.validationMessages.DUPLICATE_MODEL_EDIT) {
                //Model name after edition is conflicting with name of the other element in collection
                //inform about this but do nothing with it
                alertDialog = new AlertDialog({
                    message: i18n["dashboard.component.dialog.properties.hyperlinks.parameter.exist.no.override"]
                        .replace('{0}', model.get('name'))
                });
                this.listenToOnce(alertDialog, 'button:close', function() {
                    alertDialog.remove();
                });
                alertDialog.open();
            } else if (errors.message === collection.validationMessages.DUPLICATE_MODEL_ADD) {
                //Trying to add duplicate item
                //Ask for replacement
                this.confirmationDialog.setContent(i18n['dashboard.component.dialog.properties.hyperlinks.parameter.exist']
                    .replace('{0}', model.get('name')));
                this.confirmationDialog.open();
                this.listenToOnce(this.confirmationDialog, 'button:yes', function() {
                    collection.get(model).set({value: model.get('value')});
                    self.removeEditHyperlinkParameterView();
                }).listenToOnce(this.confirmationDialog, 'button:no', function() {
                    self.stopListening(self.confirmationDialog);
                });
            }
        },

        onSaveItem: function(sender, hyperlinkParameterModel) {
            this.collection.add(hyperlinkParameterModel);
        },

        onDelete: function(sender, model) {
            var self = this;

            this.confirmationDialog.setContent(i18n['dashboard.component.dialog.properties.hyperlinks.delete.parameter'].replace('{0}', model.get('name')));
            this.confirmationDialog.open();
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

        addNewItem: function(ev) {
            this.showEditHyperlinkParameterView();
        },

        scrollTo: function($el) {
            var $tableContainer = jQuery('.table-container');

            $tableContainer.animate({
                scrollTop: $el.position().top + $tableContainer.scrollTop() - 29 //29px floating header offset
            }, 1000);

            setTimeout(function() {
                $el.find('input:first').focus();
            }, 0);
        },

        showEditHyperlinkParameterView: function(hyperlinkParameterView) {

            //Create new edit view
            var editHyperlinkParameterView = hyperlinkParameterView ? new EditHyperlinkParameterView({model: hyperlinkParameterView.model}, {editMode: true}) : new EditHyperlinkParameterView({model: new HyperlinkParameterModel()});

            //bind events
            this.listenTo(editHyperlinkParameterView, "add edit", this.onSaveItem)
                .listenTo(editHyperlinkParameterView, "cancel", this.onCancel);

            //remove previous edit view if any
            this._currentEditPropertyView && this._currentEditPropertyView.remove();

            this.isEditing = true;
            this.hideAddBtn();
            this._currentEditPropertyView = editHyperlinkParameterView;

            if (!hyperlinkParameterView) {
                //append new view to the end of the properties list in table
                this.$('tbody').append(editHyperlinkParameterView.$el);
            } else {
                //show any previously hidden property view
                this._currentPropertyView && this._currentPropertyView.$el.show();

                this._currentPropertyView = hyperlinkParameterView;

                //insert edit view instead of of property view
                editHyperlinkParameterView.$el.insertAfter(hyperlinkParameterView.$el);
                hyperlinkParameterView.$el.hide();
            }

            //scroll to newly created property view
            this.scrollTo(editHyperlinkParameterView.$el);
        },

        removeEditHyperlinkParameterView: function() {
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