<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<script id="adHocConstants" type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove
    <js:out javaScriptEscape="true">
    __jrsConfigs__.adhoc.adhocDesigner = __jrsConfigs__.adhoc.adhocDesigner || {};
    __jrsConfigs__.adhoc.adhocDesigner.ROW_SIZE_TO_TRIGGER_SCROLLBAR = ${viewModel.rowSizeToTriggerScrollbar};
    __jrsConfigs__.adhoc.adhocDesigner.DATE_FORMAT = "${viewModel.dateFormat}";
    __jrsConfigs__.adhoc.adhocDesigner.CALENDAR_DATE_FORMAT = "${viewModel.calendarDateFormat}";
    <js:out escapeScript="false">
    __jrsConfigs__.adhoc.adhocDesigner.VALIDATION_DATE_PATTERN = new RegExp(${viewModel.validationDatePattern});
    __jrsConfigs__.adhoc.adhocDesigner.VALIDATION_DATETIME_PATTERN = new RegExp(${viewModel.validationDateTimePattern});
    </js:out>
    __jrsConfigs__.adhoc.adhocDesigner.CALENDAR_TIME_FORMAT = "${viewModel.calendarTimeFormat}";    
    </js:out>
</script>
