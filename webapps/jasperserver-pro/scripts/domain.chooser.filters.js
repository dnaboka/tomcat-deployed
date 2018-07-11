/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* jshint undef: false*/

///////////////////////////
// Pre-Filters
///////////////////////////

dc.preFilters = {

    init : function() {
        var _this = dc.preFilters;
        dc.submitFormId = 'preFiltersForm';

        // Create Filter model controller.
        var filterModelController = new domain.FilterModelController(
                "filtersListId",
                domain.FilterEditor,
                localContext.rsInitOptions
        );
        // Init Fields tree
        _this.fields.init(filterModelController, function() {

            // Continue Filter model controller initialization.
            filterModelController.init();
            filterModelController.initDropContainer(['draggable']);
        });

        if (isSupportsTouch()) {
            var stepDisplay = document.getElementById('stepDisplayScrollWrapper');
            var fieldsTree = document.getElementById('fieldsTreeRoot');
            var filtersList = document.getElementById('filtersListId');

            new TouchController(stepDisplay, stepDisplay.parentNode,{absolute:true,scrollbars:true});
            new TouchController(fieldsTree, fieldsTree.parentNode);
            new TouchController(filtersList, filtersList.parentNode);
        }

        domain.resetTreeSelectionHandler.init(['#' + _this.fields.ITEMS_TREE_DOM_ID], function() {return [_this.fields.itemsTree]});
        disableSelectionWithoutCursorStyle($(document.body));
    }
};

dc.preFilters.fields = {
    ITEMS_TREE_DOM_ID : 'fieldsTreeRoot',
    TREE_DATA_PROVIDER : 'semantic-layer-query-tree-data-provider',

    itemsTree : null,

    init : function(filterModel, callback) {
        var _this = dc.preFilters.fields;
        _this.filterModel = filterModel;

        _this.itemsTree = domain.createItemsTree({
            treeId: _this.ITEMS_TREE_DOM_ID,
            providerId: _this.TREE_DATA_PROVIDER,
            templateDomId: "list_responsive_collapsible_fields",
            selectOnMousedown: !isIPad(),
            dragPattern: '.leaf .draggable'
        });

        _this.itemsTree.showTree(10, function() {
            _this.initTreeEvents();
            callback();
        });
    },

    initTreeEvents : function() {
        _.each(this.filterModel.treeEventFactory, function(handler, selector) {
            this.itemsTree.observe(selector, _.bind(handler, this.filterModel));
        }, this);
    }
};

var dc_filters = dc.preFilters;

//////////////////////////////
// Specific Filters Logic
//////////////////////////////
domain.chooser.FilterEditor = deepClone(domain.FilterEditor.prototype);

domain.chooser.FilterEditorPrototype = {
    initTemplate :  function() {
        domain.chooser.FilterEditor.initTemplate.call(this);
        this.lockStatusElement = this.editorTemplate.down('.editable');
    },

    /**
     * Refreshes editor fields according to model state.
     */
    fillinTemplate : function() {
        this.lockStatusElement.setValue(!!this.getOriginalValue().locked);
        domain.chooser.FilterEditor.fillinTemplate.call(this);
    },

    getValue : function() {
        var newFilterValue = domain.chooser.FilterEditor.getValue.call(this);
        newFilterValue.locked = !!this.lockStatusElement.getValue();
        return newFilterValue;
    }
};

Object.extend(domain.FilterEditor.prototype, domain.chooser.FilterEditorPrototype);
Object.extend(domain.NumberFilterEditor.prototype, domain.chooser.FilterEditorPrototype);
Object.extend(domain.StringFilterEditor.prototype, domain.chooser.FilterEditorPrototype);
Object.extend(domain.DateFilterEditor.prototype, domain.chooser.FilterEditorPrototype);
Object.extend(domain.BooleanFilterEditor.prototype, domain.chooser.FilterEditorPrototype);

//////////////////////////////////////
// Specific Filters Controller Logic
//////////////////////////////////////
domain.FilterModelController.addMethod('addFieldFilter', function(selectedNodes) {
    var filterItems = selectedNodes.collect(function(node) {
        return new domain.FilterItem({node : node});
    });
    var filterItem = filterItems.first();
    if (filterItem.type !== filterItems[1].type) {
        return;
    }
    filterItem.initFieldFilterItem(filterItems[1]);
    this.addFilter(filterItem);
});

////////////////////////////////////////////////
// Initialization entry point
////////////////////////////////////////////////
if (typeof require === "undefined") {
    document.observe('dom:loaded', dc.initialize.bind(dc));
}
