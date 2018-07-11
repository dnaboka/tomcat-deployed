<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="t" %>

<div id="highChartsRepo">
    <div id="chartOptions"></div>
    <ul id="chartMenu" class="menu vertical" style="display:none">
        <li class="leaf" action="chart-types">
        	<p class="wrap">
        		<span class="icon"></span>
        		<spring:message code="ADH_1214_ICHARTS_MENU_ITEM_CHART_TYPES"/>
        	</p>
        </li>
        <li class="leaf" action="chart-format">
        	<p class="wrap">
        		<span class="icon"></span>
                <spring:message code="ADH_1214_ICHARTS_MENU_ITEM_CHART_FORMAT"/>
            </p>
        </li>
    </ul>

    <div id="chartContainer"></div>

    <div id="chartTypeSelector" class="panel dialog overlay data-level-selector moveable centered_horz centered_vert hidden">
        <div class="content">
            <div class="header mover">
                <div class="closeIcon"></div>
                <div class="title"><spring:message code="ADH_1214_ICHARTS_DIALOG_CHART_TYPE_TITLE"/></div>
            </div>
            <div class="body">
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_COLUMN_AND_BAR"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_COLUMN"/>" name="column"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_STACKED_COLUMN"/>" name="stacked_column"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_PERCENT_COLUMN"/>"name="percent_column"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_BAR"/>" name="bar"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_STACKED_BAR"/>" name="stacked_bar"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_PERCENT_BAR"/>" name="percent_bar"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPIDER_COLUMN"/>" name="spider_column"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_LINE_AND_AREA"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_LINE"/>" name="line"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPLINE"/>" name="spline"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_AREA"/>" name="area"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_STACKED_AREA"/>" name="stacked_area"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_PERCENT_AREA"/>" name="percent_area"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_AREA_SPLINE"/>" name="spline_area"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPIDER_LINE"/>" name="spider_line"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPIDER_AREA"/>" name="spider_area"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_DUAL_AND_MULTI_AXIS"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_COLUMN_LINE"/>" name="column_line"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_COLUMN_SPLINE"/>" name="column_spline"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_STACKED_COLUMN_LINE"/>" name="stacked_column_line"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_STACKED_COLUMN_SPLINE"/>" name="stacked_column_spline"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_MULTI_AXIS_LINE"/>" name="multi_axis_line"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_MULTI_AXIS_SPLINE"/>" name="multi_axis_spline"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_MULTI_AXIS_COLUMN"/>" name="multi_axis_column"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_TIME_SERIES"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_LINE_TIME_SERIES"/>" name="line_time_series"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPLINE_TIME_SERIES"/>" name="spline_time_series"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_AREA_TIME_SERIES"/>" name="area_time_series"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPLINE_AREA_TIME_SERIES"/>" name="spline_area_time_series"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_SCATTER_AND_BUBBLE"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SCATTER"/>" name="scatter"></div>
                    <!--<div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SCATTER_LINE"/>" name="scatter_line"></div>-->
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_BUBBLE"/>" name="bubble"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_PIE"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_PIE"/>" name="pie"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_DUAL_LEVEL_PIE"/>" name="dual_level_pie"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SEMI_PIE"/>" name="semi_pie"></div>
                </div>
                <p class="wrap"><spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GROUP_RANGE"/></p>
                <div class="row">
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_HEAT_MAP"/>" name="heat_map"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_TIME_SERIES_HEAT_MAP"/>" name="heat_map_time_series"></div>
                    <!--
                        <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_SPEEDOMETER"/>" name="speedometer"></div>
                        <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_GAUGE"/>" name="arc_gauge"></div>
                    -->
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_DUAL_MEASURE_TREE_MAP"/>" name="dual_measure_tree_map"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_TREE_MAP"/>" name="tree_map"></div>
                    <div class="cell" tooltipappeardelay="0" tooltiptext="<spring:message code="ADH_1214_ICHARTS_CHART_TYPE_ONE_PARENT_TREE_MAP"/>" name="one_parent_tree_map"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="chartFormatDialog" class="panel dialog overlay moveable centered_horz centered_vert hidden"></div>

    <div id="dataLevelSelector" class="panel dialog overlay data-level-selector moveable centered_horz centered_vert hidden">
        <div class="content">
            <div class="header mover">
                <div class="closeIcon"></div>
                <div class="title"><spring:message code="ADH_1214_ICHARTS_DATA_LEVEL_SELECTOR_TITLE"/></div>
            </div>
            <div class="body"></div>
        </div>
    </div>

    <script id="dataLevelSelectorTemplate" type="text/html">
        <tr>
            {{#label}}
            <td class="olap_level_name"><div><div class="olap_level_label">{{name}}</div></div></td>
            {{/label}}
            <td><div class="jrs-slider"></div></td>
        </tr>
    </script>
    <script id="sliderTickTemplate" type="text/html">
        <div class="sliderTick" level-name="{{label}}" style="left:{{width}}%"><div class="tickOverlay"></div></div>
    </script>
    <script id="titleCaptionTemplate" type="text/html">
        <div id="titleCaption" class="highChartsTitle shadow"></div>
    </script>
    <script id="levelSelectorTemplate" type="text/html">
        <table id="{{id}}" cellspacing="10" class="levelSelector" style="display: table;">
            <tbody>
            <tr>
                <td colspan="{{colspan}}" class="select-header">{{name}}</td>
            </tr>
            </tbody>
        </table>
    </script>
</div>

