/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function (require, exports, module) {
    /* global designerBase, console, dialogs, adhocDesigner, Mustache, isDesignView, layoutManagerLabels, isIPad,
     actionModel, encodeText, localContext, alert,
     addFilterErrorMessageMeasureAdd, addFilterErrorMessageAllLevelAdd, addFilterErrorMessageGroupAdd,
     addFilterErrorMessageSpacerAdd, addFilterErrorMessagePercentOfParentCalcFieldAdd, addFilterErrorMessageConstantAdd,
     addFilterErrorMessage, selObjects, AdHocCrosstabm, dynamicTree, defaultMasks, selectionCategory,
     AdHocCrosstab, addFilterErrorMessageAnotherHierarchy, isNotNullORUndefined, field
     */
    "use strict";

    var jQuery = require("jquery"),
        _ = require("underscore"),
        xssUtil = require("xssUtil"),
        i18n = require("bundle!all"),

        Highcharts = require("highcharts"),
        AdhocHighchartsAdapter = require("adhoc/api/chart/adhocToHighchartsAdapter"),
        AdhocDataProcessor = require("adhoc/api/chart/adhocToHighchartsAdapter/adhocDataProcessor"),

        highchartsDataMapper = require("adhoc/api/chart/adhocToHighchartsAdapter/highchartsDataMapper"),
        FormattingDialogModel = require("adhoc/intelligentChart/formattingDialog/model/FormattingDialogModel"),
        FormattingDialogView = require("adhoc/intelligentChart/formattingDialog/view/FormattingDialogView"),
        log = require("logger").register(module);

    require("jquery.ui");
    require("prototype");
    require("utils.common");
    require("designer.base");


    /**
     * Holds all core functionality for Ad Hoc charts.
     *
     * @type {Object}
     */
    var AdhocIntelligentChart = {};

    /**
     * This is short alias for AdhocIntelligentChart object.
     *
     * @type {Object}
     */
    var AIC = AdhocIntelligentChart;

    _.extend(AIC, {
        debug: false,
        mode: null,
        controller: "ich",
        state: {},
        cache: [],
        initd: false,
        hasAllData: false,
        groupLevel: {
            column: 0,
            row: 0
        },
        firstRendering: true,
        chartContainerSelector: "#chartContainer",

        reset: function () {
            AIC.isDesignerInitialized = false;
        },

        setMode: function (arg) {
            this.mode = arg;
        },

        getMode: function () {
            return this.mode;
        },

        flush: function () {
            this.hasAllData = false;
            this.cache = [];
        },

        setUp: function () {
            // No-op.
        },

        isOLAP: function () {
            return this.getMode() === designerBase.OLAP_ICHART;
        },

        isOlapMode: function () {
            return this.getMode() === designerBase.OLAP_ICHART;
        },

        isNonOlapMode: function () {
            return this.getMode() === designerBase.ICHART;
        },

        update: function (state) {
            try {
                AIC.setUp();

                _.extend(this.state, state);
            } catch (error) {
                if (AIC.debug) {
                    console.log("AIC.update:   caught error " + error + " restore state to previous");
                }
                adhocDesigner.undo();

                // TODO: i18n required.
                dialogs.systemConfirm.show("The previous request encountered an error '" + error +
                    "' restoring chart to previous state");
            }

            return this;
        },

        render: function () {
            //var test = new HighChartUnitTests();
            //test.run();
            var hasData = AIC.state.queryData.data.length > 0;
            var hasUnresolvedReferences = AIC.state.unresolvedReferences && AIC.state.unresolvedReferences.length > 0;

            var msg = hasUnresolvedReferences
                    ? adhocDesigner.getMissingFieldsCanvasMessage(AIC.state)
                    : adhocDesigner.getMessage("ADH_1214_ICHARTS_NO_DATA");

            jQuery("#nothingToDisplayMessage").html(msg);

            adhocDesigner.setNothingToDisplayVisibility(!hasData || hasUnresolvedReferences);
            if (AIC.chart && AIC.state.isRedrawRequired === true) {
                AIC.chart.destroy();
                AIC.chart = undefined;
            }

            // Update UI data.
            AIC.ui.update(AIC.state);

            // Render UI data.
            AIC.ui.render();

            hasData = AIC.renderChart(hasData);

            AIC.isDesignerInitialized = true;

            jQuery("[action='chart-format']").removeClass("disabled");

            return hasData;
        },

        checkChartDataOnClientSide: function () {

            if (!AIC.state.queryData.metadata.canRender) {
                // if server side decided we can't render chart... well, yeah, why not...
                return;
            }

            var metadata = AIC.state.queryData.metadata;
            var rowAxeInd = metadata.measureAxis === 1 ? 0 : 1;
            var measureAxeInd = metadata.measureAxis === 1 ? 1 : 0;
            var chartType = AIC.state.chartState.chartType;

            var measuresAmount = metadata.measures.length;
            var fieldsAmount = metadata.axes[rowAxeInd].length;
            var itemsOnMeasureAxe = metadata.axes[measureAxeInd].length;
            var measuresAxeName = metadata.measureAxis === 0 ? "row" : "column";
            var fieldsAxeName = metadata.measureAxis === 1 ? "row" : "column";

            //console.log(AIC.state.queryData);
            //console.log("amount of fields (located in " + fieldsAxeName + "): ", fieldsAmount);
            //console.log("amount of measures (located in " + measuresAxeName + "): ", measuresAmount);
            //console.log("amount of items on measure axe: ", itemsOnMeasureAxe);

            var canRender = true;
            var isOlap = (AIC.state.viewType === "olap_ichart");

            if (chartType === "dual_measure_tree_map") {
                // Requires:
                // Two Measures in the Columns location.
                // One Field in the Rows location.

                canRender = measuresAxeName === "column" && measuresAmount === 2 && fieldsAmount === 1 && !isOlap;

                // we deny mixing measures and fields on the same axe.
                // 'itemsOnMeasureAxe === 1' means there are only measures and no fields
                canRender = canRender && itemsOnMeasureAxe === 1;
            }
            else if (chartType === "tree_map") {
                // Requires:
                // One Measure in the Columns location.
                // One or more Fields in the Rows location.

                canRender = measuresAxeName === "column" && measuresAmount === 1 && fieldsAmount >= 1 && !isOlap;

                // we deny mixing measures and fields on the same axe.
                // 'itemsOnMeasureAxe === 1' means there are only measures and no fields
                canRender = canRender && itemsOnMeasureAxe === 1;
            }
            else if (chartType === "one_parent_tree_map") {
                // Requires:
                // One Measure in the Columns location.
                // Two or more Fields in the Rows location.
                // Builds the chart with only one parent level

                canRender = measuresAxeName === "column" && measuresAmount === 1 && fieldsAmount >= 2 && !isOlap;

                // we deny mixing measures and fields on the same axe.
                // 'itemsOnMeasureAxe === 1' means there are only measures and no fields
                canRender = canRender && itemsOnMeasureAxe === 1;
            }

            if (!canRender) {
                AIC.state.queryData.metadata.canRender = canRender;
            }
        },

        renderChart: function (hasData) {
            // For first rendering we do late rendering. This is because of bug 32104.
            if (!AIC.firstRendering && AIC.state.queryData.data.length) {
                if (AIC.debug) {
                    console.info(AIC.state);
                }

                this.checkChartDataOnClientSide();

                var displayMessage;
                if (AIC.state.queryData.metadata.canRender === false) {
                    var chartType = AIC.state.chartState.chartType;
                    if (AIC._isTimeSeries() && !highchartsDataMapper.isHeatMapTimeSeriesChart(chartType)) {
                        displayMessage = adhocDesigner.getMessage("ADH_1214_ICHARTS_NO_TIME_SERIES_DATA");
                    } else if (highchartsDataMapper.isDualOrMultiAxisChart(chartType) ||
                        highchartsDataMapper.isScatterChart(chartType) ||
                        highchartsDataMapper.isBubbleChart(chartType)) {
                        displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_" + chartType.toUpperCase()];
                    } else if (highchartsDataMapper.isDualLevelPieChart(chartType)) {
                        displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_DUAL_LEVEL_PIE"];
                    } else if (highchartsDataMapper.isHeatMapChart(chartType) && !adhocDesigner.isOlapMode()) {
                        displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_NON_OLAP"];
                    } else if (highchartsDataMapper.isHeatMapChart(chartType) && adhocDesigner.isOlapMode()) {
                        displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_OLAP"];
                    } else if (highchartsDataMapper.isHeatMapTimeSeriesChart(chartType)) {
                        displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_TIME_SERIES_HEAT_MAP"];
                        //} else if (highchartsDataMapper.isSpeedometerChart(chartType)) {
                        //    displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_SPEEDOMETER"];
                        //} else if (highchartsDataMapper.isArcGaugeChart(chartType)) {
                        //    displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_NO_DATA_GAUGE"];
                    } else if (highchartsDataMapper.isDualMeasureTreeMapChart(chartType)) {
                        displayMessage = i18n["ADH_1214_ICHARTS_NO_DATA_DUAL_MEASURE_TREE_MAP"];
                    } else if (highchartsDataMapper.isTreeMapChart(chartType)) {
                        displayMessage = i18n["ADH_1214_ICHARTS_NO_DATA_TREE_MAP"];
                    } else if (highchartsDataMapper.isOneParentTreeMapChart(chartType)) {
                        displayMessage = i18n["ADH_1214_ICHARTS_NO_DATA_ONE_PARENT_TREE_MAP"];
                    } else {
                        displayMessage = "Unknown chart type group.";
                    }

                    jQuery("#nothingToDisplayMessage").text(displayMessage);


                    adhocDesigner.setNothingToDisplayVisibility(true);
                    if (AIC.chart) {
                        AIC.chart.destroy();
                        AIC.chart = undefined;
                    }
                } else {
                    var chartContainer = jQuery(AIC.chartContainerSelector);
                    // Store view port size to detect if resize is required on layout update.
                    AIC.ichWidth = chartContainer.width();
                    AIC.ichHeight = chartContainer.height();
                    var highchartsOptions = AdhocHighchartsAdapter.generateOptions(AIC.state.queryData,
                        AIC.state.chartState, {
                            width: AIC.ichWidth,
                            height: AIC.ichHeight,
                            messages: adhocDesigner.messages
                        });

                    if (AIC._checkHasData(highchartsOptions)) {
                        hasData = true;
                        if (AIC.state.isRedrawRequired === true || !AIC.chart) {
                            AIC._setAutoScaleFonts();
                            // catch highcharts error #38195

                            try {

                                AIC.chart = new Highcharts.Chart(highchartsOptions);
                            } catch (e) {
                                log.error(e);

                                if (/\#12/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_12"];
                                } else if (/\#13/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_13"];
                                } else if (/\#14/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_14"];
                                } else if (/\#15/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_15"];
                                } else if (/\#16/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_16"];
                                } else if (/\#17/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_17"];
                                } else if (/\#18/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_18"];
                                } else if (/\#19/.test(e)) {
                                    displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_ERROR_TOO_MANY_VALUES"];
                                } else if (/\#20/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_20"];
                                } else if (/\#21/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_21"];
                                } else if (/\#22/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_22"];
                                } else if (/\#23/.test(e)) {
                                    displayMessage = i18n["ADH_1214_ICHARTS_ERROR_23"];
                                } else {
                                    displayMessage = adhocDesigner.messages["ADH_1214_ICHARTS_ERROR_UNCAUGHT"];
                                }

                                _.each(Highcharts.charts, function (chart) {
                                    chart && chart.destroy();
                                });

                                AIC.state.canSave = false;
                                adhocDesigner.enableRunAndSave(false);

                                jQuery("#nothingToDisplayMessage").text(displayMessage);
                                adhocDesigner.setNothingToDisplayVisibility(true);

                                if (AIC.chart) {
                                    AIC.chart.destroy();
                                    AIC.chart = undefined;
                                }
                                hasData = false;
                            }
                        }
                    } else {
                        //
                        // http://bugzilla.jaspersoft.com/show_bug.cgi?id=29278
                        //
                        // 2012-10-09 thorick
                        //
                        // the current state:  hasData AND !highchartsOptions.hasData
                        //   means that the query has returned some results
                        //   but the chart level rendering does NOT have results
                        //   this can happen if a Data Level selector is set at a level
                        //   which does not contain any results
                        //      (note:  a measure value of zero counts as a result)
                        //
                        hasData = false;
                        jQuery("#nothingToDisplayMessage").html(xssUtil.escape(adhocDesigner.getMessage("ADH_1214_ICHARTS_NO_CHART_DATA"), {softHTMLEscape: true}));
                        adhocDesigner.setNothingToDisplayVisibility(!hasData);
                    }

                    if (AIC.isOLAP()) {
                        AIC.state.olapDimensionInfo = AdhocDataProcessor.getOLAPDimensionInfo();
                    }

                    isDesignView && AIC._renderDataLevelSelector();
                }
            }

            return hasData;
        },

        redraw: function () {
            var chartContainer = jQuery(AIC.chartContainerSelector);

            // Update only in case view port size was changed.
            if (AIC.ichWidth != chartContainer.width() || AIC.ichHeight != chartContainer.height()) {
                // Switch off animation if height was changed.
                // Horizontal resize with animation causes invalid rendering of labels (see bug #33531).
                var animation = AIC.ichHeight == chartContainer.height();

                AIC.ichWidth = chartContainer.width();
                AIC.ichHeight = chartContainer.height();

                if (AIC._setAutoScaleFonts()) {
                    AIC.render();
                } else {
                    AIC.chart.setSize(AIC.ichWidth, AIC.ichHeight, animation);
                }
            }
        },
        _setAutoScaleFonts: function () {
            var chartContainer = jQuery(AIC.chartContainerSelector);
            if (!AIC.state.chartState.autoScaleFonts) {
                if (typeof AIC.autoScaleFontsSize !== "undefined") {
                    chartContainer.css("font-size", AIC.autoScaleFontsSize);
                }
                return false;
            }

            if (typeof AIC.autoScaleFontsSize === "undefined") {
                AIC.autoScaleFontsSize = parseInt(chartContainer.css("font-size"));
            }
            var scale = 1;
            if (AIC.ichWidth <= 100) {
                scale = 0.4
            } else if (AIC.ichWidth > 100 && AIC.ichWidth <= 200) {
                scale = 0.5
            } else if (AIC.ichWidth > 200 && AIC.ichWidth <= 300) {
                scale = 0.6
            } else if (AIC.ichWidth > 300 && AIC.ichWidth <= 400) {
                scale = 0.7
            } else if (AIC.ichWidth > 400 && AIC.ichWidth <= 500) {
                scale = 0.8
            } else if (AIC.ichWidth > 500 && AIC.ichWidth <= 600) {
                scale = 0.9
            }

            if (parseInt(chartContainer.css("font-size")) !== Math.round(AIC.autoScaleFontsSize * scale)) {
                chartContainer.css("font-size", AIC.autoScaleFontsSize * scale);
                return true;
            } else {
                return false;
            }
        },

        _isTimeSeries: function () {
            return AIC.state.chartState.chartType.indexOf("time_series") != -1;
        },

        _isDualMeasureTreeMap: function () {
            return AIC.state.chartState.chartType.indexOf("dual_measure_tree_map") != -1;
        },

        _isTimeSeriesHeatMap: function () {
            return highchartsDataMapper.isHeatMapTimeSeriesChart(AIC.state.chartState.chartType);
        },

        cleanupOnSwitch: function () {
            AIC.ui.controls.chartTypeSelector.hide();
            AIC.ui.dialogs.groupSelector.hide();
        },

        resize: function () {
            if (AIC.state.chartState.chartType == "pie" || highchartsDataMapper.isHeatMapTimeSeriesChart(AIC.state.chartState.chartType)) {
                AIC.render();
            }
        },

        // For first rendering we do late rendering. This is because of bug 32104.
        fixFirstRendering: function () {
            if (AIC.firstRendering) {
                AIC.firstRendering = false;

                AIC.renderChart();
            }
        },

        initAll: function () {
            // No-op.
        },
        //
        //  check to see if the highcharts Object has any data
        //  It is possible to have a query that returned data
        //  but a grouping level that contains NO data
        //
        _checkHasData: function (highchartsOptions) {
            if (!highchartsOptions)  return false;
            if (!highchartsOptions.series)  return false;

            if (highchartsOptions.series.length <= 0) return false;
            var hasSeriesData = false;
            for (var i = 0; i < highchartsOptions.series.length; i++) {
                if (highchartsOptions.series[i].data != null) {
                    if (highchartsOptions.series[i].data.length > 0) {
                        hasSeriesData = true;
                        break;
                    }
                }
            }
            return hasSeriesData;
        },

        _isPivotAllowed: function () {
            var me = AIC;

            return me.getDimensions('row').length > 0 ||
                (me.isOLAP() && me.getDimensions('column').length > 0);
        },

        _renderDataLevelSelector: function () {
            var me = AIC.ui.controls.dataLevelSelector;

            me.render();

            if (AIC._isTimeSeries() || AIC._isDualMeasureTreeMap()) {
                me.hideRowsSlider();
            }
        }
    });

    /**
     * Service bus.
     */
    _.extend(AIC, {
        serviceBus: {
            _listenersMap: {},

            _allEventsListeners: [],

            _incorrectEventTypeMsg: "Service bus supports only string events. Received event is not a string.",

            /**
             * Should be used by services to fire event.
             *
             * @param event the event which is fired.
             */
            fireEvent: function (event) {
                var serviceBus = AIC.serviceBus;
                if (typeof event !== "string") {
                    throw serviceBus._incorrectEventTypeMsg;
                }

                var listenersMap = serviceBus._listenersMap;
                var eventListeners = listenersMap[event];

                if (eventListeners) {
                    _.each(eventListeners, function (listener) {
                        listener(event);
                    });
                }

                _.each(serviceBus._allEventsListeners, function (listener) {
                    listener(event);
                });
            },

            /**
             * Registers event listener.
             *
             * @param event the event.
             * @param listener the listener.
             */
            registerListener: function (event, listener) {
                var serviceBus = AIC.serviceBus;
                if (typeof event !== "string") {
                    throw serviceBus._incorrectEventTypeMsg;
                }

                var listenersMap = serviceBus._listenersMap;
                var eventListeners = listenersMap[event];

                if (!eventListeners) {
                    eventListeners = [];

                    listenersMap[event] = eventListeners;
                }

                eventListeners.push(listener);
            },

            registerAllEventsListener: function (listener) {
                AIC.serviceBus._allEventsListeners.push(listener);
            }
        }
    });

    /**
     * Mediator. Knows all about components on the page. Handles custom events and performs the actions.
     */
    _.extend(AIC, {
        mediator: {
            _isListenerRegistered: false,

            eventToAction: {
                "chart:typeChanged": function () {
                    // Update client state.
                    AIC.state.chartState.chartType = AIC.ui.controls.chartTypeSelector.getType();

                    // Update server state.
                    AIC.updateChartState();
                },

                "chart:levelChanged": function () {
                    // Update client state.
                    AIC.state.chartState.columnsSelectedLevels =
                        AIC.ui.controls.dataLevelSelector.getColumnSelectedLevels();
                    AIC.state.chartState.rowsSelectedLevels = AIC.ui.controls.dataLevelSelector.getRowsSelectedLevels();

                    // Update server state.
                    AIC.updateChartState();
                }
            },

            listener: function (event) {
                if (typeof event !== "string") {
                    throw "Mediator supports only string events. Received event is not a string.";
                }

                var action = AIC.mediator.eventToAction[event];

                // Execute the action if we have if defined for the event.
                if (action) {
                    action();
                }
            },

            /**
             * Registers itself in service bus to listen events.
             */
            register: function () {
                if (!AIC.serviceBus._isListenerRegistered) {
                    AIC.serviceBus.registerAllEventsListener(AIC.mediator.listener);
                    AIC.serviceBus._isListenerRegistered = true;
                }
            }
        }
    });

    /*
     * Initialization
     */
    _.extend(AIC, {
        ui: {
            controls: {
                dataLevelSelector: {
                    _container: null,
                    _column: null,
                    _row: null,

                    init: function () {
                        var me = AIC.ui.controls.dataLevelSelector;

                        me._container = jQuery('#dataLevelSelector');
                    },

                    // TODO: pass the state to the render method instead of external referencing.
                    render: function () {
                        // disable filters panel for dual-level pie
                        if (highchartsDataMapper.isDualLevelPieChart(AIC.state.chartState.chartType)) {
                            AIC.ui.controls.dataLevelSelector.hide();
                            return;
                        }
                        var me = AIC.ui.controls.dataLevelSelector;

                        AIC.ui.selectorTables.column.show().find('td.select-header').parent().siblings().remove();
                        AIC.ui.selectorTables.row.show().find('td.select-header').parent().siblings().remove();

                        if (AIC.isOLAP()) {
                            me._renderOlapSlider();
                        } else {
                            me._renderNonOlapSliders();
                        }

                        adhocDesigner.resetFilterPanelState();
                    },

                    _renderOlapSlider: function () {
                        var me = AIC.ui.controls.dataLevelSelector;
                        me._column = [];
                        me._row = [];

                        jQuery.each(['row', 'column'], function (index, type) {
                            if (AIC.state.olapDimensionInfo[index].length) {
                                jQuery.each(AIC.state.olapDimensionInfo[index], function (i, dimension) {
                                    var level = AIC.state.chartState[type + "sSelectedLevels"][i];
                                    me['_' + type].push(AIC.ui.create.slider(AIC.ui.selectorTables[type], dimension.levels, dimension.dimension, {
                                        max: dimension.levels.length - 1,
                                        value: me._levelToLevelPosition(level, dimension),
                                        stop: function (ev, ui) {
                                            AIC.serviceBus.fireEvent("chart:levelChanged");
                                        }
                                    }));
                                });
                                AIC.ui.selectorTables[type].show();
                            } else {
                                AIC.ui.selectorTables[type].hide();
                            }
                        });
                    },

                    _renderNonOlapSliders: function () {
                        var me = AIC.ui.controls.dataLevelSelector;

                        me._row = me._renderNonOlapSlider(0);
                        me._column = me._renderNonOlapSlider(1);
                    },

                    _renderNonOlapSlider: function (axisIndex) {
                        var me = AIC.ui.controls.dataLevelSelector;
                        var levels = [];

                        jQuery.each(AIC.state.queryData.metadata.axes[axisIndex], function (i, v) {
                            if (v.name != 'Measures') {
                                levels.push(v.label);
                            }
                        });

                        var selectorTable = axisIndex === 0 ? AIC.ui.selectorTables.row : AIC.ui.selectorTables.column;
                        var sliderLevelCount = axisIndex === 0 ? AdhocDataProcessor.getRowSliderLevelCount() :
                            AdhocDataProcessor.getColumnSliderLevelCount();
                        var selectedLevels = axisIndex === 0 ? AIC.state.chartState.rowsSelectedLevels :
                            AIC.state.chartState.columnsSelectedLevels;

                        selectorTable.find('td.select-header').parent().siblings().remove();

                        sliderLevelCount == 1 ? selectorTable.hide() : selectorTable.show();

                        return AIC.ui.create.slider(selectorTable, levels, '', {
                            max: sliderLevelCount - 1,
                            value: me._getSliderPositionForNonOlap(selectedLevels, axisIndex),
                            stop: function (ev, ui) {
                                AIC.serviceBus.fireEvent("chart:levelChanged");
                            }
                        });
                    },

                    hide: function () {
                        AIC.ui.selectorTables.column.hide();
                        AIC.ui.selectorTables.row.hide();
                    },

                    hideRowsSlider: function () {
                        AIC.ui.selectorTables.row.hide();
                    },

                    hideColumnsSlider: function () {
                        AIC.ui.selectorTables.column.hide();
                    },

                    _levelToLevelPosition: function (level, dimension) {
                        for (var i = 0; i < dimension.levels.length; i++) {
                            if (dimension.levels[i].levelName === level.name) {
                                return i;
                            }
                        }

                        throw "No OLAP level info found for specified level = " + level;
                    },

                    getRowsSelectedLevels: function () {
                        var me = AIC.ui.controls.dataLevelSelector;
                        return me._getSelectedLevels(me._row, me._row, 0);
                    },

                    getColumnSelectedLevels: function () {
                        var me = AIC.ui.controls.dataLevelSelector;
                        return me._getSelectedLevels(me._column, me._column, 1);
                    },

                    _getSelectedLevels: function (nonOlapSlider, olapSliders, axisIndex) {
                        var me = AIC.ui.controls.dataLevelSelector;

                        if (AIC.isOLAP()) {
                            return me._extractOlapSelectedLevels(olapSliders, axisIndex);
                        } else {
                            return me._extractNonOlapSelectedLevels(nonOlapSlider, axisIndex);
                        }
                    },

                    _extractOlapSelectedLevels: function (sliders, axisIndex) {
                        var me = AIC.ui.controls.dataLevelSelector;
                        var selectedLevels = [];

                        jQuery(sliders).each(function (i) {
                            var selectedLevelPosition = me._extractSliderPosition(
                                jQuery(this));
                            var dimensionInfo = AIC.state.olapDimensionInfo[axisIndex][i];
                            var selectedLevel = dimensionInfo.levels[selectedLevelPosition];

                            selectedLevels.push({
                                name: xssUtil.unescape(selectedLevel.levelName), // jshint ignore: line
                                label: xssUtil.unescape(selectedLevel.label), // jshint ignore: line
                                dimension: dimensionInfo.dimension
                            });
                        });

                        return selectedLevels;
                    },

                    _extractNonOlapSelectedLevels: function (dimSlider, axisIndex) {
                        var me = AIC.ui.controls.dataLevelSelector;

                        var sliderPos = me._extractSliderPosition(dimSlider);

                        if (sliderPos === 0) {
                            return [];
                        } else {
                            var levels =
                                AdhocDataProcessor.getLevelsWithoutMeasures(AIC.state.queryData.metadata.axes[axisIndex]);

                            return [levels[sliderPos - 1]];
                        }
                    },

                    _getSliderPositionForNonOlap: function (selectedLevels, axisIndex) {
                        if (selectedLevels.length === 0) {
                            return 0;
                        }

                        var levels =
                            AdhocDataProcessor.getLevelsWithoutMeasures(AIC.state.queryData.metadata.axes[axisIndex]);

                        // The slider position will be level index + 1 because of grand total on the position 0.
                        return AdhocDataProcessor.getLevelIndex(levels, selectedLevels[0]) + 1;
                    },

                    _extractSliderPosition: function (dimSlider) {
                        return dimSlider.slider('option', 'value');
                    },

                    dock: function () {
                        var me = AIC.ui.controls.dataLevelSelector;

                        me._container.find('div.pod-body').eq(0).appendTo(jQuery('#level-container'));

                        dialogs.popup.hide(me._container[0]);
                    },

                    undock: function () {
                        var me = AIC.ui.controls.dataLevelSelector;

                        jQuery('#level-container').children('div.pod-body').eq(0).appendTo(me._container.find('div.body').eq(0));

                        dialogs.popup.show(me._container[0]);
                    }
                },

                chartTypeSelector: {
                    _type: null,
                    _container: null,
                    _DISABLED_CLASS: "disabled",
                    _patternsDisabledForOlap: [
                        "[name$='_time_series']",
                        "[name$='tree_map']"
                    ],

                    init: function () {
                        var me = AIC.ui.controls.chartTypeSelector;

                        me._container = jQuery('#chartTypeSelector');
                        me._container.on('click', 'div.cell', me._typeSelectedHandler);

                        if (AIC.isOLAP()) {
                            for (var i = 0; i < me._patternsDisabledForOlap.length; i++) {
                                jQuery(me._patternsDisabledForOlap[i]).addClass(me._DISABLED_CLASS);
                            }
                        }
                    },

                    update: function (type) {
                        var me = AIC.ui.controls.chartTypeSelector;

                        me._type = type;
                    },

                    render: function () {
                        var me = AIC.ui.controls.chartTypeSelector;

                        me._container.find('div.cell').removeClass("selected");
                        me._container.find('div.cell[name="' + me._type + '"]').eq(0).addClass("selected");
                    },

                    hide: function () {
                        var me = AIC.ui.controls.chartTypeSelector;

                        dialogs.popup.hide(me._container[0]);
                    },

                    _typeSelectedHandler: function () {
                        var me = AIC.ui.controls.chartTypeSelector;

                        if (!jQuery(this).hasClass(me._DISABLED_CLASS)) {
                            me._type = this.getAttribute('name');
                            me.render();

                            AIC.serviceBus.fireEvent("chart:typeChanged");
                        }
                    },

                    getType: function () {
                        var me = AIC.ui.controls.chartTypeSelector;

                        return me._type;
                    }
                }
            },

            update: function (state) {
                AIC.ui.controls.chartTypeSelector.update(state.chartState.chartType);
            },

            render: function () {
                var titleCaption = jQuery('#titleCaption');
                AIC.state.titleBarShowing ? titleCaption.show() : titleCaption.hide();
                titleCaption.text(AIC.state.title);

                adhocDesigner.enableXtabPivot(AIC._isPivotAllowed());

                AIC.ui.controls.chartTypeSelector.render();
                AIC.ui.dialogs.formatDialog.model.set(AIC.state.chartState);

                // Hide them by default. If required they will be rendered later in the flow.
                AIC.ui.controls.dataLevelSelector.hide();
            },

            create: {
                sliderTable: function (isRowsAxis) {
                    var body = jQuery('#level-container').show().children('.pod-body').eq(0);
                    var levelSelectorHtml = Mustache.to_html(jQuery('#levelSelectorTemplate').html(), {
                        id: (isRowsAxis ? "row" : "column") + "LevelSelector",
                        colspan: (AIC.isOLAP() ? 2 : 1),
                        name: isRowsAxis ? layoutManagerLabels.row[AIC.mode] : layoutManagerLabels.column[AIC.mode]
                    });
                    var table = jQuery(levelSelectorHtml).appendTo(body);

                    table.on('mouseover', 'div.tickOverlay', function (evt) {
                        var tick = jQuery(this).parent();
                        AIC.dataLevelTooltip.text(tick.attr('level-name'));
                        AIC.dataLevelTooltip.show().position({
                            of: tick,
                            at: 'center top',
                            my: 'center bottom',
                            offset: '0 -6',
                            collision: 'fit'
                        });
                        AIC.ui.selectorTables.column.css('display') == 'block' && AIC.ui.selectorTables.column.hide().show();
                        AIC.ui.selectorTables.row.css('display') == 'block' && AIC.ui.selectorTables.row.hide().show();
                    });

                    table.on('mouseover', 'a.ui-slider-handle', function (evt) {
                        var slider = jQuery(this).parent();
                        var tick = slider.children('div.sliderTick').eq(slider.slider('option', 'value'));
                        AIC.dataLevelTooltip.text(tick.attr('level-name'));

                        AIC.dataLevelTooltip.show().position({
                            of: tick,
                            at: 'center top',
                            my: 'center bottom',
                            offset: '0 -6',
                            collision: 'fit'
                        });
                        AIC.ui.selectorTables.column.css('display') == 'block' && AIC.ui.selectorTables.column.hide().show();
                        AIC.ui.selectorTables.row.css('display') == 'block' && AIC.ui.selectorTables.row.hide().show();
                    });

                    table.on('mouseout', 'a.ui-slider-handle, div.tickOverlay', function (evt) {
                        AIC.dataLevelTooltip.hide();
                        AIC.ui.selectorTables.column.css('display') == 'block' && AIC.ui.selectorTables.column.hide().show();
                        AIC.ui.selectorTables.row.css('display') == 'block' && AIC.ui.selectorTables.row.hide().show();
                    });

                    return table;
                },
                slider: function (table, levels, name, options) {
                    /*
                     * Create <tr>. Add label in OLAP mode
                     */
                    var parms = {
                        label: AIC.isOLAP() ? {name: name} : false,
                        marginLeft: AIC.isOLAP() ? '24px' : 0
                    };
                    table.find('tbody').eq(0).append(Mustache.to_html(jQuery('#dataLevelSelectorTemplate').html(), parms));
                    /*
                     * Init jqueryui slider
                     */
                    var slider = table.find('div.jrs-slider').last();
                    slider.slider({
                        value: options.value,
                        min: 0,
                        max: options.max,
                        step: 1,
                        range: 'min',
                        stop: options.stop,
                        slide: function (ev, ui) {
                            var tick = jQuery(ui.handle).parent().children('div.sliderTick').eq(ui.value);
                            AIC.dataLevelTooltip.text(tick.attr('level-name'));
                            AIC.dataLevelTooltip.show().position({
                                of: tick,
                                at: 'center top',
                                my: 'center bottom',
                                offset: '0 -6',
                                collision: 'fit'
                            });
                            AIC.ui.selectorTables.column.css('display') == 'block' && AIC.ui.selectorTables.column.hide().show();
                            AIC.ui.selectorTables.row.css('display') == 'block' && AIC.ui.selectorTables.row.hide().show();
                        }
                    });
                    /*
                     * Add tick marks
                     */
                    var spacing = options.max > 0 ? 100 / (options.max) : 0;
                    if (!AIC.isOLAP()) {
                        levels.unshift('All');
                        options.max++;
                    }

                    for (var i = 0; i < (options.max + 1); i++) {
                        if (levels[i]) {
                            var parms = {
                                label: levels[i].label || levels[i],
                                width: i * spacing
                            };
                            parms.label == 'All' && (parms.label = 'Total');
                            parms.label = xssUtil.unescape(parms.label); // jshint ignore: line
                            var htm = Mustache.to_html(jQuery('#sliderTickTemplate').html(), parms);
                            slider.append(htm);
                        }
                    }
                    return slider;
                }
            }
        },
        init: function (mode) {
            AIC.mediator.register();
            AIC.dataLevelTooltip = jQuery('#dataLevelTooltip');

            jQuery('#chartOptions').appendTo(adhocDesigner.ui.canvas).show();
            jQuery('#chartMenu').appendTo(adhocDesigner.ui.canvas);
            jQuery(Mustache.to_html(jQuery('#titleCaptionTemplate').html()), {}).appendTo(adhocDesigner.ui.canvas).show();
            jQuery('#chartContainer').appendTo(adhocDesigner.ui.canvas).show();

            if (!AIC.initd) {
                jQuery('#chartOptions').on('mouseenter', function () {
                    jQuery(this).addClass('over');
                    jQuery('#chartMenu').show().position({
                        of: jQuery('#chartOptions'),
                        at: 'left bottom',
                        my: 'left top',
                        offset: '0 -1'
                    })
                });
                jQuery('#chartMenu').on('mouseleave', function () {
                    jQuery('#chartOptions').removeClass('over');
                    jQuery('#chartMenu').hide();
                });
                jQuery('#chartMenu').on('mouseenter', 'p.wrap', function () {
                    jQuery(this).addClass('over');
                });
                jQuery('#chartMenu').on('mouseleave', 'p.wrap', function () {
                    jQuery(this).removeClass('over');
                });
                jQuery('#chartMenu').on('click', 'li', function () {
                    if (jQuery(this).is('[action="chart-types"]')) {
                        dialogs.popup.show(AIC.ui.dialogs.typeSelector[0]);

                        AIC.ui.controls.chartTypeSelector.render();
                    } else if (jQuery(this).is('[action="chart-format"]')) {
                        if (jQuery(this).hasClass("disabled")) {
                            return;
                        }

                        AIC.ui.dialogs.formatDialog.model.set(AIC.state.chartState);

                        dialogs.popup.show(AIC.ui.dialogs.formatDialog.el);
                        // $ is prototype!
                        adhocDesigner.initEnableBrowserSelection($("designer")); // jshint ignore: line
                    }
                });
                // TODO: refactor to self contained components.
                jQuery('#chartTypeSelector .closeIcon').on(isIPad() ? 'touchstart' : 'click', function () {
                    AIC.ui.dialogs.typeSelector.hide();
                });
                jQuery('#dataLevelSelector .closeIcon').on(isIPad() ? 'touchstart' : 'click', function () {
                    AIC.ui.dialogs.groupSelector.hide();
                });

                AIC.ui.dialogs = {
                    typeSelector: jQuery('#chartTypeSelector'),
                    groupSelector: jQuery('#dataLevelSelector')
                };

                AIC.ui.selectorTables = {
                    column: AIC.ui.create.sliderTable(false),
                    row: AIC.ui.create.sliderTable(true)
                };

                AIC.ui.controls.chartTypeSelector.init();
                AIC.ui.controls.dataLevelSelector.init();

                if (!AIC.ui.dialogs.formatDialog) {
                    var formattingDialogModel = new FormattingDialogModel(AIC.state.chartState, {
                        parse: true,
                        updateState: _.bind(AIC.updateChartState, AIC)
                    });
                    AIC.ui.dialogs.formatDialog = new FormattingDialogView({model: formattingDialogModel});
                }
            }
            AIC.ui.dialogs.typeSelector.hide();
            AIC.ui.dialogs.groupSelector.hide();
            jQuery('#level-container').show();

            AIC.initd = true;
        },
        hide: function () {
            jQuery('#chartOptions').appendTo('#highChartsRepo').hide();
            jQuery('#chartMenu').appendTo('#highChartsRepo').hide();
            jQuery('#titleCaption').remove();
            jQuery('#chartContainer').appendTo('#highChartsRepo').hide();
        }
    });
    /*
     * Event Handling
     */
    _.extend(AIC, {
        mouseUpHandler: function (evt) {

        },
        mouseDownHandler: function (evt) {

        },
        mouseOverHandler: function (evt) {

        },
        mouseOutHandler: function (evt) {

        },
        mouseClickHandler: function (evt) {

        },
        treeMenuHandler: function (event) {
            var node = event.memo.node;
            var contextName;

            if (node.treeId === "dimensionsTree") {
                contextName = node.isParent() ? adhocDesigner.DIMENSION_TREE_DIMENSION_CONTEXT : adhocDesigner.DIMENSION_TREE_LEVEL_CONTEXT;
            } else if (node.treeId === "measuresTree") {
                contextName = node.isParent() ? adhocDesigner.MEASURE_TREE_GROUP_CONTEXT : adhocDesigner.MEASURE_TREE_CONTEXT;
            }

            adhocDesigner.showDynamicMenu(event.memo.targetEvent, contextName, null);
        },
        lmHandlersMap: {
            // Common methods for both axes
            addItems: function (nodes, pos, axis) {
                var dims = _.uniq(_.map(nodes, function (n) {
                    return n.extra.dimensionId;
                }));
                var child = _.pluck(nodes, 'id');
                var isMeasure = nodes[0].extra.isMeasure;
                var isOlap = localContext.isOlapMode();

                AIC.insertDimensionInAxisWithChild({
                    dim: isMeasure ? dims.slice(0, 1) : dims,
                    axis: axis,
                    pos: pos,
                    child: isOlap || isMeasure ? child : null,
                    hierarchyName: nodes[0].extra.hierarchyName
                });
            },
            measureReorder: function (measure, to) {
                AIC.moveMeasure(measure, to);
            },
            column: {
                addItem: function (dim, pos, level, levelPos, isMeasure, uri, hierarchyName) {
                    AIC.insertDimensionInAxisWithChild({
                        dim: dim,
                        axis: 'column',
                        pos: pos,
                        child: localContext.isOlapMode() || isMeasure ? level : null,
                        measure_pos: levelPos,
                        isMeasure: isMeasure,
                        uri: uri,
                        hierarchyName: hierarchyName
                    });
                },
                removeItem: function (item, index) {
                    if (item.isMeasure) {
                        AIC.removeMeasure(index);
                    } else {
                        AIC.hideColumnLevel(item.dimensionId, item.level);
                    }
                },
                moveItem: function (dim, from, to) {
                    AIC.moveDimension(dim, 'column', 'column', from, to);
                },
                switchItem: function (dim, from, to) {
                    AIC.moveDimension(dim, 'row', 'column', from, to);
                },
                contextMenu: function (event, options) {
                    AIC.selectFromDisplayManager(options.targetEvent, options.extra, designerBase.COLUMN_GROUP_MENU_LEVEL);
                    actionModel.setSelected([options.extra]);
                    AIC.showMenu(options.targetEvent, 'displayManagerColumn');
                }
            },
            row: {
                addItem: function (dim, pos, level, levelPos, isMeasure, uri, hierarchyName) {
                    AIC.insertDimensionInAxisWithChild({
                        dim: dim,
                        axis: 'row',
                        pos: pos,
                        child: localContext.isOlapMode() || isMeasure ? level : null,
                        measure_pos: levelPos,
                        isMeasure: isMeasure,
                        uri: uri,
                        hierarchyName: hierarchyName
                    });
                },
                removeItem: function (item, index) {
                    if (item.isMeasure) {
                        AIC.removeMeasure(index);
                    } else {
                        AIC.hideRowLevel(item.dimensionId, item.level);
                    }
                },
                moveItem: function (dim, from, to) {
                    AIC.moveDimension(dim, 'row', 'row', from, to);
                },
                switchItem: function (dim, from, to) {
                    AIC.moveDimension(dim, 'column', 'row', from, to);
                },
                contextMenu: function (event, options) {
                    AIC.selectFromDisplayManager(options.targetEvent, options.extra, designerBase.ROW_GROUP_MENU_LEVEL);
                    actionModel.setSelected([options.extra]);
                    AIC.showMenu(options.targetEvent, 'displayManagerRow');
                }
            }
        }
    });
    /*
     * Ajax Controller
     */
    _.extend(AIC, {
        insertDimensionInAxisWithChild: function (params) {
            if (params) {
                if (params.dim) {
                    params.dim = designerBase.encodeParam(params.dim);
                }
                if (params.child) {
                    params.child = designerBase.encodeParam(params.child);
                }
                if (params.hierarchyName) {
                    params.hierarchyName = designerBase.encodeParam(params.hierarchyName);
                }
                if (params.uri) {
                    params.uri = designerBase.encodeParam(params.uri);
                }
            }
            AIC.flush();
            designerBase.sendRequest('ich_insertDimensionInAxisWithChild', params, AIC.standardOpCallback, {bPost: true});
        },
        removeMeasure: function (index) {
            designerBase.sendRequest('ich_removeMeasure', new Array('i=' + index), AIC.standardOpCallback, null);
        },
        moveDimension: function (dimName, axisFrom, axisTo, from, to) {
            designerBase.sendRequest('ich_moveDimension', {
                dim: encodeURIComponent(dimName),
                axisFrom: axisFrom,
                axisTo: axisTo,
                f: from,
                t: to
            }, AIC.standardOpCallback, null);
        },
        hideRowLevel: function (dimName, levelName) {
            designerBase.sendRequest('ich_hideRowLevel', new Array('f=' + encodeText(dimName), 'level=' + encodeText(levelName)), AIC.standardOpCallback, null);
        },
        hideColumnLevel: function (dimName, levelName) {
            var callback = function (state) {
                AIC.standardOpCallback(state);

                var level = AIC.getLevelObject(levelName, dimName, "column");
                if (level && level.propertyMap && level.propertyMap.lastFilteredLevel == "true") {
                    dialogs.systemConfirm.show(adhocDesigner.getMessage("ADH_CROSSTAB_LAST_FILTERED_LEVEL"), 5000);
                }
            };

            designerBase.sendRequest('ich_hideColumnLevel', new Array('f=' + encodeText(dimName), 'level=' + encodeText(levelName)), callback, null);
        },
        expandAllLevels: function () {
            if (AIC.debug) {
                console.log("AIC.expandAllLevels:  sending expandAll query, this may take some time");
            }
            AIC.cache = [];
            AIC.hasAllData = true;
            designerBase.sendRequest('ich_expandAllLevels', null, AIC.standardOpCallback, null);
        },
        switchToColumnGroup: function (ind) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            // TODO: adapt/normalize data from tree and from custom generated event
            var index = _.isNumber(ind) ? ind : object.groupIndex;
            designerBase.sendRequest('ich_switchToColumnGroup', new Array('i=' + index), AIC.standardOpCallback, null);
        },
        switchToRowGroup: function (ind) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var index = _.isNumber(ind) ? ind : object.groupIndex;
            designerBase.sendRequest('ich_switchToRowGroup', new Array('i=' + index), AIC.standardOpCallback, null);
        },
        moveRowGroup: function (from, to, customCallback) {
            var callback = function (state) {
                AIC.standardOpCallback(state);
                customCallback && customCallback();
            };
            designerBase.sendRequest('ich_moveRowGroup', new Array('f=' + from, 't=' + to), callback, null);
        },
        moveColumnGroup: function (from, to, customCallback) {
            var callback = function (state) {
                AIC.standardOpCallback(state);
                customCallback && customCallback();
            };
            designerBase.sendRequest('ich_moveColumnGroup', new Array('f=' + from, 't=' + to), callback, null);
        },
        moveMeasure: function (measure, to) {
            designerBase.sendRequest('ich_moveMeasureByName', ['measure=' + encodeText(measure), 'to=' + to], AIC.standardOpCallback, null);
        },
        updateChartState: function (chartState) {
            // TODO replace substitution when server functionality will be extended
            jQuery.extend(AIC.state.chartState, chartState);

            var callback = function (response) {
                if (response) {
                    AIC.standardOpCallback(response);
                } else {
                    throw "No response received on save chart state request";
                }
            };

            designerBase.sendRequest('ich_updateChartState', [
                'chartState=' + encodeURIComponent(Object.toJSON(AIC.state.chartState))], callback, null);
        },
        setCategoryForRowGroup: function (catName, index) {
            var callback = function (state) {
                AIC.standardOpCallback(state);
            };
            designerBase.sendRequest('ich_setRowGroupCategorizer', new Array('cat=' + encodeText(catName), 'i=' + index),
                callback, null);
        },
        setCategoryForColumnGroup: function (catName, index) {
            var callback = function (state) {
                AIC.standardOpCallback(state);
            };
            designerBase.sendRequest('ich_setColumnGroupCategorizer', new Array('cat=' + encodeText(catName), 'i=' + index),
                callback, null);
        },
        setSummaryFunction: function (thisFunction, index) {
            designerBase.sendRequest('ich_setSummaryFunction', new Array('f=' + encodeText(thisFunction), 'i=' + index),
                AIC.standardOpCallback, null);
        },
        setSummaryFunctionAndMask: function (thisFunction, thisMask, index) {
            designerBase.sendRequest('cr_setSummaryFunctionAndDataMask',
                new Array('f=' + encodeText(thisFunction), 'm=' + encodeText(thisMask), 'i=' + index),
                AIC.standardOpCallback, null);
        },
        setSummaryTimeFunction: function (thisFunction, index) {
            designerBase.sendRequest('ich_setSummaryTimeFunction', new Array('f=' + encodeText(thisFunction), 'i=' + index),
                AIC.standardOpCallback, null);
        },
        setHideEmptyRows: function () {
            designerBase.sendRequest('ich_setProperty', new Array("name=hideEmptyRows", "value=true"),
                AIC.standardOpCallback, null);
        },
        setUnhideEmptyRows: function () {
            designerBase.sendRequest('ich_setProperty', new Array("name=hideEmptyRows", "value=false"),
                AIC.standardOpCallback, null);
        },

        /**
         * Used to update the canvas view
         */
        updateViewCallback: function (state) {
            AIC.standardOpCallback(state);
        }
    });

    /*
     * Actionmodel Tests
     */
    _.extend(AIC, {
        canSaveReport: function () {
            return AIC.state.canSave;
        },
        hideEmptyRowsEquals: function (val) {
            return AIC.state.crosstabState.hideEmptyRows === val;
        },
        canAddFilter: function (object, errorMessages) {
            var isMeasure,
                isDuplicate;

            if (localContext.isOlapMode()) {
                isMeasure = isNotNullORUndefined(object.isMeasure)
                    ? object.isMeasure
                    : (object.param.extra && object.param.extra.isMeasure);

                isDuplicate = localContext._isAddingFilterDuplicate(object);
            }

            //We do not support filters for measures in OLAP-mode.
            if (isMeasure) {
                errorMessages && errorMessages.push(addFilterErrorMessageMeasureAdd);
                return false;
            }

            var levelName = object.param ? (object.param.extra && object.param.extra.id) : object.level,
                isAllLevel = levelName && levelName.indexOf(localContext.ALL_LEVEL_NAME) === 0;

            //We do not support filters for (All) level in 1'st iteration.
            if (isAllLevel) {
                errorMessages && errorMessages.push(addFilterErrorMessageAllLevelAdd);
                return false;
            }
            // Cannot add group of fields as filter.
            if (object.isParent && object.isParent()) {
                errorMessages && errorMessages.push(addFilterErrorMessageGroupAdd);
                return false;
            }

            if (object.param && localContext.fromSiblingHierarchy(object.param.extra.hierarchyName, object.param.extra.dimensionId)) {
                errorMessages && errorMessages.push(addFilterErrorMessageAnotherHierarchy);
                return false;
            }

            if (adhocDesigner.isSpacerSelected(object)) {
                errorMessages && errorMessages.push(addFilterErrorMessageSpacerAdd);
                return false;
            }
            if (adhocDesigner.isPercentOfParentCalcSelected(object)) {
                errorMessages && errorMessages.push(addFilterErrorMessagePercentOfParentCalcFieldAdd);
                return false;
            }
            if (adhocDesigner.isConstantSelected(object)) {
                errorMessages && errorMessages.push(addFilterErrorMessageConstantAdd);
                return false;
            }

            if (isDuplicate) {
                errorMessages && errorMessages.push(addFilterErrorMessage);
                return false;
            }

            return true;
        },
        canAddSliceFilter: function () {
            var doesSelectionContainNotSliceableObject = selObjects.find(function (obj) {
                return !obj.isSliceable;
            });

            return selObjects.first() && !doesSelectionContainNotSliceableObject;
        },
        _isAddingFilterDuplicate: function (filterCandidate) {
            var filterCandidateName;

            if (filterCandidate.param) {
                filterCandidateName = "[" + filterCandidate.param.extra.dimensionId + "].[" + filterCandidate.param.extra.id + "]";
            } else {
                filterCandidateName = "[" + filterCandidate.dimensionId + "].[" + filterCandidate.level + "]";
            }
            return adhocDesigner.filtersController.hasFilterForField(filterCandidateName);
        },

        isDateType: function () {
            return AIC.isDateTimeType("date");
        },
        isTimestampType: function () {
            return AIC.isDateTimeType("timestamp");
        },
        isTimeType: function () {
            return AIC.isDateTimeType("time");
        },
        isDateTimeType: function (dateTimeType) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            if (object) {
                var isGroup = AIC.isGroupSelected(object);
                var group = AdHocCrosstab.getSelectedGroup(object);
                if (group) {
                    var canReBucket = group.canReBucket === true;
                    var dateDataType = group.type === dateTimeType;
                    return (isGroup && canReBucket && dateDataType);
                }
            }
            return false;
        },
        isGroupSelected: function (selectedObject) {
            return !selectedObject.isMeasure;
        },
        isCurrentDateType: function (thisType) {
            var group = AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup());
            if (group) {
                return group.categorizerName == thisType;
            }
            return false;
        },
        canMoveUpOrLeft: function () {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var index = AIC.getSelectedDimensionIndex(object);
            return (index > 0);
        },
        canMoveDownOrRight: function () {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var index = AIC.getSelectedDimensionIndex(object);
            return index < AIC.getDimensions(object.axis).length - 1;
        },
        canAddSiblingLevels: function () {
            //TODO: if all sibling levels already added to crosstab or
            //or no siblings present - return false
            return true;
        },
        canSwitchToRow: function () {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            return (!AIC.isOLAP() || AIC.getDimensions(object.axis).length > 1);
        },
        canAddDimensionAsRowGroup: function () {
            var node = selObjects.first();
            if (!node.hasChilds()) {
                node = node.parent;
            }

            if (AIC.isOLAP()) {
                if (AIC.getDimensions('column').length === 0) {
                    return false;
                }
                var dimensionId = node.param.id,
                    hierarchyName = node.param.extra.isHierarchy && node.param.extra.id,
                    levelsAtColumns = AIC.getLevelsFromDimension(dimensionId, 'column'),
                    levelsAtRows = AIC.getLevelsFromDimension(dimensionId, 'row');

                var fromSiblingHierarchy = localContext.fromSiblingHierarchy(hierarchyName, dimensionId);

                return levelsAtColumns.length === 0 && (node.param.extra.isHierarchy && fromSiblingHierarchy || levelsAtRows.length < node.getChildCount());
            } else {
                var tree = dynamicTree.trees[node.getTreeId()];
                var leaves = adhocDesigner.getAllLeaves(node, tree);
                var leavesStringArray = adhocDesigner.getAllLeaves(node, tree).collect(function (node) {
                    return node.param.extra.id;
                });

                if (leaves[0].param.extra.isMeasure) {
                    var measuresInColumns = AIC.getFilteredMeasureList('column');
                    return measuresInColumns.length === 0;
                } else {
                    var allUsedFields = _.pluck(AIC.getFilteredList(), 'name');
                    return _.difference(leavesStringArray, allUsedFields).length > 0;
                }
            }
        },
        canAddDimensionAsColumnGroup: function () {
            var node = selObjects.first();
            if (!node.hasChilds()) {
                node = node.parent;
            }

            if (AIC.isOLAP()) {
                var dimensionId = node.param.id;
                var hierarchyName = node.param.extra.isHierarchy && node.param.extra.id;
                var levelsAtColumns = AIC.getLevelsFromDimension(dimensionId, 'column');
                var levelsAtRows = AIC.getLevelsFromDimension(dimensionId, 'row');

                var fromSiblingHierarchy = localContext.fromSiblingHierarchy(hierarchyName, dimensionId);

                return levelsAtRows.length === 0 && (node.param.extra.isHierarchy && fromSiblingHierarchy || levelsAtColumns.length < node.getChildCount());
            } else {
                var tree = dynamicTree.trees[node.getTreeId()];
                var leaves = adhocDesigner.getAllLeaves(node, tree);
                var leavesStringArray = adhocDesigner.getAllLeaves(node, tree).collect(function (node) {
                    return node.param.extra.id;
                });

                if (leaves[0].param.extra.isMeasure) {
                    var measuresInRows = AIC.getFilteredMeasureList('row');
                    return measuresInRows.length === 0;

                } else {
                    var allUsedFields = _.pluck(AIC.getFilteredList(), 'name');
                    return _.difference(leavesStringArray, allUsedFields).length > 0;
                }
            }
        },
        canAddLevelAsColumnGroup: function () {
            var node = selObjects.first();
            var dimensionIds = AIC.isOLAP() ? [node.param.extra.dimensionId] :
                adhocDesigner.getAllLeaves(node).map(function (n) {
                    return n.param.extra.dimensionId
                });

            var levelsAtColumns = dimensionIds.inject([], function (levels, d) {
                return levels.concat(AIC.getLevelsFromDimension(d, 'column') || []);
            });
            var levelsAtRows = dimensionIds.inject([], function (levels, d) {
                return levels.concat(AIC.getLevelsFromDimension(d, 'row') || []);
            });

            return levelsAtRows.length === 0 &&
                (levelsAtColumns.length === 0 ||
                (!AIC.isOLAP() && (node.param.extra.isMeasure || AIC.isDateField(node.param.extra))) || !levelsAtColumns.find(function (name) {
                    return _.contains(_.map(designerBase.getSelectedObjects(), function (node) {
                        return node.param.extra.id;
                    }), name);
                }));
        },
        canAddLevelAsRowGroup: function () {
            if (AIC.getDimensions('column').length === 0 && AIC.isOLAP()) {
                return false;
            }
            var node = selObjects.first();
            var dimensionIds = AIC.isOLAP() ? [node.param.extra.dimensionId] :
                adhocDesigner.getAllLeaves(node).map(function (n) {
                    return n.param.extra.dimensionId
                });

            var levelsAtColumns = dimensionIds.inject([], function (levels, d) {
                return levels.concat(AIC.getLevelsFromDimension(d, 'column') || []);
            });
            var levelsAtRows = dimensionIds.inject([], function (levels, d) {
                return levels.concat(AIC.getLevelsFromDimension(d, 'row') || []);
            });

            if (!node.param.extra) {
                return false;
            }

            return levelsAtColumns.length === 0 &&
                (levelsAtRows.length === 0 ||
                (!AIC.isOLAP() && (node.param.extra.isMeasure || AIC.isDateField(node.param.extra))) || !levelsAtRows.find(function (name) {
                    return node.param.extra.id === name
                }));
        },
        isRowGroupSelected: function (selectedObject) {
            return selectedObject.axis === "row" && !selectedObject.isMeasure;
        },
        isColumnGroupSelected: function (selectedObject) {
            return selectedObject.axis === "column" && !selectedObject.isMeasure;
        },
        showAddHierarchyConfirm: function (hierarchyName, dimensionId, onOk) {
            if (AIC.fromSiblingHierarchy(hierarchyName, dimensionId)) {
                adhocDesigner.addConfirmDialog.show({
                    ok: function () {
                        if (AIC.isFiltersApplied(dimensionId)) {
                            dialogs.systemConfirm.show(adhocDesigner.getMessage("ADH_CROSSTAB_LAST_FILTERED_LEVEL"), 5000);
                            return;
                        }
                        onOk();
                    }
                });
                return true;
            }
            return false;
        },
        isFiltersApplied: function (dimensionId, axis) {
            var levelNames = _.pluck(AIC.getLevelObjectsFromDimension(dimensionId, axis), "levelUniqueName");
            var filterNames = _.pluck(AIC.state.existingFilters, "name");

            return !_.isEmpty(_.intersection(levelNames, filterNames));
        },
        isDateField: function (field) {
            return field.type === "Timestamp" || field.type === "Date" || field.type === "Time";
        }
    });
    /*
     * Actionmodel Actions
     */
    _.extend(AIC, {
        removeLevelFromColumn: function () {
            var meta = selObjects.first();
            jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:removeItem', {
                axis: 'column',
                index: meta.index,
                item: {
                    level: meta.level,
                    dimensionId: meta.dimensionId,
                    isMeasure: meta.isMeasure
                }
            });
        },
        removeLevelFromRow: function () {
            var meta = selObjects.first();
            jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:removeItem',
                {
                    axis: 'row',
                    index: meta.index,
                    item: {level: meta.level, dimensionId: meta.dimensionId, isMeasure: meta.isMeasure}
                });
        },
        moveRowGroupLeft: function (customCallback) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var fromGroup = AIC.getSelectedDimensionIndex(object);
            var toGroup = fromGroup - 1;
            AIC.moveRowGroup(fromGroup, toGroup, customCallback);
        },
        moveRowGroupRight: function (customCallback) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var fromGroup = AIC.getSelectedDimensionIndex(object);
            var toGroup = fromGroup + 1;
            AIC.moveRowGroup(fromGroup, toGroup, customCallback);
        },
        moveColumnGroupLeft: function (customCallback) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var fromGroup = AIC.getSelectedDimensionIndex(object);
            var toGroup = fromGroup - 1;
            AIC.moveColumnGroup(fromGroup, toGroup, customCallback);
        },
        moveColumnGroupRight: function (customCallback) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            var fromGroup = AIC.getSelectedDimensionIndex(object);
            var toGroup = fromGroup + 1;
            AIC.moveColumnGroup(fromGroup, toGroup, customCallback);
        },
        appendDimensionWithLevel: function (level, axis) {
            var meta = level ?
                AIC.getAvailableFieldsNodeBySelection(level.id, level.groupId) :
                AIC.getAvailableFieldsNodeBySelection();
            meta.axis = axis;
            if (AIC.showAddHierarchyConfirm(meta.hierarchyName, meta.dimensionId, function () {
                    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItem', meta);
                })) {
                return;
            }
            jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItem', meta);
        },

        appendDimensionToRowAxisWithLevel: function (level) {
            AIC.appendDimensionWithLevel(level, "row");
        },
        appendDimensionToColumnAxisWithLevel: function (level) {
            AIC.appendDimensionWithLevel(level, "column")
        },
        appendMeasureToRow: function (name) {
            var meta = name ?
                AIC.getAvailableFieldsNodesBySelection(name) :
                AIC.getAvailableFieldsNodesBySelection();
            jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItems',
                {axis: 'row', levels: meta, index: meta[0].index});
        },
        appendMeasureToColumn: function (name) {
            var meta = name ?
                AIC.getAvailableFieldsNodesBySelection(name) :
                AIC.getAvailableFieldsNodesBySelection();
            jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItems',
                {axis: 'column', levels: meta, index: meta[0].index});
        },
        showMenu: function (evt, type) {
            var context, dynamicMenuUpdater = null;
            switch (type) {
                case 'displayManagerRow':
                    context = 'displayManagerRow';
                    dynamicMenuUpdater = AIC.generateAvailableSummaryCalculationsMenu;
                    break;
                case 'displayManagerColumn':
                    context = 'displayManagerColumn';
                    dynamicMenuUpdater = AIC.generateAvailableSummaryCalculationsMenu;
                    break;
                case 'groupMember':
                    context = designerBase.MEMBER_GROUP_MENU_LEVEL;
                    dynamicMenuUpdater = AIC.updateContextMenuWithSiblingLevels;
                    break;
                case 'measuresDimensionRow':
                    context = 'measuresDimensionInRows';
                    break;
                case 'measuresDimensionColumn':
                    context = 'measuresDimensionInColumns';
                    break;
                case 'rowGroup':
                    context = designerBase.ROW_GROUP_MENU_LEVEL;
                    break;
                case 'columnGroup':
                    context = designerBase.COLUMN_GROUP_MENU_LEVEL;
                    break;
                case 'measureRow':
                    context = 'measureRow';
                    break;
                case 'measureColumn':
                    context = 'measureColumn';
            }
            adhocDesigner.showDynamicMenu(evt, context, null, dynamicMenuUpdater);
        },
        generateAvailableSummaryCalculationsMenu: function (context, menuActionModel) {
            if (!actionModel.selObjects[0].isMeasure) {
                return menuActionModel;
            }

            var availableSummariesMenu = _.find(menuActionModel, function (item) {
                return item.clientTest === "AdHocCrosstab.selectedMeasureShowsSummaryOptions";
            });

            if (availableSummariesMenu) {
                var levelModel = actionModel.selObjects[0],
                    field = _.findWhere(AIC.state.measures, {name: levelModel.name});

                field && adhocDesigner.generateAvailableSummaryCalculationsMenu(field.fieldName, availableSummariesMenu, {
                    action: AdhocIntelligentChart.selectFunction,
                    // TODO: remove reference to AdHocCrosstab
                    isSelectedTest: AdHocCrosstab.isSelectedSummaryFunction
                });
            }
            return menuActionModel;
        },
        setCatForColumnGroup: function (catName) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            if (object && AIC.isColumnGroupSelected(object)) {
                AIC.setCategoryForColumnGroup(catName, object.groupIndex);
            }
        },
        setCatForRowGroup: function (catName) {
            var object = adhocDesigner.getSelectedColumnOrGroup();
            if (object && AIC.isRowGroupSelected(object)) {
                AIC.setCategoryForRowGroup(catName, object.groupIndex);
            }
        },
        selectFunction: function (newFunction) {
            var object = AdHocCrosstab.getSelectedMeasure();
            if (object) {
                var index = selObjects.first().index;
                var type = adhocDesigner.getSuperType(object.type);
                var newType = AdHocCrosstab.getMeasureTypeByFunction(newFunction);
                if (type !== newType) {
                    AIC.setSummaryFunctionAndMask(newFunction, defaultMasks[newType], index);
                } else {
                    AIC.setSummaryFunction(newFunction, index);
                }
            }
        },
        selectTimeFunction: function (newFunction) {
            var object = AdHocCrosstab.getSelectedMeasure();
            if (object) {
                var index = selObjects.first().index;
                var type = adhocDesigner.getSuperType(object.type);
                var newType = AdHocCrosstab.getMeasureTypeByFunction(newFunction);
                AIC.setSummaryTimeFunction(newFunction, index);
            }
        }
    });
    /*
     * Helpers
     */
    _.extend(AIC, {
        getDimensions: function (axis) {
            var xtabState = AIC.state.crosstabState;
            return axis ? xtabState[axis + 'Groups'] : _.chain(xtabState).filter(function (val, key) {
                return key.search(/Groups$/) >= 0;
            }).flatten().value();
        },
        getLevelsFromDimension: function (dim, axis) {
            return _.pluck(this.getLevelObjectsFromDimension(dim, axis), "name");
        },
        getLevelObjectsFromDimension: function (dim, axis) {
            var axisModel = this.getDimensions(axis);
            dim = _.find(axisModel, function (d) {
                return d.name === dim;
            });

            return dim ?
                _.chain(dim.levels).filter(function (level) { // return only visible levels
                    return level.visible;
                }).map(function (level) {                    // retrieve all members from levels
                    return !_.isEmpty(level.members) ? level.members : level
                }).flatten().filter(function (member) {      // filter out spacers
                    return !member.isSpacer;
                }).value() :
                [];
        },
        getLevelObject: function (levelName, dimName, axisName) {
            var axisModel = this.getDimensions(axisName);

            function findByName(array, name) {
                return _.find(array, function (item) {
                    return item.name == name;
                })
            }

            var dim = findByName(axisModel, dimName);
            if (!dim) {
                return null;
            }
            return findByName(dim.levels, levelName);
        },
        getFilteredList: function (a, p) {
            var axis = a || null, props = p || {};
            if (arguments.length === 1 && _.isObject(a)) {
                props = a;
                axis = null;
            }
            // add mandatory values to property map
            props.visible = true;
            return _.chain(AIC.getDimensions(axis)).pluck('levels').flatten().map(function (level) {
                return !_.isEmpty(level.members) ? level.members : level;
            }).flatten().filter(function (level) {
                return _.all(props, function (prop, key) {
                    return level[key] === undefined || level[key] === prop;
                });
            }).value();
        },
        getFilteredMeasureList: function (a, p) {
            var axis = a || null, props = p || {};
            if (arguments.length === 1 && _.isObject(a)) {
                props = a;
                axis = null;
            }
            return AIC.getFilteredList(axis, _.extend(props, {measure: true, measuresLevel: true}));
        },
        fromSiblingHierarchy: function (hierarchy, dimensionId, axis) {
            if (!hierarchy) {
                return false;
            }
            var levelsInAxis = this.getLevelsFromDimension(dimensionId, axis);

            return levelsInAxis.length > 0 && levelsInAxis[0].indexOf("[" + hierarchy + "]") === -1;
        },
        getHierarchy: function (node) {
            var extra = node.param.extra;
            // Return hierarchy name if this is level
            if (!node.hasChilds()) {
                return extra.hierarchyName;
            }

            // Reset extra to Default (first in list) hierarchy, if current node is Dimension, holding multiple hierarchies
            if (node.getFirstChild().hasChilds()) {
                extra = node.getFirstChild().param.extra;
            }

            return (extra && extra.isHierarchy) ? extra.id : undefined;
        },
        getAvailableFieldsNodeBySelection: function (level, dimensionId, item) {
            var meta = {};
            if (!item) {
                item = selObjects.first();
            }

            if (selectionCategory.area == designerBase.AVAILABLE_FIELDS_AREA) {
                if (item.hasChilds()) {
                    meta.isMeasure = item.treeId === "measuresTree";
                    meta.dimensionId = meta.isMeasure ? item.treeId : item.param.id;
                    meta.uri = localContext.isNonOlapMode() ? item.param.uri : undefined;
                    meta.level = null;
                } else {
                    meta.isMeasure = !!item.param.extra.isMeasure;
                    meta.level = item.param.extra.dimensionId && item.param.id;
                    meta.dimensionId = item.param.extra.dimensionId || item.param.extra.id;
                }
                meta.hierarchyName = this.getHierarchy(item);
                meta.index = -1;
            } else if (selectionCategory.area == designerBase.ROW_GROUP_MENU_LEVEL
                || selectionCategory.area == designerBase.COLUMN_GROUP_MENU_LEVEL) {

                if (level || dimensionId) {
                    var hierarchyMatch = /.*\[(.*)\]/.exec(level),
                        hierarchyName = hierarchyMatch && hierarchyMatch[1];

                    meta.isMeasure = !dimensionId;
                    meta.level = level;
                    meta.dimensionId = meta.isMeasure ? adhocDesigner.MEASURES : dimensionId;
                    meta.index = -1;
                    meta.hierarchyName = hierarchyName;
                } else if (item.axis) {
                    //Display Manager object in selection
                    meta = item;
                } else {
                    //xtab object in selection
                    //TODO get dim and lev from crosstab
                    alert("Need a way to get dimension name for clicked level from crosstab");
                    return;
                }
            }
            return meta;
        },
        getAvailableFieldsNodesBySelection: function (level, dimensionId) {
            var metas = [];
            for (var i = 0; i < selObjects.length; i++) {
                metas.push(AIC.getAvailableFieldsNodeBySelection(level, dimensionId, selObjects[i]));
                metas[i].extra = metas[i];
                metas[i].dimensionId = metas[i].dimensionId;
                metas[i].id = metas[i].level;
            }
            return metas;
        },
        updateContextMenuWithSiblingLevels: function (contextName, contextActionModel) {
            if (!adhocDesigner.ui.display_manager) {
                return contextActionModel;
            }

            var menuToUpdate = contextActionModel.find(function (item) {
                return item.clientTest === "AdHocCrosstab.canAddSiblingLevels";
            });

            if (!menuToUpdate) {
                return contextActionModel;
            }

            var siblingLevels = null;
            var rootNode = null;
            var action = null;
            var firstSelected = selObjects[0];
            var hierarchyMatch = /.*\[(.*)\]/.exec(firstSelected.level),
                hierarchyName = hierarchyMatch && hierarchyMatch[1];

            if (!selObjects.first().isMeasure) {
                if (AIC.isOLAP()) {
                    rootNode = adhocDesigner.dimensionsTree.getRootNode().childs.find(function (node) {
                        return node.param.extra.id === selObjects.first().dimensionId;
                    });

                    if (rootNode.childs[0].param.extra.isHierarchy) {
                        rootNode = _.find(rootNode.childs, function (node) {
                            return node.param.extra.id === hierarchyName;
                        })
                    }

                    action = selObjects.first().axis === "row" ? "AdHocCrosstab.appendDimensionToRowAxisWithLevel" : "AdHocCrosstab.appendDimensionToColumnAxisWithLevel";
                } else {
                    //In nonOLAP mode there is only one level for any dimension
                    selObjects.first().index = 0;
                    return contextActionModel;
                }
            } else {
                rootNode = adhocDesigner.measuresTree.getRootNode();
                action = selObjects.first().axis === "row" ? "AdHocCrosstab.appendMeasureToRow" : "AdHocCrosstab.appendMeasureToColumn";
            }

            if (selObjects.first().allLevels === undefined) {
                var metadata = selObjects.first();
                metadata.allLevels = AdHocCrosstab.state.getLevelsFromDimension(selObjects.first().dimensionId, metadata.axis);
                metadata.index = metadata.allLevels.indexOf(metadata.level);
            }

            if (selObjects.first().allLevels) {
                if (AIC.isOLAP()) {
                    siblingLevels = rootNode.childs.findAll(function (node) {
                        return !selObjects.first().allLevels.include(node.param.extra.id);
                    });
                } else {
                    siblingLevels = adhocDesigner.getAllLeaves(rootNode, adhocDesigner.measuresTree)
                        .findAll(function (node) {
                            return !selObjects.first().allLevels.include(node.param.extra.id);
                        });
                }
            }

            if (!siblingLevels || siblingLevels.length === 0) {
                return contextActionModel;
            }

            menuToUpdate.text = adhocDesigner.getMessage(selObjects.first().isMeasure ? 'addMeasures' : 'addLevels');
            menuToUpdate.children = siblingLevels.collect(function (node) {
                return actionModel.createMenuElement("optionAction", {
                    text: node.name,
                    action: action,
                    actionArgs: selObjects.first().isMeasure ? [node.param.extra.id] : [{
                        id: node.param.extra.id,
                        groupId: node.param.extra.dimensionId,
                        isMeasure: false
                    }]
                });
            });

            return contextActionModel;
        },
        getSelectedDimensionIndex: function (selectedObject) {
            var index;
            if (selectedObject) {
                var dimensionId = selectedObject.isMeasure ? adhocDesigner.MEASURES : selectedObject.dimensionId;
                index = -1;

                _.find(AIC.getDimensions(selectedObject.axis), function (elem, ind) {
                    if (elem.name === dimensionId) {
                        index = ind;
                        return true;
                    }
                });
            }
            return index;
        }
    });
    /*
     * Select
     */
    _.extend(AIC, {
        selectFromDisplayManager: function (event, node, area) {
            designerBase.unSelectAll();
            var isMultiSelect = adhocDesigner.isMultiSelect(event, area);
            selectionCategory.area = area;
            var isSelected = adhocDesigner.isAlreadySelected(node);
            adhocDesigner.addSelectedObject(event, node, isMultiSelect, isSelected);
            Event.stop(event);
        },
        deselectAllSelectedOverlays: function () {
        }
    });

///////////////////////////////////////////////////////////////
// Ajax callbacks
///////////////////////////////////////////////////////////////
    _.extend(AIC, {
        standardOpCallback: function (state) {
            if (state) {
                adhocDesigner.updateStateAndRender(state);
            } else {
                window.console && console.log("Internal server error occurred");
            }
        }
    });

    /*
     * Observers.
     */

    jQuery(window).on('resizeEnd', function () {
        if (localContext.getMode() == designerBase.ICHART || localContext.getMode() == designerBase.OLAP_ICHART) {
            localContext.resize();
        }
    });

    jQuery('#designer').bind({
        'rendering:done': function () {
            if (localContext.getMode() == designerBase.ICHART || localContext.getMode() == designerBase.OLAP_ICHART) {
                AIC.fixFirstRendering();
            }
        }
    });

    //TODO: remove while moving to full AMD env
    window.AdhocIntelligentChart = AdhocIntelligentChart;
    window.AIC = AdhocIntelligentChart;

    return AdhocIntelligentChart;

});
