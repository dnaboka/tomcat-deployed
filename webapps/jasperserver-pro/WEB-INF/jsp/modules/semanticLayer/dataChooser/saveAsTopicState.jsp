<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages["exitMessage"]  = '<spring:message code="domain.chooser.exitMessage" javaScriptEscape="true"/>';
    domain._messages['accessDeniedError'] = '<spring:message code="ADH_1001_SERVER_REPOSITORY_ACCESS_DENIED" javaScriptEscape="true"/>';
    domain._messages['warning'] = '<spring:message code="QB_WARNING" javaScriptEscape="true"/>';
    domain._messages['tooLongName'] = '<spring:message code="QB_TOO_LONG_NAME" javaScriptEscape="true"/>';
    domain._messages['tooLongDescription'] = '<spring:message code="QB_TOO_LONG_DESCRIPTION" javaScriptEscape="true"/>';
    domain._messages['topicAlredyExists'] = '<spring:message code="SLQB_TOPIC_ALREADY_EXISTS" javaScriptEscape="true"/>';
    domain._messages['QB_007_NAVIGATION_BUTTON_SAVE'] = '<spring:message code="QB_007_NAVIGATION_BUTTON_SAVE" javaScriptEscape="true"/>';
    domain._messages['QB_007_NAVIGATION_BUTTON_SAVE_AS'] = '<spring:message code="QB_007_NAVIGATION_BUTTON_SAVE_AS" javaScriptEscape="true"/>';
    domain._messages['resource_of_other_type_exists'] = '<spring:message code="ADH_1001_RESOURCE_OF_OTHER_TYPE_EXISTS_ERROR" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.max.was.changed'] = '<spring:message code="page.saveAsTopic.dataLifetime.max.was.changed" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.min.was.changed'] = '<spring:message code="page.saveAsTopic.dataLifetime.min.was.changed" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.minutes'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.minutes" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.minute'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.minute" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.hours'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.hours" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.hour'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.hour" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.days'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.days" javaScriptEscape="true"/>';
    domain._messages['page.saveAsTopic.dataLifetime.units.day'] = '<spring:message code="page.saveAsTopic.dataLifetime.units.day" javaScriptEscape="true"/>';
    domain._messages["page.saveAsTopic.dataLifetime.maximum"] = '<spring:message code="page.saveAsTopic.dataLifetime.maximum" javaScriptEscape="true"/>';
    domain._messages["page.saveAsTopic.dataLifetime.minimum"] = '<spring:message code="page.saveAsTopic.dataLifetime.minimum" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        <js:out javaScriptEscape="true">
        mode: "${wizardMode}",
        flowExecutionKey: '${flowExecutionKey}',
        organizationId:  "${organizationId}",
        publicFolderUri:  "${publicFolderUri}",
        folderURI: "${slReportUnitLocation}",
        // Session values
        topicName : "${slReportUnitLabel}",
        topicLocation : "${slReportUnitLocation}",
        topicDescription : "${slReportUnitDesc}",
        topicStagingEnabled: "${dataStrategy_staged}",
        topicStagingQueryCacheTimeout: "${dataStrategy_dataLifetimeMinutes}",
        stagingEnabled: "${stagingEnabled}",
        // Validation params
        maxTopicName: ${maxTopicName},

        maxTopicDescription: ${maxTopicDescription},
        minStagingTopicMinutes: ${slTopicStagingMinMinutes},
        maxStagingTopicMinutes: ${slTopicStagingMaxMinutes},
        unsavedChangesPresent: ${unsavedChangesPresent},
        organizationsFolderUri: "${organizationsFolderUri}"
        </js:out>
    };

    var errorMessage = "${errorMessage}";

    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;
    __jrsConfigs__.dataChooser.errorMessage = errorMessage;

</script>
