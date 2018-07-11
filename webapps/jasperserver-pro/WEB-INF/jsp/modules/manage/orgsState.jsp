<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<js:out javaScriptEscape="true">
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove
    if (typeof orgModule === "undefined") {
        orgModule = {};
    }

    if (typeof orgModule.messages === "undefined") {
        orgModule.messages = {};
    }

    orgModule.messages['MT_SUB_TENANT_COUNT'] = '<spring:message code="MT_SUB_TENANT_COUNT" javaScriptEscape="true"/>';
    orgModule.messages['MT_SUB_TENANT_UNKNOWN_COUNT'] = '<spring:message code="MT_SUB_TENANT_UNKNOWN_COUNT" javaScriptEscape="true"/>';
    orgModule.messages['orgIdIsAlreadyInUse'] = '<spring:message code="MT_TENANT_EXIST_MSG" javaScriptEscape="true"/>';
    orgModule.messages['orgAliasIsAlreadyInUse'] = '<spring:message code="MT_ORG_ALIAS_ALREADY_EXISTS_MSG" javaScriptEscape="true"/>';
    orgModule.messages['orgIdIsEmpty'] = '<spring:message code="MT_TENANT_ID_IS_EMPTY_MSG" javaScriptEscape="true"/>';
    orgModule.messages['orgAliasIsEmpty'] = '<spring:message code="MT_TENANT_ALIAS_IS_EMPTY_MSG" javaScriptEscape="true"/>';
    orgModule.messages['orgNameIsEmpty'] = '<spring:message code="MT_TENANT_NAME_IS_EMPTY_MSG" javaScriptEscape="true"/>';
    orgModule.messages['unsupportedSymbols'] = '<spring:message code="MT_ORG_UNSUPPORTED_SYMBOLS" javaScriptEscape="true"/>';
    orgModule.messages['addOrg'] = '<spring:message code="MT_ADD_ORG" javaScriptEscape="true"/>';

    orgModule.messages['addOrgTo'] = '<spring:message code="MT_ADD_ORG_TO" javaScriptEscape="true"/>';
    orgModule.messages['deleteMessage'] = '<spring:message code="MT_DELETE_ORG_CONFIRMATION" javaScriptEscape="true"/>';
    orgModule.messages['deleteAllMessage'] = '<spring:message code="MT_DELETE_ALL_ORG_CONFIRMATION" javaScriptEscape="true"/>';
    orgModule.messages['cancelEdit'] = '<spring:message code="MT_CANCEL_TENANT_EDIT_MESSAGE" javaScriptEscape="true"/>';
    orgModule.messages['error.length.description'] = '<spring:message code="error.length.description" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.flowExecutionKey = '${flowExecutionKey}';
    localContext.orgMngInitOptions = {
        state: JSON.parse('${state}'),
        defaultRole: '${defaultRole}',
        currentUser: '${currentUser}'
    };

    orgModule.Configuration = JSON.parse('${configuration}');

    if (typeof __jrsConfigs__.orgManagement === "undefined") {
        __jrsConfigs__.orgManagement = {};
    }

    __jrsConfigs__.orgManagement.orgModule = orgModule;
    __jrsConfigs__.orgManagement.localContext = localContext;
</script>
</js:out>