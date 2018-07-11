<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<js:out javaScriptEscape="true">
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    var dashboardViewFrame = {};
    dashboardViewFrame.flowExecutionKey = '${flowExecutionKey}';

    // store values rendered on server side for future usage in module
    __jrsConfigs__.dashboardDesignerFrame = {};

    __jrsConfigs__.dashboardDesignerFrame.reportRequestParams = JSON.parse('${allRequestParameters}');

    <c:if test="${isAdhocReportUnit == null || isAdhocReportUnit == 'false'}">
    __jrsConfigs__.dashboardDesignerFrame.isAdhocReportUnit = false;
    </c:if>
    <c:if test="${isAdhocReportUnit != null && isAdhocReportUnit == 'true'}">
    __jrsConfigs__.dashboardDesignerFrame.isAdhocReportUnit = true;
    </c:if>

    __jrsConfigs__.dashboardDesignerFrame.fid = '${param.fid}';
</script>
</js:out>