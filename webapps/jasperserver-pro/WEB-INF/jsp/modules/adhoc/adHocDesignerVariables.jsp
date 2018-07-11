<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--designer mode availability--%>
<c:choose>
    <c:when test="${requestScope.viewModel.isWritable}">
        <c:set var="canDesign" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="canDesign" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<%--save availability--%>
<c:choose>
    <c:when test="${requestScope.viewModel.canSave}">
        <c:set var="canSaveOrExport" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="canSaveOrExport" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<%--undo redo setting--%>
<c:choose>
    <c:when test="${requestScope.viewModel.canUndo}">
        <c:set var="canUndo" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="canUndo" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.canRedo}">
        <c:set var="canRedo" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="canRedo" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<%--full data options--%>
<c:choose>
    <c:when test="${requestScope.viewModel.canShowSampleData}">
        <c:set var="canShowSampleData" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="canShowSampleData" value="selected"/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.showingFullData}">
        <c:set var="sampleData" value=""/>
        <c:set var="fullData" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="sampleData" value="selected"/>
        <c:set var="fullData" value=""/>
    </c:otherwise>
</c:choose>

<%--pivot actions--%>
<c:choose>
    <c:when test="${requestScope.viewModel.canPivot}">
        <c:set var="canPivot" value=""/></c:when>
    <c:otherwise>
        <c:set var="canPivot" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<%--query view--%>
<c:set var="canViewQuery" value="${requestScope.viewModel.canViewQuery ? '' : 'disabled=\"disabled\"'}" />

<%--report options --%>
<c:choose>
    <c:when test="${requestScope.reportType == 'table'}">
        <c:set var="canSort" value=""/></c:when>
    <c:otherwise>
        <c:set var="canSort" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.isItDomainReport}">
        <c:set var="isDomainReport" value="disabled='disabled'"/>
    </c:when>
    <c:when test="${requestScope.hasVisibleInputControls == 'true'}">
        <c:set var="isDomainReport" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="isDomainReport" value="disabled='disabled'"/>
    </c:otherwise>
</c:choose>

<%--context or mode type--%>
<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'table'}">
        <c:set var="tableMode" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="tableMode" value=""/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'chart'}">
        <c:set var="chartMode" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="chartMode" value=""/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'ichart' || requestScope.viewModel.viewType == 'olap_ichart'}">
        <c:set var="ichartMode" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="ichartMode" value=""/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'crosstab' || requestScope.viewModel.viewType == 'ichart'}">
        <c:set var="crosstabMode" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="crosstabMode" value=""/>
    </c:otherwise>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'olap_crosstab' || requestScope.viewModel.viewType == 'olap_ichart'}">
        <c:set var="olapCrosstabMode" value="selected"/>
    </c:when>
</c:choose>

<c:choose>
    <c:when test="${requestScope.viewModel.viewType == 'crosstab' || requestScope.viewModel.viewType == 'olap_ichart'}">
        <c:set var="crosstabModeOnly" value="selected"/>
    </c:when>
    <c:otherwise>
        <c:set var="crosstabModeOnly" value=""/>
    </c:otherwise>
</c:choose>

<c:set var="isCrosstab" value="${olapCrosstabMode == 'selected' || crosstabMode == 'selected'}"/>

<c:set var="availFieldsPanelClass" value="twoPanes"/>
<c:set var="primaryColumnID" value="canvas"/>
