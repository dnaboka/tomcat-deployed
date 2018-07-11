/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

////////////////////////////////////
// Common domain designer logic
////////////////////////////////////

/* jshint undef: false*/

domain.designer = {
    FLOW_ID: 'domainDesignerFlow',
    CREATE_DS_FLOW: 'createSLDatasourceFlow',
    TABLES_VIEW: 'domainDesigner_tables',
    DERIVED_TABLES_VIEW: 'domainDesigner_derivedTables',
    JOINS_VIEW: 'domainDesigner_joins',
    CALC_FIELDS_VIEW: 'domainDesigner_calculatedFields',
    FILTERS_VIEW: 'domainDesigner_filters',
    DISPLAY_VIEW: 'domainDesigner_display',
    ACTION_MODEL_TAG: 'domainDesignerActionModel',
    TREE_DRAG_PATTERN: '.draggable',
    ITEM_KEY_BLACKLIST_REGEX_PATTERN: /[-+='"!#$%^&,<> %:;?{}@()|\*\[\]\/\\]/,
    ITEM_ID_BLACKLIST_REGEX_PATTERN:  /[-+='"!%^&<> %.:;?{}()|\*\[\]\/\\]/,

    formDomId: 'stepDisplayForm',

    currentPage: null,
    flowExecutionKey: null,
    hasSchemas: false,
    presentationSelected: false,
    unsavedChangesPresent: false,

    derivedTableQueryRegex: /^\s*select\s+([^\s]+(\s+|$)){3,}|^\s*\{\s*attribute\s*\('.+'\)\s*\}\s*$/ig,

    initialize: function() {
        //layoutModule.resizeOnClient('fields', 'filters');
        webHelpModule.setCurrentContext("domain");

        var options = localContext.domainInitOptions;
        this.flowExecutionKey = options.flowExecutionKey;
        this.unsavedChangesPresent = options.unsavedChangesPresent;
        this.allowDesignerCloseWithValidationErrors = options.allowDesignerCloseWithValidationErrors;

        var dataSourceId = options.dataSourceId;
        if (!dataSourceId && options.dataSourcesList && options.dataSourcesList.first()) {
            dataSourceId = options.dataSourcesList.first().id;
        }

        //Domain designer is only available if datasource is selected
        if (!dataSourceId) {
            this.redirectToCreateDomain();
            return;
        }
        
        this.presentationSelected = options.presentationSelected;

        var schemasList = options.datasourcesProperties[dataSourceId] ? options.datasourcesProperties[dataSourceId].schemas : null;
        this.hasSchemas = schemasList && schemasList.first();

        domain.registerClickHandlers([
            this.flowControlsClickEventHandler.bind(this),
            this.stopEventForToolbarButtonsClickEventHandler.bind(this)]);

        domain.confirmDialog.init();
        domain.detailsDialog.init();

        this.currentPage = document.body.identify();
        var module = this.pageInitFactory[this.currentPage]();
        this.initModule(module, options);
    },

    initModule: function(module, options) {
        if (!module) {
            return;
        }

        module.fillForm && (dd.fillForm = module.fillForm.bind(module));
        module.getValidationPostData && (dd.getValidationPostData = module.getValidationPostData.bind(module));
        module.getCheckDesignValidator && (dd.getCheckDesignValidator = module.getCheckDesignValidator.bind(module));
        module.exportEnabled && (dd.exportEnabled = module.exportEnabled.bind(module));
        module.exportBundleStub && (dd.exportBundleStub = module.exportBundleStub.bind(module));
        dd.initToolbar(module.toolbarActionMap);
        module.init.bind(module)(options);
    },
    
    initToolbar: function(extendedActions) {
        this.toolbarActionMap = Object.extend(this.toolbarActionMap, extendedActions);
        
        toolbarButtonModule.ACTION_MODEL_TAG = this.ACTION_MODEL_TAG;
        toolbarButtonModule.initialize(this.toolbarActionMap);
    },

    redirectToCreateDomain: function() {
        document.location = buildActionUrl({flowId: this.CREATE_DS_FLOW});
    },

    //By default no hidden inputs are filled
    fillForm: function() {
    },

    //By default post data is empty 
    getValidationPostData: function() {
        return {};
    },

    //By default post data is empty
    getCheckDesignValidator: function() {
        return dd.checkDesignValidator;
    },

    flowControlsClickEventHandler: function(element) {
        var eventHandled = false;
        this.flowControlsEventMap.each(function(pair) {
            if (domain.elementClicked(element, pair.key)) {
                var flowControlObject = pair.value;
                eventHandled = true;

                if (this.currentPage === flowControlObject.returnOnPage) {
                    throw $break;
                }

                flowControlObject.flowExecutionKey = this.flowExecutionKey;

                var callback = function() {
                    delete flowControlObject.returnOnPage;
                    delete flowControlObject.performValidation;
                    flowControlObject.flowId = this.FLOW_ID;
                    domain.submitForm(this.formDomId, flowControlObject, this.fillForm);
                };

                var showConfirmation = pair.key === "#done" && this.allowDesignerCloseWithValidationErrors;

                flowControlObject.performValidation
                        ? this.getCheckDesignValidator().validate(showConfirmation, callback.bind(this))
                        : callback.bind(this)();

                throw $break;
            }
        }.bind(this));

        return eventHandled;
    },

    stopEventForToolbarButtonsClickEventHandler: function(element) {
        var eventHandled = false;
        $H(this.toolbarActionMap).each(function(pair) {
            if (domain.elementClicked(element, '#' + pair.key)) {
                eventHandled = true;
                throw $break;
            }
        }.bind(this));

        return eventHandled;
    },

    //////////////////////////////////////
    // Common domain designer AJAX calls
    //////////////////////////////////////

    checkDesign: function(callback, params) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'validateSchema'
        };

        domain.sendAjaxRequest(urlData, this.getValidationPostData(), callback, params);
    },

    checkForEmptySets: function(callback) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'checkForEmptySets'
        };

        domain.sendAjaxRequest(urlData, {}, callback);
    },

    deleteEmptySets: function(emptySets, callback) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'deleteEmptySets'
        };

        var postData = {
            emptySets: Object.toJSON(emptySets)
        };

        domain.sendAjaxRequest(urlData, postData, callback);
    },

    exportToXml: function(exportSchemaPrefixes) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'exportToXML'
        };

        if (this.hasSchemas) {
            urlData.exportSchemaPrefix = !!exportSchemaPrefixes;
        }

        domain.submitForm(this.formDomId, urlData, null);
    },

    generateAndDownloadBundles: function(generateDescriptionKeys, generateLabelKeys, callback, callbackDeferred) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'bundle'
        };

        var postData = {
            generateDescrKey: !!generateDescriptionKeys,
            generateLabelKey: !!generateLabelKeys
        };

        var internalCallback = function(json) {
            if ('success' === json) {
                // if callback deferred is provided, then this.downloadBundleStubs() function (with form submit inside)
                // should be executed after callback is done.
                // This trick is needed for Chrome browser only. Otherwise all ajax requests inside callback() are cancelled.
                // See bug #27212 for details.
                if(callback && callbackDeferred){
                    callbackDeferred.done(this.downloadBundleStubs.bind(this));
                }else{
                    this.downloadBundleStubs();
                }
                callback && callback();
            }
        };

        domain.sendAjaxRequest(urlData, postData, internalCallback.bind(this));
    },

    downloadBundleStubs: function() {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'downloadBundleStubs'
        };

        domain.submitForm(this.formDomId, urlData, null);
    },

    validateForCalcFields: function(tableIds, isRealTables, callback) {
        var urlData = {
            flowExecutionKey: this.flowExecutionKey,
            eventId: 'validateDeletedTablesForCalcFields'
        };

        var postData = {
            deletedTablesIds: tableIds,
            isRealTables: isRealTables
        };

        domain.sendAjaxRequest(urlData, postData, callback);
    },

    changeTableAlias: function(oldAlias, newAlias, callback) {
        var aliasChangesMap = {};
        aliasChangesMap[oldAlias] = newAlias;

        var urlData = {
            flowExecutionKey: dd.flowExecutionKey,
            eventId: 'changeTableAlias'
        };

        var postData = {
            aliasChangesMap: Object.toJSON(aliasChangesMap)
        };

        domain.sendAjaxRequest(urlData, postData, callback);
    },

    ////////////////////////////////////
    // Common domain desinger functions
    ////////////////////////////////////
    createTreeNodesMap: function(tree) {
        var addToNodesMap = function(node, nodesMap) {
            if (!node) {
                return;
            }

            nodesMap[node.param.id] = node;
            if (node.isParent()) {
                node.childs.each(function(child) {
                    addToNodesMap(child, nodesMap);
                });
            }
        };

        tree.treeMap = {};
        tree.getRootNode().childs.each(function(child) {
            addToNodesMap(child, tree.treeMap);
        })
    },

    deleteNodesFromTreeById: function(nodeIds, tree, copyMoveController) {
        if (!nodeIds || !nodeIds.first()) {
            return;
        }

        var getChildrenCount = function(node) {
            return node.childs.length;
        };

        var hideNode = function(node) {
            return node.parent.removeChild(node);
        };

        var removeFromTreeMap = function(node) {
            delete tree.treeMap[node.param.id];
            if (node.isParent()) {
                node.childs.each(removeFromTreeMap)
            }
        };

        nodeIds.each(function(id) {
            var node = tree.treeMap[id];
            if (node) {
                copyMoveController.hide([node], getChildrenCount, hideNode);
                removeFromTreeMap(node);
            }
        }.bind(this));
    },

    getTablesUsedForFilters: function(usedTablesByItemId, nodes) {
        if (!nodes.first()) {
            return [];
        }

        var tablesUsedInFilters =
                nodes.findAll(function (node) {
                     if (!usedTablesByItemId) {
                         return false;
                     }

                     var tableItemId = node.param.extra.itemId;
                     return (usedTablesByItemId && usedTablesByItemId[tableItemId] && usedTablesByItemId[tableItemId].itemId === tableItemId);
                });


        return tablesUsedInFilters.collect(function(node) {
                    return node.param.extra.itemId;
               });
    },

    insertAtCaret: function(element, text, range) {
        if  (document.selection) { //IE - we need to pass range because selection is loosed when focus loosed
            if (!range) {
                range = document.selection.createRange();
            }

            if(range.parentElement() != element) {
                element.value += text;
                return false;
            }

            element.focus();
            range.text = text;
            range.collapse(false); //move cursor to the end of selection.
            range.select();
        } else if(Object.isNumber(element.selectionStart) && element.selectionStart >= 0) {
            var value = element.getValue();
            var start = element.selectionStart;
            var end   = element.selectionEnd;

            element.setValue(value.substr(0, start) + text + value.substr(end));
            element.focus();
            element.setSelectionRange(start, start + text.length);
        } else {
            element.value += text;
        }
    },

    emptyValidator: function(value) {
        return {
            isValid: value && value.strip(),
            errorMessage: domain.getMessage('field.empty')
        }
    },

    itemKeyValidator: function(message, value) {
        return {
            isValid: !value || (value.match(dd.ITEM_KEY_BLACKLIST_REGEX_PATTERN) == null),
            errorMessage: domain.getMessage(message)
        }
    },

    itemIdValidator: function(message, value) {
        return {
            isValid: !value || (value.match(dd.ITEM_ID_BLACKLIST_REGEX_PATTERN) == null),
            errorMessage: domain.getMessage(message ? message : "id.invalid")
        }
    },

    itemIdNotStartFromNumberValidator: function(value) {
        return {
            isValid: !value || (value.match(/^[0-9]/) == null),
            errorMessage: domain.getMessage("id.startFromNumber")
        }
    },

    escapeJsonValidator: function(value) {
        return {
            isValid: !value || !value.match(/[\?]+/g),
            errorMessage: domain.getMessage('field.invalid')
        }
    }
};

// Shorter alias for domain.designer object
var dd = domain.designer;

///////////////////////////////
// Shows confirmation message
// when exit domain designer
///////////////////////////////

dd.confirmAndLeave = function(){
    if (dd.isUnsavedChangesPresent()) {
        return confirm(domain.getMessage('exitMessage'));
    }

    return true;
};

dd.setUnsavedChangesPresent = function(present) {
    dd.unsavedChangesPresent = !!present;
},

dd.isUnsavedChangesPresent = function() {
    return dd.unsavedChangesPresent;
},

///////////////////////////////
// Toolbar integration
///////////////////////////////

//action array
dd.toolbarActionMap = {
    'checkDesign' : "dd.validateDesign",
    'exportSchema': "dd.exportSchema",
    'exportBundleStub': "dd.exportBundleStub"
};

dd.toolbarEnableMap = {
    'exportSchema': function() {return dd.exportEnabled()},
    'exportBundleStub': function() {return dd.exportEnabled()}
};

dd.updateToolBarButtons = function() {
    $H(dd.toolbarEnableMap).each(function(pair) {
        toolbarButtonModule.setButtonState(pair.key, pair.value());
    })
};

dd.exportSchema = function() {
    dd.exportSchemaValidator.validate(dd.exportToXml.bind(dd));
};

dd.isPresentationSelected = function() {
    return dd.presentationSelected;
};

dd.exportBundleStub = function() {
    dd.exportBundlesValidator.validate(dd.generateAndDownloadBundles.bind(dd));
};

dd.exportEnabled = function() {
    return dd.presentationSelected;
};

dd.validateDesign = function() {
    dd.getCheckDesignValidator().validate(false);
};

///////////////////////////////
// Factories
///////////////////////////////

dd.pageInitFactory = {
    'domainDesigner_tables': function() {
        return dd_tables;
    },

    'domainDesigner_derivedTables':function() {
        return dd_derivedTables;
    },

    'domainDesigner_joins': function() {
        return dd_joins;
    },

    'domainDesigner_calculatedFields': function() {
        return dd_calcFields;
    },

    'domainDesigner_filters': function() {
        return dd_filters;
    },

    'domainDesigner_display': function() {
        return dd_display;
    }
};

dd.flowControlsEventMap = $H({
    //sourceTab: {keepExecutionKey: true, eventId: 'cancel'},
    '#tablesTab': {returnOnPage: dd.TABLES_VIEW, eventId: 'tables'},
    '#derivedTablesTab': {returnOnPage: dd.DERIVED_TABLES_VIEW, eventId: 'query'},
    '#joinsTab': {returnOnPage: dd.JOINS_VIEW, eventId: 'joins'},
    '#calcFieldsTab': {returnOnPage: dd.CALC_FIELDS_VIEW, eventId : 'calcFields'},
    '#preFiltersTab': {returnOnPage: dd.FILTERS_VIEW, eventId: 'filters'},
    '#displayTab': {returnOnPage: dd.DISPLAY_VIEW, eventId: 'design'},
    '#done':  {eventId: 'done', performValidation: true},
    '#cancelButton':  {eventId: 'cancel'}
});
