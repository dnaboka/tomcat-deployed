<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
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

    domain._messages["exitMessage"]  = '<spring:message code="domain.designer.exitMessage" javaScriptEscape="true"/>';
    domain._messages["designIsValid"]  = '<spring:message code="domain.designer.designIsValid" javaScriptEscape="true"/>';
    domain._messages["yes"]  = '<spring:message code="button.designer.yes" javaScriptEscape="true"/>';
    domain._messages["no"]  = '<spring:message code="button.designer.no" javaScriptEscape="true"/>';
    domain._messages["ok"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_OK" javaScriptEscape="true"/>';
    domain._messages["cancel"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_CANCEL" javaScriptEscape="true"/>';

    domain._messages['Max'] = '<spring:message code="ADH_071_MENU_MAXIMUM" javaScriptEscape="true"/>';
    domain._messages['Min'] = '<spring:message code="ADH_072_MENU_MINIMUM" javaScriptEscape="true"/>';
    domain._messages['Average'] = '<spring:message code="ADH_073_MENU_AVERAGE" javaScriptEscape="true"/>';
    domain._messages['Sum']  = '<spring:message code="ADH_074_MENU_SUM" javaScriptEscape="true"/>';
    domain._messages['StdDevP'] = '<spring:message code="ADH_074_MENU_STD_DEV_P" javaScriptEscape="true"/>';
    domain._messages['StdDevS'] = '<spring:message code="ADH_074_MENU_STD_DEV_S" javaScriptEscape="true"/>';
    domain._messages['Mode'] = '<spring:message code="ADH_074_MENU_MODE" javaScriptEscape="true"/>';
    domain._messages['Median'] = '<spring:message code="ADH_074_MENU_MEDIAN" javaScriptEscape="true"/>';
    domain._messages['Range'] = '<spring:message code="ADH_074_MENU_RANGE" javaScriptEscape="true"/>';

    domain._messages['RangeMinutes']  = '<spring:message code="ADH_074_MENU_RANGE_MINUTES" javaScriptEscape="true"/>';
    domain._messages['RangeHours'] = '<spring:message code="ADH_074_MENU_RANGE_HOURS" javaScriptEscape="true"/>';
    domain._messages['RangeDays'] = '<spring:message code="ADH_074_MENU_RANGE_DAYS" javaScriptEscape="true"/>';
    domain._messages['RangeWeeks'] = '<spring:message code="ADH_074_MENU_RANGE_WEEKS" javaScriptEscape="true"/>';
    domain._messages['RangeMonths'] = '<spring:message code="ADH_074_MENU_RANGE_MONTHS" javaScriptEscape="true"/>';
    domain._messages['RangeQuarters'] = '<spring:message code="ADH_074_MENU_RANGE_QUARTERS" javaScriptEscape="true"/>';
    domain._messages['RangeSemis'] = '<spring:message code="ADH_074_MENU_RANGE_SEMIS" javaScriptEscape="true"/>';
    domain._messages['RangeYears'] = '<spring:message code="ADH_074_MENU_RANGE_YEARS" javaScriptEscape="true"/>';

    domain._messages['CountDistinct'] = '<spring:message code="ADH_163_MENU_COUNT_DISTINCT" javaScriptEscape="true"/>';
    domain._messages['CountAll'] = '<spring:message code="ADH_075_MENU_COUNT_ALL" javaScriptEscape="true"/>';
    domain._messages['None'] = '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>';
    domain._messages['Dimension'] = '<spring:message code="DD_ITEM_PROPERTY_DIMENSION" javaScriptEscape="true"/>';
    domain._messages['Measure'] = '<spring:message code="DD_ITEM_PROPERTY_MEASURE" javaScriptEscape="true"/>';

    domain._messages['field.empty'] = '<spring:message code="domain.designer.error.field.empty" javaScriptEscape="true"/>';
    domain._messages['id.invalid'] = '<spring:message code="domain.designer.error.id.invalid" javaScriptEscape="true"/>';
    domain._messages['id.startFromNumber'] = '<spring:message code="domain.designer.error.id.startFromNumber" javaScriptEscape="true"/>';
    domain._messages['itemNameKey.invalid'] = '<spring:message code="domain.designer.error.itemNameKey.invalid" javaScriptEscape="true"/>';
    domain._messages['itemDescriptionKey.invalid'] = '<spring:message code="domain.designer.error.itemDescriptionKey.invalid" javaScriptEscape="true"/>';
    domain._messages['field.invalid'] = '<spring:message code="domain.designer.error.field.invalid" javaScriptEscape="true"/>';
    domain._messages['item.exists'] = '<spring:message code="domain.designer.error.item.exists" javaScriptEscape="true"/>';
    domain._messages['items.fromDifferentDataIslands'] = '<spring:message code="domain.designer.error.items.fromDifferentDataIslands" javaScriptEscape="true"/>';

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
        jsonJoins: JSON.parse('${joinsJSON}'),
        datasourcesProperties: JSON.parse('${datasourcesProperties}'),
        presentationSelected: ${presentationSelected},
        dataSourceId: '${selectedDatasource}',
        usedTablesByItemId: JSON.parse('${tablesUsedForRulesByItemId}'),
        typesMap: JSON.parse('${typesMap}'),
        fieldJavaTypes: JSON.parse('[${ddFiledJavaTypes}]'),
        joinTreeModel: JSON.parse('${joinTreeModel}'),
        designerMode: '${designerMode}',
        dontWarnOfDeleteItems: '${dontWarnOfDeleteItems}',
        unsavedChangesPresent: ${unsavedChangesPresent},
        allowDesignerCloseWithValidationErrors: ${domainDependentsDontBlock}
    };

    var opts = localContext.domainInitOptions;

    // Default mask setup
    opts.defaultMasks = [];
    opts.defaultMasks['int'] = [{'value':'none','label': '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>'}];
    opts.defaultMasks['dec'] = [{'value':'none','label': '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>'}];
    opts.defaultMasks['date'] = [{'value':'none','label': '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>'}];
    opts.defaultMasks['timestamp'] = [{'value':'none','label': '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>'}];
    opts.defaultMasks['time'] = [{'value':'none','label': '<spring:message code="domain.designer.display.none" javaScriptEscape="true"/>'}];
    opts.defaultMasks['NaN'] = [];

   <c:forEach var="m" items="${sessionScope['maskMap']['int']}">
     opts.defaultMasks['int'].push({'value':'${m.key}','label':'${m.value}'.replace(/&nbsp;/g,' ')});
   </c:forEach>

   <c:forEach var="m" items="${sessionScope['maskMap']['dec']}">
     opts.defaultMasks['dec'].push({'value':'${m.key}','label':'${m.value}'.replace(/&nbsp;/g,' ')});
   </c:forEach>

   <c:forEach var="m" items="${sessionScope['maskMap']['date']}">
     opts.defaultMasks['date'].push({'value':'${m.key}','label':'${m.value}'.replace(/&nbsp;/g,' ')});
   </c:forEach>

   <c:forEach var="m" items="${sessionScope['maskMap']['timestamp']}">
     opts.defaultMasks['timestamp'].push({'value':'${m.key}','label':'${m.value}'.replace(/&nbsp;/g,' ')});
   </c:forEach>

   <c:forEach var="m" items="${sessionScope['maskMap']['time']}">
     opts.defaultMasks['time'].push({'value':'${m.key}','label':'${m.value}'.replace(/&nbsp;/g,' ')});
   </c:forEach>

    if (typeof __jrsConfigs__.domainDesigner === "undefined") {
        __jrsConfigs__.domainDesigner = {};
    }

    // save references to variables defined in state
    __jrsConfigs__.domainDesigner.domain = domain;
    __jrsConfigs__.domainDesigner.localContext = localContext;

</script>
</js:out>