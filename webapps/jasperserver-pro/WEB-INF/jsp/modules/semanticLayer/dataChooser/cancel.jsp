<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<head></head>

<body>
<script type="text/javascript">
<c:choose>
<c:when test='${ParentFolderUri != null}'>
    document.location='flow.html?_flowId=searchFlow&lastMode=true'; 
</c:when>
<c:otherwise>
    document.location='flow.html?_flowId=queryBuilderFlow&_flowExecutionKey=${flowExecutionKey}&_eventId=cancel'; 
</c:otherwise>
</c:choose>
</script>
</body>

<!-- ${sessionScope.XSS_NONCE} do not remove -->

