<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="/spring" prefix="spring"%>

<%
    request.setAttribute("homePage","true");
    LicenseManager licenseManager = LicenseManager.getInstance();
%>

<authz:authorize ifAllGranted="ROLE_ADMINISTRATOR">
    <c:set var="bodyId" value="home_admin"/>
</authz:authorize>
<authz:authorize ifNotGranted="ROLE_ADMINISTRATOR">
    <c:set var="bodyId" value="home_user"/>
</authz:authorize>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='home.title'/></t:putAttribute>
    <t:putAttribute name="bodyID">${bodyId}</t:putAttribute>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
    <t:putAttribute name="moduleName" value="home/homeDeprecatedMain"/>
    <t:putAttribute name="headerContent" >
    </t:putAttribute>
    <t:putAttribute name="bodyContent" >
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated primary home"/>
            <t:putAttribute name="containerTitle"><spring:message code="home.header.title"/></t:putAttribute>
            <t:putAttribute name="bodyContent">
                <div id="buttons" data-tab-index="3" data-component-type="linkList">
                    <%
                        if (!licenseManager.banUserRole()) {
                    %>
                    <div class="row">
                        <a id="viewReports" class="button action jumbo up"><span class="wrap"><spring:message code="home.view" javaScriptEscape="true"/></span><span class="icon"></span></a>

                        <%
                            if (licenseManager.isAdHocFeatureSupported()) {
                        %>
                        <a id="createView" class="button action jumbo up"><span class="wrap"><spring:message code="home.createView" javaScriptEscape="true"/></span><span class="icon"></span></a>
                        <%
                            }
                        %>

                        <a id="createReport" class="button action jumbo up"><span class="wrap"><spring:message code="home.createReport" javaScriptEscape="true"/></span><span class="icon"></span></a>

                        <c:if test="${!isIPad}">
                            <a id="manageServer" class="button action jumbo up"><span class="wrap"><spring:message code="home.manage" javaScriptEscape="true"/></span><span class="icon"></span></a>
                        </c:if>
                    </div>
                    <%
                        }
                    %>
                </div>
            </t:putAttribute>
        </t:insertTemplate>
    </t:putAttribute>
</t:insertTemplate>
