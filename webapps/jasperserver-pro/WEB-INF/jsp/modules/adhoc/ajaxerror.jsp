<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:if test="${not empty header['x-requested-with']}">
    <c:set var="SKIP_XSS_ESCAPE" value="true" scope="page"/>
</c:if>

<div id="ajaxerror">
    ${ajaxerror}
</div>
