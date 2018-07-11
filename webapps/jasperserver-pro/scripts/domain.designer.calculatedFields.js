/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

///////////////////////////////
// Domain Designer Calculated Fields
///////////////////////////////

/* jshint undef: false*/

dd.calculatedFields = {
    PAGE: 'calsFields',

    getValidationPostData: function() {
        return {
            page: this.PAGE
        }
    },
    
    fillForm: function() {
        $('unsavedChangesPresent').writeAttribute('value', dd.isUnsavedChangesPresent().toString());
    },

    ///////////////////////////////////////
    // Initialization methods
    ///////////////////////////////////////

    init: function(options) {
        dd.formDomId = 'calculatedFieldsForm';

        dd_calcFields.fields.init();
        dd_calcFields.editor.init(options);
    }
};

// Alias for dd.calculatedFields
var dd_calcFields = dd.calculatedFields;

///////////////////////////
// Fields Tree
///////////////////////////
dd_calcFields.fields = {
    ITEMS_TREE_DOM_ID : 'fieldsTreeRoot',
    TREE_DATA_PROVIDER : 'joinTreeDataProviderForCalcFields',

    itemsTree : null,

    init : function() {

        this.itemsTree = domain.createItemsTree({
            treeId: this.ITEMS_TREE_DOM_ID,
            providerId: this.TREE_DATA_PROVIDER,
            templateDomId: "list_responsive_collapsible_type_tables",
            nodeClass: domain.TablesNode,
            selectOnMousedown: true            
        });
        this.itemsTree.showTree(1, this.initTreeEvents.bind(this), domain.treeErrorHandler);

        domain.resetTreeSelectionHandler.init(['#' + this.ITEMS_TREE_DOM_ID], function() {return [this.itemsTree]}.bind(this));
    },

    treeEventFactory : {
        'leaf:dblclick' : function(e) {
            var node = e.memo.node;
            Event.stop(e);
            if (!node) {
                return;
            }
            var editor = dd_calcFields.editor;
            var calculatedField = new dd_calcFields.CalculatedField(node);
            editor.insertFieldReference(calculatedField);
            if (editor.mode === editor.EMPTY_MODE) {
                editor.edit(calculatedField);
            }
        }
    },

    initTreeEvents : function() {
        for (var eventName in this.treeEventFactory) {
            this.itemsTree.observe(eventName, this.treeEventFactory[eventName].bind(this));
        }
    },

    refreshTree : function(nodeId) {
        this.itemsTree.showTree(2, function() {
            if (nodeId) {
                var node = this.itemsTree.findNodeById(nodeId);
                this.itemsTree.openAndSelectNode(node.param.uri);
            }
        }.bind(this));
    }
    
};

///////////////////////////
// Editor Controller
///////////////////////////
dd_calcFields.editor = {
    // Inputs identifiers.
    FIELD_NAME_ELEMENT_ID : 'fieldName',
    DATA_TYPE_ELEMENT_ID : 'dataType',
    EXPRESSION_ELEMENT_ID : 'expression',
    // Buttons identifiers.
    SAVE_BUTTON_ID : 'saveField',
    CANCEL_BUTTON_ID : 'cancelField',
    DELETE_BUTTON_ID : 'deleteField',

    CONFIRM_DIALOG_ID : 'editFieldConfirmMessage',

    // Editor's states/modes
    EMPTY_MODE : 'empty',
    EDIT_MODE : 'edit',
    EDIT_ALLOWED: true, // flag if editing of the field is allowed

    init : function(options) {
        this.calculatedField = null;
        this.mode = this.EMPTY_MODE;

        this._setFieldsUsedByFilters(options.fieldsUsedByFilters[options.dataSourceId]);

        this._initControls();
        this._updateViewState();
        this._initHandlers();
    },

    edit : function(calculatedField) {
        this.calculatedField = calculatedField;
        this.mode = this.EDIT_MODE;
        this.EDIT_ALLOWED = true;
        if (this.calculatedField.isEdit()) {
            this._validateDeletion(function(fieldsIds) {
                // ATTENTION: BE AWARE: _validateDeletion() returns _singular_ value, not an array !
                // because it uses apply() to call this function, apply() converts correct array into
                // separate arguments for this function, so variable 'fieldsIds' is equal to the first element
                // of the returned array from _validateDeletion()
                // BUT because first element of that array is also array, the next line of code works good.
                // Just be aware that 'fieldsIds' must be named 'fieldsId'
                if (fieldsIds && fieldsIds.length > 0) {
                    domain.enableButton(this._saveButton, false);
                    domain.enableButton(this._deleteButton, false);
                    dialogs.systemConfirm.show(domain._messages['cannot_edit_field']);
                    this.EDIT_ALLOWED = false;
                }
            }.bind(this));
        } else {
            this.calculatedField.resetName();
        }
        this._updateViewState();
        this._nameInput.activate();
    },

    insertFieldReference : function(calculatedField) {
        dd.insertAtCaret(this._expressionInput, calculatedField.getExpressionId(), this.selectionRange);
    },

    /////////////////
    // Private
    /////////////////
    _initControls : function() {
        this._saveButton = $(this.SAVE_BUTTON_ID);
        this._cancelButton = $(this.CANCEL_BUTTON_ID);
        this._deleteButton = $(this.DELETE_BUTTON_ID);

        this._nameInput = $(this.FIELD_NAME_ELEMENT_ID);
        this._dataTypeInput = $(this.DATA_TYPE_ELEMENT_ID);
        this._expressionInput = $(this.EXPRESSION_ELEMENT_ID);

        this.selectionRange = null;

        this._elementTypesMap = $H({
            name : this._nameInput,
            expression : this._expressionInput
        });
    },

    _setFieldsUsedByFilters : function(fields) {
        this.fieldsUsedByFilters = $H(fields || {});
    },
    
    _updateViewState : function() {
        this._modelToTemplate();
        this._updateButtonsState();
    },

    _updateButtonsState : function() {
        switch (this.mode) {
            case this.EMPTY_MODE :
                    [this._saveButton, this._cancelButton, this._deleteButton].each(function(b){
                        domain.enableButton(b, false);
                    });
                break;
            case this.EDIT_MODE :
                domain.enableButton(this._cancelButton, true);

                if (this.EDIT_ALLOWED === true) {
                    domain.enableButton(this._saveButton, true);
                    domain.enableButton(this._deleteButton, this.calculatedField && this.calculatedField.isEdit());
                }
                break;
            default : throw("Unexpected Calculated Field editor's state: [#{mode}]"
                    .interpolate({mode : this.mode}));
        }
    },

    _discardPreviousEditing : function() {
        this.mode = this.EMPTY_MODE;
        this.calculatedField = null;
        this._updateViewState();
        this._clearAllErrors();
    },

    _modelToTemplate : function() {
        this._nameInput.setValue(this.calculatedField ? this.calculatedField.name : "");
        this._dataTypeInput.setValue(this.calculatedField ? this.calculatedField.type : "java.lang.String");
        this._expressionInput.setValue(this.calculatedField ? this.calculatedField.expression : "");
    },

    _templateToModel : function() {
        if (this.calculatedField) {
            this.calculatedField.setName(this._nameInput.getValue());
            this.calculatedField.setType(this._dataTypeInput.getValue());
            this.calculatedField.setExpression(this._expressionInput.getValue());
        } else {
            this.calculatedField = new dd_calcFields.CalculatedField(
                    this._nameInput.getValue(),
                    this._dataTypeInput.getValue(),
                    this._expressionInput.getValue());
        }
    },

    _save : function() {
        this._templateToModel();
        this._clearAllErrors();
        if (this._validate()) {
            if (this._isFieldNotUsedByFilter()) {
                this._sendValidationRequest();
            } else {
                this._showWarningDialog(domain.getMessage('confirm_filter_delete'),
                        this._sendValidationRequest.bind(this));
            }
        }
    },

    _validate : function() {
        return ValidationModule.validate([{
                validator : function(value) {
                    return domain.stringIdValidator(value, domain.getMessage('wrong_name_format'));
                },
                element : this._nameInput
        }]);
    },

    _isFieldNotUsedByFilter : function() {
        return !this.fieldsUsedByFilters.any(function(pair) {
            return this.calculatedField.oldName === pair.value.itemId;
        }, this);
    },

    _sendValidationRequest : function() {
        var data = {calculateField : Object.toJSON(this.calculatedField)};
        if (this.calculatedField.isEdit()) {
            data['oldCalcFieldName'] = this.calculatedField.getExpressionId();
        }
        dd_calcFields.sendAjaxRequest({eventId : 'validateCalcField', flowExecutionKey : dd.flowExecutionKey},
            data,
            function(buffer) {
                var successDiv = buffer.down('#validationSuccess');
                var warningDiv = buffer.down('#validationWarning');
                var errorDiv = buffer.down('#validationFailed');
                if (warningDiv) {
                    return this._showWarningDialog(warningDiv.innerHTML,
                            successDiv && this._doSave.bind(this, successDiv.innerHTML));
                }
                if (successDiv) {
                    return this._doSave(successDiv.innerHTML.replace(/\&amp;/g,'&'));
                }
                if (errorDiv) {
                    return this._handleValidationFailure(errorDiv.innerHTML, errorDiv.readAttribute('for'));
                }
            }.bind(this));
    },

    _doSave : function (result) {
        var validationObject = result.evalJSON()[0];

        if (this.calculatedField.isEdit()) {
            this._removeField(function() {
                var oldName = this.calculatedField.getExpressionId();
                validationObject['oldCalcFieldName'] = oldName;
                this._addCalculatedField(validationObject);
            }.bind(this));
        } else {
            this._addCalculatedField(validationObject);
        }
    },

    _handleValidationFailure : function(message, elementType) {
        this._showError(this._elementTypesMap.get(elementType), message);
    },

    _showWarningDialog : function(message, okCallback) {
        $(this.CONFIRM_DIALOG_ID).down('.message').update(message);
        var cancelCallback = function() {domain.confirmDialog.hideForDetails()};
        domain.confirmDialog.show(
            this.CONFIRM_DIALOG_ID,
            okCallback || cancelCallback,
            cancelCallback,
            null,
            domain.confirmDialog.MODE_YES_NO
        );
    },

    _addCalculatedField : function(validationObject) {
        dd.setUnsavedChangesPresent(true);
        validationObject['calculateField'] = Object.toJSON(this.calculatedField);

        dd_calcFields.sendAjaxRequest(
            {eventId : 'createCalcField', flowExecutionKey : dd.flowExecutionKey},
            validationObject, this._saveFieldHandler.bind(this));
    },

    _saveFieldHandler : function(buffer) {
        var field = buffer.innerHTML.replace(/\&amp;/g,'&').evalJSON()[0];
        dd_calcFields.fields.refreshTree(field.id);

        var messageKey = this.calculatedField.isEdit() ? 'calculated_field_edited' : 'calculated_field_added';
        dialogs.systemConfirm.show(domain.getMessage(messageKey, {field: field.id}));

        this._discardPreviousEditing();
    },

    _cancel : function() {
        this._discardPreviousEditing();
    },

    _remove : function() {
        var removeField = function() {
            this._validateDeletion(function() {
                this._removeField(function() {
                    dd_calcFields.fields.refreshTree();
                    dialogs.systemConfirm.show(domain.getMessage('calculated_field_removed',
                            {field: this.calculatedField.getExpressionId()}));
                    this._discardPreviousEditing();
                }.bind(this));
            }.bind(this));
        }.bind(this);

        // check that field is not used by filters
        this._isFieldNotUsedByFilter()
                ? removeField()
                : this._showWarningDialog(domain.getMessage('confirm_filter_delete'), removeField);
    },

    _validateDeletion : function(callback) {
        dd_calcFields.sendAjaxRequest(
            {eventId : 'validateCalculateFieldDeletion', flowExecutionKey : dd.flowExecutionKey},
            {calculateField : this.calculatedField.getExpressionId()},
                function() {
                    var result = ['involvedFieldsIds', 'involvedFieldsExpressionIds'].collect(function(id) {
                        var element = $$('#ajaxbuffer #' + id)[0];
                        if (!element) {
                            return null;
                        }
                        return element.innerHTML.evalJSON();
                    });

                    callback.apply(this, result);
        }.bind(this));
    },

    _removeField : function(onSuccessHandler) {
        dd.setUnsavedChangesPresent(true);
        dd_calcFields.sendAjaxRequest(
            {eventId : 'deleteCalculatedField', flowExecutionKey : dd.flowExecutionKey},
            {fieldsToDelete : Object.toJSON([this.calculatedField.getExpressionId()])}, onSuccessHandler);
    },

    _initHandlers : function() {
        this.buttonHandlersMap = this._buttonHandlersFactory();
        domain.registerClickHandlers([this._clickHandler.bind(this)]);
        [this._nameInput, this._dataTypeInput, this._expressionInput].each(function(input) {
            input.observe('change', function() {
                if (this._nameInput.getValue() === '' &&
                        this._expressionInput.getValue() === '') {
                    this.mode = this.EMPTY_MODE;
                } else {
                    this.mode = this.EDIT_MODE;
                }
                this._updateButtonsState();
            }.bind(this))
        }, this);
        this._expressionInput.observe('mouseup', this._saveSelection.bind(this));

    },

    _clickHandler : function(element) {
        domain.basicClickHandler(element, this.buttonHandlersMap);
    },

    _buttonHandlersFactory : function() {
        return $H({
            '#saveField' : this._save.bind(this),
            '#cancelField' : this._cancel.bind(this),
            '#deleteField' : this._remove.bind(this)
        });
    },

    _saveSelection: function() {
        if (document.selection) {
            this.selectionRange = document.selection.createRange();
        }
    },

    _showError : function(element, message) {
        element && ValidationModule.showError(element, message);
    },

    _clearAllErrors : function() {
        this._elementTypesMap.each(function(pair) {
            ValidationModule.hideError(pair.value);
        });
    }
};

////////////////////////////////////////////
// Calculated Field
////////////////////////////////////////////
dd_calcFields.CalculatedField = function() {
    if (arguments.length === 0) {
        return this;
    } else if (arguments.length === 1) {
        var node = arguments[0];
        this.expression = node.param.extra.expression;
        if (this.expression) {
            this.expression = this.expression.unescapeHTML();
            this.setIsEdit(true);
        }
        this.oldName = this.name = node.param.extra.itemId;
        this.type = node.param.extra.JavaType;
        this.parentName = node.parent.param.extra.itemId;
    } else if (arguments.length === 3) {
        this.setName(arguments[0]);
        this.setType(arguments[1]);
        this.setExpression(arguments[2]);
    }
};

dd_calcFields.CalculatedField.addMethod('setName', function(name) {
    // TODO: cleanup raw name - domain.escape(name);
    this.name = name;
});

dd_calcFields.CalculatedField.addMethod('resetName', function() {
    this.oldName = this.name = "";
});

dd_calcFields.CalculatedField.addMethod('setType', function(type) {
    this.type = type;
});

dd_calcFields.CalculatedField.addMethod('setExpression', function(expression) {
    // TODO: cleanup raw name - domain.escape(name);
    this.expression = expression.unescapeHTML();
});


dd_calcFields.CalculatedField.addMethod('toJSON', function() {
    return {
        name : this.name,
        type : this.type,
        expression : dd_calcFields.normalizeLt(this.expression)
    };
});

dd_calcFields.CalculatedField.addMethod('setIsEdit', function(value) {
    this.isEditMode = value;
});

dd_calcFields.CalculatedField.addMethod('isEdit', function() {
    return !!this.isEditMode;
});
dd_calcFields.CalculatedField.addMethod('getExpressionId', function() {
    return [this.parentName, this.oldName || this.name].join(".").replace(/'/g, "''");
});


///////////////////////////
// Helper Methods
///////////////////////////
dd_calcFields.sendAjaxRequest = function(urlData, postData, callback) {
    domain.sendAjaxRequest(urlData, postData, callback, {
        mode: AjaxRequester.prototype.TARGETTED_REPLACE_UPDATE,
        fillLocation : 'ajaxbuffer'
    });
};

/**
 * Encompasses all &lt; signs with single white-spaces
 *
 * @param string Value that should be 'normalized'
 */
dd_calcFields.normalizeLt = function(string) {
    return string.replace(/\s*([<])\s*([^=])/g, " $1 $2");
};

///////////////////////////
// Entry point
///////////////////////////
if (typeof require === "undefined") {
    // prevent conflict with domReady plugin in RequireJS environment
    document.observe('dom:loaded', dd.initialize.bind(dd));
}
