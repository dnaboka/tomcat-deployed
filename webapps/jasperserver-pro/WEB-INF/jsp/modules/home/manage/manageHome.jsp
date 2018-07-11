<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/spring" prefix="spring"%>

<% request.setAttribute("homePage","true"); %>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='manage.home.header.title'/></t:putAttribute>
    <t:putAttribute name="bodyID" value="home_manage"/>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
    <t:putAttribute name="moduleName" value="home/homeAdminWorkflowMain"/>
    <t:putAttribute name="bodyContent" >
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated primary home"/>
            <t:putAttribute name="containerTitle"><spring:message code="manage.home.title"/></t:putAttribute>
            <t:putAttribute name="bodyContent"></t:putAttribute>
        </t:insertTemplate>
    </t:putAttribute>
</t:insertTemplate>
