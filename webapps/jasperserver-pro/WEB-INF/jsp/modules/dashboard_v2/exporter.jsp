<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="/spring" prefix="spring"%>

<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='ADH_700_DASHBOARD_VIEWER_TITLE'/></t:putAttribute>

    <t:putAttribute name="bodyID">dashboard</t:putAttribute>
    <t:putAttribute name="bodyClass" value="oneColumn dashboardViewer"/>
    <t:putAttribute name="moduleName" value="dashboardViewer/dashboardViewerExporterMain"/>

    <t:putAttribute name="headerContent">
        <c:if test='${!empty param.viewAsDashboardFrame && param.viewAsDashboardFrame != "false"}'>
            <!--in case of frame decorators do not work, so need to load config manually-->
            <jsp:include page="/WEB-INF/jsp/modules/common/jrsConfigs.jsp"/>

            <link rel="stylesheet" href="${pageContext.request.contextPath}/runtime/${jsOptimizationProperties.runtimeHash}/themes/reset.css" type="text/css" media="all">

            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="themeMinimal.css"/>" type="text/css" media="all,print"/>

            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="dashboard/canvas.css"/>" type="text/css" media="all,print"/>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="pagination.css"/>" type="text/css" media="all,print"/>

            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="jasper-ui/jasper-ui.css"/>" type="text/css" media="all,print"/>

            <!--[if IE 7.0]>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_ie7.css"/>" type="text/css" media="all"/>
            <![endif]-->

            <!--[if IE 8.0]>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_ie8.css"/>" type="text/css" media="all"/>
            <![endif]-->

            <!--[if IE]>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_ie.css"/>" type="text/css" media="all"/>
            <![endif]-->
            <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_custom.css"/>" type="text/css" media="all"/>

            <c:forEach var="style" items="${dashboardstyle}">
                <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/reportresource/reportresource?${style}" class="jrWebFont">
           </c:forEach>

            <style type="text/css">
                body {background:#fff;}
                .hidden {display:none;}
                .column.decorated.primary {border:none;border-radius:0;}
                .column.decorated.primary>.corner,
                .column.decorated.primary>.edge,
                /*.column.decorated.primary>.content>.header,*/
                .column.decorated.primary>.content .title,
                .column.decorated.primary>.content>.footer {
                    display:none !important;
                }

                .column.decorated.primary,
                .column.decorated.primary>.content,
                .column.decorated.primary>.content>.body {
                    top:0;
                    bottom:0;
                    left:0;
                    right:0;
                    margin:0;
                }

                .filterRow > .inputControlWrapper > div {
                    height: auto !important;
                }
            </style>
        </c:if>

        <%--<style>--%>
            <%--<% if (request.getAttribute("dashboardstyle") != null) out.print(request.getAttribute("dashboardstyle"));%>--%>

        <%--</style>--%>
    </t:putAttribute>

    <t:putAttribute name="bodyContent">
        <div class="content">
            <div class="body">
                <% out.print(request.getAttribute("dashboardmarkup"));%>
            </div>
        </div>
    </t:putAttribute>
</t:insertTemplate>

