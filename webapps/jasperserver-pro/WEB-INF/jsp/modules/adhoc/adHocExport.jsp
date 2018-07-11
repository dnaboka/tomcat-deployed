<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html" %>
<%--tag libs--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="/WEB-INF/jasperserver.tld" prefix="js" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<js:out javaScriptEscape="true">
<script type="text/javascript" src='${pageContext.request.contextPath}/scripts/components.dependent.dialog.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/scripts/designer.base.js'></script>

<script>
    // ${sessionScope.XSS_NONCE} do not remove
    jQuery(function() {
        var exportFormat = "${param.exportFormat}";

        clientKey = clientKey || "${param.clientKey}";
        function tmpRepCallback(response) {
            var reportURI = response.data.location+"/"+response.data.label;
            window.location.href = "flow.html?_flowId=viewReportFlow&standAlone=true&output="+exportFormat+"&ParentFolderUri="+response.data.location+"&reportUnit="+reportURI;
        }
        localContext.getMode = function() {
            return "ADHOC_EXPORT";
        };
        designerBase.sendRequest("co_generateTempReportUnit", [], tmpRepCallback);
    })
</script>
</js:out>
    
Exporting...
<%-- TODO nicer design of this page --%>