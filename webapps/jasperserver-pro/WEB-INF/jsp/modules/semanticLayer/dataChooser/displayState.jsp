<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

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
    domain._messages["sortingInfoWillBeLost"]  = '<spring:message code="page.display.sortingInfoWillBeLost" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        <js:out javaScriptEscape="true">
        flowExecutionKey: '${flowExecutionKey}',
        treeItemsModel: JSON.parse('${slSortedQueryTree}'),
        listItemsModel: JSON.parse('${slSortedQueryList}'),
        itemOriginalLabels: JSON.parse('${treeItemOriginalLabelsJSON}'),
        isFlatList: ${slIsTableAsList},
        unsavedChangesPresent: ${unsavedChangesPresent}
        </js:out>
    };

    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;

</script>
