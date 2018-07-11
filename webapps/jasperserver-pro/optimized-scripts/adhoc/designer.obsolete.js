define(["require","adhoc/designer","jquery","underscore","bi/repository/model/RepositoryResourceModel","common/util/identityUtil","bi/repository/enum/repositoryResourceTypes"],function(e){var t=e("adhoc/designer"),r=e("jquery"),n=e("underscore"),i=e("bi/repository/model/RepositoryResourceModel"),o=e("common/util/identityUtil"),a=e("bi/repository/enum/repositoryResourceTypes");return t.handleBack=function(){var e=t.buildSaveRequestData();t.filtersController.hasNotAppliedFilters()?t.showSaveConfirmationDialog(function(){r(document).trigger("adhocDesigner:save",t.buildResourceMetadata(e))}):r(document).trigger("adhocDesigner:save",t.buildResourceMetadata(e))},t.handleCancel=function(){r(document).trigger("adhocDesigner:cancel")},t.buildSaveRequestData=function(){var e=!!saveUri,t=e?saveFolder:"/temp",r=e?saveLabel:o.generateUniqueName("tmpAdv_"),n=e?saveDesc:"Dashboard visualization.",a=e;return window.embeddedSaveAsUri&&(t=i.getParentFolderFromUri(embeddedSaveAsUri),r=i.getNameFromUri(embeddedSaveAsUri)),window.embeddedSaveAsOverwrite&&(a=embeddedSaveAsOverwrite),window.embeddedSaveAsUri&&(t=i.getParentFolderFromUri(embeddedSaveAsUri),r=i.getNameFromUri(embeddedSaveAsUri)),window.embeddedSaveAsOverwrite&&(a=embeddedSaveAsOverwrite),{aruLabel:r,aruFolder:t,aruDesc:n,allOverwrite:a}},t.buildResourceMetadata=function(e){var t=!!saveUri,r={uri:[e.aruFolder,e.aruLabel].join("/"),resourceType:a.ADHOC_DATA_VIEW,type:localContext.mode,label:e.aruLabel,version:1};return t||(r.dataSourceUri=reportUnitURI),r},t.saveEmbedded=function(){var e=t.buildSaveRequestData();designerBase.sendRequest(designerBase.getControllerPrefix()+"_save",e,function(i){var o=n.clone(e);o.viewType=i.viewType,r(document).trigger("adhocDesigner:saved",t.buildResourceMetadata(o))})},t.crossDocumentListener=function(e){"adhocDesigner:save"==e.data&&t.saveEmbedded()},t.saveAndRun=function(){windowPopUp=window.open("","jr"),buttonManager.disable(r("execute"));var e=function(e){t.updateStateAndRender(e),windowPopUp.location="flow.html?_flowId=viewAdhocReportFlow&clientKey="+clientKey+"&reportUnit="+localContext.state.tempAruName+"&noReturn=true"};designerBase.sendRequest("co_saveTemp",[],e)},t.applyAdhocTheme=function(e,t){var n=null,i=e.element(),o=null;if(t){var a=t.childElements();n=matchAny(i,["li.button"],!0),n&&(o=n.identify(),a.each(function(e){buttonManager.unSelect(e)}),buttonManager.select(n)),o!==selectedThemeId&&(selectedThemeId=o,r(this.CANVAS_PARENT_ID)&&selectedThemeId&&(r(this.CANVAS_PARENT_ID).writeAttribute("class",o),this.toggleAdhocTheme()))}},t.orientationSelected=function(e){t.setPageOrientation(e),designerBase.unSelectAll()},t.getOrientation=function(){return localContext.state.pageOrientation},t.orientationEquals=function(e){return t.getOrientation()==e},t.getPaperSize=function(){return localContext.state.paperSize},t.paperSizeEquals=function(e){return t.getPaperSize()==e},t.paperSizeSelected=function(e,r){t.setPaperSize(e),designerBase.unSelectAll(r)},t.goToDesignView=function(){var e=document.location.href.parseQuery();delete e._flowId,delete e.viewReport,delete e.fromDesigner,primaryNavModule.setNewLocation("designer",Object.toQueryString(e))},t.goToPresentationView=function(){var e=document.location.href.parseQuery();delete e._flowId,e.viewReport=!0,e.fromDesigner=!0,primaryNavModule.setNewLocation("designer",Object.toQueryString(e))},t.getAllAvailableFolders=function(e){var t=[];if(!e){if(!this.availableTree)return t;e=this.availableTree.rootNode,t.push(e)}if(e.param.type===this.FOLDER_TYPE)for(var r=0;r<e.childs.length;r++){var n=e.childs[r];n.param.type===this.FOLDER_TYPE&&(t.push(n),t=t.concat(this.getAllAvailableFolders(n)))}return t},t.togglePagePropsRoller=function(){selectionObject.pagePropsRollDown=!selectionObject.pagePropsRollDown},t.setFieldValuesOnColumnSelection=function(){},t.setFieldValuesOnGroupSelection=function(){},t.selectReport=function(){designerBase.unSelectAll(),this.activateReportSelectionObject()},t.activateReportSelectionObject=function(){this.selectSingleObject(titleBar),selectionCategory.area=designerBase.TITLE_SELECT_AREA},t.isSingleFieldSelected=function(){return 1==designerBase.getSelectedObject().length},t.isInColumns=function(e){for(var t=0;t<localContext.state.columns.length;t++)if(e==localContext.state.columns[t])return!0;return!1},t.setPageOrientation=function(e){designerBase.sendRequest("co_setPageOrientation",["o="+e])},t.setPaperSize=function(e){designerBase.sendRequest("co_setPaperSize",["s="+e])},t});