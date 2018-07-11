<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ page language="java" contentType="application/javascript" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="/spring" prefix="spring"%>

/**
 * ${sessionScope.XSS_NONCE} do not remove
 *
 * @author: Igor Nesterenko, Sergey Prilukin
 * @version $Id: visualize.jsp 51369 2014-11-12 13:59:41Z sergey.prilukin $
 */

<jsp:include page="setScriptOptimizationProps.jsp"/>

<%-- Temporary solution for JasperMobile. Will be removed in next release. --%>
<c:set var="_showInputControls" value="${true}" scope="session"/>

<c:choose>
    <c:when test="${param['_showInputControls'] == 'false'}">
        <c:set var="_showInputControls" value="${false}" scope="session"/>
    </c:when>
</c:choose>

<c:choose>
    <c:when test="${optimizeJavascript == true}">
        <c:import url="${scriptsFolderInternal}/client/visualize.js" />
        <%-- Workaround to fix jquery.ui.datepicker in case if optimization is enabled. In this case __jrsConfigs__ will not be global --%>
        visualize.__jrsConfigs__["userLocale"] = "${userLocale}";
        visualize.__jrsConfigs__["avaliableLocales"] = [<c:forEach items="${userLocales}" var="locale" varStatus="sts">"${locale.code}"<c:if test="${!sts.last}">, </c:if></c:forEach>];

    <%--TODO: maybe it's better to move it to visualize.js--%>
        if (typeof define === "function" && define.amd) {
            define([], function () {
                return visualize;
            });
        }

    </c:when>
    <c:otherwise>
        <%-- Workaround to fix jquery.ui.datepicker. Set global __jrsConfigs__ property --%>
        var __jrsConfigs__ = {
            userLocale: "${userLocale}",
            avaliableLocales: [<c:forEach items="${userLocales}" var="locale" varStatus="sts">"${locale.code}" <c:if test="${!sts.last}">, </c:if> </c:forEach>]
        };
        <c:import url="${scriptsFolderInternal}/bower_components/requirejs/require.js"/>
        <%--Adding already optimized loader, not need in decomposing it--%>
        <c:import url="${optimizedScriptsFolderInternal}/loader/jasper.js" />
        <%--Use not optimized version of visualize for development proposes--%>
        <c:import url="${scriptsFolderInternal}/client/visualize.js" />
    </c:otherwise>
</c:choose>

var themeHref = "${baseUrl}" + "/" + "<spring:theme code='theme.css'/>".split("/").slice(0, -1).join("/");

visualize.config({
    server : "${baseUrl}",
    scripts : "${scriptsFolder}",
    logEnabled: ${logEnabled},
    logLevel: "${logLevel}",
    _showInputControls: "${_showInputControls}" === "true",
    theme: {
        href: themeHref
    }
});