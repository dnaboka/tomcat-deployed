<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ page contentType="text/html" %>
<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib uri="/spring" prefix="spring"%>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='ADH_701_DASHBOARD_DESIGNER_HEADER'/></t:putAttribute>
    <t:putAttribute name="moduleName" value="dashboardDeprecated/dashboardDesignerMain"/>
    <t:putAttribute name="headerContent">
        <script type="text/javascript">
            // init these vars here, because they get populated in JSP inclusions
            var localContext = { messages: {} };
            var clientKey = "${clientKey}";
        </script>
        <%@ include file="dashboardDesignerScriptHeader.jsp"%>
        <%@ include file="/WEB-INF/jsp/modules/adhoc/baseState.jsp" %>
        <%@ include file="../inputControls/InputControlConstants.jsp"%>
        <%@ include file="../inputControls/InputControlTemplates.jsp"%>
        <script type="text/javascript">
            // hack to prevent variables to be overwritten by other modules
            __jrsConfigs__.dashboardDesigner = { localContext: localContext };
            __jrsConfigs__.inputControlConstants = ControlsBase;
        </script>
    </t:putAttribute>
    <t:putAttribute name="bodyID" value="dashboardDesigner"/>
    <t:putAttribute name="bodyClass" value="twoColumn"/>
    <t:putAttribute name="bodyContent" >
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerID" value="canvas"/>
            <t:putAttribute name="containerClass" value="column decorated primary showingToolBar"/>
            <t:putAttribute name="containerTitle">${viewModel.name}</t:putAttribute>
            <t:putAttribute name="headerContent" >
                <div class="toolbar">
                    <ul class="list buttonSet">
                        <li class="leaf" onclick="javascript:localContext.allowPreview && window.open(localContext.getPreviewUrl(), 'preview');">
                            <button id="presentation" title="<spring:message code="ADH_720_BUTTON_PREVIEW"/>" class="button capsule text up first"
                                    >
                                <span class="wrap"><spring:message code="ADH_720_BUTTON_PREVIEW"/><span class="icon"></span></span>
                            </button>
                        </li>
                        <li class="node">
                            <button id="save" title="<spring:message code="ADH_012_BUTTON_SAVE"/>" class="button capsule text mutton up middle">
                                <span class="wrap"><spring:message code="ADH_012_BUTTON_SAVE"/><span class="icon"></span><span class="indicator"></span></span>
                            </button>
                        </li>
                        <li class="node">
                            <button id="options" title="<spring:message code="ADH_018_BUTTON_OPTIONS"/>" class="button capsule text mutton up last">
                                <span class="wrap"><spring:message code="ADH_018_BUTTON_OPTIONS"/><span class="icon"></span><span class="indicator"></span></span>
                            </button>
                        </li>
                    </ul>
                </div>
                <%--title section--%>
                <c:if test="${viewModel.titleBarShowing}">
                    <div id="title" class="emphasis larger">${viewModel.title}</div>
                </c:if>
            </t:putAttribute>
            <%--main content--%>
            <t:putAttribute name="bodyClass" value=""/>
            <t:putAttribute name="bodyID" cascade="true">dashboardDropZone</t:putAttribute>
            <t:putAttribute name="swipeScroll" value="${isIPad}"/>
            <t:putAttribute name="bodyContent">
                <%--canvas--%>
                <%@ include file="dashboardDesignerCanvas.jsp" %>
            </t:putAttribute>
        </t:insertTemplate>
        <%--available content--%>
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerID" value="folders"/>
            <t:putAttribute name="containerClass" value="column decorated secondary sizeable"/>
            <t:putAttribute name="containerElements">
                <div class="sizer horizontal"></div>
                <button class="button minimize"></button>
            </t:putAttribute>
            <t:putAttribute name="containerTitle"><spring:message code="ADH_710_AVAILABLE_REPORTS"/></t:putAttribute>
            <t:putAttribute name="bodyClass" value=""/>
            <t:putAttribute name="bodyID" value="dashboardFolderContainer"/>
            <t:putAttribute name="swipeScroll" value="${isIPad}"/>
            <t:putAttribute name="bodyContent" >
                <ul id="dashboardSpecialContentTree">
                </ul>
                <ul id="dashboardRepoTree">
                </ul>
            </t:putAttribute>
        </t:insertTemplate>
        <%--ajax buffer--%>
        <div id="ajaxbuffer" style="display: none;" ></div>
        <%--all dashboard templates--%>
        <%@ include file="dashboardDesignerTemplates.jsp"%>
        <%--custom url--%>
        <t:insertTemplate template="/WEB-INF/jsp/templates/customURL.jsp">
            <t:putAttribute name="bodyContent">
                <t:putAttribute name="containerClass" value="hidden noParams"/>
            </t:putAttribute>
        </t:insertTemplate>

    </t:putAttribute>
</t:insertTemplate>
