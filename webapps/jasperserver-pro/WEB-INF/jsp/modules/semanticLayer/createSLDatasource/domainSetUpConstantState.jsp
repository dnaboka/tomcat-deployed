<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%-- todo: clean up unused messages --%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<js:out javaScriptEscape="true">
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    if (typeof domain.wizard === "undefined") {
        domain.wizard = {};
    }

    domain._messages["CSLD_CHANGE_LINK"]  = '<spring:message code="CSLD_CHANGE_LINK" javaScriptEscape="true"/>';
    domain._messages["CSLD_REMOVE_LINK"]  = '<spring:message code="CSLD_REMOVE_LINK" javaScriptEscape="true"/>';
    domain._messages["DOMAIN_WIZARD_CHANGE_DATASOURCE"]  = '<spring:message code="DOMAIN_WIZARD_CHANGE_DATASOURCE" javaScriptEscape="true"/>';
    domain._messages["DOMAIN_WIZARD_REMOVE_DATASOURCE"]  = '<spring:message code="DOMAIN_WIZARD_REMOVE_DATASOURCE" javaScriptEscape="true"/>';

    domain._messages["CSLD_CREATE_WITH_DD"]  = '<spring:message code="CSLD_CREATE_WITH_DD" javaScriptEscape="true"/>';
    domain._messages["CSLD_EDIT_WITH_DD"]  = '<spring:message code="CSLD_EDIT_WITH_DD" javaScriptEscape="true"/>';

    domain._messages["CSLD_ADD_SECURITY_FILE"]  = '<spring:message code="CSLD_ADD_SECURITY_FILE" javaScriptEscape="true"/>';
    domain._messages["CSLD_CHANGE_SECURITY_FILE"]  = '<spring:message code="CSLD_CHANGE_SECURITY_FILE" javaScriptEscape="true"/>';
    domain._messages["CSLD_ADD_BUNDLE_FILE"]  = '<spring:message code="CSLD_ADD_BUNDLE_FILE" javaScriptEscape="true"/>';
    domain._messages["CSLD_CHANGE_BUNDLE_FILE"]  = '<spring:message code="CSLD_CHANGE_BUNDLE_FILE" javaScriptEscape="true"/>';

    domain._messages["CSLD_DOMAIN_SAVED"]  = '<spring:message code="CSLD_DOMAIN_SAVED" javaScriptEscape="true"/>';
    domain._messages["CSLD_SCHEMA_UPLOADED"]  = '<spring:message code="CSLD_SCHEMA_UPLOADED" javaScriptEscape="true"/>';
    domain._messages["CSLD_SECURITY_FILE_IS_SET"]  = '<spring:message code="CSLD_SECURITY_FILE_IS_SET" javaScriptEscape="true"/>';
    domain._messages["CSLD_SECURITY_FILE_IS_REMOVED"]  = '<spring:message code="CSLD_SECURITY_FILE_IS_REMOVED" javaScriptEscape="true"/>';
    domain._messages["CSLD_BUNDLE_IS_SET"]  = '<spring:message code="CSLD_BUNDLE_IS_SET" javaScriptEscape="true"/>';
    domain._messages["CSLD_DATA_SOURCE_IS_SET"]  = '<spring:message code="CSLD_DATA_SOURCE_IS_SET" javaScriptEscape="true"/>';
    domain._messages["CSLD_BUNDLE_REMOVED"]  = '<spring:message code="CSLD_BUNDLE_REMOVED" javaScriptEscape="true"/>';
    domain._messages["CSLD_INVALID_SCHEMA"]  = '<spring:message code="CSLD_INVALID_SCHEMA" javaScriptEscape="true"/>';
    domain._messages["CSLD_SCHEMA_UPLOAD_ERROR"]  = '<spring:message code="CSLD_SCHEMA_UPLOAD_ERROR" javaScriptEscape="true"/>';
    domain._messages["CSLD_SELECT_DS_FROM_REPO"]  = '<spring:message code="CSLD_SELECT_DS_FROM_REPO" javaScriptEscape="true"/>';
    domain._messages["CSLD_SAVE_DS_DIALOG_TITLE"]  = '<spring:message code="CSLD_SAVE_DS_DIALOG_TITLE" javaScriptEscape="true"/>';

    domain._messages['warning'] = '<spring:message code="CSLD_WARNING" javaScriptEscape="true"/>';
    domain._messages['error'] = '<spring:message code="CSLD_ERROR" javaScriptEscape="true"/>';
    domain._messages['validationError'] = '<spring:message code="CSLD_VALIDATION_ERROR" javaScriptEscape="true"/>';
    domain._messages['serverError'] = '<spring:message code="CSLD_SERVER_ERROR" javaScriptEscape="true"/>';
    domain._messages['tooManyDatasources'] = '<spring:message code="CSLD_TOO_MANY_DATASOURCES" javaScriptEscape="true"/>';
    domain._messages['tooManySchemaDatasources'] = '<spring:message code="CSLD_NOT_EHOUGH_DATASOURCES" javaScriptEscape="true"/>';
    domain._messages['uploadSchemaError'] = '<spring:message code="CSLD_SCHEMA_FILE_UPLOAD_ERROR" javaScriptEscape="true"/>';
    domain._messages['schemaFileUploaded1'] = '<spring:message code="CSLD_SCHEMA_FILE_UPLOADED_1" javaScriptEscape="true"/>';
    domain._messages['schemaFileUploaded2'] = '<spring:message code="CSLD_SCHEMA_FILE_UPLOADED_2" javaScriptEscape="true"/>';
    <%--domain._messages['sldsAlreadyExists'] = '<spring:message code="CSLD_SLDS_ALREADY_EXISTS" javaScriptEscape="true"/>';--%>
    domain._messages['CSLD_SLDS_REFERENCED_TO_OTHER_OBJECTS'] = '<spring:message code="CSLD_SLDS_REFERENCED_TO_OTHER_OBJECTS" javaScriptEscape="true"/>';
    domain._messages['createOrUploadTheDesign'] = '<spring:message code="CSLD_DESIGN_FILE_BOX_CREATE_OR_UPLOAD_LABEL" javaScriptEscape="true"/>';
    domain._messages['cannotChangeLocation'] = '<spring:message code="CSLD_CHANGE_LOCATION_ERROR" javaScriptEscape="true"/>';
    domain._messages['tooLongDescription'] = '<spring:message code="CSLD_TOO_LONG_DESCRIPTION" javaScriptEscape="true"/>';
    domain._messages['tooLongName'] = '<spring:message code="CSLD_TOO_LONG_NAME" javaScriptEscape="true"/>';
    domain._messages['notCorrectDesignFileType'] = '<spring:message code="CSLD_NOT_CORRECT_DESIGN_FILE_TYPE" javaScriptEscape="true"/>';
    domain._messages['invalidSchema'] = '<spring:message code="CSLD_INVALID_SCHEMA" javaScriptEscape="true"/>';
    domain._messages['clickHereForDetails'] = '<spring:message code="CSLD_CLICK_HERE_FOR_DETAILS" javaScriptEscape="true"/>';
    domain._messages['CSLD_FOLDER_DOESNT_EXIST'] = '<spring:message code="CSLD_FOLDER_DOESNT_EXIST" javaScriptEscape="true"/>';
    domain._messages['CSLD_DATA_SOURCE_IS_INVALID'] = '<spring:message code="CSLD_DATA_SOURCE_IS_INVALID" javaScriptEscape="true"/>';
    domain._messages['CSLD_ACCESS_DENIED'] = '<spring:message code="CSLD_ACCESS_DENIED" javaScriptEscape="true"/>';
    domain._messages['CSLD_DOMAIN_VALIDATION_ERROR'] = '<spring:message code="CSLD_DOMAIN_VALIDATION_ERROR" javaScriptEscape="true"/>';
    domain._messages['CSLD_SCHEMA_PREFIXES_UPDATED'] = '<spring:message code="CSLD_SCHEMA_PREFIXES_UPDATED" javaScriptEscape="true"/>';
    domain._messages['notCorrectBundleFileType'] = '<spring:message code="CSLD_NOT_CORRECT_BUNDLE_FILE_TYPE" javaScriptEscape="true"/>';
    domain._messages['notSameBaseName'] = '<spring:message code="CSLD_NOT_SAME_BASE_NAME" javaScriptEscape="true"/>';
    domain._messages['bundleAlreadyExists'] = '<spring:message code="CSLD_BUNDLE_ALREADY_EXISTS" javaScriptEscape="true"/>';
    domain._messages['notCorrectSecurityFileType'] = '<spring:message code="CSLD_NOT_CORRECT_SECURITY_FILE_TYPE" javaScriptEscape="true"/>';
    domain._messages['notCorrectSecurityFileUri'] = '<spring:message code="CSLD_NOT_CORRECT_SECURITY_FILE_URI" javaScriptEscape="true"/>';

    domain._messages['bundleUploadError'] = '<spring:message code="CSLD_BUNDLE_UPLOAD_ERROR" javaScriptEscape="true"/>';
    domain._messages['securityUploadError'] = '<spring:message code="CSLD_SECURITY_UPLOAD_ERROR" javaScriptEscape="true"/>';

    domain._messages['sldsAlreadyExists'] = '<spring:message code="CSLD_SLDS_ALREADY_EXISTS" javaScriptEscape="true"/>';
    domain._messages['CSLD_SLDS_REFERENCED_TO_OTHER_OBJECTS'] = '<spring:message code="CSLD_SLDS_REFERENCED_TO_OTHER_OBJECTS" javaScriptEscape="true"/>';
    domain._messages["ok"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_OK" javaScriptEscape="true"/>';
    domain._messages["cancel"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_CANCEL" javaScriptEscape="true"/>';
    domain._messages["yes"]  = '<spring:message code="button.designer.yes" javaScriptEscape="true"/>';
    domain._messages["no"]  = '<spring:message code="button.designer.no" javaScriptEscape="true"/>';    
    
    domain._messages["resourceIdDuplicate"]  = '<spring:message code="CSLD_DUPLICATE_RESOURCE_ID" javaScriptEscape="true"/>';

    domain._messages['ITEM_BEING_USED_BY_RESOURCE'] ='<spring:message code="ITEM_BEING_USED_BY_RESOURCE" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['resource.label'] ='<spring:message code="jsp.listResources.resource" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['field.label'] ='<spring:message code="DD_ITEM_PROPERTY_DIMENSION" javaScriptEscape="true"/>'.replace(/''/g, "'");
    domain._messages['resourcesWithNoAccess'] = '<spring:message code="DOMAIN_DEPENDENCY_NO_ACCES_TO_RESOURCE" javaScriptEscape="true"/>'.replace(/''/g, "'");

    domain.wizard.organizationId = '${organizationId}';
    domain.wizard.publicFolderUri = '${publicFolderUri}';

    domain.wizard.firstLoad = ${isItFirstLoad};
    domain.wizard.isSchemaSet = ${isSchemaSet};
    domain.wizard.schemaDesignFileName = '${schemaDesignFileName}';
    domain.wizard.mode = '${mode}';
    domain.wizard.slLocation = '${slLocation}';
    domain.wizard.selectedDatasourcesUri = JSON.parse('${selectedDatasourcesJSONArray}');

    domain.wizard.securityFile = 
            <c:choose>
                <c:when test="${slSecurityFile == null}">
                    null;
                </c:when>
                <c:otherwise>
                    "${slSecurityFile}";
                </c:otherwise>
            </c:choose>
    domain.wizard.bundles = JSON.parse('${slBundles}');

    domain.wizard.flowExecutionKey = '${flowExecutionKey}';

    domain.wizard.allowDesignerCloseWithValidationErrors = ${domainDependentsDontBlock};

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    localContext.initOptions = {
        resourceIdNotSupportedSymbols: "${resourceIdNotSupportedSymbols}"
    };

    if (typeof resource === "undefined") {
        resource = {};
    }

    if (typeof resource.messages === "undefined") {
        resource.messages = {};
    }

    resource.messages["labelToLong"] = '<spring:message code="CSLD_TOO_LONG_NAME" javaScriptEscape="true"/>';
    resource.messages["labelIsEmpty"] = '<spring:message code="CSLD_EMPTY_NAME" javaScriptEscape="true"/>';
    resource.messages["resourceIdToLong"] = '<spring:message code="CSLD_TOO_LONG_RESOURCE_ID" javaScriptEscape="true"/>';
    resource.messages["resourceIdIsEmpty"] = '<spring:message code="CSLD_EMPTY_NAME" javaScriptEscape="true"/>';
    resource.messages["resourceIdInvalidChars"] = '<spring:message code="CSLD_INVALID_RESOURCE_ID" javaScriptEscape="true"/>';
    resource.messages["descriptionToLong"] = '<spring:message code="CSLD_TOO_LONG_DESCRIPTION" javaScriptEscape="true"/>';
    resource.messages["descriptionToLong"] = '<spring:message code="CSLD_TOO_LONG_DESCRIPTION" javaScriptEscape="true"/>';

    if (typeof __jrsConfigs__.domainDesigner === "undefined") {
        __jrsConfigs__.domainDesigner = {};
    }

    // save references to variables defined in state
    __jrsConfigs__.domainDesigner.domain = domain;
    __jrsConfigs__.domainDesigner.resource = resource;
    __jrsConfigs__.domainDesigner.localContext = localContext;
</script>
</js:out>