<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>

<!-- Login Help Dialog -->
<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
    <t:putAttribute name="containerClass" value="panel dialog overlay moveable centered_horz centered_vert hidden"/>
    <t:putAttribute name="containerID" value="helpLoggingIn"/>
    <t:putAttribute name="containerTitle"><spring:message code='LOGIN_HELP'/></t:putAttribute>
    <t:putAttribute name="headerClass" value="mover"/>
    <t:putAttribute name="bodyContent">
        <p class="message"><spring:message code="LOGIN_HELP_AWS_INFO_TITLE" /></p>
        <ul class="decorated">
            <li><span class="emphasis"><spring:message code="LOGIN_HELP_AWS_INFO_USERID_LABEL" /></span>: superuser</li>
            <li><span class="emphasis"><spring:message code="LOGIN_HELP_AWS_INFO_OLD_PASSWORD_LABEL" /></span>: <spring:message code="LOGIN_HELP_AWS_INFO_OLD_PASSWORD" /></li>
            <li><span class="emphasis"><spring:message code="LOGIN_HELP_AWS_INFO_NEW_PASSWORD_LABEL" /></span>:
                <spring:message code="LOGIN_HELP_AWS_INFO_NEW_PASSWORD" />
            </li>
            <li><span class="emphasis"><spring:message code="LOGIN_HELP_AWS_INFO_CONFIRM_PASSWORD_LABEL" /></span>:
                <spring:message code="LOGIN_HELP_AWS_INFO_CONFIRM_PASSWORD" />
            </li>
        </ul><br />
        <p class="message">
            <spring:message code="LOGIN_HELP_AWS_INFO_OTHERS_TITLE" />
        </p>
        <ul class="decorated">
            <li><span class="emphasis">jasperadmin</span>
                <spring:message code='LOGIN_ADMIN_USER'/>
            </li>
            <li><span class="emphasis">joeuser</span>
                <spring:message code='LOGIN_JOEUSER'/>
            </li>
            <li><span class="emphasis">demo</span>
                <spring:message code='LOGIN_TO_VIEW_DEMO_AWS'/>
            </li>
        </ul>
    </t:putAttribute>

    <t:putAttribute name="footerContent">
        <button type="submit" class="button action primary up"><span class="wrap"><spring:message code='button.ok'/></span><span class="icon"></span></button>
    </t:putAttribute>
</t:insertTemplate>