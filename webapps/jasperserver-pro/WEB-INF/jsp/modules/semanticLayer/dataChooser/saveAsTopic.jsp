<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle">
        <spring:message code="page.saveAsTopic.pageTitle"/>
    </t:putAttribute>
    <t:putAttribute name="bodyID" value="dataChooserSaveAsTopic"/>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
    <t:putAttribute name="moduleName" value="dataChooser/dataChooserSaveAsTopicMain"/>
    <t:putAttribute name="headerContent">
        <%@ include file="saveAsTopicState.jsp" %>
        <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="domainTopic/saveAsTopic.css"/>" type="text/css" media="screen,print"/>
    </t:putAttribute>

    <t:putAttribute name="bodyContent" >
        <form id="stepDisplayForm">
            <input type="hidden" id="slTopicLabel" name="slTopicLabel" value=""/>
            <input type="hidden" id="slTopicLocation" name="slTopicLocation" value=""/>
            <input type="hidden" id="slTopicDesc" name="slTopicDesc" value=""/>
            <c:if test="${stagingEnabled}">
                <input type="hidden" id="slDataStrategy_staged" name="dataStrategy_staged" value=""/>
                <input type="hidden" id="slDataStrategy_dataLifetimeMinutes" name="dataStrategy_dataLifetimeMinutes" value=""/>
            </c:if>
        </form>
        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerClass" value="column decorated primary"/>
            <t:putAttribute name="containerTitle">
                <spring:message code='domain.chooser.title'/>
            </t:putAttribute>
            <t:putAttribute name="bodyClass" value="flow oneStep"/>

            <t:putAttribute name="bodyContent">
                <t:insertTemplate template="/WEB-INF/jsp/templates/dataChooserFlowControls.jsp">
                    <t:putAttribute name="selectedTab" value="saveAs"/>
                </t:insertTemplate>
                <div id="stepDisplay">
                    <fieldset class="row instructions">
                        <legend class="offLeft">
                            <span><spring:message code="page.saveAsTopic.instructions"/></span>
                        </legend>
                        <h2 class="textAccent02">
                            <spring:message code="page.saveAsTopic.saveTopic"/>
                        </h2>
                        <h4><spring:message code="page.saveAsTopic.saveTopic.info"/></h4>
                    </fieldset>

                    <fieldset class="row inputs oneColumn">
                        <legend class="offLeft">
                            <span><spring:message code="page.saveAsTopic.userInputs"/></span>
                        </legend>
                        <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                                <t:putAttribute name="containerClass" value="column primary noHeader"/>
                                <t:putAttribute name="containerTitle">
                                    <spring:message code="page.saveAsTopic.userInputs.save"/>
                                </t:putAttribute>

                                <t:putAttribute name="bodyContent">
                                    <div id="saveAsTopicInputs">
                                        <label class="control input text topicName" accesskey="o" for="topicName" title="<spring:message code='dialog.file.name.title' javaScriptEscape="true"/>">
                                            <c:choose>
                                                <c:when test="${stagingEnabled}">
                                                    <span class="wrap"><spring:message code="page.saveAsTopic.name.staging.on"/></span>
                                                </c:when>
                                                <c:otherwise>
                                                    <span class="wrap"><spring:message code="page.saveAsTopic.name.staging.off"/></span>
                                                </c:otherwise>
                                            </c:choose>
                                            <input class="" id="topicName" type="text" value="${slReportUnitLabel}"/>
                                            <span class="message warning"></span>
                                        </label>
                                        <label class="control textArea topicDesc" for="topicDesc">
                                            <span class="wrap"><spring:message code="page.saveAsTopic.description"/>:</span>
                                            <textarea id="topicDesc" type="text">${slReportUnitDesc}</textarea>
                                            <span class="message warning"></span>
                                        </label>
                                        <label class="control browser" for="topicLocation" title="<spring:message code="page.saveAsTopic.location.title" javaScriptEscape="true"/>">
                                            <span class="wrap"><spring:message code="page.saveAsTopic.location"/>:</span>
                                            <input class="" id="topicLocation" type="text" value="${slReportUnitLocation}"/>
                                            <button class="button action" id="browser_button" type="button">
                                                <span class="wrap">
                                                    <spring:message code="button.browse"/>
                                                    <span class="icon"></span>
                                                </span>
                                            </button>
                                            <span class="message warning"></span>
                                        </label>
                                    </div>
                                    <!-- following fields only appear if staging is enabled (see queryBuilderFlow.xml and applicationContext-adhoc-dataStrategy.xml) -->
                                    <c:if test="${stagingEnabled}">
                                        <label class="control checkBox staging" for="dataStrategy_staged" title="<spring:message code='page.saveAsTopic.enableStaging.title' javaScriptEscape="true"/>">
                                            <span class="wrap"><spring:message code="page.saveAsTopic.enableStaging"/></span>
                                            <input class="" id="dataStrategy_staged" type="checkbox" <c:if test="${dataStrategy_staged}">checked="checked"</c:if> />
                                            <span class="message warning"></span>
                                        </label>
                                        <div class="dataLifetimeControls group">
                                            <lable class="control" id="minMaxTimeNote" style="display:none">
                                                <span class="wrap"></span>
                                            </lable>
                                            <lable class="control dataLifetimeLabel">
                                                <span class="wrap"><spring:message code="page.saveAsTopic.dataLifetime"/></span>
                                            </lable>
                                            <span id="dataStrategy_dataLifetimeMinutes"  class="dataLifetimeInputs control">
                                                <input class="days" type="text" maxLength="3"  max="365" <c:if test="${!dataStrategy_staged}">disabled="disabled"</c:if>/>
                                                <span class="wrap"><spring:message code="page.saveAsTopic.dataLifetime.units.days"/></span>
                                                <input class="hours" type="text" maxLength="2"  max="23" <c:if test="${!dataStrategy_staged}">disabled="disabled"</c:if>/>
                                                <span class="wrap"><spring:message code="page.saveAsTopic.dataLifetime.units.hours"/></span>
                                                <input class="minutes" type="text" maxLength="2" max="59" <c:if test="${!dataStrategy_staged}">disabled="disabled"</c:if>/>
                                                <span class="wrap"><spring:message code="page.saveAsTopic.dataLifetime.units.minutes"/></span>
                                                <span class="message warning dataLifetimeInputsError"></span>
                                            </span>
                                            <div class="control lifeTimeInfo">
                                                <span class="wrap minimumLifetime"></span>
                                                <span class="wrap maximumLifetime"></span>
                                            </div>
                                        </div>
                                    </c:if>
                                </t:putAttribute>
                            </t:insertTemplate>
                    </fieldset><!--/.row.inputs-->
                </div><!--/#stepDisplay-->
            </t:putAttribute>
            <t:putAttribute name="footerContent">
                <fieldset id="wizardNav">
                    <c:if test="${wizardMode == 'createMode'}">
                        <button id="goToDesigner" class="button primary action up">
                    <span class="wrap">
                            <spring:message code="button.goToDesigner.ok" javaScriptEscape="true"/>
                    </span><span class="icon"></span>
                        </button>
                    </c:if>
                    <c:if test="${wizardMode == 'editMode'}">
                        <button id="goToDesigner" class="button primary action up">
                    <span class="wrap">
                            <spring:message code="button.save" javaScriptEscape="true"/>
                    </span><span class="icon"></span>
                        </button>
                    </c:if>
                    <button id="cancel" class="button action up">
                        <span class="wrap"><spring:message code='button.cancel'/></span>
                        <span class="icon"></span>
                    </button>
               </fieldset>
            </t:putAttribute>
        </t:insertTemplate><!--column-->

        <t:insertTemplate template="/WEB-INF/jsp/templates/selectFromRepository.jsp">
            <t:putAttribute name="containerTitle">
                <spring:message code="QB_SAVE_ADHOC_TOPIC_DIALOG_TITLE"/>
            </t:putAttribute>
            <t:putAttribute name="containerClass">hidden centered_vert centered_horz</t:putAttribute>
            <t:putAttribute name="bodyContent">
                <ul class="responsive collapsible folders hideRoot" id="addFileTreeRepoLocation" style="position: relative;">
            </t:putAttribute>
        </t:insertTemplate>

        <t:insertTemplate template="/WEB-INF/jsp/templates/standardConfirm.jsp">
            <t:putAttribute name="containerClass">centered_vert centered_horz hidden</t:putAttribute>
            <t:putAttribute name="bodyContent">
                <p class="message"><spring:message code="page.saveAsTopic.repoBrowser.warningMessage"/></p>
                <p class="message"><spring:message code="page.saveAsTopic.repoBrowser.cautionMessage"/></p>
            </t:putAttribute>
            <t:putAttribute name="okLabel"><spring:message code="QB_BUTTON_YES"/></t:putAttribute>
            <t:putAttribute name="leftButtonId" value="saveAsTopicOverwriteButtonId"/>

            <t:putAttribute name="cancelLabel"><spring:message code="QB_BUTTON_NO" javaScriptEscape="true"/></t:putAttribute>
            <t:putAttribute name="rightButtonId" value="saveAsTopicOverwriteCancelButtonId"/>
        </t:insertTemplate>

        <%--ajax buffer--%>
        <div id="ajaxbuffer" class="hidden" ></div>

    </t:putAttribute>

</t:insertTemplate><!--page-->
