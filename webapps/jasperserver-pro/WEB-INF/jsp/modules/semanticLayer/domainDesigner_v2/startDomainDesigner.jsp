    <%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

        <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
        <%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

        <c:set var="isAuthorized" value="false"/>
        <c:set var="disableAwsDefaults" value="${not isEc2Instance or suppressEc2CredentialsWarnings}" />

        <!--
        <c:choose>
            <c:when test="${isProVersion}">
                <authz:authorize ifAllGranted="ROLE_SUPERUSER">
                    <c:set var="isAuthorized" value="true"/>
                </authz:authorize>
            </c:when>
            <c:otherwise>
                <authz:authorize ifAllGranted="ROLE_ADMINISTRATOR">
                    <c:set var="isAuthorized" value="true"/>
                </authz:authorize>
            </c:otherwise>
        </c:choose>
        -->

        <%@ page import="com.jaspersoft.jasperserver.war.cascade.handlers.InputControlHandler"%>

        <script type="text/javascript">
            //${sessionScope.XSS_NONCE} do not remove

        __jrsConfigs__.inputControlsConstants = {};
        __jrsConfigs__.inputControlsConstants.NULL_SUBSTITUTION_VALUE = "<%= InputControlHandler.NULL_SUBSTITUTION_VALUE %>";
        __jrsConfigs__.inputControlsConstants.NULL_SUBSTITUTION_LABEL = "<%= InputControlHandler.NULL_SUBSTITUTION_LABEL %>";
        __jrsConfigs__.inputControlsConstants.NOTHING_SUBSTITUTION_VALUE = "<%= InputControlHandler.NOTHING_SUBSTITUTION_VALUE %>";
        </script>

        <t:insertTemplate template="/WEB-INF/jsp/templates/pageWithoutDisplayIdAndLegacyLayout.jsp">
            <t:putAttribute name="pageTitle"><spring:message code='page.design.pageTitle' javaScriptEscape='true'/></t:putAttribute>
            <t:putAttribute name="bodyClass" value="jr-jDomainDesigner"/>
            <t:putAttribute name="bodyID" value="domainDesigner"/>
            <t:putAttribute name="moduleName" value="domainDesignerV2/domainDesignerMain"/>
            <%-- uncomment line below and put your module there--%>
            <%--<t:putAttribute name="moduleName" value="dataSource/addDataSourcePage"/>--%>
            <t:putAttribute name="headerContent" >
                <%--TODO: remove after migration to jasper-ui CSS--%>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="theme.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="pages.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="containers.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="dialog.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="buttons.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="lists.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="controls.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="domainDesigner/index.css"/>" type="text/css" media="screen,print"/>
                <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="pageSpecific.css"/>" type="text/css" media="screen,print"/>
            </t:putAttribute>
            <t:putAttribute name="bodyContent">
            </t:putAttribute>
        </t:insertTemplate>
