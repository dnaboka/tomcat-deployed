<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="/spring" prefix="spring"%>

<%
    request.setAttribute("homePage","true");
    LicenseManager licenseManager = LicenseManager.getInstance();
%>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='home.title'/></t:putAttribute>
    <t:putAttribute name="bodyID">home_user</t:putAttribute>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
    <t:putAttribute name="moduleName" value="commons.main"/>
    <t:putAttribute name="bodyContent" >
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated primary"/>
            <t:putAttribute name="containerTitle"><spring:message code="home.header.title"/></t:putAttribute>
            <t:putAttribute name="swipeScroll" value="${isIPad}"/>
            <t:putAttribute name="dbodyContent">
                <iframe id="outerFrame" class="outerDashboardFrame" name="Dashboard" allowtransparency="true" align="center" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" height="450" width="100%" scrolling="no"
                        src="${pageContext.request.contextPath}/flow.html?_flowId=dashboardRuntimeFlow&amp;dashboardResource=${demoHomeResource}&viewAsDashboardFrame=true&decorate=no&hidden_isJasperAnalysis=<%=licenseManager.isAnalysisFeatureSupported()?"true":"false"%>">
                </iframe>
            </t:putAttribute>
        </t:insertTemplate>
    </t:putAttribute>
</t:insertTemplate>
