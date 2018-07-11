<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
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
    domain._messages["error.fromDifferentIslands"]  = '<spring:message code="page.fields.error.fromDifferentIslands" javaScriptEscape="true"/>';
    domain._messages["error.itemsDeleted"]  = '<spring:message code="page.fields.error.itemsDeleted" javaScriptEscape="true"/>';
    domain._messages["error.itemsMoved"]  = '<spring:message code="page.fields.error.itemsMoved" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        <js:out javaScriptEscape="true">
        flowExecutionKey: '${flowExecutionKey}',
        <c:if test="${invalidDomainFields eq null}">
            invalidFields: {},
        </c:if>
        <c:if test="${not (invalidDomainFields eq null)}">
            invalidFields: ${invalidDomainFields},
        </c:if>
        unsavedChangesPresent: ${unsavedChangesPresent}
        </js:out>
    };

    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;

</script>
