<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:if test="${isAwsMpProduct}">
    <li class="leaf first">
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="panel pane settings"/>
            <t:putAttribute name="containerTitle"><spring:message code="aws.db.security.group.settings.configuration"/></t:putAttribute>
            <t:putAttribute name="bodyClass" value="twoColumn"/>
            <t:putAttribute name="bodyContent">
                <div class="column simple primary">
                    <c:url value="/awsconfiguration.html" var="configurationUrl"/>
                    <p class="description"><spring:message code="aws.db.security.group.settings.configuration.link" arguments="${configurationUrl}"/></p>
                </div>
            </t:putAttribute>
        </t:insertTemplate>
    </li>
</c:if>
