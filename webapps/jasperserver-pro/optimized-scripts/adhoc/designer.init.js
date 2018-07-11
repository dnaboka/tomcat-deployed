define(["require","adhoc/designer","adhoc/layout.manager","underscore","underscore.string","dialog.definitions"],function(e){function t(e,t){var n=parseInt(layoutModule.getPanelWidth(e),10);n||layoutModule.storePanelWidth(e,t)}var n=e("adhoc/designer"),a=e("adhoc/layout.manager"),o=e("underscore");e("underscore.string"),e("dialog.definitions");return n.layoutManagerProperties={table:function(){return{axes:[{name:"column",elementId:"olap_columns"},{name:"group",elementId:"olap_rows"}],common:{mode:"table",id:n.DISPLAY_MANAGER_ID}}},crosstab:function(e){return{axes:[{name:"column",elementId:"olap_columns"},{name:"row",elementId:"olap_rows",isDependent:!!e}],common:{mode:"crosstab",id:n.DISPLAY_MANAGER_ID,measuresGroupId:"Measures",isOlapMode:!!e}}},olap_crosstab:function(){return n.layoutManagerProperties.crosstab(!0)},ichart:function(e){return{axes:[{name:"column",elementId:"olap_columns"},{name:"row",elementId:"olap_rows",isDependent:!!e}],common:{mode:"crosstab",id:n.DISPLAY_MANAGER_ID,measuresGroupId:"Measures",isOlapMode:!!e}}},olap_ichart:function(){return n.layoutManagerProperties.crosstab(!0)},chart:function(){return{axes:[{name:"measures",elementId:"olap_columns"},{name:"group",elementId:"olap_rows"}],common:{mode:"chart",id:n.DISPLAY_MANAGER_ID}}}},n.initTitle=function(){var e=window.isEmbeddedDesigner?embeddedName:saveLabel;o.isBlank(e)||n.ui.header_title.text(e)},n.initLayoutManager=function(e){var t=n.layoutManagerProperties[e]();n.ui.display_manager=new a(t),n.observeDisplayManagerEvents()},n.initDialogs=function(){isDesignView&&adhocReentrance.initialize(),adhocSort.initialize(),n.initViewQueryDialog(),n.initSaveConfirmationDialog(),n.initDeleteCalculatedFieldConfirmationDialog(),n.addConfirmDialog=new jaspersoft.components.ConfirmDialog({messages:[n.messages.ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_1,n.messages.ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_2]})},n.initSaveConfirmationDialog=function(){var e=jQuery("#standardConfirm").clone();e.attr("id",n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.DIALOG_ID),e.find(".body").text(n.messages.ADH_1236_SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION),e.find(".button.action.up").attr("id",n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID),e.find(".button.action.primary.up").attr("id",n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.OK_BUTTON_ID),e.find(".button.action.primary.up .wrap").text(n.messages.ADH_1237_IGNORE),e.appendTo(jQuery("#frame .content:eq(0)"))},n.initDeleteCalculatedFieldConfirmationDialog=function(){var e=jQuery("#standardConfirm").clone();e.attr("id",n.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.DIALOG_ID),e.find(".body").text(n.messages.ADH_436_CALCULATED_FIELD_REMOVE_CONFIRM),e.find(".button.action.up").attr("id",n.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID),e.find(".button.action.primary.up").attr("id",n.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.OK_BUTTON_ID),e.appendTo(jQuery("#frame .content:eq(0)"))},n.initViewQueryDialog=function(){n.viewQueryDialog=new JRS.ViewQueryDialog({id:"#queryViewer",content:"",selectionContainer:$("designer")})},n.initFieldsPanel=function(t){if(isDesignView){var a=n;t&&(Event.observe($("topicMutton"),"mouseover",function(e){actionModel.showDynamicMenu("topicMenu",e,null,null,localContext.state.actionmodel),$("menu").clonePosition($("topicMutton"),{setWidth:!1,setHeight:!1,offsetTop:5}),Event.stop(e),Event.observe($("menu"),"mouseleave",function(){this.showButtonMenuMouseOut($("menu"))}.bind(this))}.bind(n)),n.isOlapMode()||(Event.observe($("availableFieldsMutton"),"mouseover",function(e){actionModel.showDynamicMenu("availableFieldsMenu",e,null,null,localContext.state.actionmodel),$("menu").clonePosition($("availableFieldsMutton"),{setWidth:!1,setHeight:!1,offsetTop:5}),Event.stop(e),Event.observe($("menu"),"mouseleave",function(){this.showButtonMenuMouseOut($("menu"))}.bind(this))}.bind(n)),Event.observe($("availableMeasuresMutton"),"mouseover",function(e){actionModel.showDynamicMenu("availableMeasuresMenu",e,null,null,localContext.state.actionmodel),$("menu").clonePosition($("availableMeasuresMutton"),{setWidth:!1,setHeight:!1,offsetTop:5}),Event.stop(e),Event.observe($("menu"),"mouseleave",function(){this.showButtonMenuMouseOut($("menu"))}.bind(this))}.bind(n))));var o,i={dimensions:{name:"dimensionsTree",className:"dimension",domId:a.DIMENSIONS_TREE_DOM_ID,providerId:a.DIMENSIONS_TREE_PROVIDER_ID},measures:{name:"measuresTree",className:"measure",domId:a.MEASURES_TREE_DOM_ID,providerId:a.MEASURES_TREE_PROVIDER_ID}};for(o in i){var r=$(i[o].domId);if(r){var l=r.childElements();l.each(function(e){e.remove()})}a[i[o].name]=a.getAvailableFieldsTree(i[o].domId,i[o].providerId);var s=window.localStorage?localStorage.getItem(a._cookieName):void 0;a._availableTreeLastOpened=s&&s.length>0?s:"/",a[i[o].name].DEFAULT_TREE_CLASS_NAME="responsive fields",a[i[o].name].multiSelectEnabled=!n.isOlapMode(),a[i[o].name].dragClasses=i[o].className,a[i[o].name].setDragStartState=function(e){return function(t,a,o){n.setDragStartState(e,t,a,o),selectionCategory.area=designerBase.AVAILABLE_FIELDS_AREA,localContext.canAddFilter&&localContext.canAddFilter(t)&&a.element.addClassName("supportsFilter")}}(a[i[o].name]),isIPad()&&(r=document.getElementById(i[o].domId),new TouchController(r,r.parentNode,{scrollbars:!0})),function(t){e(["./DynamicTreeSearch"],function(e){var o=new e({tree:a[t],depth:n._AVAILABLE_TREE_DEPTH,keyword:""});jQuery(".j-"+t+"-search").append(o.el),a[t+"Search"]=o})}(i[o].name)}a.observeTreeEvents(a.dimensionsTree,a.measuresTree),a.observeTreeEvents(a.measuresTree,a.dimensionsTree)}},n.FILTERS_PANEL_DEFAULT_WIDTH=300,n.FILTERS_PANEL_MIN_WIDTH=250,n.initPanelsState=function(){layoutModule.panelStateWasManuallyChanged("filters",clientKey)||"false"===layoutModule.getPanelMinimizedState("filters")&&jQuery("#filters").hasClass("minimized")&&layoutModule.storePanelMinimizedState("filters",!0),t("filters",n.FILTERS_PANEL_MIN_WIDTH);var e=n.CANVAS_PANEL_ID;$("fields")?layoutModule.resizeOnClient("fields",e,"filters"):layoutModule.resizeOnClient("filters",e),layoutModule.panelStateWasManuallyChanged("filters",clientKey)||"true"===layoutModule.getPanelMinimizedState("filters")&&parseInt(layoutModule.getPanelWidth("filters"),10)<n.FILTERS_PANEL_MIN_WIDTH&&layoutModule.storePanelWidth("filters",n.FILTERS_PANEL_DEFAULT_WIDTH)},n.initFiltersPanel=function(){var e=$("filters"),t=n.isOlapMode()?OlapFiltersController:FiltersController,a=new FilterService({clientKey:clientKey,mode:n.getMode});enableSelection(e),n.filtersController=new t({el:e,service:a,clientKey:clientKey,onApply:function(e){localContext.standardOpCallback(e)},onStateUpdate:function(e){localContext.state.update?localContext.state.update(e):localContext.update(e),isDesignView&&n.enableCanUndoRedo(),!n.isOlapMode()&&n.updateFieldsInUse(o.pluck(e.existingFilters,"name"))},onFilterRemove:function(e){n.removeFromFieldsInUse(o.pluck(e,"name"))},resetFilterPanelState:n.resetFilterPanelState}),document.observe("dragger:sizer",function(e){var t=e.memo.element;t==n.filtersController.sizerEl&&n.filtersController.onPanelResize()})},n.initDroppables=function(){var e={filters:{accept:["draggable","wrap"],hoverclass:"dropTarget",onDrop:function(e){var t=[];if(n.canShowFilterOption(t)){var a=n.getListOfSelectedFields();n.filtersController.addFilter(a)}else dialogs.systemConfirm.show(t.join(" "),5e3)}},mainTableContainer:{accept:["measure","dimension"],hoverclass:"dropTarget",onDrop:function(){switch(localContext.getMode()){case"table":AdHocTable.addFieldAsColumn(!0);break;case"chart":AdHocChart.addFieldAsMeasure(!0)}if(localContext.getMode().indexOf("ichart")>=0){var e=[],t=n.getSelectedTreeNodes();jQuery.each(t,function(t,n){e.push(n.param)});var a=jQuery("#olap_columns").children().length;AIC.lmHandlersMap.addItems(e,a,"column")}}},canvasTableFrame:{accept:["draggable","wrap"],hoverclass:"dropTarget",onDrop:function(){"table"==localContext.getMode()&&AdHocTable.addFieldAsColumn(!0)}}};for(var t in e)Droppables.remove(t),document.getElementById(t)&&Droppables.add(t,e[t])},n.getAvailableFieldsTree=function(e,t){function a(e){dynamicTree.TreeNode.call(this,e),this.Types={Folder:new dynamicTree.TreeNode.Type("ItemGroupType")},this.nodeHeaderTemplateDomId="list_responsive_collapsible_folders_adhocAvailableTrees:folders"}return a.prototype=deepClone(dynamicTree.TreeNode.prototype),a.addMethod("refreshStyle",function(e){if(e=e||this._getElement()){var t=n.findFieldByName(this.param.id);if(t&&t.isCustomField){this.name=this.param.label=t.defaultDisplayName.replace(/\\'/g,"'").escapeHTML();var a=["calculatedField"];if(n.isInUse(this.param.id)&&a.push("dependency"),n.isInError(this.param.id)){a.push("inError");var o=e.getElementsByClassName("icon error");1==o.length&&(o=o[0]),o.classList.remove("hidden")}else{var o=e.getElementsByClassName("icon error");1==o.length&&(o=o[0]),o.classList.add("hidden")}this.param.cssClass=a.join(" ")}dynamicTree.TreeNode.prototype.refreshStyle.call(this,e)}}),new dynamicTree.TreeSupport(e,{providerId:t,rootUri:"/",showRoot:!1,resetStatesOnShow:!1,nodeClass:a,templateDomId:"list_responsive_collapsible_folders_adhocAvailableTrees",dragPattern:isIPad()?void 0:".draggable",treeErrorHandlerFn:doNothing,selectOnMousedown:!isIPad(),regionID:e?e:designerBase.AVAILABLE_FIELDS_AREA})},n});