/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

define(function(require){
    "use strict";

    require("jrs.configs");
    var _ = require("underscore");

    require("prototype");
    require("jquery");
    require("designer.base");
    require("components.toolbar");
    require("touchcontroller");
    require("core.layout");
    require("utils.common");
    require("adhoc/intelligentChart/adhocIntelligentChart");
    require("adhoc/crosstab.tests");
    require("adhoc/chart.observers");
    require("adhoc/table.init");
    require("actionModel.modelGenerator");
    require("adhoc/designer.calculatedFields");
    require("adhoc/designer.sort");
    require("adhoc/designer.reentrant");
    require("adhoc/layout.manager");
    require("adhoc/filter/FiltersController");
    require("adhoc/filter/OlapFiltersController");
    require("adhoc/filter/FilterService");
    require("dragdrop.extra.v0.5");
    require("org.rootObjectModifier");
    require("controls.adhoc");
    require("adhoc/crosstab.multiselect");

    var classUtil = require("common/util/classUtil");

    JRS.vars.current_flow = 'adhoc';
    var adhocSessionButton;
    var adhocSessionDialog;

    //TODO: remove while moving to full AMD env
    window.localContext = window;
    window.theBody = document.body;
    window.requestLogEnabled = false;
    window.TIMEOUT_INTERVAL = serverTimeoutInterval * 1000; //since intervals are in milli-secs we need to multiply by 1000
    window.ADHOC_SESSION_TIMEOUT_MESSAGE = adHocSessionExpireCode;
    window.ADHOC_EXIT_MESSAGE = adHocExitConfirmation;

    var adhocDesigner = {
        ui: {
            header_title: null,
            display_manager: null,
            canvas: null,
            dataMode: null
        },

        //member variables
        _leafSelectedFired : false,

        dimensionsTree : null,
        measuresTree : null,

        _availableTreeLastOpened : null,
        _AVAILABLE_TREE_DEPTH : 10,
        _cookieName : "lastNodeUri",
        _cookieTime : 3,
        FOLDER_TYPE : "ItemGroupType",
        multiSelect : false,

        //Name of measures dimension and measures level
        MEASURES : "Measures",

        //For OLAP mode
        DIMENSIONS_TREE_DOM_ID : "dimensionsTree",
        DIMENSIONS_TREE_PROVIDER_ID : "dimensionsTreeDataProvider",
        MEASURES_TREE_DOM_ID : "measuresTree",
        MEASURES_TREE_PROVIDER_ID : "measuresTreeDataProvider",

        TREE_CONTEXT_MENU_PATTERN: [
            'ul#dimensionsTree li.leaf .button',
            'ul#dimensionsTree li.node .button',
            'ul#measuresTree li.leaf .button',
            'ul#measuresTree li.node .button'],
        DIMENSION_TREE_DIMENSION_CONTEXT: "dimensionsTree_dimension",
        DIMENSION_TREE_LEVEL_CONTEXT: "dimensionsTree_level",
        MEASURE_TREE_GROUP_CONTEXT: "measuresTree_group",
        MEASURE_TREE_CONTEXT : "measuresTree",
        TREE_NODE_AND_LEAF_PATTERN:
            ['ul#visibleFieldsTree li.leaf', 'ul#visibleFieldsTree li.node',
                'ul#dimensionsTree li.leaf', 'ul#dimensionsTree li.node', 'ul#measuresTree li.node'],

        CANVAS_ID : "canvasTable",
        CANVAS_PARENT_ID : "mainTableContainer",
        CANVAS_PANEL_ID : "canvas",
        OLAP_MEASURES_TREE: "measuresTree",
        DISPLAY_MANAGER_ID: "displayManagerPanel",
        overlayParent : null,
        overlayDraggedColumn : null,
        initialDragXposition : null,
        NaN : "NaN",
        removeDroppables : null,
        addDroppables : null,
        DEFAULT_SUMMARY_NUM_FUNC : "Sum",
        DEFAULT_SUMMARY_NONNUM_FUNC : "DistinctCount",
        //patterns
        //table patterns
        COLUMN_OVERLAY_PATTERN : "div.overlay.col",
        GROUP_OVERLAY_PATTERN : "div.overlay.group",
        SUMMARY_OVERLAY_PATTERN : "div.overlay.summary",
        GROUP_LABEL_SPAN_PATTERN : "span.labelOverlay.label",
        COLUMN_SIZER_PATTERN : "div.columnSizer",

        ROW_OVERLAY_PATTERN : "div.rowOverlay",
        ROW_GROUP_OVERLAY_PATTERN : "div.rowGroupOverlay",
        COLUMN_GROUP_OVERLAY_PATTERN : "div.columnGroupOverlay",
        MEASURE_OVERLAY_PATTERN : "div.measureOverlay",

        XTAB_GROUP_HEADER_PATTERN : "th.label.group",
        XTAB_GROUP_OVERLAY_PATTERN : "div.overlay.xtab.gr",
        XTAB_GROUP_HEADER_OVERLAY_PATTERN : "div.overlay.xtab.header",

        XTAB_MEASURE_OVERLAY_PATTERN : "div.overlay.xtab.m",
        XTAB_MEASURE_HEADER_OVERLAY_PATTERN : "div.overlay.xtab.measure",

        ROW_GROUP_MEMBER_PATTERN : "tbody#detailRows tr td.label.member",
        COLUMN_GROUP_MEMBER_PATTERN : "thead#headerAxis th.label.member",
        LEGEND_OVERLAY_PATTERN : "div.legend.overlay",

        AVAILABLE_FIELDS_PATTERN : ["ul#visibleFieldsTree", "ul#dimensionsTree", "ul#measuresTree"],
        CANVAS_PATTERN : "table#canvasTable",
        MENU_PATTERN : "div#menu",
        CANVAS_PARENT_PATTERN : "div#mainTableContainer",
        EXPORT_FORM_PATTERN : "#exportActionForm",
        FILTER_OPERATOR_MENU_PATTERN : "#filter-container .button.operator",
        FILTER_GENERAL_MENU_PATTERN : "#filter-container #filterPanelMutton",
        FILTER_ITEM_MENU_PATTERN : "#filter-container .button.mutton",

        SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG: {
            DIALOG_ID: "saveWithoutFiltersApplyConfirmationDialog",
            OK_BUTTON_ID: "saveWithoutFiltersApplyConfirmationDialogOK",
            CANCEL_BUTTON_ID: "saveWithoutFiltersApplyConfirmationDialogCancel"
        },

        DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG: {
            DIALOG_ID: "deleteCalculatedFieldConfirmationDialog",
            OK_BUTTON_ID: "deleteCalculatedFieldConfirmationDialogOK",
            CANCEL_BUTTON_ID: "deleteCalculatedFieldConfirmationDialogCancel"
        },

        ///////////////////////////////////////////
        //Type conversation constants
        ///////////////////////////////////////////

        INTEGER_JAVA_TYPES: ["java.lang.Byte", "java.lang.Integer", "java.lang.Short", "java.lang.Long", "java.math.BigInteger"],
        DECIMAL_JAVA_TYPES: ["java.lang.Float", "java.lang.Double", "java.math.BigDecimal", "java.lang.Number"],
        DATE_JAVA_TYPES: ["java.sql.Timestamp", "java.sql.Time", "java.sql.Date", "java.util.Date"],
        BOOLEAN_JAVA_TYPES: ["java.lang.Boolean"],

        DATE_TYPE_DISPLAY: "date",
        INTEGER_TYPE_DISPLAY: "int",
        DECIMAL_TYPE_DISPLAY: "dec",
        BOOLEAN_TYPE_DISPLAY: "bool",
        NOT_A_NUMBER_TYPE_DISPLAY: "NaN",

        //action array
        toolbarActionMap : {
            presentation : "adhocDesigner.goToPresentationView",
            explorer : "adhocDesigner.goToDesignView",
            execute : "adhocDesigner.saveAndRun",
            undo : "adhocDesigner.undo",
            redo : "adhocDesigner.redo",
            undoAll : "adhocDesigner.undoAll",
            pivot : "adhocDesigner.pivot",
            sort : "adhocDesigner.sort",
            controls : "adhocDesigner.launchDialogMenu",
            styles : "adhocDesigner.showAdhocThemePane",
            query : "adhocDesigner.showViewQueryDialog"
        },

        dialogESCFunctions : {
            save : "saveAs",
            saveDataViewAndReport : "saveDataViewAndReport",
            sort : "sortDialog",
            reentrant : "selectFields",
            editLabel: "editLabel"
        },

        contextMap: {
            table : AdHocTable,
            crosstab : AdHocCrosstab,
            olap_crosstab : AdHocCrosstab,
            chart : AdHocChart,
            ichart: AdhocIntelligentChart,
            olap_ichart: AdhocIntelligentChart
        },

        ///////////////////////////////////////////////////////////////
        // Type conversation helper functions
        ///////////////////////////////////////////////////////////////
        isIntegerType: function(type) {
            return adhocDesigner.INTEGER_JAVA_TYPES.indexOf(type) >= 0;
        },

        isDecimalType: function(type) {
            return adhocDesigner.DECIMAL_JAVA_TYPES.indexOf(type) >= 0;
        },

        isDateType: function(type) {
            return adhocDesigner.DATE_JAVA_TYPES.indexOf(type) >= 0;
        },

        isBooleanType: function(type) {
            return adhocDesigner.BOOLEAN_JAVA_TYPES.indexOf(type) >= 0;
        },

        getSuperType: function(type) {
            if (adhocDesigner.isIntegerType(type)) {
                return adhocDesigner.INTEGER_TYPE_DISPLAY;
            } else if (adhocDesigner.isDecimalType(type)) {
                return adhocDesigner.DECIMAL_TYPE_DISPLAY;
            } else if (adhocDesigner.isDateType(type)) {
                return adhocDesigner.DATE_TYPE_DISPLAY;
            } else {
                return adhocDesigner.NOT_A_NUMBER_TYPE_DISPLAY;
            }
        },

        /*
         * Todo: Should be refactored inline
         */
        getSelectedColumnOrGroup: function(){
            return selObjects[0];
        },
        generalDesignerCallback: function(){
            localContext.initAll();
            adhocDesigner.updateTrees();
        },

        //////////////////////////////////
        // Toolbar action handlers
        //////////////////////////////////

        launchDialogMenu: function(){
            adhocControls.launchDialog();
        },
        showViewQueryDialog: function() {
            adhocDesigner.viewQueryDialog.show();
        },
        sort: function(){
            adhocSort.launchDialog();
        },

        selectFields: function(){
            adhocReentrance.launchDialog();
        },

        //////////////////////////////////
        // Public designer interface
        //////////////////////////////////

        run: function(mode) {
            // Setup Web Help
            webHelpModule.setCurrentContext(mode.indexOf('olap') >= 0 ? "analysis" : "ad_hoc");
            // Init UI elements
            this.ui.dataMode = jQuery('#dataSizeSelector');
            this.ui.canvas = isSupportsTouch() ? jQuery('#mainTableContainer > .scrollWrapper') : jQuery('#mainTableContainer');
            this.ui.header_title = jQuery('#canvas > div.content > div.header > div.title');
            /*
             * Events
             */
            this.observePointerEvents();
            this.observeKeyEvents();
            this.observeCustomEvents();
            this.observeTableContainerEvents();
            /*
             * DnD
             */
            this.initDroppables();
            /*
             * Initialize Mode dependent Ad Hoc Designer components
             */
            this.initComponents(mode);

            this.loadState();
            /*
             * UI
             */
            if (window.isEmbeddedDesigner) {
                toolbarButtonModule.initialize(_.extend(this.toolbarActionMap, {
                    presentation: "doNothing",
                    "export": "doNothing",
                    save: "adhocDesigner.handleBack",
                    closeDesigner: "adhocDesigner.handleCancel"
                }), $("adhocToolbar"));

                adhocDesigner.observeCloseDesignerEvent();
                adhocDesigner.observeCrossDocumentMessages();
            } else {
                toolbarButtonModule.initialize(this.toolbarActionMap, $("adhocToolbar"));
            }


            if(isSupportsTouch()){
                var wrapper = this.ui.canvas.get(0);
                this._touchController = new TouchController(wrapper,wrapper.parentNode,{
                    useParent: true,
                    absolute: true,
                    scrollbars: true
                });
            }

            this.initTitle();
            this.initFiltersPanel();
            this.initPanelsState();
            this.initDialogs();
            typeof window.orientation !== 'undefined' && window.orientation === 0 && this.hideOnePanel();
            /*
             * Error on load?
             */
            $("errorPageContent") ? adhocDesigner.initEnableBrowserSelection($("designer")) : adhocDesigner.initPreventBrowserSelection($("designer"));
        },
        initLocalContext: function(mode) {
            // Set up local context variable
            localContext = this.contextMap[mode];
            localContext.setMode(mode);
            localContext.init && localContext.init(mode);

            adhocDesigner.resetState();
            localContext.reset();
        },
        initComponents: function(mode){
            // Init Crosstab mode variables
            this.isCrosstabMode = mode.indexOf('ichart') >= 0 || mode.indexOf('crosstab') >= 0;

            this.ui.canvas.empty();
            jQuery('#level-container').hide();
            jQuery('#dataModeSelector').val(mode);

            this.initLocalContext(mode);
            // Register Report Template
            if(mode.indexOf('ichart') < 0) adhocDesigner.registerTemplate(localContext, mode + "Template");
            // Init Layout Manager instance
            this.initLayoutManager(mode);
            // Update Data Mode panel appearance
            (mode.indexOf('chart') >= 0 || mode.indexOf('olap') >= 0) ? this.ui.dataMode.hide() : this.ui.dataMode.show();
            // Prepare axes labels
            jQuery('#columns').children().eq(0).html(layoutManagerLabels.column[mode]);
            jQuery('#rows').children().eq(0).html(layoutManagerLabels.row[mode]);
        },
        render: function(){
            var state = localContext.state;
            toolbarButtonModule.setActionModel(state.actionmodel);

            if(localContext.getMode() != designerBase.ICHART &&
                localContext.getMode() != designerBase.OLAP_ICHART ) {
                adhocDesigner.ui.canvas.empty();
            }
            adhocDesigner.updateCanvasClasses(adhocDesigner.isCrosstabMode);

            var isDataRendered = localContext.render();

            if (isDesignView) {  //save and undo buttons are disabled in report display view
                adhocDesigner.enableCanUndoRedo();
                adhocDesigner.enableRunAndSave(localContext.canSaveReport());
            }

            if(isDataRendered) {
                editor = null;
                designerBase.initAdhocSpecificDesignerBaseVar();
                designerBase.setState();
                designerBase.updateSessionWarning();
                designerBase.updateFlowKey();
                if (localContext.initAll) {
                    localContext.initAll();
                }

                // Fixed bug # 37348:
                // TODO: find out why should deselect items. If deselection confirmed - then the tree node should be also deselected. Fix it!
//                designerBase.unSelectAll();
            }

            if (isDesignView && adhocDesigner.isDisplayManagerVisible()) {
                jQuery("#" + adhocDesigner.DISPLAY_MANAGER_ID).removeClass(layoutModule.HIDDEN_CLASS);
            }

            adhocDesigner.updateModeLabelSelection(state.viewType);
            adhocDesigner.updateDataMode(state.dataSize);


            adhocDesigner.ui.display_manager.render(
                state.columns ?    { column : state.columns, group : state.groups } :
                    state.chartItems ? { measures: state.chartItems, group: state.group } :
                    { column : state.crosstabState.columnGroups, row : state.crosstabState.rowGroups});

            jQuery('#designer').trigger('layout_update');

            adhocDesigner.resetScroll();

            //save and undo buttons are disabled in report display view
            if (isDesignView) {
                adhocDesigner.enableRunAndSave(localContext.canSaveReport());
            }
            adhocDesigner.enableSort(state.viewType == 'table');
            adhocDesigner.viewQueryDialog.updateContent(state.query);
            jQuery('#designer').trigger('rendering:done');
        },
        resetState: function() {
            localContext.state = new adhocDesigner.State({});
        },
        updateState: function(state) {
            localContext.state.update(state);
        },
        updateModeLabelSelection: function(mode){
            jQuery('#dataModeSelector').val(mode);
        },
        updateDataMode: function(datasize){
            jQuery('#dataSizeSelector').val(datasize);
        },
        setNothingToDisplayVisibility : function(visible) {
            if(visible) {
                jQuery('#titleCaption').css('min-width','400px');
                jQuery('#nothingToDisplay').removeClass(layoutModule.HIDDEN_CLASS);
                centerElement($('nothingToDisplay'), {horz: true, vert: true});
                /*
                 * TODO: put layout positioning code into layout related code. Should be handled through media CSS queries.
                 */
                if (isIPad()) {
                    var elem = $('nothingToDisplay');
                    var theWidth = parseInt(elem.getStyle('width'));
                    var theBufferedWidth = theWidth + getBufferWidth(elem, true);
                    var e = jQuery('#displayManager');
                    var parentWidth = e ? e.width() : elem.up(1).getWidth();

                    elem.style.marginLeft = (theWidth/2) + 'px';
                    elem.style.left = '0%';

                    elem.style.position = 'relative';
                    elem.style.minWidth = '300px';
                }
            } else {
                jQuery('#titleCaption').css('min-width','');
                jQuery('#nothingToDisplay').addClass(layoutModule.HIDDEN_CLASS);
            }
        },
        updateCanvasClasses : function (isCrosstabMode) {
            jQuery('#' + adhocDesigner.CANVAS_PANEL_ID)[(isCrosstabMode ? 'add' : 'remove') + 'Class']('showingSubHeader OLAP');
        },
        showSaveConfirmationDialog: function(callback) {
            var confirmDialog = jQuery("#" + adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.DIALOG_ID);

            dialogs.popupConfirm.show(confirmDialog[0], false, {
                okButtonSelector: '#' + adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.OK_BUTTON_ID,
                cancelButtonSelector: '#' + adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID
            }).done(callback);
        },
        resetScroll: function() {
            if (adhocDesigner._touchController) {
                adhocDesigner._touchController.reset();
                adhocDesigner._touchController.addPadding('canvasTable',{right:200});
            }
        },
        resetFilterPanelState: function(){
            // if user did not manually expand/collapse filter panel we will show or hide it depending on conditions
            if (!layoutModule.panelStateWasManuallyChanged("filters", clientKey)) {
                // Expand filter panel if there are any filters or Chart Data Level's sliders, otherwise  - collapse it.
                if (adhocDesigner.filtersController.collection.length > 0 || jQuery("#level-container .sliderTick").length > 0) {
                    layoutModule.maximize($("filters"), true);
                } else {
                    layoutModule.minimize($("filters"), true);
                }
            } else {
                layoutModule[layoutModule.getPanelMinimizedState('filters') === "true" ? "minimize" : "maximize"]($("filters"), true);
            }
        },
        canShowFilterOption: function (errorMessages) {
            var canShow = true;
            for (var i = 0; i < selObjects.length; i++) {
                if (!localContext.canAddFilter(selObjects[i], errorMessages)) {
                    canShow = false;
                    break;
                }
            }
            return canShow;
        },
        getMode : function() {
            return localContext.getMode();
        },

        isOlapMode : function() {
            return localContext.getMode().indexOf("olap") > -1;
        }
    };

    adhocDesigner.State = function(state) {
        this.update(state);
        classUtil.mixin(this, localContext.State);
    };

    adhocDesigner.State.prototype.update = function(newState) {
        _.extend(this, newState);
    };

    //TODO: remove while moving to full AMD env
    window.adhocDesigner = adhocDesigner;
    window.adhocSessionButton = adhocSessionButton;
    window.adhocSessionDialog = adhocSessionDialog;

    return adhocDesigner;

});
