AdHocCrosstab.deselectAllSelectedOverlays=function(){},AdHocCrosstab.deselectAllColumnGroupOverlays=function(){},AdHocCrosstab.deselectAllRowGroupOverlays=function(){},AdHocCrosstab.deselectAllMeasureOverlays=function(){},AdHocCrosstab.removeFromSelectObjects=function(e){var t=null;selObjects.each(function(o){o.id==e&&(t=o)}),selObjects=selObjects.without(t)},AdHocCrosstab.getSelectedDimensionIndex=function(e){var t,o=-1;return e?_.isNumber(e.groupIndex)?e.groupIndex:(t=e.isMeasure?adhocDesigner.MEASURES:e.dimensionId,_.find(localContext.state.getDimensions(e.axis),function(e,s){return e.name===t?(o=s,!0):void 0}),o):o},AdHocCrosstab.getSelectedMeasure=function(){if(selObjects&&selObjects.length>0){var e=selObjects[0];if(e.isMeasure){var t=AdHocCrosstab.getRefinedMeasuresFromState();return t[e.index]}}return null},AdHocCrosstab.getRefinedMeasuresFromState=function(){return _.filter(localContext.state.measures,function(e){return!e.isSpacer})},AdHocCrosstab.getSelectedGroup=function(e){return e?"row"===e.axis?localContext.state.rowGroups[e.groupIndex]:localContext.state.columnGroups[e.groupIndex]:null},AdHocCrosstab.getMeasureTypeByFunction=function(e){var t=AdHocCrosstab.getSelectedMeasure();if(t){var o=adhocDesigner.getSuperType(t.type);return"Average"===e?"dec":"Count"===e||"DistinctCount"===e?"int":o}return null},AdHocCrosstab.updateContextMenuWithSiblingLevels=function(e,t){if(!adhocDesigner.ui.display_manager)return t;var o=t.find(function(e){return"AdHocCrosstab.canAddSiblingLevels"===e.clientTest});if(!o)return t;var s=null,n=null,r=null,a=selObjects[0],i=/.*\[(.*)\]/.exec(a.level),l=i&&i[1];if(a.isMeasure)n=adhocDesigner.measuresTree.getRootNode(),r="row"===a.axis?"AdHocCrosstab.appendMeasureToRow":"AdHocCrosstab.appendMeasureToColumn";else{if(!localContext.isOlapMode())return a.index=0,t;n=adhocDesigner.dimensionsTree.getRootNode().childs.find(function(e){return e.param.extra.id===a.dimensionId}),n.childs[0].param.extra.isHierarchy&&(n=_.find(n.childs,function(e){return e.param.extra.id===l})),r="row"===a.axis?"AdHocCrosstab.appendDimensionToRowAxisWithLevel":"AdHocCrosstab.appendDimensionToColumnAxisWithLevel"}if(void 0===a.allLevels){var c=a;c.allLevels=AdHocCrosstab.state.getLevelsFromDimension(a.dimensionId,c.axis),c.index=c.allLevels.indexOf(c.level)}return a.allLevels&&(s=localContext.isOlapMode()?n.childs.findAll(function(e){return!a.allLevels.include(e.param.extra.id)}):adhocDesigner.getAllLeaves(n,adhocDesigner.measuresTree).findAll(function(e){return!a.allLevels.include(e.param.extra.id)})),s&&0!==s.length?(o.text=adhocDesigner.getMessage(a.isMeasure?"addMeasures":"addLevels"),o.children=s.collect(function(e){return actionModel.createMenuElement("optionAction",{text:e.name,action:r,actionArgs:a.isMeasure?[e.param.extra.id]:[{id:e.param.extra.id,groupId:e.param.extra.dimensionId,isMeasure:!1}]})}),t):t},AdHocCrosstab.generateAvailableSummaryCalculationsMenu=function(e,t){var o=_.find(t,function(e){return"AdHocCrosstab.selectedMeasureShowsSummaryOptions"===e.clientTest});if(o){var s=actionModel.selObjects[0],n=_.findWhere(localContext.state.measures,{name:s.name});n&&adhocDesigner.generateAvailableSummaryCalculationsMenu(n.fieldName,o,{action:AdHocCrosstab.selectFunction,isSelectedTest:AdHocCrosstab.isSelectedSummaryFunction})}return t},AdHocCrosstab.getTopBottomFilter=function(){if("undefined"==typeof localContext.state.crosstab.topBottomFilter){localContext.state.crosstab.topBottomFilter=null;var e=localContext.state.crosstab.axisTransforms,t=e&&e.ROWS;if(t&&t.length>0)for(var o=0;o<t.length;o++){var s=t[o];if(s&&"com.jaspersoft.commons.dimengine.axistransform.TopOrBottomN"===s.type){localContext.state.crosstab.topBottomFilter={path:"/"+s.path.join("/"),type:s.asc?"bottom":"top",aggregateUnranked:s.createOtherBucket,applyAcrossGroups:s.limitAllLevels,limit:s.limit};break}}}return localContext.state.crosstab.topBottomFilter};