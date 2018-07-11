<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c-rt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>


<%--jstl variables--%>
<c-rt:set var="state" scope="page" value="${requestScope.dashboardState}"/>
<c-rt:set var="frames" scope="page" value="${requestScope.dashboardState.allFrames}"/>
<c-rt:set var="contentFrames" scope="page" value="${requestScope.dashboardState.contentFrames}"/>
<c-rt:set var="controlFrames" scope="page" value="${requestScope.dashboardState.controlFrames}"/>
<c-rt:set var="controlFramesInitialValues" scope="page" value="${requestScope.dashboardState.formattedInputControlValues}"/>
<c-rt:set var="dashboardParameters" scope="page" value="${requestScope.dashboardState.dashboardParameters}"/>
<c-rt:set var="hiddenParameters" scope="page" value="${hiddenParams}"/>
<c-rt:set var="textFrames" scope="page" value="${requestScope.dashboardState.textFrames}"/>
<c-rt:set var="clickableFrames" scope="page" value="${requestScope.dashboardState.clickableFrames}"/>
<c-rt:set var="reportParameters" scope="page" value="${requestScope.dashboardState.reportParameters}"/>
<c-rt:set var="maxMultiSelectSize" value="7"/>
<c-rt:set var="calendarDatePattern" scope="page" value="${state.calendarDatePattern}"/>
<c-rt:set var="calendarDateTimePattern" scope="page" value="${state.calendarDateTimePattern}"/>



<%@ include file="dashboardViewerCommonImports.jsp"%>

<js:out javaScriptEscape="true">
<%--State props for javascript objects--%>
<script type="text/javascript">
    var clientKey = "${clientKey}";
    if (typeof localContext == "undefined") {
        localContext = {};
    }
    //server set variables
    var maxMultiSelectSize = "${maxMultiSelectSize}";
    var urlContext = "${pageContext.request.contextPath}";
    var staticDatePattern = "${state.staticDatePattern}";
    var localDatePattern = "${state.localDatePattern}";
    var paramsChanged = ${state.paramValuesChanged};
    var proportionalSizing = ${!state.useAbsoluteSizing};
    var dashboardState = "${requestScope.dashboardState}";
    var dashboardResource = "${requestScope.dashboardResource}";
    var systemWarning = "${systemWarning}";
    var NO_DASHBOARD_TITLE_TEXT = "<spring:message code='ADH_725_DASHBOARD_SELECTOR' javaScriptEscape='true'/>";
    var DASHBOARD_CUSTOM_URL_ERROR = "<spring:message code='DASHBOARD_CUSTOM_URL_ERROR' javaScriptEscape='true'/>";
    localContext.resetButton = "<spring:message code='button.reset' javaScriptEscape='true'/>";

    //i18n date formats
    var localDateFormat = "<spring:message code='date.format'/>";
    var localDateTimeFormat = "<spring:message code='datetime.format'/>";
    var calendarDateFormat = "<spring:message code='calendar.date.format'/>";
    var calendarTimeFormat = "<spring:message code='calendar.time.format'/>";
    var calendarDateTimeFormat = "${viewModel.calendarDateTimePattern}";

    var contentFrames = [];
    <c-rt:forEach var="frame" items="${contentFrames}" varStatus="frameStatus">
        contentFrames[${frameStatus.index}] = {
            frameName: "${frame.name}",
            resourceType: "${frame.resourceType}",
            source: "${frame.source}",
            uri: "${frame.URI}",
            autoRefresh: <c-rt:out value="${frame.autoRefresh}" escapeXml="false"/>,
            params: {}
        };
        <c-rt:forEach var="controlFrame" items="${controlFrames}">
            contentFrames[${frameStatus.index}]['params']['${controlFrame.paramName}'] = "${frame.paramMappings[controlFrame.paramName]}";
        </c-rt:forEach>
    </c-rt:forEach>

    var textFrames = [];
    <c-rt:forEach var="frame" items="${textFrames}" varStatus="frameStatus">
        textFrames[${frameStatus.index}] = {
            frameName: "${frame.name}",
            resizesProportionally: ${frame.resizesProportionally},
            fontSize: "${frame.textFontSize}",
            <%--TODO spring:escape is no longer needed --%>
            label: "${frame.textLabel}",
            fontResizes: ${frame.fontResizes},
            heightPercentage: ${frame.heightAsPercentage},
            maxFontSize: ${frame.maxFontSize}
        };
    </c-rt:forEach>

    var controlFrames = [];
    <c-rt:forEach var="frame" items="${controlFrames}" varStatus="frameStatus">
        controlFrames[${frameStatus.index}] = {
            frameName: "${frame.name}",
            paramName: "${frame.paramName}",
            dataType: "${frame.dataType}"
        };
        controlFrames[${frameStatus.index}].paramValue = [
            <c-rt:forEach var="paramValue" items="${controlFramesInitialValues[frame.paramName]}" varStatus="valueStatus">
            <%--TODO spring:escape is no longer needed --%>
            <c:if test="${!valueStatus.first}">, </c:if>"${paramValue}"
            </c-rt:forEach>
        ];
    </c-rt:forEach>

    //these are passed in via the dashboard URL and applied to every report
    if (!hiddenParams) {
        var hiddenParams = [];
        <c-rt:forEach var="hiddenParameter" items="${hiddenParameters}" varStatus="paramStatus">
            hiddenParams[${paramStatus.index}] = {
                originalParamName: "${hiddenParameter.name}",
                <%--TODO spring:escape is no longer needed --%>
                paramValue: "${hiddenParameter.value}"
            }
        </c-rt:forEach>
    }

</script>
</js:out>