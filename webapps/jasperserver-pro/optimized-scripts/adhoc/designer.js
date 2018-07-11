define(["require","jrs.configs","underscore","prototype","jquery","designer.base","components.toolbar","touchcontroller","core.layout","utils.common","adhoc/intelligentChart/adhocIntelligentChart","adhoc/crosstab.tests","adhoc/chart.observers","adhoc/table.init","actionModel.modelGenerator","adhoc/designer.calculatedFields","adhoc/designer.sort","adhoc/designer.reentrant","adhoc/layout.manager","adhoc/filter/FiltersController","adhoc/filter/OlapFiltersController","adhoc/filter/FilterService","dragdrop.extra.v0.5","org.rootObjectModifier","controls.adhoc","adhoc/crosstab.multiselect","common/util/classUtil"],function(e){"use strict";e("jrs.configs");var t=e("underscore");e("prototype"),e("jquery"),e("designer.base"),e("components.toolbar"),e("touchcontroller"),e("core.layout"),e("utils.common"),e("adhoc/intelligentChart/adhocIntelligentChart"),e("adhoc/crosstab.tests"),e("adhoc/chart.observers"),e("adhoc/table.init"),e("actionModel.modelGenerator"),e("adhoc/designer.calculatedFields"),e("adhoc/designer.sort"),e("adhoc/designer.reentrant"),e("adhoc/layout.manager"),e("adhoc/filter/FiltersController"),e("adhoc/filter/OlapFiltersController"),e("adhoc/filter/FilterService"),e("dragdrop.extra.v0.5"),e("org.rootObjectModifier"),e("controls.adhoc"),e("adhoc/crosstab.multiselect");var o=e("common/util/classUtil");JRS.vars.current_flow="adhoc";var a,i;window.localContext=window,window.theBody=document.body,window.requestLogEnabled=!1,window.TIMEOUT_INTERVAL=1e3*serverTimeoutInterval,window.ADHOC_SESSION_TIMEOUT_MESSAGE=adHocSessionExpireCode,window.ADHOC_EXIT_MESSAGE=adHocExitConfirmation;var n={ui:{header_title:null,display_manager:null,canvas:null,dataMode:null},_leafSelectedFired:!1,dimensionsTree:null,measuresTree:null,_availableTreeLastOpened:null,_AVAILABLE_TREE_DEPTH:10,_cookieName:"lastNodeUri",_cookieTime:3,FOLDER_TYPE:"ItemGroupType",multiSelect:!1,MEASURES:"Measures",DIMENSIONS_TREE_DOM_ID:"dimensionsTree",DIMENSIONS_TREE_PROVIDER_ID:"dimensionsTreeDataProvider",MEASURES_TREE_DOM_ID:"measuresTree",MEASURES_TREE_PROVIDER_ID:"measuresTreeDataProvider",TREE_CONTEXT_MENU_PATTERN:["ul#dimensionsTree li.leaf .button","ul#dimensionsTree li.node .button","ul#measuresTree li.leaf .button","ul#measuresTree li.node .button"],DIMENSION_TREE_DIMENSION_CONTEXT:"dimensionsTree_dimension",DIMENSION_TREE_LEVEL_CONTEXT:"dimensionsTree_level",MEASURE_TREE_GROUP_CONTEXT:"measuresTree_group",MEASURE_TREE_CONTEXT:"measuresTree",TREE_NODE_AND_LEAF_PATTERN:["ul#visibleFieldsTree li.leaf","ul#visibleFieldsTree li.node","ul#dimensionsTree li.leaf","ul#dimensionsTree li.node","ul#measuresTree li.node"],CANVAS_ID:"canvasTable",CANVAS_PARENT_ID:"mainTableContainer",CANVAS_PANEL_ID:"canvas",OLAP_MEASURES_TREE:"measuresTree",DISPLAY_MANAGER_ID:"displayManagerPanel",overlayParent:null,overlayDraggedColumn:null,initialDragXposition:null,NaN:"NaN",removeDroppables:null,addDroppables:null,DEFAULT_SUMMARY_NUM_FUNC:"Sum",DEFAULT_SUMMARY_NONNUM_FUNC:"DistinctCount",COLUMN_OVERLAY_PATTERN:"div.overlay.col",GROUP_OVERLAY_PATTERN:"div.overlay.group",SUMMARY_OVERLAY_PATTERN:"div.overlay.summary",GROUP_LABEL_SPAN_PATTERN:"span.labelOverlay.label",COLUMN_SIZER_PATTERN:"div.columnSizer",ROW_OVERLAY_PATTERN:"div.rowOverlay",ROW_GROUP_OVERLAY_PATTERN:"div.rowGroupOverlay",COLUMN_GROUP_OVERLAY_PATTERN:"div.columnGroupOverlay",MEASURE_OVERLAY_PATTERN:"div.measureOverlay",XTAB_GROUP_HEADER_PATTERN:"th.label.group",XTAB_GROUP_OVERLAY_PATTERN:"div.overlay.xtab.gr",XTAB_GROUP_HEADER_OVERLAY_PATTERN:"div.overlay.xtab.header",XTAB_MEASURE_OVERLAY_PATTERN:"div.overlay.xtab.m",XTAB_MEASURE_HEADER_OVERLAY_PATTERN:"div.overlay.xtab.measure",ROW_GROUP_MEMBER_PATTERN:"tbody#detailRows tr td.label.member",COLUMN_GROUP_MEMBER_PATTERN:"thead#headerAxis th.label.member",LEGEND_OVERLAY_PATTERN:"div.legend.overlay",AVAILABLE_FIELDS_PATTERN:["ul#visibleFieldsTree","ul#dimensionsTree","ul#measuresTree"],CANVAS_PATTERN:"table#canvasTable",MENU_PATTERN:"div#menu",CANVAS_PARENT_PATTERN:"div#mainTableContainer",EXPORT_FORM_PATTERN:"#exportActionForm",FILTER_OPERATOR_MENU_PATTERN:"#filter-container .button.operator",FILTER_GENERAL_MENU_PATTERN:"#filter-container #filterPanelMutton",FILTER_ITEM_MENU_PATTERN:"#filter-container .button.mutton",SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG:{DIALOG_ID:"saveWithoutFiltersApplyConfirmationDialog",OK_BUTTON_ID:"saveWithoutFiltersApplyConfirmationDialogOK",CANCEL_BUTTON_ID:"saveWithoutFiltersApplyConfirmationDialogCancel"},DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG:{DIALOG_ID:"deleteCalculatedFieldConfirmationDialog",OK_BUTTON_ID:"deleteCalculatedFieldConfirmationDialogOK",CANCEL_BUTTON_ID:"deleteCalculatedFieldConfirmationDialogCancel"},INTEGER_JAVA_TYPES:["java.lang.Byte","java.lang.Integer","java.lang.Short","java.lang.Long","java.math.BigInteger"],DECIMAL_JAVA_TYPES:["java.lang.Float","java.lang.Double","java.math.BigDecimal","java.lang.Number"],DATE_JAVA_TYPES:["java.sql.Timestamp","java.sql.Time","java.sql.Date","java.util.Date"],BOOLEAN_JAVA_TYPES:["java.lang.Boolean"],DATE_TYPE_DISPLAY:"date",INTEGER_TYPE_DISPLAY:"int",DECIMAL_TYPE_DISPLAY:"dec",BOOLEAN_TYPE_DISPLAY:"bool",NOT_A_NUMBER_TYPE_DISPLAY:"NaN",toolbarActionMap:{presentation:"adhocDesigner.goToPresentationView",explorer:"adhocDesigner.goToDesignView",execute:"adhocDesigner.saveAndRun",undo:"adhocDesigner.undo",redo:"adhocDesigner.redo",undoAll:"adhocDesigner.undoAll",pivot:"adhocDesigner.pivot",sort:"adhocDesigner.sort",controls:"adhocDesigner.launchDialogMenu",styles:"adhocDesigner.showAdhocThemePane",query:"adhocDesigner.showViewQueryDialog"},dialogESCFunctions:{save:"saveAs",saveDataViewAndReport:"saveDataViewAndReport",sort:"sortDialog",reentrant:"selectFields",editLabel:"editLabel"},contextMap:{table:AdHocTable,crosstab:AdHocCrosstab,olap_crosstab:AdHocCrosstab,chart:AdHocChart,ichart:AdhocIntelligentChart,olap_ichart:AdhocIntelligentChart},isIntegerType:function(e){return n.INTEGER_JAVA_TYPES.indexOf(e)>=0},isDecimalType:function(e){return n.DECIMAL_JAVA_TYPES.indexOf(e)>=0},isDateType:function(e){return n.DATE_JAVA_TYPES.indexOf(e)>=0},isBooleanType:function(e){return n.BOOLEAN_JAVA_TYPES.indexOf(e)>=0},getSuperType:function(e){return n.isIntegerType(e)?n.INTEGER_TYPE_DISPLAY:n.isDecimalType(e)?n.DECIMAL_TYPE_DISPLAY:n.isDateType(e)?n.DATE_TYPE_DISPLAY:n.NOT_A_NUMBER_TYPE_DISPLAY},getSelectedColumnOrGroup:function(){return selObjects[0]},generalDesignerCallback:function(){localContext.initAll(),n.updateTrees()},launchDialogMenu:function(){adhocControls.launchDialog()},showViewQueryDialog:function(){n.viewQueryDialog.show()},sort:function(){adhocSort.launchDialog()},selectFields:function(){adhocReentrance.launchDialog()},run:function(e){if(webHelpModule.setCurrentContext(e.indexOf("olap")>=0?"analysis":"ad_hoc"),this.ui.dataMode=jQuery("#dataSizeSelector"),this.ui.canvas=isSupportsTouch()?jQuery("#mainTableContainer > .scrollWrapper"):jQuery("#mainTableContainer"),this.ui.header_title=jQuery("#canvas > div.content > div.header > div.title"),this.observePointerEvents(),this.observeKeyEvents(),this.observeCustomEvents(),this.observeTableContainerEvents(),this.initDroppables(),this.initComponents(e),this.loadState(),window.isEmbeddedDesigner?(toolbarButtonModule.initialize(t.extend(this.toolbarActionMap,{presentation:"doNothing","export":"doNothing",save:"adhocDesigner.handleBack",closeDesigner:"adhocDesigner.handleCancel"}),$("adhocToolbar")),n.observeCloseDesignerEvent(),n.observeCrossDocumentMessages()):toolbarButtonModule.initialize(this.toolbarActionMap,$("adhocToolbar")),isSupportsTouch()){var o=this.ui.canvas.get(0);this._touchController=new TouchController(o,o.parentNode,{useParent:!0,absolute:!0,scrollbars:!0})}this.initTitle(),this.initFiltersPanel(),this.initPanelsState(),this.initDialogs(),"undefined"!=typeof window.orientation&&0===window.orientation&&this.hideOnePanel(),$("errorPageContent")?n.initEnableBrowserSelection($("designer")):n.initPreventBrowserSelection($("designer"))},initLocalContext:function(e){localContext=this.contextMap[e],localContext.setMode(e),localContext.init&&localContext.init(e),n.resetState(),localContext.reset()},initComponents:function(e){this.isCrosstabMode=e.indexOf("ichart")>=0||e.indexOf("crosstab")>=0,this.ui.canvas.empty(),jQuery("#level-container").hide(),jQuery("#dataModeSelector").val(e),this.initLocalContext(e),e.indexOf("ichart")<0&&n.registerTemplate(localContext,e+"Template"),this.initLayoutManager(e),e.indexOf("chart")>=0||e.indexOf("olap")>=0?this.ui.dataMode.hide():this.ui.dataMode.show(),jQuery("#columns").children().eq(0).html(layoutManagerLabels.column[e]),jQuery("#rows").children().eq(0).html(layoutManagerLabels.row[e])},render:function(){var e=localContext.state;toolbarButtonModule.setActionModel(e.actionmodel),localContext.getMode()!=designerBase.ICHART&&localContext.getMode()!=designerBase.OLAP_ICHART&&n.ui.canvas.empty(),n.updateCanvasClasses(n.isCrosstabMode);var t=localContext.render();isDesignView&&(n.enableCanUndoRedo(),n.enableRunAndSave(localContext.canSaveReport())),t&&(editor=null,designerBase.initAdhocSpecificDesignerBaseVar(),designerBase.setState(),designerBase.updateSessionWarning(),designerBase.updateFlowKey(),localContext.initAll&&localContext.initAll()),isDesignView&&n.isDisplayManagerVisible()&&jQuery("#"+n.DISPLAY_MANAGER_ID).removeClass(layoutModule.HIDDEN_CLASS),n.updateModeLabelSelection(e.viewType),n.updateDataMode(e.dataSize),n.ui.display_manager.render(e.columns?{column:e.columns,group:e.groups}:e.chartItems?{measures:e.chartItems,group:e.group}:{column:e.crosstabState.columnGroups,row:e.crosstabState.rowGroups}),jQuery("#designer").trigger("layout_update"),n.resetScroll(),isDesignView&&n.enableRunAndSave(localContext.canSaveReport()),n.enableSort("table"==e.viewType),n.viewQueryDialog.updateContent(e.query),jQuery("#designer").trigger("rendering:done")},resetState:function(){localContext.state=new n.State({})},updateState:function(e){localContext.state.update(e)},updateModeLabelSelection:function(e){jQuery("#dataModeSelector").val(e)},updateDataMode:function(e){jQuery("#dataSizeSelector").val(e)},setNothingToDisplayVisibility:function(e){if(e){if(jQuery("#titleCaption").css("min-width","400px"),jQuery("#nothingToDisplay").removeClass(layoutModule.HIDDEN_CLASS),centerElement($("nothingToDisplay"),{horz:!0,vert:!0}),isIPad()){var t=$("nothingToDisplay"),o=parseInt(t.getStyle("width")),a=(o+getBufferWidth(t,!0),jQuery("#displayManager"));a?a.width():t.up(1).getWidth();t.style.marginLeft=o/2+"px",t.style.left="0%",t.style.position="relative",t.style.minWidth="300px"}}else jQuery("#titleCaption").css("min-width",""),jQuery("#nothingToDisplay").addClass(layoutModule.HIDDEN_CLASS)},updateCanvasClasses:function(e){jQuery("#"+n.CANVAS_PANEL_ID)[(e?"add":"remove")+"Class"]("showingSubHeader OLAP")},showSaveConfirmationDialog:function(e){var t=jQuery("#"+n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.DIALOG_ID);dialogs.popupConfirm.show(t[0],!1,{okButtonSelector:"#"+n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.OK_BUTTON_ID,cancelButtonSelector:"#"+n.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID}).done(e)},resetScroll:function(){n._touchController&&(n._touchController.reset(),n._touchController.addPadding("canvasTable",{right:200}))},resetFilterPanelState:function(){layoutModule.panelStateWasManuallyChanged("filters",clientKey)?layoutModule["true"===layoutModule.getPanelMinimizedState("filters")?"minimize":"maximize"]($("filters"),!0):n.filtersController.collection.length>0||jQuery("#level-container .sliderTick").length>0?layoutModule.maximize($("filters"),!0):layoutModule.minimize($("filters"),!0)},canShowFilterOption:function(e){for(var t=!0,o=0;o<selObjects.length;o++)if(!localContext.canAddFilter(selObjects[o],e)){t=!1;break}return t},getMode:function(){return localContext.getMode()},isOlapMode:function(){return localContext.getMode().indexOf("olap")>-1}};return n.State=function(e){this.update(e),o.mixin(this,localContext.State)},n.State.prototype.update=function(e){t.extend(this,e)},window.adhocDesigner=n,window.adhocSessionButton=a,window.adhocSessionDialog=i,n});