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
<t:useAttribute id="viewBodyContent" name="viewBodyContent" classname="java.lang.String" ignore="true"/>
<t:useAttribute id="reportBodyContent" name="reportBodyContent" classname="java.lang.String" ignore="true"/>


<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
    <t:putAttribute name="containerClass">panel dialog overlay saveAs sizeable moveable ${containerClass}</t:putAttribute>
    <t:putAttribute name="containerID" value="saveDataViewAndReport" />
    <t:putAttribute name="containerTitle"><span class="forDataViewOnly"><spring:message code="dialog.saveAs.title"/></span><span class="forReport"><spring:message code="ADH_037_MENU_SAVE_DATA_VIEW_AND_REPORT"/></span></t:putAttribute>
    <t:putAttribute name="containerElements"><div class="sizer diagonal"></div></t:putAttribute>
    <t:putAttribute name="headerClass" value="mover"/>
    <t:putAttribute name="bodyContent">
    <div class="dualColumnContainer">
	    <div class="dataViewColumnContainer">
	        <ul class="dataViewColumn forDataView">
				<li>
	                <label class="control input text forDataView" accesskey="o" title="<spring:message code="resource.visiblename.tooltip"/>">
	                    <span class="wrap"><spring:message code="dialog.file.data.view.name"/> (<spring:message code='required.field'/>):</span>
	                    <input class="dataViewName resourceNameInput" type="text" maxlength="94" value=""/>
	                    <span class="message warning">error message here</span>
	                </label>
	            </li>
	            <li>
	                <label class="control textArea forDataView">
	                    <span class="wrap"><spring:message code="dialog.file.data.view.description"/>:</span>
	                    <textarea class="dataViewDescription resourceDescriptionInput" type="text" maxlength="249"> </textarea>
	                    <span class="message warning">error message here</span>
	                </label>
	            </li>
	            <li>
	                <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
	                    <t:putAttribute name="containerClass" value="control groupBox"/>
	                    <t:putAttribute name="bodyContent">${viewBodyContent}</t:putAttribute>
	                </t:insertTemplate>
	            </li>
	        </ul>
		</div>
		<div class="reportColumnContainer">
			<ul class="reportColumn forReport">
	            <li>
	                    <%-- TODO make design look fine when both DataView and Report options need to be edited --%>
	                <label class="control input text forReport" accesskey="o" title="<spring:message code='resource.visiblename.tooltip'/>">
	                    <span class="wrap"><spring:message code="dialog.file.report.name"/> (<spring:message code='required.field'/>):</span>
	                    <input class="reportName resourceNameInput" type="text" value=""/>
	                    <span class="message warning">error message here</span>
	                </label>
	            </li>
	            <li>
	                <label class="control textArea forReport">
	                    <span class="wrap"><spring:message code="dialog.file.report.description"/>:</span>
	                    <textarea class="reportDescription resourceDescriptionInput" type="text"> </textarea>
	                    <span class="message warning">error message here</span>
	                </label>
	            </li>
	            <li>
	                <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
	                    <t:putAttribute name="containerClass" value="control groupBox"/>
	                    <t:putAttribute name="bodyContent">${reportBodyContent}</t:putAttribute>
	                </t:insertTemplate>
	            </li>
	        </ul>
		</div>
	</div>


        <t:insertTemplate template="/WEB-INF/jsp/templates/generatorSelect.jsp">
            <t:putAttribute name="containerID" value="adHocGeneratorSelect"/>
        </t:insertTemplate>

    </t:putAttribute>
    <t:putAttribute name="footerContent">
         <button class="button action primary up saveButton"><span class="wrap"><spring:message code="dialog.file.save"/><span class="icon"></span></button>
         <button class="button action up cancelButton"><span class="wrap"><spring:message code="dialog.file.cancel"/><span class="icon"></span></button>
    </t:putAttribute>
</t:insertTemplate>
