<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--
Overview:
    Usage:permit user to add a system created object to the repository.

Usage:

    <t:insertTemplate template="/WEB-INF/jsp/templates/saveAs.jsp">
    </t:insertTemplate>
    
--%>

<%@ page import="com.jaspersoft.jasperserver.api.JSException" %>
<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


<t:useAttribute id="containerClass" name="containerClass" classname="java.lang.String" ignore="true"/>
<t:useAttribute id="bodyContent" name="bodyContent" classname="java.lang.String" ignore="true"/>

<style>
    .saveAs #saveAsInputDescription,  .saveAs textarea.resourceDescriptionInput{
        min-height: 40px;
        min-height:44px \9; /* IE9 */
    }
</style>



<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
    <t:putAttribute name="containerClass">panel dialog overlay saveAs sizeable moveable ${containerClass}</t:putAttribute>
    <t:putAttribute name="containerID" value="saveDataViewAndReport" />
    <t:putAttribute name="containerTitle"><span class="forDataViewOnly"><spring:message code="dialog.saveAs.title"/></span><span class="forReport"><spring:message code="ADH_037_MENU_SAVE_DATA_VIEW_AND_REPORT"/></span></t:putAttribute>
    <t:putAttribute name="containerElements"><div class="sizer diagonal"></div></t:putAttribute>
    <t:putAttribute name="headerClass" value="mover"/>
    <t:putAttribute name="bodyContent">

        <div class="column simple">
            <div class="body twoColumn_equal pickWells">
                <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                    <t:putAttribute name="containerClass" value="column decorated secondary"/>
                    <t:putAttribute name="containerID" value="viewColumn"/>
                    <t:putAttribute name="containerTitle"><spring:message code="ADH_RE_AVAILABLE_FIELDS" javaScriptEscape="true"/></t:putAttribute>

                    <t:putAttribute name="bodyContent">
                        <label class="control input text forDataView" accesskey="o" title="<spring:message code='resource.visiblename.tooltip'/>">
                            <span class="wrap"><spring:message code="dialog.file.data.view.name"/> (<spring:message code='required.field'/>):</span>
                            <input class="dataViewName resourceNameInput" type="text" maxlength="94" value=""/>
                            <span class="message warning">error message here</span>
                        </label>
                        <label class="control textArea forDataView">
                            <span class="wrap"><spring:message code="dialog.file.data.view.description"/>:</span>
                            <textarea class="dataViewDescription resourceDescriptionInput" type="text" maxlength="249"> </textarea>
                            <span class="message warning">error message here</span>
                        </label>

                        <ul class="responsive collapsible folders hideRoot" id="saveDataViewFoldersTree"></ul>

                    </t:putAttribute>

                </t:insertTemplate>

                <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                    <t:putAttribute name="containerClass" value="column decorated primary"/>
                    <t:putAttribute name="containerID" value="reportColumn"/>
                    <t:putAttribute name="containerTitle"><spring:message code="ADH_RE_SELECTED_FIELDS" javaScriptEscape="true"/></t:putAttribute>

                    <t:putAttribute name="bodyContent">
                        <label class="control input text forReport" accesskey="o" title="<spring:message code='resource.visiblename.tooltip'/>">
                            <span class="wrap"><spring:message code="dialog.file.report.name"/> (<spring:message code='required.field'/>):</span>
                            <input class="reportName resourceNameInput" type="text" value=""/>
                            <span class="message warning">error message here</span>
                        </label>
                        <label class="control textArea forReport">
                            <span class="wrap"><spring:message code="dialog.file.report.description"/>:</span>
                            <textarea class="reportDescription resourceDescriptionInput" type="text"> </textarea>
                            <span class="message warning">error message here</span>
                        </label>

                        <ul class="responsive collapsible folders hideRoot" id="saveReportFoldersTree"></ul>

                    </t:putAttribute>
                </t:insertTemplate>
            </div>
        </div>

        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="control groupBox"/>
            <t:putAttribute name="bodyContent">${bodyContent}</t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/generatorSelect.jsp"></t:insertTemplate>

    </t:putAttribute>
    <t:putAttribute name="footerContent">
         <button class="button action primary up saveButton"><span class="wrap"><spring:message code="dialog.file.save"/><span class="icon"></span></button>
         <button class="button action up cancelButton"><span class="wrap"><spring:message code="dialog.file.cancel"/><span class="icon"></span></button>
    </t:putAttribute>
</t:insertTemplate>
