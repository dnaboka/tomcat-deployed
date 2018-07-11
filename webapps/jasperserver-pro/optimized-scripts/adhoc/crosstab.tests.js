AdHocCrosstab.canMoveToDimensions=function(){var e=selObjects.find(function(e){return localContext.isInUse(e.param.extra.id,e.param.extra.isMeasure)});return!e},AdHocCrosstab.canMoveToMeasures=function(){return AdHocCrosstab.canMoveToDimensions()},AdHocCrosstab.canSaveReport=function(){return localContext.isNonOlapMode()?localContext.state.hasMeasures:localContext.state.hasMeasures&&localContext.state.columnGroups.first()&&localContext.state.columnGroups.first().dimensionName!==localContext.NULL_DIMENSION},AdHocCrosstab.isGroupSelected=function(e){return!e.isMeasure},AdHocCrosstab.isRowGroupSelected=function(e){return"row"===e.axis&&!e.isMeasure},AdHocCrosstab.isColumnGroupSelected=function(e){return"column"===e.axis&&!e.isMeasure},AdHocCrosstab.isCurrentDateType=function(e){var t=AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup());return t?t.categorizerName==e:!1},AdHocCrosstab.isSelectedMeasureNumeric=function(){var e=AdHocCrosstab.getSelectedMeasure();if(e){var t=adhocDesigner.getSuperType(e.type);return"int"==t||"dec"==t}return!1},AdHocCrosstab.isDateType=function(){return AdHocCrosstab.isDateTimeType("date")},AdHocCrosstab.isTimestampType=function(){return AdHocCrosstab.isDateTimeType("timestamp")},AdHocCrosstab.isTimeType=function(){return AdHocCrosstab.isDateTimeType("time")},AdHocCrosstab.isDateTimeType=function(e){var t=adhocDesigner.getSelectedColumnOrGroup();if(t){var r=AdHocCrosstab.isGroupSelected(t),o=AdHocCrosstab.getSelectedGroup(t);if(o){var a=o.canReBucket===!0,s=o.type===e;return r&&a&&s}}return!1},AdHocCrosstab.isSelectedMeasureItemType=function(e){var t=AdHocCrosstab.getSelectedMeasure();if(t){var r=adhocDesigner.getSuperType(t.type);return r===e}return!1},AdHocCrosstab.isSelectedMeasureMask=function(e){var t=AdHocCrosstab.getSelectedMeasure();return t?t.functionMaskOrDefault===e||!t.functionMaskOrDefault&&e===defaultMasks[adhocDesigner.INTEGER_TYPE_DISPLAY]:!1},AdHocCrosstab.isSelectedSummaryFunction=function(e){var t=AdHocCrosstab.getSelectedMeasure();return t?t.functionOrDefault===e:!1},AdHocCrosstab.isSelectedTimeSummaryFunction=function(e){var t=AdHocCrosstab.getSelectedMeasure();return t?t.aggregateFirstLevelFunction===e:!1},AdHocCrosstab.canSwitchToRow=function(){var e=adhocDesigner.getSelectedColumnOrGroup();return localContext.isNonOlapMode()||AdHocCrosstab.state.getDimensionsCount(e.axis)>1},AdHocCrosstab.canAddSliceFilter=function(){var e=selObjects.find(function(e){return!e.isSliceable});return selObjects.first()&&!e},AdHocCrosstab.canMoveUpOrLeft=function(){var e=adhocDesigner.getSelectedColumnOrGroup(),t=AdHocCrosstab.getSelectedDimensionIndex(e);return t>0},AdHocCrosstab.canMoveDownOrRight=function(){var e=adhocDesigner.getSelectedColumnOrGroup(),t=AdHocCrosstab.getSelectedDimensionIndex(e);return t<AdHocCrosstab.state.getDimensionsCount(e.axis)-1},AdHocCrosstab.canMoveMeasureUpOrLeft=function(){var e=adhocDesigner.getSelectedColumnOrGroup();return e.index>0},AdHocCrosstab.canMoveMeasureDownOrRight=function(){var e=adhocDesigner.getSelectedColumnOrGroup(),t=e.isMeasure?adhocDesigner.MEASURES:e.dimensionId,r=AdHocCrosstab.state.getLevelsFromDimension(t,e.axis).length;return e.index<r-1},AdHocCrosstab.canAddDimensionAsRowGroup=function(){var e=localContext.getSelectedObject();if(e.hasChilds()||(e=e.parent),localContext.isOlapMode()){var t=e.param.id,r=localContext.state.getDimensionsCount("column"),o=e.param.extra.isHierarchy,a=AdHocCrosstab.state.getLevelsFromDimension(t,"column"),s=o&&1===r&&!_.isEmpty(a);if(0===r||s)return!1;var n=o&&e.param.extra.id,i=AdHocCrosstab.state.getLevelsFromDimension(t,"row"),c=_.isEmpty(a),d=localContext.fromSiblingHierarchy(n,t);return(o||c)&&(o&&d||i.length<e.getChildCount())}var l=dynamicTree.trees[e.getTreeId()],u=adhocDesigner.getAllLeaves(e,l),m=adhocDesigner.getAllLeaves(e,l).collect(function(e){return e.param.extra.id});if(u[0].param.extra.isMeasure){var C=localContext.state.getFilteredMeasureList("column");return 0===C.length}var p=_.pluck(localContext.state.getFilteredList(),"name");return _.difference(m,p).length>0},AdHocCrosstab.canAddDimensionAsColumnGroup=function(){var e=localContext.getSelectedObject();if(e.hasChilds()||(e=e.parent),localContext.isOlapMode()){var t=e.param.id,r=e.param.extra.isHierarchy,o=r&&e.param.extra.id,a=AdHocCrosstab.state.getLevelsFromDimension(t,"column"),s=AdHocCrosstab.state.getLevelsFromDimension(t,"row"),n=0===s.length,i=localContext.fromSiblingHierarchy(o,t);return(r||n)&&(r&&i||a.length<e.getChildCount())}var c=dynamicTree.trees[e.getTreeId()],d=adhocDesigner.getAllLeaves(e,c),l=adhocDesigner.getAllLeaves(e,c).collect(function(e){return e.param.extra.id});if(d[0].param.extra.isMeasure){var u=localContext.state.getFilteredMeasureList("row");return 0===u.length}var m=_.pluck(localContext.state.getFilteredList(),"name");return _.difference(l,m).length>0},AdHocCrosstab.canAddLevelAsRowGroup=function(){if(0===localContext.state.getDimensionsCount("column")&&localContext.isOlapMode())return!1;var e=localContext.getSelectedObject();if(!e)return!1;var t=e.param.extra;if(!t)return!1;var r=localContext.isOlapMode()?[t.dimensionId]:adhocDesigner.getAllLeaves(e).map(function(e){return e.param.extra.dimensionId}),o=r.inject([],function(e,t){return e.concat(AdHocCrosstab.state.getLevelsFromDimension(t,"column")||[])}),a=r.inject([],function(e,t){return e.concat(AdHocCrosstab.state.getLevelsFromDimension(t,"row")||[])});return 0===o.length&&(0===a.length||localContext.isNonOlapMode()&&(t.isMeasure||AdHocCrosstab.isDateField(t))||!_.contains(a,t.name))},AdHocCrosstab.canAddLevelAsColumnGroup=function(){var e=localContext.getSelectedObject();if(!e)return!1;var t=e.param.extra,r=localContext.isOlapMode()?[t.dimensionId]:adhocDesigner.getAllLeaves(e).map(function(e){return e.param.extra.dimensionId}),o=r.inject([],function(e,t){return e.concat(AdHocCrosstab.state.getLevelsFromDimension(t,"column")||[])}),a=r.inject([],function(e,t){return e.concat(AdHocCrosstab.state.getLevelsFromDimension(t,"row")||[])});return 0===a.length&&(0===o.length||localContext.isNonOlapMode()&&(t.isMeasure||AdHocCrosstab.isDateField(t))||!o.find(function(e){return _.contains(_.map(designerBase.getSelectedObjects(),function(e){return e.param.extra.id}),e)}))},AdHocCrosstab.showAddHierarchyConfirm=function(e,t,r){return localContext.fromSiblingHierarchy(e,t)?(adhocDesigner.addConfirmDialog.show({ok:function(){return AdHocCrosstab.isFiltersApplied(t)?void dialogs.systemConfirm.show(adhocDesigner.getMessage("ADH_CROSSTAB_LAST_FILTERED_LEVEL"),5e3):void r()}}),!0):!1},AdHocCrosstab.isFiltersApplied=function(e,t){var r=_.pluck(localContext.state.getLevelObjectsFromDimension(e,t),"levelUniqueName"),o=_.pluck(localContext.state.existingFilters,"name");return!_.isEmpty(_.intersection(r,o))},AdHocCrosstab.canAddSiblingLevels=function(){return!0},AdHocCrosstab.canHideLevel=function(){return!0},AdHocCrosstab.canShowLevel=function(){return!0},AdHocCrosstab.canHideSummariesForColumnGroup=function(){return AdHocCrosstab.canHideSummariesForGroup(!1)},AdHocCrosstab.canHideSummariesForRowGroup=function(){return AdHocCrosstab.canHideSummariesForGroup(!0)},AdHocCrosstab.canHideSummariesForGroup=function(e){return!0},AdHocCrosstab.canAddFilter=function(e,t){if(localContext.isOlapMode())var r=isNotNullORUndefined(e.isMeasure)?e.isMeasure:e.param.extra&&e.param.extra.isMeasure,o=localContext._isAddingFilterDuplicate(e);if(r)return t&&t.push(addFilterErrorMessageMeasureAdd),!1;var a=e.param?e.param.extra&&e.param.extra.id:e.level,s=a&&0===a.indexOf(localContext.ALL_LEVEL_NAME);return s?(t&&t.push(addFilterErrorMessageAllLevelAdd),!1):e.isParent&&e.isParent()?(t&&t.push(addFilterErrorMessageGroupAdd),!1):e.param&&localContext.fromSiblingHierarchy(e.param.extra.hierarchyName,e.param.extra.dimensionId)?(t&&t.push(addFilterErrorMessageAnotherHierarchy),!1):adhocDesigner.isSpacerSelected(e)?(t&&t.push(addFilterErrorMessageSpacerAdd),!1):adhocDesigner.isPercentOfParentCalcSelected(e)?(t&&t.push(addFilterErrorMessagePercentOfParentCalcFieldAdd),!1):adhocDesigner.isConstantSelected(e)?(t&&t.push(addFilterErrorMessageConstantAdd),!1):o?(t&&t.push(addFilterErrorMessage),!1):!0},AdHocCrosstab._isAddingFilterDuplicate=function(e){var t;return t=e.param?"["+e.param.extra.dimensionId+"].["+e.param.extra.id+"]":"["+e.dimensionId+"].["+e.level+"]",adhocDesigner.filtersController.hasFilterForField(t)},AdHocCrosstab.getSelectedObject=function(){return selObjects.first()},AdHocCrosstab.getHierarchy=function(e){var t=e.param.extra;return e.hasChilds()?(e.getFirstChild().hasChilds()&&(t=e.getFirstChild().param.extra),t&&t.isHierarchy?t.id:void 0):t.hierarchyName},AdHocCrosstab._getAvailableFieldsNodeBySelection=function(e,t,r){var o={};if(selectionCategory.area==designerBase.AVAILABLE_FIELDS_AREA)r.hasChilds()?(o.isMeasure="measuresTree"===r.treeId,o.dimensionId=o.isMeasure?r.treeId:r.param.id,o.uri=localContext.isNonOlapMode()?r.param.uri:void 0,o.level=null):(o.isMeasure=!!r.param.extra.isMeasure,o.level=r.param.extra.dimensionId&&r.param.id,o.dimensionId=r.param.extra.dimensionId||r.param.extra.id),o.hierarchyName=AdHocCrosstab.getHierarchy(r),o.index=-1;else if(selectionCategory.area==designerBase.ROW_GROUP_MENU_LEVEL||selectionCategory.area==designerBase.COLUMN_GROUP_MENU_LEVEL)if(e||t){var a=/.*\[(.*)\]/.exec(e),s=a&&a[1];o.isMeasure=!t,o.level=e,o.dimensionId=o.isMeasure?adhocDesigner.MEASURES:t,o.index=-1,o.hierarchyName=s}else{if(!r.axis)return void alert("Need a way to get dimension name for clicked level from crosstab");o=r}return o},AdHocCrosstab.getAvailableFieldsNodeBySelection=function(e,t){return AdHocCrosstab._getAvailableFieldsNodeBySelection(e,t,selObjects.first())},AdHocCrosstab.getAvailableFieldsNodesBySelection=function(e,t){for(var r=[],o=0;o<selObjects.length;o++)r.push(AdHocCrosstab._getAvailableFieldsNodeBySelection(e,t,selObjects[o])),r[o].extra=r[o],r[o].dimensionId=r[o].dimensionId,r[o].id=r[o].level;return r},AdHocCrosstab.canShowSortOptions=function(){if(selObjects.length>1)return!1;var e="column"===selObjects[0].axis,t=localContext.state.crosstab.hasConcreteRowGroups;return selObjects[0].isInner&&(e?t:selObjects[0].isMeasure)},AdHocCrosstab.canShowTopBottomNFilterMenu=function(){var e=!localContext.isOlapMode()&&AdHocCrosstab.canShowSortOptions(),t=localContext.state.hasConcreteRowGroups,r=localContext.state.getDimensions("row"),o=t&&_.find(r,function(e){return"Measures"===e.name});return e&&!o},AdHocCrosstab.isSortOptionSelected=function(e){return selObjects[0].sorting===e},AdHocCrosstab.isDateField=function(e){return"Timestamp"===e.type||"Date"===e.type||"Time"===e.type},AdHocCrosstab.isTopBottomNOptionSelected=function(e){return selObjects[0].topBottomFilter===e};