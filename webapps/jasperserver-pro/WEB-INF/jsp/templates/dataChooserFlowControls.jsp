<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<t:useAttribute name="selectedTab" id="selectedTab" classname="java.lang.String" ignore="false"/>

<div id="flowControls">
    <!-- ${sessionScope.XSS_NONCE} do not remove -->

    <t:insertTemplate template="/WEB-INF/jsp/templates/control_tabSet.jsp">
        <t:putAttribute name="type" value="buttons"/>
        <t:putAttribute name="containerClass" value="vertical"/>
        <t:putListAttribute name="tabset">
            <%--<t:addListAttribute>
                <t:addAttribute>sourceTab</t:addAttribute>
                <t:addAttribute><spring:message code='button.chooserSource' javaScriptEscape='true'/></t:addAttribute>
            </t:addListAttribute>--%>
            <t:addListAttribute>
                <t:addAttribute>fieldsTab</t:addAttribute>
                <t:addAttribute><spring:message code='button.chooserFields' javaScriptEscape='true'/></t:addAttribute>
                <c:if test="${selectedTab eq 'fields'}">
                    <t:addAttribute>selected</t:addAttribute>
                </c:if>
            </t:addListAttribute>
            <t:addListAttribute>
                <t:addAttribute>filtersTab</t:addAttribute>
                <t:addAttribute><spring:message code='button.chooserPreFilters' javaScriptEscape='true'/></t:addAttribute>
                <c:if test="${selectedTab eq 'filters'}">
                    <t:addAttribute>selected</t:addAttribute>
                </c:if>
            </t:addListAttribute>
            <t:addListAttribute>
                <t:addAttribute>displayTab</t:addAttribute>
                <t:addAttribute><spring:message code='button.chooserDisplay' javaScriptEscape='true'/></t:addAttribute>
                <c:if test="${selectedTab eq 'display'}">
                    <t:addAttribute>selected</t:addAttribute>
                </c:if>
            </t:addListAttribute>
            <t:addListAttribute>
                <t:addAttribute>saveTopicTab</t:addAttribute>
                <t:addAttribute><spring:message code='button.chooserSaveTopic' javaScriptEscape='true'/></t:addAttribute>
                <c:if test="${selectedTab eq 'saveAs'}">
                    <t:addAttribute>selected</t:addAttribute>
                </c:if>
            </t:addListAttribute>
        </t:putListAttribute>
    </t:insertTemplate>
</div>
