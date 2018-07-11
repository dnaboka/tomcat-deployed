<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib prefix="spring" uri="/spring" %>

<!-- create filter row for each of the existing filters -->
<%@ include file="filterState.jsp" %>

<ul class="list filters">
<!-- ${sessionScope.XSS_NONCE} do not remove -->

    <li class="leaf">
        <%-- complex filters are supported only for nonOLAP for now --%>
        <c:if test="${viewModel.viewType != 'olap_crosstab'}">
            <%@ include file="adHocFilterComplexPodTemplate.jsp" %>
        </c:if>
    </li>
    <c:forEach var="filter" items="${viewModel.existingFilters}">
        <li class="leaf">
            <%@ include file="adHocFilterPodTemplate.jsp" %>
        </li>
    </c:forEach>
</ul>

