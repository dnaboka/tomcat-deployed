<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>

<js:out javaScriptEscape="true">
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages['calculated_field_added'] = '<spring:message code="page.calcFields.field.added" javaScriptEscape="true"/>';
    domain._messages['calculated_field_edited'] = '<spring:message code="page.calcFields.field.edited" javaScriptEscape="true"/>';
    domain._messages['calculated_field_removed'] = '<spring:message code="page.calcFields.field.removed" javaScriptEscape="true"/>';
    domain._messages['wrong_name_format'] = '<spring:message code="page.calcFields.wrong.name.format" javaScriptEscape="true"/>';
    domain._messages['cannot_edit_field'] = '<spring:message code="page.calcFields.cannot.edit" javaScriptEscape="true"/>';
    domain._messages['confirm_filter_delete'] = '<spring:message code="DD_CONFIRM_DELETE_FILTER_IF_USED_IN_CALC_FIELD" javaScriptEscape="true"/>';

    domain._messages["exitMessage"]  = '<spring:message code="domain.designer.exitMessage" javaScriptEscape="true"/>';
    domain._messages["designIsValid"]  = '<spring:message code="domain.designer.designIsValid" javaScriptEscape="true"/>';
    domain._messages["yes"]  = '<spring:message code="button.designer.yes" javaScriptEscape="true"/>';
    domain._messages["no"]  = '<spring:message code="button.designer.no" javaScriptEscape="true"/>';
    domain._messages["ok"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_OK" javaScriptEscape="true"/>';
    domain._messages["cancel"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_CANCEL" javaScriptEscape="true"/>';

    domain._messages['ITEM_BEING_USED_BY_RESOURCE'] ='<spring:message code="ITEM_BEING_USED_BY_RESOURCE" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['resource.label'] ='<spring:message code="jsp.listResources.resource" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['field.label'] ='<spring:message code="DD_ITEM_PROPERTY_DIMENSION" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['resourcesWithNoAccess'] = '<spring:message code="DOMAIN_DEPENDENCY_NO_ACCES_TO_RESOURCE" javaScriptEscape="true"/>'.replace(/''/g, "'");

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.domainInitOptions = {
        flowExecutionKey: '${flowExecutionKey}',
        datasourcesProperties: JSON.parse('${datasourcesProperties}'), // Do not remove. used for common domain dsigner logic
        presentationSelected: ${presentationSelected}, // Do not remove. used for common domain dsigner logic
        dataSourceId: '${selectedDatasource}', // Do not remove. used for common domain dsigner logic
        fieldsUsedByFilters : JSON.parse('${fieldsUsedForRulesByItemId}'),
        unsavedChangesPresent: ${unsavedChangesPresent},
        allowDesignerCloseWithValidationErrors: ${domainDependentsDontBlock}
    };

    if (typeof __jrsConfigs__.domainDesigner === "undefined") {
        __jrsConfigs__.domainDesigner = {};
    }

    // save references to variables defined in state
    __jrsConfigs__.domainDesigner.domain = domain;
    __jrsConfigs__.domainDesigner.localContext = localContext;

</script>
</js:out>