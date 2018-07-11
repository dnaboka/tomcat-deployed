var TopBottomFilterDialog,Backbone;require(["adhoc/TopBottomFilterDialog","backbone"],function(e,o){TopBottomFilterDialog=e,Backbone=o}),AdHocCrosstab.showCrosstabMenu=function(e,o){adhocDesigner.showDynamicMenu(e,o,null,function(e,o){return e=AdHocCrosstab.updateContextMenuWithSiblingLevels(e,o),AdHocCrosstab.generateAvailableSummaryCalculationsMenu(e,o)})},AdHocCrosstab.addFieldToXtab=function(e,o,r){var t=r.element();if(t){var n=matchMeOrUp(t,localContext.DM_AXIS_LIST_PATTERN);if(n){var s=$(n).identify();s.startsWith(localContext.OLAP_COLUMNS_ID)?AdHocCrosstab.appendDimensionToColumnAxisWithLevel():s.startsWith(localContext.OLAP_ROWS_ID)&&AdHocCrosstab.appendDimensionToRowAxisWithLevel()}}},AdHocCrosstab.processFieldAsColumnGroup=function(e,o,r){var t=r,n=null,s=e.identify();if(s.startsWith("colGroupHeaderRow_")||s.startsWith("colGroupHeader_"))try{n=o.exec(s)[0],t=parseInt(n)+1}catch(a){}AdHocCrosstab.addFieldAsColumnGroup(t)},AdHocCrosstab.processFieldAsMeasure=function(e,o,r){var t=r,n=null,s=e.identify();if(s.startsWith("measureHeader_"))try{n=o.exec(s)[0],t=parseInt(n)+1}catch(a){}else("A"==e.nodeName||"LI"==e.nodeName)&&("A"==e.nodeName&&(e=e.up("li.leaf")),e&&(t=$(e).previousSiblings().length));addFieldAsMeasure(t,!0)},AdHocCrosstab.processFieldAsRowGroup=function(e,o,r){var t=r,n=null,s=e.identify();if(s.startsWith("rowGroup_")||s.startsWith("rowGroupHeader_"))try{n=o.exec(s)[0],t=parseInt(n)+1}catch(a){}AdHocCrosstab.addFieldAsRowGroup(t)},AdHocCrosstab.moveRowGroupLeft=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r-1;AdHocCrosstab.moveRowGroup(r,t,e)},AdHocCrosstab.moveRowGroupRight=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r+1;AdHocCrosstab.moveRowGroup(r,t,e)},AdHocCrosstab.moveColumnGroupLeft=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r-1;AdHocCrosstab.moveColumnGroup(r,t,e)},AdHocCrosstab.moveColumnGroupRight=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r+1;AdHocCrosstab.moveColumnGroup(r,t,e)},AdHocCrosstab.moveMeasureLeft=function(){var e=adhocDesigner.getSelectedColumnOrGroup();AdHocCrosstab.moveMeasure(e.level,e.index-1)},AdHocCrosstab.moveMeasureRight=function(){var e=adhocDesigner.getSelectedColumnOrGroup();AdHocCrosstab.moveMeasure(e.level,e.index+1)},AdHocCrosstab.moveRowGroupOnDrag=function(){draggingMoveOverIndex=parseInt(draggingMoveOverIndex),currentlyDraggingIndex=parseInt(currentlyDraggingIndex),currentlyDraggingIndex!=draggingMoveOverIndex&&(currentlyDraggingIndex>=0&&draggingMoveOverIndex>=0?AdHocCrosstab.moveRowGroup(currentlyDraggingIndex,draggingMoveOverIndex):-1==draggingMoveOverIndex&&AdHocCrosstab.removeRowGroup(currentlyDraggingIndex))},AdHocCrosstab.hideLevel=function(e){var o=getDimensionWithLevelFromSelection();selectionCategory.area===designerBase.COLUMN_GROUP_MENU_LEVEL?AdHocCrosstab.hideColumnLevel(o.dimensionId,o.level):selectionCategory.area===designerBase.ROW_GROUP_MENU_LEVEL&&AdHocCrosstab.hideRowLevel(o.dimensionId,o.level)},AdHocCrosstab.showLevel=function(e){var o=AdHocCrosstab.getDimensionWithLevelFromSelection();selectionCategory.area===designerBase.COLUMN_GROUP_MENU_LEVEL?AdHocCrosstab.showColumnLevel(o.dimensionId,o.level):selectionCategory.area===designerBase.ROW_GROUP_MENU_LEVEL&&AdHocCrosstab.showRowLevel(o.dimensionId,o.level)},AdHocCrosstab.moveColumnGroupDown=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r+1;AdHocCrosstab.moveColumnGroup(r,t,e)},AdHocCrosstab.moveColumnGroupUp=function(e){var o=adhocDesigner.getSelectedColumnOrGroup(),r=AdHocCrosstab.getSelectedDimensionIndex(o),t=r-1;AdHocCrosstab.moveColumnGroup(r,t,e)},AdHocCrosstab.moveColumnGroupOnDrag=function(){draggingMoveOverIndex=parseInt(draggingMoveOverIndex),currentlyDraggingIndex=parseInt(currentlyDraggingIndex),currentlyDraggingIndex!=draggingMoveOverIndex&&(currentlyDraggingIndex>=0&&draggingMoveOverIndex>=0?AdHocCrosstab.moveColumnGroup(currentlyDraggingIndex,draggingMoveOverIndex):-1==draggingMoveOverIndex&&AdHocCrosstab.removeColumnGroup(currentlyDraggingIndex))},AdHocCrosstab.moveMeasureOnDrag=function(){draggingMoveOverIndex=parseInt(draggingMoveOverIndex),currentlyDraggingIndex=parseInt(currentlyDraggingIndex),currentlyDraggingIndex!=draggingMoveOverIndex&&(currentlyDraggingIndex>=0&&draggingMoveOverIndex>=0?AdHocCrosstab.moveMeasure(currentlyDraggingIndex,draggingMoveOverIndex):-1==draggingMoveOverIndex&&AdHocCrosstab.removeMeasure(currentlyDraggingIndex))},AdHocCrosstab.retrieveOverflowRowGroups=function(){var e=confirm(adhocDesigner.getMessage("overflowConfirmMessage"));e&&AdHocCrosstab.getOverflowRowGroups()},AdHocCrosstab.retrieveOverflowColumnGroups=function(){var e=confirm(adhocDesigner.getMessage("overflowConfirmMessage"));e&&AdHocCrosstab.getOverflowColumnGroups()},AdHocCrosstab.selectMeasureMask=function(e){var o=AdHocCrosstab.getSelectedMeasure();if(o){var r=selObjects.first().index;AdHocCrosstab.setMask(e,r)}},AdHocCrosstab.selectFunction=function(e){var o=AdHocCrosstab.getSelectedMeasure(),r=selObjects.first();if(o){var t=adhocDesigner.getSuperType(o.type),n=AdHocCrosstab.getMeasureTypeByFunction(e);t!==n?AdHocCrosstab.setSummaryFunctionAndMask(e,defaultMasks[n],r.index):AdHocCrosstab.setSummaryFunction(e,r.index)}},AdHocCrosstab.selectTimeFunction=function(e){var o=AdHocCrosstab.getSelectedMeasure(),r=selObjects.first();if(o){adhocDesigner.getSuperType(o.type),AdHocCrosstab.getMeasureTypeByFunction(e);AdHocCrosstab.setSummaryTimeFunction(e,r.index)}},AdHocCrosstab.selectedMeasureShowsSummaryOptions=function(){return!!AdHocCrosstab.getSelectedMeasure()},AdHocCrosstab.selectedMeasureShowsNumericSummaryOptions=function(){return localContext.selectedMeasureShowsSummaryOptions()&&localContext.isSelectedMeasureNumeric()},AdHocCrosstab.setCatForColumnGroup=function(e){var o=adhocDesigner.getSelectedColumnOrGroup();o&&AdHocCrosstab.isColumnGroupSelected(o)&&AdHocCrosstab.setCategoryForColumnGroup(e,o.groupIndex)},AdHocCrosstab.setCatForRowGroup=function(e){var o=adhocDesigner.getSelectedColumnOrGroup();o&&AdHocCrosstab.isRowGroupSelected(o)&&AdHocCrosstab.setCategoryForRowGroup(e,o.groupIndex)},AdHocCrosstab.appendDimensionWithLevel=function(e,o){var r=e?localContext.getAvailableFieldsNodeBySelection(e.id,e.groupId):localContext.getAvailableFieldsNodeBySelection();r.axis=o,AdHocCrosstab.showAddHierarchyConfirm(r.hierarchyName,r.dimensionId,function(){jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:addItem",r)})||jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:addItem",r)},AdHocCrosstab.appendDimensionToRowAxisWithLevel=function(e){AdHocCrosstab.appendDimensionWithLevel(e,"row")},AdHocCrosstab.appendDimensionToColumnAxisWithLevel=function(e){AdHocCrosstab.appendDimensionWithLevel(e,"column")},AdHocCrosstab.appendMeasureToRow=function(e){var o=e?localContext.getAvailableFieldsNodesBySelection(e):localContext.getAvailableFieldsNodesBySelection();jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:addItems",{axis:"row",levels:o,index:o[0].index})},AdHocCrosstab.appendMeasureToColumn=function(e){var o=e?localContext.getAvailableFieldsNodesBySelection(e):localContext.getAvailableFieldsNodesBySelection();jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:addItems",{axis:"column",levels:o,index:o[0].index})},AdHocCrosstab.removeLevelFromRow=function(){var e=localContext.getSelectedObject();jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:removeItem",{axis:"row",index:e.index,item:{level:e.level,dimensionId:e.dimensionId,isMeasure:e.isMeasure}})},AdHocCrosstab.removeLevelFromColumn=function(){var e=localContext.getSelectedObject();jQuery("#"+adhocDesigner.DISPLAY_MANAGER_ID).trigger("lm:removeItem",{axis:"column",index:e.index,item:{level:e.level,dimensionId:e.dimensionId,isMeasure:e.isMeasure}})},AdHocCrosstab.selectedGroupCanShowSummary=function(){var e=AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup()),o=AdHocCrosstab.getGroupParent(e);return o?o.expanded===!0&&!AdHocCrosstab.selectedGroupHasSummary():!AdHocCrosstab.selectedGroupHasSummary()},AdHocCrosstab.selectedColumnGroupCanHideSummary=function(){var e=AdHocCrosstab.canHideSummariesForColumnGroup(),o=AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup()),r=AdHocCrosstab.getGroupParent(o);return e?r?r.expanded===!0&&AdHocCrosstab.selectedGroupHasSummary():AdHocCrosstab.selectedGroupHasSummary():!1},AdHocCrosstab.selectedRowGroupCanHideSummary=function(){var e=AdHocCrosstab.canHideSummariesForRowGroup();return e?AdHocCrosstab.selectedGroupHasSummary():!1},AdHocCrosstab.getGroupParent=function(e){var o,r=-1;return localContext.state.columnGroups.detect(function(o,t){return o.name===e.name?r=t-1:void 0}),r>=0&&(o=localContext.state.columnGroups[r]),o},AdHocCrosstab.selectedGroupHasSummary=function(){var e=AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup());return e?e.isShowingSummary===!0:!1},AdHocCrosstab.selectedRowGroupIsCollapsible=function(){var e=adhocDesigner.getSelectedColumnOrGroup();return e&&e.expandable},AdHocCrosstab.selectedColumnGroupIsCollapsible=function(){var e=adhocDesigner.getSelectedColumnOrGroup();return e&&e.expandable},AdHocCrosstab.topBottomNFilteringClicked=function(e){var o=selObjects[0],r=AdHocCrosstab.getTopBottomFilter(),t=r&&o.path===r.path,n={type:e,limit:t?r.limit:5,aggregateUnranked:t?r.aggregateUnranked:!0,applyAcrossGroups:t?r.applyAcrossGroups:!1};"none"!==e?new TopBottomFilterDialog({model:new Backbone.Model(n),ok:function(o){AdHocCrosstab.applyTopBottomNFiltering({type:"top"===e?"desc":"asc",limit:o.limit,aggregateUnranked:o.aggregateUnranked,applyAcrossGroups:o.applyAcrossGroups})}}).open():t&&e!==r.type&&AdHocCrosstab.applyTopBottomNFiltering({type:e,limit:0,aggregateUnranked:!1,applyAcrossGroups:!1})};