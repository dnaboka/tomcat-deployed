<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<%@ page contentType="text/html" %>

<!-- purpose of this jsp is simply to redirect to the Ad Hoc main editor page if you start the adhocFlow from repository
this is so that refresh (or change mode) doesn't wipe out data -->
<body>
<!-- ${sessionScope.XSS_NONCE} do not remove -->

<div id="pageDimmer" class="dimmer fixed"></div>

<tiles:insertTemplate template="/WEB-INF/jsp/templates/loading.jsp">
     <tiles:putAttribute name="containerID" value="loadingForRedirect"/>
     <tiles:putAttribute name="containerClass" value="statically_centered"/>
</tiles:insertTemplate>

<js:out javaScriptEscape="true">
     <script>
         window.onload = function() {
             this.location.href = '${pageContext.request.contextPath}/flow.html' +
                 '?_flowId=adhocFlow' +
                 '&_eventId=initForExistingReport' +
                 '&_flowExecutionKey=${flowExecutionKey}' +
                 <c:if test="${param.decorate == 'no'}">'&decorate=no' + </c:if>
                 '&viewReport=${viewReport}';
         }
     </script>
</js:out>

</body>
