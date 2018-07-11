<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--Used to keep track of the spanning--%>
{{
var flagForOverflow = false;
var innerSpanCount = 0;
}}

{{ for (var groupIndex = 0; groupIndex < headerRow.length; groupIndex++) { }}
    {{ var xtabHeader = headerRow[groupIndex]; }}
    {{var colSpan = xtabHeader.span; }}

    {{var renderNextCell = true; }}

    <%-- Set up index from which totals column generation should starts --%>
    {{ if (!olapCrosstabMode && headerRowIndex == 0 && xtabHeader && xtabHeader.isSummaryCrosstabHeader && totalsColSpanIndex < 0) {
        <%-- Show total in safe mode only when measures is last column or not in columns --%>
        if (measuresIsLastColumn) {
            totalsColSpanIndex = innerSpanCount;
        }
    } }}
    {{ var isTotalsColumn = totalsColSpanIndex > 0 ? (innerSpanCount >= totalsColSpanIndex) : false; }}

    <%--set overflow flag to true for overflow rendering--%>
    {{ if (innerSpanCount + colSpan >= safeNumberOfColumns) {
        flagForOverflow = innerSpanCount < safeNumberOfColumns;
        <%--adjust column span for summary cell--%>
        colSpan = flagForOverflow ? (safeNumberOfColumns - innerSpanCount) : colSpan;

        <%-- Render next cell if it is a last column which will be cut to safeColumns number or if it is a totals column --%>
        renderNextCell = flagForOverflow ? true : isTotalsColumn;
    } }}

    {{ if (renderNextCell) {
        (function() {
            var _isColumnHeader = true;
            var _isAll = xtabHeader.isAll;
            var _tclass = xtabHeader.hierarchicalClassSelectors + " column" + (_isAll ? " all" : "");
            var _expanded = xtabHeader.expanded;
            var _cellContent = xtabHeader.label;
            var _isInnermost = xtabHeader.isInner;
            var _canSort = inDesignView && _isInnermost;
            var _sortStatus = xtabHeader.sortStatus;
            var _rowspan = xtabHeader.inwardSpan;
            var _colspan = crosstab.mergeCrosstabCells ? colSpan : 1;
            var _isSummaryHeader = xtabHeader && xtabHeader.isSummaryCrosstabHeader;
            var _sliceable = xtabHeader.sliceable;
            var _path = xtabHeader.path;
            var _topBottomFilter = AdHocCrosstab.getTopBottomFilter();
            var _topFilterStatus = _topBottomFilter && _topBottomFilter.path === _path ? _topBottomFilter.type : null;

            for (var _headerLabelIndex = 0; _headerLabelIndex < (crosstab.mergeCrosstabCells ? 1 : colSpan); _headerLabelIndex++) { }}
                {{  var _isMegedCrosstabCell = _headerLabelIndex > 0;
                    var _isExpandable = _isMegedCrosstabCell ? false : xtabHeader.expandable;
                    var _id = _headerLabelIndex == 0 ? "colGroupHeaderRow_" + xtabHeader.level + "_" + groupIndex : null;}}

                <%@ include file="crosstabHeaderLabel.jsp" %>
        {{  } }}
    {{ })(); }}

        <%--render this cell IFF we need overflow. this should only be rendered once by the outmost row --%>
        {{ if (flagForOverflow && (crosstab.numberOfColumnHeaderCells - safeNumberOfColumns > 0)) { }}
            {{ if (headerRowIndex == 0) { }}
                <th class="colOverflow"
                    data-canShowMore="{{-crosstab.safeColumnMode}}"
                    title="{{print(crosstab.numberOfColumnHeaderCells - safeNumberOfColumns);}} <spring:message code="ADH_280_MORE_LINK"/>"
                    rowspan="{{print(rowGroupsPresent ? numberOfColumnGroups + 1: numberOfColumnGroups)}}">
                    <a><span class="wrap">...</span></a>
                </th>
            {{ } }}
        {{ } }}
    {{ } }}

    <%--update cell count--%>
    {{ innerSpanCount = innerSpanCount + xtabHeader.span; }}
{{ } }}
