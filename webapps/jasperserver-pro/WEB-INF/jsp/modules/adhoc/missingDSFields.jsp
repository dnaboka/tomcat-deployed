<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="/WEB-INF/jasperserver.tld" prefix="js" %>
<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>

<c:choose>
    <c:when test="${startTopic}">
        <c:set var="isTopicTreeHidden" value=""/>
        <c:set var="isTopicTabSelected" value="selected"/>
        <c:set var="isDomainTreeHidden" value="hidden"/>
        <c:set var="isDomainTabSelected" value=""/>
    </c:when>
    <c:otherwise>
        <c:set var="isTopicTreeHidden" value="hidden"/>
        <c:set var="isTopicTabSelected" value=""/>
        <c:set var="isDomainTreeHidden" value=""/>
        <c:set var="isDomainTabSelected" value="selected"/>
    </c:otherwise>
</c:choose>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle">
        <spring:message code="ADH_108_DATA_CHOOSER_PAGE_TITLE"/>
    </t:putAttribute>
    <t:putAttribute name="moduleName" value="adhoc/adhocStartMainFix"/>
    <t:putAttribute name="headerContent">
        <%@ include file="adHocScriptHeader.jsp"%>
    </t:putAttribute>
    <t:putAttribute name="bodyID" value="fixFieldsSource"/>
    <t:putAttribute name="bodyClass" value="threeColumn"/>

    <t:putAttribute name="bodyContent" >
        <div style="display: none;">
            <span id="missingFieldBuffer">
                 <c:forEach items="${missingFields}" var="field">
                    ${field} <br>
                 </c:forEach>
              </span>
        </div>

        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated primary"/>
            <t:putAttribute name="containerAttributes" value="style='right:12px;'" />
            <t:putAttribute name="containerTitle"><spring:message code='ADH_002c_CANVAS'/></t:putAttribute>
            <t:putAttribute name="bodyContent">

            </t:putAttribute>
        </t:insertTemplate>


        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated secondary sizeable"/>
            <t:putAttribute name="containerElements">
                <div class="sizer horizontal"></div>
                <button class="button minimize"></button>
            </t:putAttribute>
            <t:putAttribute name="containerTitle"><spring:message code='ADH_112_DATA_SOURCE'/></t:putAttribute>
            <t:putAttribute name="bodyContent">

            </t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated tertiary sizeable minimized"/>
            <t:putAttribute name="containerElements">
                <div class="sizer horizontal" style="display:none;"></div>
                <button class="button minimize"></button>
                <div class="vtitle" style="width: 73px; top: 73px;"><spring:message code='ADH_187_FILTERS_TITLE'/></div>
            </t:putAttribute>
            <t:putAttribute name="containerTitle"><spring:message code='ADH_187_FILTERS_TITLE'/></t:putAttribute>
            <t:putAttribute name="contentAttributes" value="style='display:none;'" />
            <t:putAttribute name="bodyContent">

            </t:putAttribute>
        </t:insertTemplate>

    </t:putAttribute>

</t:insertTemplate>









