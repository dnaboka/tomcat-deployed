<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

{{ if (_isColumnHeader) { }}
<th
{{ } else { }}
<td
{{ } }}
    {{ var sortDirection = _sortStatus == 1 ? "ascending" : (_sortStatus == 2 ? "descending" : "natural"); }}

    {{ if (_id) { }} id="{{-_id}}" {{ } }}
    class="{{-_tclass}}"
    rowspan="{{-_rowspan}}"
    colspan="{{-_colspan}}"
    data-isSummaryHeader="{{-_isSummaryHeader}}"
    data-fieldValue="{{- _cellContent }}"
    data-sliceable="{{-_sliceable}}"
    data-expanable="{{-_isExpandable}}"
    data-path="{{-_path}}"
    data-sorting="{{-sortDirection}}"
    data-levelName="{{-_levelName}}">
    {{ if (_isExpandable) { }}
        <span class="button disclosure icon {{ _expanded ? print('open') : print('closed'); }} {{ if (_isMegedCrosstabCell) { }} placeholder{{ } }}"></span>
    {{ } }}

    {{- _cellContent }}

    {{ if (_canSort) { }}
    <span class="icon button sort {{-sortDirection}}"></span>
    {{ } }}

    {{ if (_topFilterStatus) { }}
    <span class="icon button filter {{-_topFilterStatus}}"></span>
    {{ } }}

{{ if (_isColumnHeader) { }}
</th>
{{ } else { }}
</td>
{{ } }}
