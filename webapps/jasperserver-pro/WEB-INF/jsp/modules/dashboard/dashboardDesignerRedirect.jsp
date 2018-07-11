<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--
The purpose of this jsp is simply to redirect to the same Dashboard instance flow but without the createNew param
This is so subsequent refreshes will not clobber data
-->
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<js:out javaScriptEscape="true">
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

//    url context
    var urlContext = "${pageContext.request.contextPath}";
//event fired on onload to cause redirect.
    window.onload = function() {
        this.location.href="${pageContext.request.contextPath}/flow.html?_flowId=dashboardDesignerFlow&clientKey=${clientKey}"
    }
</script>
</js:out>