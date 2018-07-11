<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="t" %>

<script id="tableTemplate" type="text/template">
<c:if test="${!isIPad}">
<div id="canvasTableFrame" style="padding-right:100px;position:absolute;">
</c:if>

<table id="canvasTable"
       class="data table wrapper default"
       style="z-index:0; {{ if (!(partial.table.columns.length > 0 || partial.table.flattenedData.length > 0)) { print('border:none;'); } }}"
       cellspacing="0">
        <caption class="caption" style="height:40px;">
            {{ if (groups.length > 0 || partial.columns.length > 0) { }}
                <div id="tableOptions" class="selector mutton"></div>
                <!-- title caption -->
                {{ if (titleBarShowing) { }}
                    {{ if (isWebKitEngine() || isIE7()) { }}
                    <div id="titleCaption">
                        <div style="position:absolute;text-align:center;">{{- title }}</div>
                    </div>
                    {{ } else {}}
                        <div id="titleCaption" >{{- title }}</div>
                    {{ } }}
                {{ } }}
            {{ } }}
        </caption>
    <!-- START: Column Stakes -->
    <colgroup id='canvasTableCols'>
        {{ _.each(partial.table.columns, function(column) { }}
            <col style="width:{{-column.width}}px;">
        {{ }); }}
    </colgroup>
    <!-- END: Column Stakes -->

    <!-- START: Column Headers -->
    <tr  class="labels column" id='columnHeaderRow'>
        {{ _.each(partial.table.columnHeaderRow.members, function(member, index) { }}
            <th data-type="{{-partial.table.columns[index].numericType}}"
                data-mask='{{-partial.table.columns[index].mask}}'
                class="label {{ if (member.isEmpty || member.isSpacer) {print('deletedHeader');} else {member.isNumeric ? print('numeric') : print('');} }}"
                data-fieldName="{{-partial.table.columns[index].fieldName }}"
                data-fieldDisplay="{{- partial.table.columns[index].defaultDisplayName }}"
                data-label="{{-member.formattedContent}}"
                data-index="{{-index}}"
                style="min-width:{{-partial.table.columns[index].width}}px; box-sizing: border-box;">
                {{ if (!member.isEmpty || member.isSpacer) { }}
                <span class="wrap">
                    {{
                        if(partial.table.columns[index].fieldName === '_spacer') {
                            print( _.xssEscape(member.formattedContent, {softHTMLEscape: true, whiteList: ['img']}) );
                        } else {
                            print( _.xssEscape(member.formattedContent) );
                        }
                    }}
                </span>
                {{ } else { }}
                {{-partial.table.columns[index].name}}
                {{ } }}
            </th>
        {{ }); }}
    </tr>
    <!-- END: Column Headers -->
    <!-- START: Group and Rows-->
    {{ if (!hasNoData) { }}
        <%-- because of infinit scroll feature we have to store this counter somewhere in global scope --%>
        {{localContext.state.table._oddIndex = 0; }}
        <%@ include file="tableRows.jsp" %>
    {{ } }}
</table>
<c:if test="${!isIPad}">
</div>
</c:if>
</script>
