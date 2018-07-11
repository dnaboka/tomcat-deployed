<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="com.jaspersoft.ji.adhoc.DashboardContentFrame" %>
<%@ page import="com.jaspersoft.ji.adhoc.DashboardCustomContentFrame" %>
<%@ page import="com.jaspersoft.ji.adhoc.DashboardFrame" %>
<%@ page import="com.jaspersoft.ji.adhoc.DashboardState" %>
<%@ page import="com.jaspersoft.ji.adhoc.DashboardTextFrame" %>

<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--imports--%>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<%--dummy tag required for innerHTML to work in IE--%>
<br>
<js:out javaScriptEscape="true">
<script type="text/javascript" id="dashboardDesignerState">
    // ${sessionScope.XSS_NONCE} do not remove

    //dashboard props
    localContext.title = "${viewModel.title}";
    localContext.dashboardName = "${viewModel.name}";
    localContext.titleShowing = "${viewModel.titleBarShowing}";
    localContext.resyncRequired = ${viewModel.resyncRequired};
    localContext.conversionFactor = ${viewModel.conversionFactor};
    localContext.gridSize = ${viewModel.gridSize};
    localContext.layoutSize = "${viewModel.layoutSize}";
    localContext.oversized = ${viewModel.isOversized};
    localContext.cannotResize = ${viewModel.cannotResize};
    localContext.layoutWidth = ${viewModel.layoutWidth};
    localContext.layoutHeight = ${viewModel.layoutHeight};
    localContext.titleBandHeight = ${viewModel.titleBandHeight};
    localContext.isFixedSizing = ${viewModel.useAbsoluteSizing};
    //frame properties
    localContext.nextContentFrameName = "${viewModel.nextContentFrameName}";
    localContext.nextContentFrameLeft = ${viewModel.nextContentFrameLeft};
    localContext.nextContentFrameTop = ${viewModel.nextContentFrameTop};
    localContext.nextContentFrameWidth = ${viewModel.nextContentFrameWidth};
    localContext.nextContentFrameHeight = ${viewModel.nextContentFrameHeight};
    localContext.displayNextContentFrameCue = ${viewModel.displayNextContentFrameCue};
    localContext.nextControlFrameLeft = ${viewModel.nextNonContentFrameLeft};
    localContext.nextControlFrameTop = ${viewModel.nextNonContentFrameTop};
    localContext.nextControlFrameWidth = ${viewModel.nextNonContentFrameWidth};
    localContext.nextControlFrameHeight = ${viewModel.nextNonContentFrameHeight};
    localContext.resetButton = "<spring:message code='button.reset' javaScriptEscape='true'/>";
    // Bundle messages
    localContext.messages.dashboardOptionMessage = "<spring:message code='DASHBOARD_OPTION_ONLY_PRESENT_IN_RUNTIME'/>";
    localContext.messages.buttonAlreadyAdded = "<spring:message code='DASHBOARD_BUTTON_ALREADY_ADDED' javaScriptEscape='true'/>";
    //frames as array
    localContext.contentFrames = [];
    <c:forEach var="frame" items="${viewModel.contentFrames}" varStatus="cnt">
        localContext.contentFrames[${cnt.index}]={};
        localContext.contentFrames[${cnt.index}]['name']="${frame.name}";
        localContext.contentFrames[${cnt.index}]['source']="${frame.source}";
        localContext.contentFrames[${cnt.index}]['uri']="${frame.URI}";
        localContext.contentFrames[${cnt.index}]['resourceName']="${frame.resourceName}";
        localContext.contentFrames[${cnt.index}]['resourceType']="${frame.resourceType}";
        localContext.contentFrames[${cnt.index}]['left']=${frame.left};
        localContext.contentFrames[${cnt.index}]['top']=${frame.top};
        localContext.contentFrames[${cnt.index}]['width']=${frame.width};
        localContext.contentFrames[${cnt.index}]['height']=${frame.height};
        localContext.contentFrames[${cnt.index}]['hasScrollBars']=${frame.hasScrollBars};
        localContext.contentFrames[${cnt.index}]['autoRefresh']=${frame.autoRefresh};
        localContext.contentFrames[${cnt.index}]['resizeable']=${frame.isResizeable};
        localContext.contentFrames[${cnt.index}]['reportWidth']=${frame.reportWidth};
        localContext.contentFrames[${cnt.index}]['reportHeight']=${frame.reportHeight};
        localContext.contentFrames[${cnt.index}]['params'] = {};

        <c:forEach var="ctrlFrame" items="${viewModel.controlFrames}">
            <c:set var="mappingValue" value="${frame.paramMappings[ctrlFrame.paramName]}"/>
            localContext.contentFrames[${cnt.index}]['params']['${ctrlFrame.paramName}']='${mappingValue != null ? mappingValue : ""}';
        </c:forEach>

        <%
            DashboardContentFrame frame = (DashboardContentFrame) pageContext.getAttribute("frame");
            if (frame instanceof DashboardCustomContentFrame) { %>
                localContext.contentFrames[${cnt.index}]['customContent']=true;
        <%  } %>
    </c:forEach>

    <c:set var="viewModelState" value="${viewModel.state}"/>
    <% DashboardState viewModelState = (DashboardState)pageContext.getAttribute("viewModelState"); %>
    localContext.controlFrames = [];
    <c:forEach var="frame" items="${viewModel.controlFrames}" varStatus="cnt">
        localContext.controlFrames[${cnt.index}]={};
        localContext.controlFrames[${cnt.index}]['name']="${frame.name}";
        localContext.controlFrames[${cnt.index}]['paramName']="${frame.paramName}";

        <%
            String frameParamName = (String)pageContext.getAttribute("frame.paramName");
            if (viewModelState.getFormattedInputControlValues().containsKey(frameParamName)) {
                JSONArray paramValue = new JSONArray(Arrays.asList(viewModelState.getFormattedInputControlValues().get(frameParamName)));
                pageContext.setAttribute("paramValueStr", paramValue.toString());
        %>
                localContext.controlFrames[${cnt.index}]['paramValue']=${paramValueStr};
        <%  }%>

        localContext.controlFrames[${cnt.index}]['dataType']="${frame.dataType}";
        localContext.controlFrames[${cnt.index}]['left']=${frame.left};
        localContext.controlFrames[${cnt.index}]['top']=${frame.top};
        localContext.controlFrames[${cnt.index}]['width']=${frame.width};
        localContext.controlFrames[${cnt.index}]['height']=${frame.height};
        localContext.controlFrames[${cnt.index}]['resizeable']=${frame.isResizeable};

        <%
             List<DashboardTextFrame> dashboardLabelFrames =
                    (List<DashboardTextFrame>) viewModelState.getFrames(DashboardFrame.LABEL_TYPE);

            for (DashboardTextFrame dashboardLabelFrame : dashboardLabelFrames) {
                String inputControlReference = dashboardLabelFrame.getInputControlReference();

                if (inputControlReference != null && inputControlReference.equals(frameParamName)) {
                    pageContext.setAttribute("dashTextFrameLabel", dashboardLabelFrame.getProperty(DashboardTextFrame.DASH_TEXT_FRAME_LABEL));
        %>
                localContext.controlFrames[${cnt.index}]['label']="${dashTextFrameLabel}";
        <%
                    break;
                }
            }

        %>
    </c:forEach>

    localContext.textFrames = [];
    <c:forEach var="frame" items="${viewModel.textFrames}" varStatus="cnt">
        localContext.textFrames[${cnt.index}]={};
        localContext.textFrames[${cnt.index}]['name']="${frame.name}";
        localContext.textFrames[${cnt.index}]['textLabel']="${frame.textLabel}";
        localContext.textFrames[${cnt.index}]['fontSize']=${frame.textFontSize};
        localContext.textFrames[${cnt.index}]['left']=${frame.left};
        localContext.textFrames[${cnt.index}]['top']=${frame.top};
        localContext.textFrames[${cnt.index}]['width']=${frame.width};
        localContext.textFrames[${cnt.index}]['height']=${frame.height};
        localContext.textFrames[${cnt.index}]['resizeable']=${frame.isResizeable};
        localContext.textFrames[${cnt.index}]['fontResizes']=${frame.fontResizes};
        localContext.textFrames[${cnt.index}]['maxFontSize']=${frame.maxFontSize};
        localContext.textFrames[${cnt.index}]['inputControlRef']="${frame.inputControlReference}";
    </c:forEach>

    localContext.clickableFrames = [];
    <c:forEach var="frame" items="${viewModel.clickableFrames}" varStatus="cnt">
        localContext.clickableFrames[${cnt.index}]={};
        localContext.clickableFrames[${cnt.index}]['name']="${frame.name}";
        localContext.clickableFrames[${cnt.index}]['function']="${frame.function}";
        localContext.clickableFrames[${cnt.index}]['imageSrc']="${frame.imageSrc}";
        localContext.clickableFrames[${cnt.index}]['left']=${frame.left};
        localContext.clickableFrames[${cnt.index}]['top']=${frame.top};
        localContext.clickableFrames[${cnt.index}]['width']=${frame.width};
        localContext.clickableFrames[${cnt.index}]['height']=${frame.height};
        localContext.clickableFrames[${cnt.index}]['resizeable']=${frame.isResizeable};
    </c:forEach>

    localContext.clickableControlIDs = [];
    <c:forEach var="ctrId" items="${viewModel.clickableControlIDs}" varStatus="cnt">
        localContext.clickableControlIDs[${cnt.index}]='${ctrId}';
    </c:forEach>

    //params as array
    localContext.controls = {};
    localContext.controls['singleReport']=[];
    localContext.controls['multiReport']=[];
    localContext.controls['other']=[];
    <c:set var="singleReportCount" value="-1"/>
    <c:set var="multiReportCount" value="-1"/>
    <c:forEach var="entry" items="${viewModel.dashboardParameters}">
       <c:if test="${entry.value ne null and entry.value.inputControl ne null}">
            <c:set var="category" value=""/>
            <c:set var="count" value="-1"/>
            <c:choose>
                <c:when test="${fn:length(entry.value.associatedFrames) gt 1}">
                    <c:set var="multiReportCount" value="${multiReportCount + 1}"/>
                    <c:set var="count" value="${multiReportCount}"/>
                    <c:set var="category" value="multiReport"/>
                </c:when>
                <c:otherwise>
                    <c:set var="singleReportCount" value="${singleReportCount + 1}"/>
                    <c:set var="count" value="${singleReportCount}"/>
                    <c:set var="category" value="singleReport"/>
                </c:otherwise>
            </c:choose>

            localContext.controls['${category}'][${count}] = {};
            localContext.controls['${category}'][${count}]['name'] = '${entry.key}';
            localContext.controls['${category}'][${count}]['label'] = '${entry.value.displayLabel}';
       </c:if>
    </c:forEach>

    var calendarDateFormat = "<spring:message code='calendar.date.format'/>";
</script>
</js:out>

<js:out escapeScript="false">
<script type="text/json" id='dashboardActionModel' >
    ${viewModel.clientActionModelDocument}
</script>
</js:out>