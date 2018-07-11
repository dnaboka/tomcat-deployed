<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<js:out javaScriptEscape="true">
<script id="baseState" type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove
    clientKey = clientKey || "${clientKey}";
</script>
</js:out>

<js:out escapeScript="false">
<script type="text/json" id='adhocActionModel' >
    ${viewModel.clientActionModelDocument}
</script>
</js:out>