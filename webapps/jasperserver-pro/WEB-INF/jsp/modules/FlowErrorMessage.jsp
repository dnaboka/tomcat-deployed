<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@page import="java.util.regex.Pattern,
		com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceLookup"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="/WEB-INF/jasperserver.tld" prefix="js"%>

<form name="frm" method="post">
<!-- ${sessionScope.XSS_NONCE} do not remove -->

<input type="hidden" name="_flowExecutionKey" value="${flowExecutionKey}"/>

<table border="0" cellpadding="0" cellspacing="20" width="100%">
	<tr>
		<td width="25%">&nbsp;</td>
		<td align="center" width="50%">
			<span class="ferror"><spring:message code="${messageCode}" arguments="${messageArguments}"/></span>
		</td>
		<td width="25%">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="3" align="center">
			<input type="submit" name="_eventId_back" value="<spring:message code="button.back"/>" class="fnormal"/>
		</td>
	</tr>
</table>

</form>
