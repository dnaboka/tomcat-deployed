<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html" %>

<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>

<authz:authorize ifAllGranted="ROLE_DEMO">
    <jsp:include page="homeForDemo.jsp"/>
</authz:authorize>
<authz:authorize ifNotGranted="ROLE_DEMO">
    <jsp:include page="homeForNonDemo.jsp"/>
</authz:authorize>

