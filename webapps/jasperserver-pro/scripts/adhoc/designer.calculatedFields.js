/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global dialogs, designerBase, adhocDesigner, adhocCalculatedFields, localContext, clientKey */

///////////////////////////////////
// Calculated fields
///////////////////////////////////

define(function(require) {

    var _ = require("underscore"),
        _dialog,
        i18n = _.extend(require('bundle!jasperserver_messages'),require('bundle!adhoc_messages')),
        CalculatedFieldsController = require("adhoc/calculatedFields/CalculatedFieldsController"),
        CalculatedFieldsService = require("adhoc/calculatedFields/CalculatedFieldsService");

    window.adhocCalculatedFields = {
        DIALOG_ID: "calcFieldMeasure",
        FIELDS_CONTAINER_ID: "#calculatedFields-container",

        calcFieldsService : new CalculatedFieldsService({clientKey : clientKey}),

        /*
         * Adhoc Dialog for Calculated Fields
         */
        showDialog: function(controller) {
            _dialog = $(this.DIALOG_ID);

            _dialog.down("button.doneButton").observe('click', controller.applyField.bind(controller));
            _dialog.down("button.cancelButton").observe('click', function(){
                controller.stop();
                this.closeDialog();
            }.bind(this));

            dialogs.popup.show(_dialog);
            _dialog.style.marginTop = '0';
            _dialog.style.top = '15px';

        },

        closeDialog: function(){
            Event.stopObserving(_dialog.down("button.doneButton"));
            Event.stopObserving(_dialog.down("button.cancelButton"));
            dialogs.popup.hide(_dialog);
        },

        setDialogLabels: function(isMeasure, isEdit) {
            var labelsMap = isMeasure ? {
                dialogHeader: isEdit ? "ADH_401_DIALOG_HEADER_EDIT_CUSTOM_MEASURE" : "ADH_401_DIALOG_HEADER_NEW_CUSTOM_MEASURE",
                okButtonLabel: isEdit ? "button.save" : "ADH_430_BUTTON_CREATE_MEASURE"
            } : {
                dialogHeader: isEdit ? "ADH_401_DIALOG_HEADER_EDIT_CUSTOM_FIELD" : "ADH_401_DIALOG_HEADER_NEW_CUSTOM_FIELD",
                okButtonLabel:  isEdit ? "button.save" : "ADH_430_BUTTON_CREATE_FIELD"
            };
            $(_dialog.down(".header.mover > .title")).update(i18n[labelsMap.dialogHeader]);
            $(_dialog.down(".footer button.doneButton span.wrap")).update(i18n[labelsMap.okButtonLabel]);
        },


        /*
         *  Field actions
         */
        createField: function(kind) {
            var controller = new CalculatedFieldsController({
                element: this.FIELDS_CONTAINER_ID,
                service:  this.calcFieldsService
            });

            controller.listenTo(controller, "field:loaded", this.setDialogLabels.bind(this));
            controller.listenTo(controller, "field:applied", function(response){
                controller.stop();
                this.closeDialog();
                this.createCustomFieldCallback(response);
            }.bind(this));

            this.showDialog(controller);

            controller.start({
                editingMode: false,
                kind: kind
            });

        },

        updateField: function() {
            var selectedObject = designerBase.getSelectedObject();
            var selectedFieldName = selectedObject.model ? selectedObject.model.fieldName : adhocDesigner.getNameForSelected(selectedObject);

            if (selectedFieldName == null) {
                throw 'The field "' + selectedFieldName + '" is not found.';
            }

            var controller = new CalculatedFieldsController({
                element: this.FIELDS_CONTAINER_ID,
                service:  this.calcFieldsService
            });

            controller.listenTo(controller, "field:loaded", this.setDialogLabels.bind(this));
            controller.listenTo(controller, "field:applied", function(response){
                controller.stop();
                this.closeDialog();
                this.updateCustomFieldCallback(response);
            }.bind(this));

            this.showDialog(controller);

            controller.start({
                editingMode: true,
                selectedFieldName: selectedFieldName
            });
        },

        deleteField : function() {
            var selectedObject = designerBase.getSelectedObject();
            var fieldName = adhocDesigner.getNameForSelected(selectedObject);
            if (!adhocDesigner.isInUse(fieldName)) {
                var callback = function(state){
                    this.deleteCustomFieldCallback(fieldName, selectedObject, state);
                    adhocDesigner.enableCanUndoRedo();
                }.bind(adhocCalculatedFields);

                this.calcFieldsService.remove(fieldName).done(_.bind(function(data, textStatus, jqXHR) {
                    if (jqXHR.status === 204) {
                        throw "Field not found.";
                    }
                    adhocCalculatedFields._updateState(callback);
                }, this));

            } else {
                throw "The field in use.";
            }
        },

        /*
         *  Callbacks
         */
        createCustomFieldCallback: function(newField) {
            var isMeasure = newField.kind === "MEASURE";

            dialogs.systemConfirm.show(i18n[isMeasure ? "ADH_435_CALCULATED_MEASURE_ADDED" : "ADH_435_CALCULATED_FIELD_ADDED"], 5000);

            // Update the fields tree and local context state.
            adhocCalculatedFields._updateState(function(state) {
                var oldSize = localContext.state.allColumns.length;

                adhocDesigner.updateState(state);

                adhocDesigner.enableCanUndoRedo();

                if (localContext.state.allColumns.length > oldSize) {
                    var newFieldId = newField.name;
                    var order = adhocDesigner.getFieldIndexByName(newFieldId);

                    // TODO: Get the dataType from newField's "type" property. Currently it has another format: "java.lang.String" while the Tree Node uses "String".
                    var dataType = adhocDesigner.findFieldByName(newFieldId).type;

                    // Add a new node to available fields tree
                    var metaNode = {
                        id: newFieldId,
                        label: newField.display,
                        type: 'com.jaspersoft.jasperserver.api.metadata.common.domain.NewNode',
                        uri: '/' + newFieldId,
                        cssClass: 'calculatedField',
                        order: order,
                        extra: {
                            id: newFieldId,
                            name: newFieldId,
                            isMeasure: isMeasure,
                            dimensionId: isMeasure ? adhocDesigner.MEASURES : newFieldId,
                            dataType: dataType
                        }
                    };
                    var targetTreeName = isMeasure ? "measuresTree" : "dimensionsTree";
                    adhocDesigner.addNodeToTree(metaNode, adhocDesigner[targetTreeName]);
                    adhocDesigner.updateAllFieldLabels();

                    adhocDesigner[targetTreeName + "Search"].setKeyword("");
                }
            });

        },

        updateCustomFieldCallback: function(field){
            var isMeasure = field.kind === "MEASURE";

            dialogs.systemConfirm.show(i18n[isMeasure ? "ADH_435_CALCULATED_MEASURE_UPDATED" : "ADH_435_CALCULATED_FIELD_UPDATED"], 5000);

            adhocCalculatedFields._updateState(function(state){
                adhocDesigner.updateState(state);
                adhocDesigner.enableCanUndoRedo();
                if (adhocDesigner.isInUse(field.name)) {
                    localContext.updateViewCallback(state);
                    adhocDesigner.filtersController.setFilters(state, {reset: true});
                }
                adhocDesigner.updateAllFieldLabels();
            });
        },

        deleteCustomFieldCallback: function(fieldName, nodeToDelete, state){
            var isMeasure = nodeToDelete.param.extra.isMeasure;

            dialogs.systemConfirm.show(i18n[isMeasure ? "ADH_435_CALCULATED_MEASURE_DELETED" : "ADH_435_CALCULATED_FIELD_DELETED"], 5000);

            var oldSize = localContext.state.allColumns.length;

            adhocDesigner.updateState(state);
            adhocDesigner.enableCanUndoRedo();

            if((localContext.state.allColumns.length < oldSize) && nodeToDelete){
                adhocDesigner.removeNodeFromTree(nodeToDelete);
                adhocDesigner.updateAllFieldLabels();
            }
        },

        /*
         *  Helpers
         */
        _updateState : function(handler) {
            designerBase.sendRequest(adhocDesigner.getControllerPrefix() + "_recompileQueryAndLoadState", [], function(state) {
                handler(state);
            });
        }
    };

    return window.adhocCalculatedFields;
});

