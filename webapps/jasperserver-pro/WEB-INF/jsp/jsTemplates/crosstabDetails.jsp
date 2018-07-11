<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--total number rows--%>
{{
var numberOfDetailRows = crosstab.detailRows.length;
var totalNumberOfDetailRows = crosstab.totalNumberOfDetailRows;
var numberOfColumns = crosstab.numberOfColumnHeaderCells;
var isTotalsRow = false;
}}

<%-- this is necessary for case when no measures added. just show emty cells in this case
to be able to manipulate with UX --%>
{{
    var _emptyValueCellColspan = totalsColSpanIndex;

    _.each(crosstab.headerRows[numberOfColumnGroups - 1], function(rowGroup, index) {
        if (totalsColSpanIndex > 0 && index >= totalsColSpanIndex) {
            _emptyValueCellColspan += 1;
        }
    });

    if (_emptyValueCellColspan > totalsColSpanIndex) {
        _emptyValueCellColspan += 1;
    }

    var _showingColOverflow = false;
}}

{{ (function() {
<%--
this is necessary for unmerged crosstab cells feature
all dummy unmerged cells will get info about effective cell from this array
--%>
var _effectiveXtabHeaders = [];

var _oddEvenCounter = 0;
}}

<%--iterate and print detail rows--%>
{{ _.each(crosstab.detailRows, function(detailRow, detailRowIndex) { }}
    {{ var _oddEvenClass = _oddEvenCounter % 2 == 0 ? 'even' : 'odd' }}

<%-- Set up flag from which totals row generation should starts --%>
    {{ if (!olapCrosstabMode && rowGroupsPresent && detailRow && detailRow.rowHeaders && detailRow.rowHeaders[0] && detailRow.rowHeaders[0].isSummaryCrosstabHeader) { }}
        {{ if (measuresIsLastRow) { }}
            <%-- Show total in safe mode only when measures is last row or not in rows--%>
            {{ isTotalsRow = true; }}
        {{ } }}
    {{ } }}

    <%--Render the row with headers and cells --%>
    {{ if (!crosstab.safeRowMode || (detailRowIndex < safeNumberOfRows) || isTotalsRow) { }}
        <tr id="detailRow_{{-detailRowIndex}}">
            {{ if (rowGroupsPresent) { }}
                {{ _.each(detailRow.rowHeaders, function(xtabHeader, groupIndex) { }}
                    <%--Render actual cell if it is not NULL or if it not exceed safe number of rows--%>
                    {{ if (xtabHeader || !crosstab.mergeCrosstabCells) { }}
                        {{ if (xtabHeader) _effectiveXtabHeaders[groupIndex] = xtabHeader; }}
                        {{ var rowSpan = crosstab.mergeCrosstabCells ? _effectiveXtabHeaders[groupIndex].span : 1; }}

                        <%--This checks to see if the next cell exceeds the overflow count. --%>
                        {{ if (crosstab.safeRowMode && ((detailRowIndex + rowSpan) > safeNumberOfRows) && !isTotalsRow) { }}
                            {{ rowSpan = safeNumberOfRows - detailRowIndex; }}
                        {{ } }}

                        {{ (function() {
                        var _isColumnHeader = false,
                            _levelName = _effectiveXtabHeaders[groupIndex].levelName,
                            _isInner = detailRow.rowHeaders.length - 1 === groupIndex,
                            _isAll = _effectiveXtabHeaders[groupIndex].isAll,
                            _tclass = _effectiveXtabHeaders[groupIndex].hierarchicalClassSelectors + " row" + (_isInner ? " " + _oddEvenClass : "") + (_isAll ? " all" : ""),
                            _path = _effectiveXtabHeaders[groupIndex].path,
                            _id = xtabHeader ? "rowGroup_" + xtabHeader.level + "_" + detailRowIndex : null,
                            _isExpandable = _effectiveXtabHeaders[groupIndex].expandable,
                            _expanded = _effectiveXtabHeaders[groupIndex].expanded,
                            _cellContent = _effectiveXtabHeaders[groupIndex].label,
                            _sortStatus = _effectiveXtabHeaders[groupIndex].sortStatus,
                            _canSort = false,
                            _rowspan = rowSpan,
                            _colspan = _effectiveXtabHeaders[groupIndex].inwardSpan,
                            _isSummaryHeader = xtabHeader && xtabHeader.isSummaryCrosstabHeader,
                            _sliceable = _effectiveXtabHeaders[groupIndex].sliceable,
                            _isMegedCrosstabCell = !xtabHeader,
                            _topFilterStatus = null;
                            }}

                        <%@ include file="crosstabHeaderLabel.jsp" %>
                        {{ })(); }}
                    {{ } }}
                {{ }); }}
            {{ } }}

            {{ if (!rowGroupsPresent) { }}
                <td id="rowGroupsPlaceHolder" rowspan="{{-numberOfDetailRows}}"><spring:message code="ADH_261_ROW_GROUP"/></td>
            {{ } }}

            {{ if (detailRow.cells && detailRow.cells.length > 0) { }}
                {{ _.each(detailRow.cells, function(xtabCell, xtabCellIndex) { }}
                    {{ var _colOverflowAlreadyShown = false; }}
                    {{ if (xtabCellIndex < safeNumberOfColumns || (totalsColSpanIndex > 0 && xtabCellIndex >= totalsColSpanIndex)) { }}
                        <%-- TODO: think how to optimize branching to avoid this code duplications--%>
                        {{ if (xtabCellIndex == safeNumberOfColumns && (crosstab.numberOfColumnHeaderCells - safeNumberOfColumns > 0)) { }}
                            <td class="colOverflow"></td>
                            {{ _showingColOverflow = true; }}
                            {{ _colOverflowAlreadyShown = true; }}
                        {{ } }}

                        {{ if (crosstab.hasParentChildDimension) { }}
                           <%--
                               2012-04-27 thorick chow:  http://bugzilla.jaspersoft.com/show_bug.cgi?id=16298
                               Drill Through is disabled for any view that contains OLAP Dimension with ParentChild (recursive) Hierarchies
                           --%>
                           <td class="{{-xtabCell.hierarchicalSelectors}} {{- _oddEvenClass}} {{- detailRowIndex}}" id="measureBucketNoDrillParentChild_{{-xtabCell.rowGroupPathIndex}}_{{-xtabCell.columnGroupPathIndex}}_values">
                           <span class="">{{- xtabCell.cellValue }}</span>
                        {{ } else if (xtabCell.isDrillable == 'false') { }}
                            <%--
                                2017-03-06 grant bacon: http://
                                Drill Down should be disabled for cells which use either a day of week categorizer or if a time balance summary is used
                            --%>
                           <td class="{{-xtabCell.hierarchicalSelectors}} {{- _oddEvenClass}} {{- detailRowIndex}}" id="measureBucketInvalidDrill_{{-xtabCell.rowGroupPathIndex}}_{{-xtabCell.columnGroupPathIndex}}_values">
                           <span class="">{{- xtabCell.cellValue }}</span>
                        {{ } else { }}
                           <td class="{{-xtabCell.hierarchicalSelectors}} {{- _oddEvenClass}} {{- detailRowIndex}}" id="measureBucketDrill_{{-xtabCell.rowGroupPathIndex}}_{{-xtabCell.columnGroupPathIndex}}_values">
                           <span class="{{inDesignView ? print('link') : print('');}}">{{- xtabCell.cellValue }}</span>
                        {{ } }}
                        </td>
                    {{ } }}
                    {{ if (xtabCellIndex == safeNumberOfColumns && (crosstab.numberOfColumnHeaderCells - safeNumberOfColumns > 0) && !_colOverflowAlreadyShown) { }}
                        <td class="colOverflow"></td>
                        {{ _showingColOverflow = true; }}
                    {{ } }}
                {{ }); }}
            {{ } else  if (numberOfColumnGroups > 0) { }}
                <td class="value bottom-border" colspan="{{- _emptyValueCellColspan}}"></td>
            {{ } }}
        </tr>
        {{_oddEvenCounter += 1;}}
    {{ } }}
{{ }); }}
{{ })(); }}


{{ if (crosstab.safeRowMode && totalNumberOfDetailRows - safeNumberOfRows - crosstab.rowTotalsSpan > 0) { }}
    {{ var rowHeadersCount =  numberOfRowGroups + (colGroupsPresent ? 1 : 0); }}
    {{ var lastAllowedRowIndex = (crosstab.detailRows.length < safeNumberOfRows ? crosstab.detailRows.length : safeNumberOfRows) - 1; }}
    {{ var cellsCount =  crosstab.detailRows[0].cells.length; }}
    {{ var rowOverflowColSpan =  rowHeadersCount + (cellsCount < safeNumberOfColumns ? cellsCount : (_showingColOverflow ? safeNumberOfColumns + 3 : safeNumberOfColumns)); }}
    {{ if (cellsCount == 0) { }}
        {{ rowOverflowColSpan =  rowHeadersCount + _emptyValueCellColspan; }}
    {{ } }}

    <tr>
        <td class="rowOverflow" colspan="{{-rowOverflowColSpan}}">
            <a><span class="wrap">{{print(totalNumberOfDetailRows - safeNumberOfRows);}} <spring:message code="ADH_280_MORE_LINK"/></span></a>
        </td>
    </tr>
{{ } }}
