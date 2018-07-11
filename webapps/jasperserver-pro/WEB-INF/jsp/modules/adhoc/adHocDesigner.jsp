<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html" %>
<%--tag libs--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="/WEB-INF/jasperserver.tld" prefix="js" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>

<%@ include file="adHocDesignerVariables.jsp"%>

<%@ include file="/WEB-INF/jsp/jsTemplates/intelligentChart.jsp" %>
<%@ include file="/WEB-INF/jsp/jsTemplates/chart.jsp" %>
<%@ include file="/WEB-INF/jsp/jsTemplates/table.jsp" %>
<%@ include file="/WEB-INF/jsp/jsTemplates/tableRowsIncludingTable.jsp" %>
<%@ include file="/WEB-INF/jsp/jsTemplates/crosstab.jsp" %>

<%--templates--%>

<%--calculated fields--%>
<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
    <t:putAttribute name="containerClass">panel dialog overlay moveable centered_horz centered_vert hidden</t:putAttribute>
    <t:putAttribute name="containerID" value="calcFieldMeasure" />
    <t:putAttribute name="headerClass" value="mover"/>
    <t:putAttribute name="bodyID" cascade="true">calculatedFields-container</t:putAttribute>
    <t:putAttribute name="bodyContent">
    </t:putAttribute>
    <t:putAttribute name="footerContent">
        <button class="button action primary up doneButton">
            <span class="wrap"></span><span class="icon"></span>
        </button>
        <button class="button action up cancelButton">
            <span class="wrap"><spring:message code="button.cancel" javaScriptEscape="true"/><span class="icon"></span>
        </button>
    </t:putAttribute>
</t:insertTemplate>

<%--remove filter standard confirm--%>
<tiles:insertTemplate template="/WEB-INF/jsp/templates/standardConfirm.jsp">
    <tiles:putAttribute name="containerClass">centered_vert centered_horz hidden</tiles:putAttribute>
    <tiles:putAttribute name="bodyContent">
        <p class="message"><spring:message code="ADH_1230_DYNAMIC_FILTER_ADVANCED_CONFIRM_REMOVE" javaScriptEscape="true"/></p>
    </tiles:putAttribute>
    <tiles:putAttribute name="leftButtonId" value="confirmYes"/>
    <tiles:putAttribute name="rightButtonId" value="confirmNo"/>
</tiles:insertTemplate>

<tiles:insertTemplate template="/WEB-INF/jsp/templates/dependencies.jsp">
    <tiles:putAttribute name="containerClass" value="hidden centered_vert centered_horz"/>

    <tiles:putAttribute name="bodyContent">
        <ul id="dependenciesList">
        </ul>
    </tiles:putAttribute>
</tiles:insertTemplate>

<%--sort dialog--%>
<tiles:insertTemplate template="/WEB-INF/jsp/templates/sortDialog.jsp">
    <tiles:putAttribute name="containerClass" value="hidden"/>
    <tiles:putAttribute name="bodyContent">
        <tiles:putAttribute name="availableFields">
            <ul id="sortDialogAvailable" class="list responsive collapsible fields hideRoot"></ul>
        </tiles:putAttribute>
        <tiles:putAttribute name="selectedFields">
            <c:if test="${isIPad}"><div class="swipeScroll" style="position: absolute; right: 0; width: 100%;"></c:if>

                <ul id="sortDialogSortFields"></ul>
            <c:if test="${isIPad}"></div></c:if>
        </tiles:putAttribute>
    </tiles:putAttribute>
</tiles:insertTemplate>

<%--select fields for re-entrant adhoc--%>
<tiles:insertTemplate template="/WEB-INF/jsp/templates/selectFields.jsp">
    <tiles:putAttribute name="containerClass" value="hidden"/>
    <tiles:putAttribute name="bodyContent">
        <tiles:putAttribute name="availableFields">
            <ul id="sourceFieldsTree"></ul>
        </tiles:putAttribute>
        <tiles:putAttribute name="selectedFields">
            <ul id="destinationFieldsTree"></ul>
            <input type="hidden" id="selectedModel" name="selectedModel" value=""/>
            <input type="hidden" id="unsavedChangesPresent" name="unsavedChangesPresent" value=""/>
        </tiles:putAttribute>
    </tiles:putAttribute>
</tiles:insertTemplate>

<%--adhoc edit label--%>
<tiles:insertTemplate template="/WEB-INF/jsp/templates/editLabel.jsp">
    <tiles:putAttribute name="containerClass" value="hidden"/>
</tiles:insertTemplate>

<tiles:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <tiles:putAttribute name="pageTitle"><spring:message code='ADH_001_TITLE'/></tiles:putAttribute>
    <tiles:putAttribute name="bodyID" value="designer"/>
    <tiles:putAttribute name="bodyClass" value="threeColumn"/>
    <tiles:putAttribute name="moduleName" value="adhoc/adhocMain"/>
    <tiles:putAttribute name="headerContent" cascade="false">
        <%--script dependencies--%>
        <%@ include file="adHocScriptHeader.jsp"%>
        <%--include base constant variables--%>
        <%@ include file="adHocBaseScripts.jsp"%>
    </tiles:putAttribute>
    <tiles:putAttribute name="bodyContent">

        <tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <tiles:putAttribute name="containerID" value="${primaryColumnID}"/>
            <%-- <tiles:putAttribute name="containerClass" cascade="false" value="column decorated primary showingToolBar showingSubHeader"/> --%>
            <tiles:putAttribute name="containerClass" cascade="false">column decorated primary showingToolBar</tiles:putAttribute>
            <tiles:putAttribute name="containerAttributes" value="style='right:12px;'" />
            <tiles:putAttribute name="containerTitle" cascade="false"><spring:message code='ADH_002c_CANVAS'/><%--${requestScope.defaultAruName}--%></tiles:putAttribute>
            <tiles:putAttribute name="headerContent" cascade="false">
                <c:if test="${isEmbeddedDesigner}">
                    <div id="closeDesigenr" class="closeIcon"></div>
                </c:if>
                <div id="adhocToolbar" class="toolbar">
                    <ul class="list buttonSet">
                        <li class="node">
                            <ul class="list buttonSet">
                                <c:if test="${!isEmbeddedDesigner}">
                                    <li class="leaf"><button id="presentation" title="<spring:message code='ADH_1100_TOOLTIP_PRESENTATION_MODE'/>" class="button capsule up middle"><span class="wrap">Preview<span class="icon"></span></span></button></li>
                                </c:if>
                                <li class="node"><button id="save" title="<spring:message code='ADH_1101_TOOLTIP_SAVE'/>" class="button capsule ${isEmbeddedDesigner ? '' : 'mutton'} up middle" ${canSaveOrExport}><span class="wrap">Save<span class="icon"></span><span class="${isEmbeddedDesigner ? '' : 'indicator'}"></span></span></button></li>
                                <c:if test="${!isEmbeddedDesigner}">
    								<li class="node"><button id="export" class="button capsule mutton up last" ${canSaveOrExport} title="<spring:message code="button.export"/>"><span class="wrap">Export<span class="icon"></span><span class="indicator"></span></span></button></li>
                                </c:if>
                                <!-- <li class="leaf"><button id="execute" title="<spring:message code='ADH_1102_TOOLTIP_RUN_REPORT'/>" class="button capsule up last" ${canSaveOrExport}><span class="wrap"><spring:message code='ADH_1102_TOOLTIP_RUN_REPORT'/><span class="icon"></span></span></button></li> -->
                            </ul>
                        </li>
                        <li class="node">
                            <ul class="list buttonSet">
                                <li class="leaf"><button id="undo" title="<spring:message code='ADH_1103_TOOLTIP_UNDO'/>" class="button capsule up first" ${canUndo}><span class="wrap">Undo<span class="icon"></span></span></button></li>
                                <li class="leaf"><button id="redo" title="<spring:message code='ADH_1104_TOOLTIP_REDO'/>" class="button capsule up  middle" ${canRedo}><span class="wrap">Redo<span class="icon"></span></span></button></li>
                                <li class="leaf"><button id="undoAll" title="<spring:message code='ADH_1105_TOOLTIP_RESET'/>" class="button capsule up last" ${canUndo}><span class="wrap">Undo All<span class="icon"></span></span></button></li>
                            </ul>
                        </li>
                        <li class="node">
                            <c:if test="${olapCrosstabMode != 'selected'}">
								<ul class="list buttonSet olapNo first">
                                    <li class="leaf"><button id="pivot" title="<spring:message code='ADH_1107_TOOLTIP_PIVOT'/>" class="button capsule up first" ${canPivot}><span class="wrap">Pivot<span class="icon"></span></span></button></li>
                                    <li class="leaf"><button id="sort" title="<spring:message code='ADH_1108_TOOLTIP_SORT'/>" class="button capsule up middle" ${canSort}><span class="wrap">Sort<span class="icon"></span></span></button></li>
                                    <li class="leaf"><button id="controls" title="<spring:message code='ADH_1109_TOOLTIP_FILTER'/>" class="button capsule up last" ${isDomainReport}><span class="wrap">Input Controls<span class="icon"></span></span></button></li>
                                    <!--<li class="leaf"><button id="styles" title="<spring:message code='ADH_1110_TOOLTIP_STYLES'/>" class="button capsule up middle"><span class="wrap">Styles<span class="icon"></span></span></button></li>-->
								</ul>
								<ul class="list buttonSet olapNo last">
                                    <li class="node"><button id="options" title="<spring:message code='ADH_1112_TOOLTIP_PAGE_SETUP'/>" class="button capsule mutton up first"><span class="wrap">Options<span class="icon"></span><span class="indicator"></span></span></button></li>
                                    <authz:authorize ifAnyGranted="ROLE_SUPERUSER, ROLE_ADMINISTRATOR">
                                        <li class="node"><button id="query" title="<spring:message code='ADH_1110_TOOLTIP_QUERY_SQL'/>" class="button capsule up last" ${canViewQuery}><span class="wrap">View Query<span class="icon"></span></span></button></li>
                                    </authz:authorize>
                                </ul>
                            </c:if>
                            <c:if test="${olapCrosstabMode == 'selected'}">
                                <ul class="list buttonSet olapYes first">
                                    <li class="leaf"><button id="pivot" title="<spring:message code='ADH_1107_TOOLTIP_PIVOT'/>" class="button capsule up" ${canPivot}><span class="wrap">Pivot<span class="icon"></span></span></button></li>
								</ul>
								 <ul class="list buttonSet olapNo last">
                                    <li class="node"><button id="options" title="<spring:message code='ADH_1115_TOOLTIP_DISPLAY_SETUP'/>" class="button capsule mutton up first"><span class="wrap">Options<span class="icon"></span><span class="indicator"></span></span></button></li>
                                     <authz:authorize ifAnyGranted="ROLE_SUPERUSER, ROLE_ADMINISTRATOR">
                                        <li class="node"><button id="query" title="<spring:message code='ADH_1110_TOOLTIP_QUERY_MDX'/>" class="button capsule up last" ${canViewQuery}><span class="wrap">View Query<span class="icon"></span></span></button></li>
                                     </authz:authorize>
                                </ul>
                            </c:if>
                        </li>

                        <li class="node toolDroplist first">
                            <select id="dataModeSelector" class="dropList">
                                <c:if test="${olapCrosstabMode != 'selected'}">
                                    <option value="table"><spring:message code="ADH_003a_TABLE"/></option>
                                </c:if>
                                <option value="${olapCrosstabMode == 'selected' ? 'olap_ichart' : 'ichart'}"><spring:message code="ADH_003b_CHART"/></option>
                                <option value="${olapCrosstabMode == 'selected' ? 'olap_crosstab' : 'crosstab'}"><spring:message code="ADH_003c_CROSSTAB"/></option>
                            </select>
                        </li>

                        <li class="node toolDroplist">
                            <select id="dataSizeSelector" class="dropList">
                                <option value="sample"><spring:message code="ADH_107_DESIGNER_SAMPLEDATA_LABEL"/></option>
                                <option value="full"><spring:message code="ADH_108_DESIGNER_FULLDATA_LABEL"/></option>
                                <option value="nodata"><spring:message code="ADH_108_DESIGNER_NODATA_LABEL"/></option>
                            </select>
                        </li>
                    </ul>
                </div>

                <div style="background:#fff;">
                    <%--sub toolbar buttons
                    <div class="sub header">
                        <c:if test="${olapCrosstabMode != 'selected' && ichartMode != 'selected'}">
                            <ul id="dataMode" class="list tabSet text control horizontal responsive">
                                <li id="sample-data" class="tab ${sampleData}"><p class="button wrap"><span><spring:message code="ADH_107_DESIGNER_SAMPLEDATA_LABEL"/></span></p></li>
                                <li id="full-data" class="tab ${fullData} last"><p class="button wrap"><span><spring:message code="ADH_108_DESIGNER_FULLDATA_LABEL"/></span></p></li>
                            </ul>
                        </c:if>
                        <ul id="displayMode" class="list tabSet text control horizontal responsive">
                            <c:if test="${olapCrosstabMode != 'selected'}">
                                <li id="table-mode" class="tab ${tableMode}"><p class="button wrap"><span><spring:message code="ADH_003a_TABLE"/></span></p></li>
                            </c:if>
                            <li id="${olapCrosstabMode == 'selected' ? 'olap_ichart' : 'ichart'}-mode" class="tab ${ichartMode}"><p class="button wrap"><span><spring:message code="ADH_003b_CHART"/></span></p></li>
                            <li id="crosstab-mode" class="tab ${crosstabModeOnly} last"><p class="button wrap"><span><spring:message code="ADH_003c_CROSSTAB"/></span></p></li>
                        </ul>
                    </div>
                    --%>
                    <table class="displayManager hidden" id="displayManagerPanel">
                        <tbody>
                            <tr id="columns" class="axis">
                            <td class="title">
                                <c:if test="${tableMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>
                                </c:if>
                                <c:if test="${chartMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_MEASURES_TITLE"/>
                                </c:if>
                                <c:if test="${crosstabMode == 'selected' || olapCrosstabMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>
                                </c:if>
                            </td>
                            <td class="slot">
                                <ul id='olap_columns' class="tokens sortable" style="z-index:99;"/>
                            </td>
                        </tr>
                        <tr id="rows" class="axis">
                            <td class="title">
                                <c:if test="${tableMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_GROUPS_TITLE"/>
                                </c:if>
                                <c:if test="${chartMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_GROUP_TITLE"/>
                                </c:if>
                                <c:if test="${crosstabMode == 'selected' || olapCrosstabMode == 'selected'}">
                                    <spring:message code="ADH_1213_DISPLAY_MANAGER_ROWS_TITLE"/>
                                </c:if>
                            </td>
                            <td class="slot">
                                <ul id='olap_rows' class="tokens sortable" style="z-index:99;"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </tiles:putAttribute>
            <tiles:putAttribute name="bodyID" cascade="false">adhocCanvasContainer</tiles:putAttribute>
            <tiles:putAttribute name="bodyContent" cascade="false">
                <div id="mainTableContainer" class="${requestScope.viewModel.theme}">

                    <c:if test="${isIPad}"><div class="scrollWrapper"></div></c:if>

                    <div id="mainTableContainerOverlay" class="hidden"></div>
                </div>
                <t:insertTemplate template="/WEB-INF/jsp/templates/nothingToDisplay.jsp">
                    <t:putAttribute name="containerID" value="nothingToDisplay"/>
                    <t:putAttribute name="containerClass" value="${isIPad ? 'centered_fn_adhocCenterElement' : ''}"/>
                    <t:putAttribute name="bodyContent">
                        <p id="nothingToDisplayMessage" class="message">
                        </p>
                    </t:putAttribute>
                </t:insertTemplate>
            </tiles:putAttribute>
        </tiles:insertTemplate>

        <%--available fields section--%>
        <tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <tiles:putAttribute name="containerID" value="fields"/>
            <tiles:putAttribute name="containerClass" value="column decorated secondary sizeable"/>
            <tiles:putAttribute name="containerElements">
                <div class="sizer horizontal"></div>
                <button class="button minimize"></button>
            </tiles:putAttribute>
            <tiles:putAttribute name="containerTitle" cascade="false">
                <c:choose>
                            <c:when test="${olapCrosstabMode == 'selected'}">
                                <spring:message code='ADH_045d_OLAP'/>: ${cubeLabel}
                            </c:when>
                            <c:otherwise>
                                <c:choose>
                                    <c:when test="${requestScope.isItDomainReport}">
                                        <spring:message code='ADH_045a_DOMAIN'/>: ${requestScope.viewModel.topicName}
                                    </c:when>
                                    <c:otherwise> <spring:message code='ADH_045b_TOPIC'/>: ${requestScope.viewModel.topicName}</c:otherwise>
                                </c:choose>
                            </c:otherwise>
                </c:choose>
            </tiles:putAttribute>
            <tiles:putAttribute name="headerContent">
                <span id="topicMutton" class="button mutton"></span>
            </tiles:putAttribute>
            <tiles:putAttribute name="bodyID" >availableFields</tiles:putAttribute>
            <tiles:putAttribute name="bodyClass" value="${availFieldsPanelClass}"/>
            <tiles:putAttribute name="swipeScroll" value="${isIPad}"/>
            <tiles:putAttribute name="bodyContent">
                <c:choose>
                    <c:when test="${olapCrosstabMode == 'selected'}">
                        <c:set var="dimensionsTreeClass" value="dimension"/>
                    </c:when>
                    <c:otherwise>
                        <c:set var="dimensionsTreeClass" value="dimension attribute"/>
                    </c:otherwise>
                </c:choose>
                <%-- two trees inside sizeable panel will be shown --%>
                <tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                    <tiles:putAttribute name="containerTitle">
                         <c:choose>
                            <c:when test="${olapCrosstabMode == 'selected'}">
                                <spring:message code='ADH_1213_AVAILABLE_FIELDS_PANEL_DIMENSIONS'/>
                            </c:when>
                            <c:otherwise><spring:message code='ADH_112_AVAILABLE_FIELDS'/></c:otherwise>
                         </c:choose>
                    </tiles:putAttribute>
                    <tiles:putAttribute name="containerClass" value="primary panel pane sizeable ${dimensionsTreeClass}"/>
                    <tiles:putAttribute name="bodyContent">
                        <ul id="dimensionsTree"></ul>
                    </tiles:putAttribute>
                    <tiles:putAttribute name="subHeaderContent">
                        <div class="j-dimensionsTree-search"></div>
                    </tiles:putAttribute>
                    <c:if test="${olapCrosstabMode != 'selected'}">
                        <tiles:putAttribute name="headerContent">
                            <span id="availableFieldsMutton" class="button mutton"></span>
                        </tiles:putAttribute>
                    </c:if>
                </tiles:insertTemplate>

                <tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                    <tiles:putAttribute name="containerTitle">
                        <spring:message code='ADH_1213_AVAILABLE_FIELDS_PANEL_MEASURES'/>
                    </tiles:putAttribute>
                    <tiles:putAttribute name="containerElements">
                        <div class="sizer vertical"></div>
                    </tiles:putAttribute>
                    <tiles:putAttribute name="containerClass" value="panel pane secondary sizeable measure"/>
                    <tiles:putAttribute name="bodyContent">
                        <ul id="measuresTree"></ul>
                    </tiles:putAttribute>
                    <tiles:putAttribute name="subHeaderContent">
                        <div class="j-measuresTree-search"></div>
                    </tiles:putAttribute>
                    <c:if test="${olapCrosstabMode != 'selected'}">
                        <tiles:putAttribute name="headerContent">
                            <span id="availableMeasuresMutton" class="button mutton"></span>
                        </tiles:putAttribute>
                    </c:if>
                </tiles:insertTemplate>
            </tiles:putAttribute>
        </tiles:insertTemplate>

        <tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <tiles:putAttribute name="containerID" value="filters"/>
            <tiles:putAttribute name="containerClass" value="column decorated tertiary sizeable minimized"/>
            <tiles:putAttribute name="containerElements">
                <div class="sizer horizontal" style="display:none;"></div>
                <button class="button minimize"></button>
                <div class="vtitle" style="width: 73px; top: 73px;"><spring:message code='ADH_187_FILTERS_TITLE'/></div>
            </tiles:putAttribute>
            <tiles:putAttribute name="containerTitle">
                <spring:message code="ADH_187_FILTERS_TITLE"/>
            </tiles:putAttribute>
            <tiles:putAttribute name="headerContent">
                <span id="filterPanelMutton" class="button mutton"></span>
            </tiles:putAttribute>
            <tiles:putAttribute name="bodyID" cascade="false"></tiles:putAttribute>
            <tiles:putAttribute name="bodyClass" cascade="false" value=""/>
            <tiles:putAttribute name="contentAttributes" value="style='display:none;'" />
            <tiles:putAttribute name="swipeScroll" value="${isIPad}"/>
            <tiles:putAttribute name="bodyContent" cascade="false">
                <%--<c:import url="${viewModel.viewResources['filterPanel']}.jsp"/>--%>
                <div id="level-container" style="display:none;">
                    <div class="pod-header"><spring:message code="ADH_1214_ICHARTS_DATA_LEVEL_TITLE" javaScriptEscape="true"/></div>
                    <div class="pod-body">
                        <div id="dataLevelTooltip"></div>
                    </div>
                </div>
                <div id="filter-container" class="primary">
                    <ul class="list filters ui-sortable"></ul>
                </div>
            </tiles:putAttribute>
            <tiles:putAttribute name="footerContent">
                <div id="expression-container"></div>
                <fieldset id="applyFilter" class="group error">
                    <button class="button action primary up" disabled="disabled">
                        <span class="wrap"><spring:message code="ADH_1204_DYNAMIC_FILTER_SUBMIT" javaScriptEscape="true"/>
                            <span class="icon"></span>
                        </span>
                    </button>
                </fieldset>
                <div id="filterMessage" class="message warning">
                    <span></span>
                </div>
            </tiles:putAttribute>
        </tiles:insertTemplate>
        <%--ajax buffer--%>
        <div id="ajaxbuffer" style="display: none;" ></div>

        <%-- This form is used for submit actions --%>
        <form id="exportActionForm" action="<c:url value="reportGenerator.html"/>" method="get">
            <input type="hidden" name="action" value="displayTempReportUnit"/>
            <input type="hidden" name="exportFormat" value=""/>
            <input type="hidden" name="clientKey" value="${clientKey}"/>
        </form>

        <!-- ========== INPUT CONTROLS DIALOG =========== -->
        <t:insertTemplate template="/WEB-INF/jsp/templates/inputControls.jsp">
            <tiles:putAttribute name="containerTitle"><spring:message code="input.control.dialog.title" javaScriptEscape="true"/></tiles:putAttribute>
            <tiles:putAttribute name="containerClass" value="sizeable hidden"/>
            <%--<t:putAttribute name="hasReportOptions" value="false"/>--%>
            <t:putAttribute name="bodyContent">
                <js:parametersForm reportName="" renderJsp="${controlsDisplayForm}" />

                <div class="control checkBox">
                    <label class="wrap" for="filterssaveasdefault" title="<spring:message code="ADH_183_FILTERS_SAVE_AS_DEFAULT"  javaScriptEscape="true"/>">
                        <spring:message code="ADH_183_FILTERS_SAVE_AS_DEFAULT"  javaScriptEscape="true"/>
                    </label>
                    <input id="filterssaveasdefault" name="filterssaveasdefault" type="checkbox">
                </div>
            </t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/saveDataViewAndReport.jsp">
            <t:putAttribute name="containerClass" value="hidden centered_vert centered_horz"/>
            <t:putAttribute name="viewBodyContent" >
                <ul class="responsive collapsible folders hideRoot" id="saveDataViewFoldersTree"></ul>
            </t:putAttribute>
            <t:putAttribute name="reportBodyContent" >
                <ul class="responsive collapsible folders hideRoot" id="saveReportFoldersTree"></ul>
            </t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass">panel dialog overlay detail centered_horz centered_vert moveable hidden sizeable</t:putAttribute>
            <t:putAttribute name="containerID" value="queryViewer"/>
            <t:putAttribute name="containerElements"><div class="sizer diagonal"></div></t:putAttribute>
            <t:putAttribute name="headerClass" value="mover"/>
            <t:putAttribute name="containerTitle">
                <span><spring:message code="ADH_1015_QUERY_VIEWER_DIALOG_TITLE"/></span>
            </t:putAttribute>
            <t:putAttribute name="bodyContent" cascade="true">
                <label class="control textArea" for="viewQueryInput">
                    <spring:message code="ADH_1015_QUERY_VIEWER_DIALOG_SUB_TITLE" javaScriptEscape="true"/>:
                    <textarea id="viewQueryInput" type="text" tabindex="2" readonly="readonly" /></textarea>
                    <span class="message warning">error message here</span>
                </label>
            </t:putAttribute>
            <t:putAttribute name="footerContent">
                <button id="close" class="button action primary up"><span class="wrap"><spring:message code="dialog.aboutBox.close" javaScriptEscape="true"/><span class="icon"></span></button>
            </t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass">panel dialog overlay detail centered_horz centered_vert moveable hidden sizeable</t:putAttribute>
            <t:putAttribute name="containerID" value="templateProperties"/>
            <t:putAttribute name="containerElements"><div class="sizer diagonal"></div></t:putAttribute>
            <t:putAttribute name="headerClass" value="mover"/>
            <t:putAttribute name="containerTitle">
                <span><spring:message code="ADH_1015_TEMPLATE_PROPERTIES_DIALOG_TITLE"/></span>
            </t:putAttribute>
            <t:putAttribute name="bodyContent" cascade="true">
                <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                    <t:putAttribute name="containerClass" value="control groupBox"/>
                    <t:putAttribute name="bodyContent">
                        <ul class="responsive collapsible folders hideRoot" id="templateLocationTree"></ul>
                    </t:putAttribute>
                </t:insertTemplate>
            </t:putAttribute>
            <t:putAttribute name="footerContent">
                <button id="okTemplateProperties" class="button action primary up"><span class="wrap"><spring:message code="button.ok" javaScriptEscape="true"/><span class="icon"></span></button>
                <button id="closeTemplateProperties" class="button action primary up"><span class="wrap"><spring:message code="button.close" javaScriptEscape="true"/><span class="icon"></span></button>
            </t:putAttribute>
        </t:insertTemplate>

        <%@ include file="adHocMessages.jsp" %>
        <%@ include file="adHocConstants.jsp" %>
    </tiles:putAttribute>
</tiles:insertTemplate>
