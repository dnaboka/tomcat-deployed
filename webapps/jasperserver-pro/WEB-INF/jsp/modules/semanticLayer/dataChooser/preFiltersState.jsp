<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages["exitMessage"]  = '<spring:message code="domain.chooser.exitMessage" javaScriptEscape="true"/>';
    domain._messages['DISABLED_NODE_TOOLTIP'] = '<spring:message code="QB_133_QB_DISABLED_NODE_TOOLTIP" javaScriptEscape="true"/>';
    domain._messages['SELECTED_NODES_WARNING'] = '<spring:message code="QB_134_QB_SELECTED_NODES_WARNING" javaScriptEscape="true"/>';
    domain._messages['SELECTED_NODES_WARNING_HEADER'] = '<spring:message code="QB_135_QB_SELECTED_NODES_WARNING_HEADER" javaScriptEscape="true"/>';
    domain._messages['QB_DATA_CHANGING_DOMAINS'] = '<spring:message code="QB_DATA_CHANGING_DOMAINS" javaScriptEscape="true"/>';
    domain._messages['QB_BUNDLES_CONFLICT'] = '<spring:message code="QB_BUNDLES_CONFLICT" javaScriptEscape="true"/>';
    domain._messages['QB_DELETE_ITEM_CONFLICT'] = '<spring:message code="QB_DELETE_ITEM_CONFLICT" javaScriptEscape="true"/>';
    domain._messages['warning'] = '<spring:message code="QB_WARNING"/>';
    <%--domain._messages['confirm'] = '<spring:message code="QB_CONFIRM"/>'--%>
    domain._messages['accessDeniedError'] = '<spring:message code="ADH_1001_SERVER_REPOSITORY_ACCESS_DENIED" javaScriptEscape="true"/>';
    domain._messages['topicAlredyExists'] = '<spring:message code="SLQB_TOPIC_ALREADY_EXISTS" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        <js:out javaScriptEscape="true">
        flowExecutionKey : '${flowExecutionKey}',
        filtersJson : [<c:forEach items="${slRulesProvider}" var="item" varStatus="status">
            JSON.parse('${item.json}')
            ${not status.last ? ',' : ''}
            </c:forEach>],
        javaToDataTypeMap : JSON.parse('${slObjectTypeMap}'),
        dateFormat : '${dateFormat}',
        dateTimeFormat : '${dateTimeFormat}',
        timeFormat : '${timeFormat}',
        calendarDateFormat : '${calendarDateFormat}',
        calendarDateTimeFormat : '${calendarDateTimeFormat}',
        calendarTimeFormat : '${calendarTimeFormat}',
        validationDatePatten : '${validationDatePatten}',
        validationDateTimePatten : '${validationDateTimePatten}',
        validationTimePatten : '${validationTimePatten}',
        timeOffset : ${timeOffset},
        decimalSeparator : '${decimalSeparatorForUserLocale}',
        groupingSeparator : "${requestScope.groupingSeparatorForUserLocale}",
        unsavedChangesPresent: ${unsavedChangesPresent}
        </js:out>
    };
</script>
<jsp:include page="../filtersMessages.jsp"/>
<script type="text/javascript">
    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;
</script>


