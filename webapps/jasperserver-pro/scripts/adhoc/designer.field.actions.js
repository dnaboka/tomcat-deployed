/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* jshint undef: false */

define(function(require) {

    var i18n = require('bundle!adhoc_messages'),
        adhocDesigner = require("adhoc/designer");

    /**
     * Used to add fields to the canvas
     * @param event
     */
    adhocDesigner.addFieldToCanvas = function(){
        if(localContext.getMode() === designerBase.TABLE){
            AdHocTable.addFieldAsColumn();
        }else if(localContext.getMode() === designerBase.CROSSTAB){
            localContext.addFieldAsLastMeasure();
        }else if(localContext.getMode() === designerBase.CHART){
            localContext.addFieldAsMeasure();
        }
    };
    /**
     * Check if field is numeric
     * @param fieldName
     */
    adhocDesigner.checkIfFieldIsNumeric = function(fieldName) {
        var col = adhocDesigner.findFieldByName(fieldName);
        return (col != null) && (col.type == 'Numeric');
    };
    /**
     * Used to check if a string is a valid number
     * @param number
     */
/*
    adhocDesigner.isValidNumericValue = function(number){
        var numberOfDecimalsPoints = 0;
        var indexOfDecimal = -1;
        var isValid = false;
    
        if (number.length > 0) {
            for (var index = 0; index < number.length; index++) {
                var character = number.charAt(index);
                if (isNaN(character) && (character === "," || character === ".")) {
                    numberOfDecimalsPoints++;
                    indexOfDecimal = index;
                }
            }
    
            isValid = !(numberOfDecimalsPoints > 1);
            if ((indexOfDecimal > -1) && isValid) {
                isValid = (indexOfDecimal < (number.length - 1));
            }
        }
    
        return {
            isValid: isValid,
            errorMessage: dynamicFilterInputError
        };
    };
*/
    /**
     * Check if selected fields are numeric
     */
    adhocDesigner.checkIfAllSelectedAreNumeric = function(){
        var fieldName = null;
        var selected = null;
    
        for (var index = 0; index < selObjects.length; index++){
            selected = selObjects[index];
            if(selected){
                if(selectionCategory.area === designerBase.AVAILABLE_FIELDS_AREA){
                    fieldName = selected.param.id;
                }else if(selectionCategory.area === designerBase.COLUMN_LEVEL){
                    fieldName = selected.header.getAttribute('data-fieldName');
                }else{
                    //must be table group, crosstab or chart//todo work in progress
                }
                if (!adhocDesigner.checkIfFieldIsNumeric(fieldName)) {
                    return false;
                }
            }
        }
        return true;
    };
    
    adhocDesigner.collectFields = function(nodes, includeSubSets, testFn){
        var fieldNames = [];
        for(var index = 0; index < nodes.length; index++){
            var node = nodes[index];
            if(node.isParent() && includeSubSets){
                fieldNames = fieldNames.concat(this.collectFields(node.childs, includeSubSets, testFn));
            }else{
                if (testFn) {
                    testFn(node.param.id) && fieldNames.push(node.param.id);
                } else {
                    fieldNames.push(node.param.id);
                }
            }
        }
    
        return fieldNames;
    };
    /**
     * Returns all fields of the adHocDesigner
     */
    adhocDesigner.getAllFields = function() {
        if (!isNotNullORUndefined(localContext.state.allColumns)) {
            return [];
        }

        return localContext.state.allColumns;
    };
    /**
     * Find the field by its name
     * @param fieldName
     */
    adhocDesigner.findFieldByName = function(fieldName) {
        var node = null;
        if(localContext.state.allColumns){
            localContext.state.allColumns.each(function(field){
                if(field.name){
                    if(field.name == fieldName){
                        node = field;
                        throw $break;
                    }
                }
            });
        }
    
        return node;
    };
    /**
     * Used to get the name of a field from the selected object
     * @param object
     */
    adhocDesigner.getNameForSelected = function(object) {
        if(selectionCategory.area === designerBase.AVAILABLE_FIELDS_AREA){
            return object ? object.param.id : '';
        }else if(object.chartMeasureId){
            return object.chartMeasureId;
        }else if(selectionCategory.area === designerBase.COLUMN_LEVEL){
            return object.header.getAttribute('data-fieldName');
        }else if(selectionCategory.area === designerBase.GROUP_LEVEL){
            return object.fieldName;
        }else if(selectionCategory.area === designerBase.ROW_GROUP_MENU_LEVEL || selectionCategory.area === designerBase.COLUMN_GROUP_MENU_LEVEL){
            return object.name;
        }else if(selectionCategory.area === designerBase.SUMMARY_LEVEL) {
            return object.model.name;
        }else if(selectionCategory.area === designerBase.LEGEND_MENU_LEVEL) {
            return object.legendName;
        }
    };
    /**
     * Get the field name of a selected object
     */
    adhocDesigner.getFieldName = function(){
        var so = designerBase.getSelectedObject();
        return so ? this.getNameForSelected(so) : '';
    };
    /**
     * Find the field index based on the field name
     * @param fieldName
     */
    adhocDesigner.getFieldIndexByName = function(fieldName) {
        if(isNotNullORUndefined(localContext.state.allColumns)){
            var size = localContext.state.allColumns.length;
            for (var i = 0; i < size; i++) {
                var f = localContext.state.allColumns[i];
                if (f.name == fieldName) {
                    return i;
                }
            }
        }
        return -1;
    };
    adhocDesigner.moveToDimensions = function () {
        if (selObjects.first()) {
            var nodes = selObjects.clone();
            adhocDesigner.moveToMeasuresOrAttributes(nodes);
            var ids = nodes.collect(function(node) {return node.param.id}).join(",");
            adhocDesigner.changeFieldAttributeOrMeasure(ids, "attribute");
        }
    };
    
    adhocDesigner.moveToMeasures = function () {
        if (selObjects.first()) {
            var nodes = selObjects.clone();
            adhocDesigner.moveToMeasuresOrAttributes(nodes);
            var ids = nodes.collect(function(node) {return node.param.id}).join(",");
            adhocDesigner.changeFieldAttributeOrMeasure(ids, "measures");
        }
    };
    
    /*
     * method to be called when a a field is selected from the available fields list
     * @param event
     * @param node
     */
    adhocDesigner.selectFromAvailableFields = function(event, node) {
        // If method was invoked not through event machinery, then simply add node to selection.
        if (!event) {
            this.addSelectedObject(event, node, false, true);
        }
        var isMultiSelect = this.isMultiSelect(event, designerBase.AVAILABLE_FIELDS_AREA);
        //update select area
        selectionCategory.area = designerBase.AVAILABLE_FIELDS_AREA;
        var isSelected = this.isAlreadySelected(node);
        this.addSelectedObject(event, node, isMultiSelect, isSelected);
    
        actionModel.setSelected(_.map(dynamicTree.trees[node.getTreeId()].selectedNodes, function(n) { return n.param.extra; }));
    
        //Event.stop(event); // iPad: Node of the tree stays selected after context menu has been opened.
    };
    
    /**
     * Update fields in use.
     * @param fieldName
     */
    adhocDesigner.updateFieldsInUse = function(fieldName){
        [].push.apply(localContext.state.fieldsInUse, fieldName);
    };
    
    /**
     * Remove fields from fields in use.
     * @param fieldNames - fields to remove
     */
    adhocDesigner.removeFromFieldsInUse = function(fieldNames){
        if (localContext.state.fieldsInUse) {
            localContext.state.fieldsInUse = _.difference(localContext.state.fieldsInUse, fieldNames);
        }
    };

    /**
     * Check to see if the field is currently in use
     * @param fieldName
     */
    adhocDesigner.isInUse = function(fieldName) {
        var inUse = _.find(localContext.state.fieldsInUse, function(usedField) {
            return usedField === fieldName;
        });
        return inUse || adhocDesigner.hasDependencyOnIt(fieldName);
    };

    adhocDesigner.isInError = function(fieldName) {
        var isInError = _.find(localContext.state.unresolvedMetadataReferences, function(usedField) {
            return usedField === fieldName;
        });
        return isInError;
    };
    
    /**
     * Used to create a new calculated field
     */
    adhocDesigner.createCalculatedField = function(){
        adhocCalculatedFields.createField("DIMENSION");
    };

    /**
     * Used to create a new calculated measure
     */
    adhocDesigner.createCalculatedMeasure = function(){
        adhocCalculatedFields.createField("MEASURE");
    };

    /**
     * Used to edit the calculated field
     */
    adhocDesigner.editCalculatedField = function(){
        adhocCalculatedFields.updateField();
    };

    /**
     * Used to delete a calculated field
     */
    adhocDesigner.deleteCalculatedField = function(){
        var selectedObject = designerBase.getSelectedObject();
        var confirmDialog = jQuery("#" + adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.DIALOG_ID);
        dialogs.popupConfirm.show(confirmDialog[0], false, {
            message: i18n["ADH_436_CALCULATED_FIELD_REMOVE_CONFIRM"] + ' "' + selectedObject.name.unescapeHTML() + '".',
            okButtonSelector: '#' + adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.OK_BUTTON_ID,
            cancelButtonSelector: '#' + adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID
        }).done(adhocCalculatedFields.deleteField.bind(adhocCalculatedFields));
    };
    
    /**
     * Used to determine if a selected object is a percent based calculated field
     */
    adhocDesigner.isPercentOfParentCalcSelected = function(object) {
        return adhocDesigner.isAggregateSelected(object);
        // TODO: make sure the logic is correct and get rid of duplicate function.
    };

    /**
     * Used to determine if a selected object is an aggregate
     */
    adhocDesigner.isAggregateSelected = function(object) {
        if(!object){
            object = designerBase.getSelectedObject();
        }
        if(object){
            var fieldName = adhocDesigner.getNameForSelected(object);
            var field = adhocDesigner.findFieldByName(fieldName)

            return field && field.aggregateField;
        }
        return false;
    };
    /**
     * Tests to see if field is a percent of parent calc.
     * @param fieldName
     */
    adhocDesigner.isPercentOfParentCalc = function(fieldName){
        // In new Calculated Fields (JRS 5.6) we have no formulaRef any more. Using aggregateField property instead
        // TODO: make sure the logic is correct and rename isPercentOfParentCalc() to isAggregateCalc()
        var field = adhocDesigner.findFieldByName(fieldName);
        return field && field.aggregateField;
    };
    /**
     * Check to see if the field has a dependency in another calculated field
     * @param fieldName
     */
    adhocDesigner.hasDependencyOnIt = function(fieldName) {
        var field = adhocDesigner.findFieldByName(fieldName);
        return field && field.isUsed;
    };

    /**
     * Used to update a calculated fields css leaf's
     */
    adhocDesigner.updateAllFieldLabels = function(){
        if (!isDesignView) {
            return;
        }
        var it = adhocDesigner;
        var trees = [it.dimensionsTree,it.measuresTree];

        _.each(trees,function(tree){
            _.each(it.getAllLeaves(null, tree),function(leaf) {
                var field = it.findFieldByName(leaf.param.id);
                if (field && field.isCustomField) {
                    adhocDesigner.updateTreeFieldLabel(leaf, field.defaultDisplayName);
                    leaf.param.cssClass = it.isInUse(leaf.param.id) ? 'calculatedField dependency' : 'calculatedField';
                    leaf.refreshStyle();
                }
            });
            tree.renderTree();
        })
    };

    adhocDesigner.updateTreeFieldLabel = function(nodeOrLeaf, label) {
        nodeOrLeaf.name = label.replace(/\\'/g, "'");
        nodeOrLeaf.param.label = label.replace(/\\'/g, "'");
    };

    return adhocDesigner;
});
