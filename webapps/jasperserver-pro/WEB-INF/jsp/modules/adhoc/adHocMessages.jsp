<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<script id="adHocMessages" type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    __jrsConfigs__.adhoc.adhocDesignerMessages = {};
    __jrsConfigs__.adhoc.AdHocChart = {};
    __jrsConfigs__.adhoc.AdHocTable = {};

    __jrsConfigs__.adhoc.adhocDesignerMessages['cantAddSet'] = '<spring:message code="ADH_109_CANT_ADD_SET" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages['noDataMode'] = '<spring:message code="ADH_108_DESIGNER_NODATA_DISPLAYMESSAGE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["addMeasures"] = '<spring:message code="ADH_1213_CROSSTAB_LEVEL_ADD_MEASURES" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["addLevels"] = '<spring:message code="ADH_1213_CROSSTAB_LEVEL_ADD_LEVELS" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["defaultCaptionTitle"] = '<spring:message code="ADH_113_REPORT_SELECTOR" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["overflowConfirmMessage"] = '<spring:message code="ADH_280_MORE_CONFIRM_MESSAGE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["spacer"] = '<spring:message code="ADH_120_SPACER" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["totalsLabelForChart"] = '<spring:message code="ADH_231_TOTALS" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["allLabelForChart"] = '<spring:message code="ADH_231_ALL" javaScriptEscape="true"/>';
    /* for OLAP */
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_264_XTAB_STATUS_EMPTY"] = '<spring:message code="ADH_264_XTAB_STATUS_EMPTY" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_264_XTAB_STATUS_EMPTY_DIMENSION"] = '<spring:message code="ADH_264_XTAB_STATUS_EMPTY_DIMENSION" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1213_DRILLTHROUGH_NOT_SUPPORTED_PARENT_CHILD"] =  '<spring:message code="ADH_1213_DRILLTHROUGH_NOT_SUPPORTED_PARENT_CHILD" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_CROSSTAB_LAST_FILTERED_LEVEL"] =  '<spring:message code="ADH_CROSSTAB_LAST_FILTERED_LEVEL" javaScriptEscape="true"/>';
    /* for nonOLAP*/
    __jrsConfigs__.adhoc.adhocDesignerMessages["missingFieldMeasureMessage"] = '<spring:message code="ADH_264_XTAB_STATUS_MISSING_FIELD_MEASURE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["missingFieldMessage"] = '<spring:message code="ADH_264_XTAB_STATUS_MISSING_FIELD" javaScriptEscape="true"/>';

    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_264_XTAB_STATUS_MISSING_MEASURE_DIMENSION"] = '<spring:message code="ADH_264_XTAB_STATUS_MISSING_MEASURE_DIMENSION" javaScriptEscape="true"/>';

    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_263_MDX_QUERY_STATUS_MISSING_MEASURE_DIMENSION"] = '<spring:message code="ADH_263_MDX_QUERY_STATUS_MISSING_MEASURE_DIMENSION" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_263_MDX_QUERY_STATUS_MISSING_COLUMN_AXIS"] = '<spring:message code="ADH_263_MDX_QUERY_STATUS_MISSING_COLUMN_AXIS" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_263_MDX_QUERY_STATUS_EMPTY_DIMENSION"] = '<spring:message code="ADH_263_MDX_QUERY_STATUS_EMPTY_DIMENSION" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_263_MDX_QUERY_STATUS_EMPTY"] = '<spring:message code="ADH_263_MDX_QUERY_STATUS_EMPTY" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_263_MDX_QUERY_STATUS_EMPTY_RESULT_AXIS"] = '<spring:message code="ADH_263_MDX_QUERY_STATUS_EMPTY" javaScriptEscape="true"/>';

    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_530_MEASURES"] = '<spring:message code="ADH_530_MEASURES" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_CHART_DATA"] = '<spring:message code="ADH_1214_ICHARTS_NO_CHART_DATA" javaScriptEscape="true"/>';

    // Wrong configuration canvas messages.
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_SPIDER"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_SPIDER" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_TIME_SERIES_DATA"] = '<spring:message code="ADH_1214_ICHARTS_NO_TIME_SERIES_DATA" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_COLUMN_LINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_COLUMN_LINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_COLUMN_SPLINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_COLUMN_SPLINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_LINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_LINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_SPLINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_SPLINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_LINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_LINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_SPLINE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_SPLINE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_COLUMN"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_COLUMN" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_SCATTER"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_SCATTER" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_BUBBLE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_BUBBLE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_DUAL_LEVEL_PIE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_DUAL_LEVEL_PIE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_NON_OLAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_NON_OLAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_OLAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_OLAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_TIME_SERIES_HEAT_MAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TIME_SERIES_HEAT_MAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_DUAL_MEASURE_TREE_MAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_DUAL_MEASURE_TREE_MAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_TREE_MAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TREE_MAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_ONE_PARENT_TREE_MAP"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_ONE_PARENT_TREE_MAP" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_SPEEDOMETER"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_SPEEDOMETER" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_DATA_GAUGE"] = '<spring:message code="ADH_1214_ICHARTS_NO_DATA_GAUGE" javaScriptEscape="true"/>';

  __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_NO_SWITCHMODE_DELETED_SUMMARIES"] = '<spring:message code="ADH_1214_ICHARTS_NO_SWITCHMODE_DELETED_SUMMARIES" javaScriptEscape="true"/>';

  __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_ERROR_TOO_MANY_VALUES"] = '<spring:message code="ADH_1214_ICHARTS_ERROR_TOO_MANY_VALUES" javaScriptEscape="true"/>';
  __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1214_ICHARTS_ERROR_UNCAUGHT"] = '<spring:message code="ADH_1214_ICHARTS_ERROR_UNCAUGHT" javaScriptEscape="true"/>';

  __jrsConfigs__.adhoc.adhocDesignerMessages["dialog.dependencies.message"] = '<spring:message code="dialog.dependencies.message" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["dialog.dependencies.saveMessage"] = '<spring:message code="dialog.dependencies.saveMessage" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["dialog.dependencies.saveAsMessage"] = '<spring:message code="dialog.dependencies.saveAsMessage" javaScriptEscape="true" />';

    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1215_FIELD_IN_USE"] = '<spring:message code="ADH_1215_FIELD_IN_USE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_1"] = '<spring:message code="ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_1" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_2"] = '<spring:message code="ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_2" javaScriptEscape="true"/>';

    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1236_SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION"] = '<spring:message code="ADH_1236_SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages["ADH_1237_IGNORE"] = '<spring:message code="ADH_1237_IGNORE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages['adhoc.inuse.designer.canvas.error.message'] = '<spring:message code="adhoc.inuse.designer.canvas.error.message" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.adhocDesignerMessages['adhoc.designer.warn.use.domain.labels'] = '<spring:message code="adhoc.designer.warn.use.domain.labels" javaScriptEscape="true"/>';

    /* for Chart */
    __jrsConfigs__.adhoc.AdHocChart.showChartLabel = '<spring:message code="ADH_099a_SHOW_CHART" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.hideChartLabel = '<spring:message code="ADH_099b_HIDE_CHART" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.chartLabel = '<spring:message code="ADH_570_CHART_LABEL" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.seriesLabel = '<spring:message code="ADH_571_SERIES_LABEL" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.byLabel = '<spring:message code="ADH_572_BY_LABEL" javaScriptEscape="true"/>';

    //hover for quick arrow
    __jrsConfigs__.adhoc.AdHocChart.quickAdd = '<spring:message code="ADH_110b_CLICK_ARROW_CHART_ADD" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.quickReplace = '<spring:message code="ADH_110c_CLICK_ARROW_CHART_REPLACE" javaScriptEscape="true"/>';
    __jrsConfigs__.adhoc.AdHocChart.reportMenuTitle = '<spring:message code="ADH_019c_MENU_REPORT_TITLE_CHART" javaScriptEscape="true"/>';

    __jrsConfigs__.adhoc.AdHocTable.nothingToDisplayMessage = "<spring:message code='ADH_265_TABLE_STATUS_MISSING_FIELD_MEASURE' javaScriptEscape='true'/>";
    __jrsConfigs__.adhoc.AdHocTable.noDataDisplayMessage = "<spring:message code='ADH_108_DESIGNER_NODATA_DISPLAYMESSAGE' javaScriptEscape='true'/>";
</script>
