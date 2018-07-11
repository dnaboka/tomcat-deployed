<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<script id="tableState" type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    localContext.hasNodata = ${viewModel.hasNoData};
    localContext.columns = ${viewModel.columnsJSON};
    localContext.groups = ${viewModel.groupsJSON};
    localContext.sortFields = ${viewModel.sortFieldsJSON};
    localContext.summarizedFields = ${viewModel.summarizedColumnsJSON};
    localContext.fieldsInUse = ${viewModel.fieldsInUseJSON};
    localContext.endOfFile = ${viewModel.allDataFetched};
    localContext.lastCalcFieldAdded = ${viewModel.lastCalcFieldAddedJSON};
    ROW_SIZE_TO_TRIGGER_SCROLLBAR = ${viewModel.rowSizeToTriggerScrollbar};
    localContext.reportMenuTitle = '<spring:message code="ADH_019a_MENU_REPORT_TITLE_TABLE" javaScriptEscape="true"/>';
    localContext.messages = {};
    localContext.messages['cantAddSet'] = '<spring:message code="ADH_109_CANT_ADD_SET" javaScriptEscape="true"/>';
</script>