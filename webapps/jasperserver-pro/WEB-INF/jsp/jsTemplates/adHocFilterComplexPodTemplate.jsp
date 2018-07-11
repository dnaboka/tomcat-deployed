<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>

<%--filter pod state minimized/maximized--%>
{{ var hidden = isComplexFilterPodShown ? "" : "hidden"; }}
{{ var minimized = isComplexFilterPodMinimized ? "minimized" : ""; }}

<tiles:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
    <tiles:putAttribute name="containerTitle">
                <spring:message code="ADH_1227_DYNAMIC_FILTER_ADVANCED_EDIT_LABEL"/>
    </tiles:putAttribute>
    <tiles:putAttribute name="containerID" cascade="true" value="complexExpressionPod"/>
    <tiles:putAttribute name="containerClass" value="panel pane filter {{-hidden}} {{-minimized}}"/>
    <tiles:putAttribute name="containerAttributes" cascade="true" value="data-filterId='complexFilter'
                                      data-filterType='complexFilter'
                                      data-fieldName='complexFilter'
                                      data-collapse='{{-isComplexFilterPodMinimized}}'
                                      data-editable='complexFilter'"/>
    <tiles:putAttribute name="headerContent">
        <button class="button disclosure noBubble"></button>
    </tiles:putAttribute>
    <tiles:putAttribute name="footerAttributes">style="z-index: -1;"</tiles:putAttribute>
    <tiles:putAttribute name="bodyContent">
        <ul class="message">
            <li class="leaf">
                <span id="complexExpressionPodValue">{{-complexExpression}}</span>
            </li>
            <li class="leaf">&nbsp;</li>
            <li class="leaf">
                <button id="edit" class="button action up"><span class="wrap"><spring:message code="button.edit"/></span></button>
            </li>
        </ul>
    </tiles:putAttribute>
</tiles:insertTemplate>

