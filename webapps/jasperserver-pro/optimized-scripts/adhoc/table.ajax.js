AdHocTable.addFieldAsColumnAtPosition=function(e,a){if(AdHocTable.canAddFieldAsColumn(e)){var n=adhocDesigner.isNoDataToDisplay(),l=function(e){AdHocTable.hoverColumn=-1,localContext.standardTableOpCallback(e),n&&!adhocDesigner.isNoDataToDisplay()&&adhocDesigner.checkMaxRowsLimit()};designerBase.sendRequest("ta_insertColumn",{"f[]":designerBase.encodeParam(e),i:a},l,{bPost:!0})}},AdHocTable.moveColumn=function(e,a,n,l){var t=l?e:_.pluck(selObjects,"index").join(","),o=a-e,d=function(e){localContext.standardTableOpCallback(e),n&&n(e)};designerBase.sendRequest("ta_moveColumn",["indexes="+t,"offset="+o],d)},AdHocTable.switchToColumn=function(e,a,n){!e&&selObjects.length>0&&(e=selObjects[0].fieldName,a=selObjects[0].index,n=-1),designerBase.sendRequest("ta_switchToColumn",["item="+encodeText(e),"from="+a,"to="+n],localContext.standardTableOpCallback)},AdHocTable.removeColumn=function(e,a){var n=_.isNumber(e)?e:_.pluck(selObjects,"index").join(","),l=a||localContext.standardTableOpCallback;designerBase.sendRequest("ta_removeColumn",["indexes="+n],l)},AdHocTable.tableColumnResize=function(e,a){var n=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_resizeColumn",["i="+a,"w="+e],n)},AdHocTable.setColumnHeaderToNull=function(e){var a=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setColumnHeader",["i="+e,"l=_null","w=-1"],a)},AdHocTable.updateColumnHeaderRequest=function(e,a,n){var l=function(e){localContext.standardTableOpCallback(e)};0===e.length?localContext.removeColumnHeaderRequest():designerBase.sendRequest("ta_setColumnHeader",["i="+a,"l="+encodeText(e),"w="+n],l)},AdHocTable.setMask=function(e,a){var n=function(e){localContext.standardTableOpCallback(e),designerBase.unSelectAll()};designerBase.sendRequest("ta_setColumnMask",["m="+encodeText(e),"i="+a],n)},AdHocTable.updateViewCallback=function(e){localContext.standardOpCallback(e)},AdHocTable.addFieldAsGroup=function(e,a){e||(a=-1,e=adhocDesigner.collectFields(adhocDesigner.getSelectedTreeNodes(),!0)),designerBase.sendRequest("ta_insertGroup",{"f[]":designerBase.encodeParam(e),i:a},localContext.standardTableOpCallback)},AdHocTable.moveGroup=function(e,a,n){var l=function(e){localContext.standardTableOpCallback(e),n&&n()};designerBase.sendRequest("ta_moveGroup",["i1="+e,"i2="+a],l)},AdHocTable.switchToGroup=function(e,a,n){!e&&selObjects.length>0&&(e=jQuery(selObjects[0].header).attr("data-fieldname"),a=selObjects[0].index,n=-1),designerBase.sendRequest("ta_switchToGroup",["item="+encodeText(e),"from="+a,"to="+n],localContext.standardTableOpCallback)},AdHocTable.removeGroup=function(e,a){var n,l=parseInt(e),t=a||localContext.standardTableOpCallback;isNaN(l)&&(l=(n=adhocDesigner.getSelectedColumnOrGroup())&&n.index),designerBase.sendRequest("ta_removeGroup",["i="+l],t)},AdHocTable.updateGroupLabel=function(e,a){if(!e||e.blank())return void localContext.setGroupLabelToNull(a);var n=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setGroupLabel",["g="+a,"l="+encodeText(e)],n)},AdHocTable.setGroupLabelToNull=function(e){var a=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setGroupLabel",["g="+e,"l=_null"],a)},AdHocTable.setGroupMask=function(e,a){var n=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setGroupMask",["m="+encodeText(e),"i="+a],n)},AdHocTable.fetchMoreRows=function(){AdHocTable.fetchingRows=!0,designerBase.sendRequest("ta_"+AdHocTable.FETCH_MORE_ROWS,[],this.Rendering.addMoreRows.bind(this.Rendering),null)},AdHocTable.addDefaultColumnSummary=function(){var e=adhocDesigner.getSelectedColumnOrGroup();e&&designerBase.sendRequest("ta_updateSummaryVisibility",["visible=true","i="+e.index],localContext.standardTableOpCallback)},AdHocTable.removeColumnSummary=function(){var e=adhocDesigner.getSelectedColumnOrGroup();e&&designerBase.sendRequest("ta_updateSummaryVisibility",["visible=false","i="+e.index],localContext.standardTableOpCallback)},AdHocTable.setSummaryFunction=function(e,a){var n=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setColumnSummaryFunction",["f="+encodeText(e),"i="+a],n)},AdHocTable.setTimeSummaryFunction=function(e,a){var n=function(e){localContext.standardTableOpCallback(e)};designerBase.sendRequest("ta_setColumnTimeSummaryFunction",["f="+encodeText(e),"i="+a],n)},AdHocTable.toggleGridMode=function(e){designerBase.sendRequest("ta_toggleGridMode",["mode="+e],localContext.standardTableOpCallback)},AdHocTable.updateCustomFieldCallback=function(){localContext.standardTableOpCallback(),localContext.state.inDesignView&&adhocDesigner.updateAllFieldLabels()},AdHocTable.getCallbacksForPivot=function(e){localContext.standardOpCallback(e)},AdHocTable.standardOpCallback=function(e){e?localContext.standardTableOpCallback(e,!0):window.console&&console.log("Internal server error occurred")},AdHocTable.standardTableOpCallback=function(e){adhocDesigner.updateStateAndRender(e)};