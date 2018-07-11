/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

////////////////////////////////
// Delete join validator
////////////////////////////////

/* jshint undef: false*/

dd_joins.deleteJoinValidator = {
    _DELETE_CALCFIELDS_TEMPLATE_ID: 'calcFieldsForJoinConfirmMessage',
    _CALC_FIELDS_DETAILS_LINK_ID: '#calcFieldsForJoinsDetails',
    _DELETE_FILTERS_TEMPLATE_ID: 'filtersForJoinConfirmMessage',
    _callback: null,
    _validateUnjoinedTableForCalcFields: null,
    _buildDataIslands: null,
    _getNotJoinedTablesAfterDeleting: null,
    _involvedFieldsIds: null,
    _involvedFieldsExpressionIds: null,

    /////////////////
    // Public
    /////////////////

    init: function(validateUnjoinedTableForCalcFields, buildDataIslands, getNotJoinedTablesAfterDeleting) {
        dd_joins.deleteJoinValidator._init
                .bind(dd_joins.deleteJoinValidator, validateUnjoinedTableForCalcFields, buildDataIslands, getNotJoinedTablesAfterDeleting)()
    },

    validate: function(joins, join, callback) {
        dd_joins.deleteJoinValidator._validate
                .bind(dd_joins.deleteJoinValidator, joins, join, callback)()
    },

    /////////////////
    // Private
    /////////////////

    _init: function(validateUnjoinedTableForCalcFields, buildDataIslands, getNotJoinedTablesAfterDeleting) {
        this._validateUnjoinedTableForCalcFields = validateUnjoinedTableForCalcFields;
        this._buildDataIslands = buildDataIslands;
        this._getNotJoinedTablesAfterDeleting = getNotJoinedTablesAfterDeleting;
    },

    _validate: function(joins, join, callback) {
        this._callback = callback;
        
        var lostTable = this._findLostTable(joins, join);


        if (lostTable) {
            this._validateUnjoinedTableForCalcFields(lostTable, this._validationCallback.bind(this, joins, join));
        } else {
            this._validateIfJoinFiledsUsedInfilters(joins, join);
        }        
    },

    _validationCallback: function(joins, join, json) {
        if ('success' === json) {
            this._validateIfJoinFiledsUsedInfilters(joins, join);
            return;
        }

        this._involvedFieldsIds = json.involvedFieldsIds;
        this._involvedFieldsExpressionIds = json.involvedFieldsExpressionIds;

        domain.confirmDialog.show(
                this._DELETE_CALCFIELDS_TEMPLATE_ID,
                this._validateIfJoinFiledsUsedInfilters.bind(this, joins, join),
                this._onCancel.bind(this),
                this._showAffectedResources.bind(this));
    },

    _validateIfJoinFiledsUsedInfilters: function(joins, join) {
        var tablesFromJoinUsedInFilters = this._getNotJoinedTablesAfterDeleting(joins, join);

        if (tablesFromJoinUsedInFilters.first()) {
            domain.confirmDialog.show(
                    this._DELETE_FILTERS_TEMPLATE_ID,
                    this._onOk.bind(this),
                    this._onCancel.bind(this),
                    this._showAffectedResources.bind(this));
        } else {
            this._onOk();
        }
    },

    _onOk: function() {
        this._callback
        && this._callback(this._involvedFieldsIds, this._involvedFieldsExpressionIds);
    },

    _onCancel: function() {
        //do nothing
    },

    _showAffectedResources: function(element) {
        if (domain.elementClicked(element, this._CALC_FIELDS_DETAILS_LINK_ID)) {
            domain.detailsDialog.show(this._involvedFieldsExpressionIds);
            return true;
        }
    },

    _findLostTable: function(joins, join) {
        var oldIslands = this._buildDataIslands(joins);
        var newIslands = this._buildDataIslands(joins.without(join));

        var lostTable = null;
        oldIslands.each(function(oldIsland) {
            oldIsland.each(function(oldTable) {
                var tableFound = false;

                newIslands.each(function(newIsland) {
                    newIsland.each(function(newTable) {
                        if (oldTable == newTable) {
                            tableFound = true;
                        }
                    });
                });

                if (!tableFound) {
                    lostTable = oldTable;
                    throw $break;
                }
            });

            if (lostTable) {
                throw $break;
            }
        });

        return lostTable;
    }
};

////////////////////////////////
// Create join validator
////////////////////////////////
dd_joins.createJoinValidator = {
    _CREATE_COMPOSITE_KEY: 'createCompositeKeyConfirmMessage',
    _callback: null,

    /////////////////
    // Public
    /////////////////

    validate: function(leftField, rightField, existingJoins, callback) {
        dd_joins.createJoinValidator._validate
                .bind(dd_joins.createJoinValidator, leftField, rightField, existingJoins, callback)()
    },

    /////////////////
    // Private
    /////////////////

    _validate: function(leftField, rightField, existingJoins, callback) {
        this._callback = callback;

        var leftTableId = leftField.parent.param.id;
        var rightTableId = rightField.parent.param.id;

        var tablesAlreadyJoined = false;

        existingJoins.each(function(join) {
            var leftTablePresentInJoin =
                    (join.left.table.id === leftTableId || join.right.table.id === leftTableId);

            var rightTablePresentInJoin =
                    (join.left.table.id === rightTableId || join.right.table.id === rightTableId);

            if (leftTablePresentInJoin && rightTablePresentInJoin) {
                tablesAlreadyJoined = true;
                throw $break;
            }
        });

        if (!tablesAlreadyJoined) {
            this._onOk();
            return;
        }

        domain.confirmDialog.show(
                this._CREATE_COMPOSITE_KEY,
                this._onOk.bind(this),
                this._onCancel.bind(this),
                null);
    },

    _onOk: function() {
        this._callback && this._callback();
    },

    _onCancel: function() {
        //do nothing
    }
};

///////////////////////////////////
// Check design validator
///////////////////////////////////

dd_joins.checkDesignValidator = {
    _INVALID_DESIGN_TEMPLATE_DOM_ID: 'invalidDesignConfirmMessage',
    _INVALID_DESIGN_LINK_ID: '#designDetails',
    _DONE_BUTTON_ID: 'done',

    _callback: null,
    _validationCallback: null,
    _errorMessage: null,
    _showConfirmation: null,

    ////////////////////////
    // Public
    ////////////////////////

    init: function(successCallback) {
        dd_joins.checkDesignValidator._init.bind(dd_joins.checkDesignValidator)(successCallback);
    },

    validate: function(showConfirmation, callback) {
        dd_joins.checkDesignValidator._validate.bind(dd_joins.checkDesignValidator, showConfirmation, callback)();
    },

    ////////////////////////
    // Private
    ////////////////////////

    _init: function(successCallback) {
        this._validationCallback = successCallback;
    },

    _validate: function(showConfirmation, callback) {
        this._callback = callback;
        this._showConfirmation = showConfirmation;
        dd.emptySetsValidator.validate(this._emptySetsCallback.bind(this));
    },

    _emptySetsCallback: function(json) {
        if (json === 'empty') {
            domain.enableButton(this._DONE_BUTTON_ID, false);
        }

        dd.checkDesign.bind(dd, this._checkDesignCallback.bind(this))();
    },

    _checkDesignCallback: function(json) {
        this._validationCallback(json);

        if ('success' === json) {
            this._callback ? this._callback() : dialogs.systemConfirm.show(domain.getMessage('designIsValid'));
        } else {
            this._errorMessage = json.errorMessage;

            var usedResources = domainUtil.getUsedResourcesList(json.errorMessage, domain._messages['ITEM_BEING_USED_BY_RESOURCE']);
            var errorMessage;
            if (usedResources.length || domainUtil.indexOfNoAccessMessage(json.errorMessage, domain._messages['resourcesWithNoAccess']) > -1) {
                errorMessage = domainUtil.getUsedResourcesFormattedMessage(usedResources, json.errorMessage, {
                    "resource.label": domain._messages["resource.label"],
                    "field.label": domain._messages["field.label"],
                    "ITEM_BEING_USED_BY_RESOURCE": domain._messages['ITEM_BEING_USED_BY_RESOURCE'],
                    "resourcesWithNoAccess": domain._messages['resourcesWithNoAccess']
                })
            } else {
                errorMessage = this._errorMessage;
            }

            if (!this._showConfirmation) {
                domain.detailsDialog.show(errorMessage);
            } else {
                if (usedResources.length || domainUtil.indexOfNoAccessMessage(json.errorMessage, domain._messages['resourcesWithNoAccess']) > -1) {
                    domain.confirmDialog.show(
                        this._INVALID_DESIGN_TEMPLATE_DOM_ID,
                        this._onOk.bind(this),
                        this._onCancel.bind(this),
                        _.bind(function (element) {
                            this._showAffectedResources(element, errorMessage);
                        }, this),
                        domain.confirmDialog.MODE_YES_NO
                    );
                } else {
                    domain.detailsDialog.show(errorMessage);
                }
            }
        }
    },

    _onOk: function() {
        this._callback && this._callback();
    },

    _onCancel: function() {
    },

    _showAffectedResources: function(element, errorMessage) {
        if (domain.elementClicked(element, this._INVALID_DESIGN_LINK_ID)) {
            domain.detailsDialog.show(errorMessage);
            return true;
        }
    }
};
