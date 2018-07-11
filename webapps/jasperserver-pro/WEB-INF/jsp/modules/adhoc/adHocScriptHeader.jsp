<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>

<%@include file="../common/designerMessages.jsp"%>

<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>
<%@ page import="com.jaspersoft.ji.license.LicenseCheckStatus" %>

<%--These varables need to be loaded first--%>
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    //Spring variables
    var multipleFieldsMessage = '<spring:message code="ADH_096_MULTIPLE_FIELDS" javaScriptEscape="true"/>';
    var multipleColumnsMessage = '<spring:message code="ADH_096_MULTIPLE_COLUMNS" javaScriptEscape="true"/>';
    var ALL_DEFAULT = '<spring:message code="ADH_1211_DYNAMIC_FILTER_COMPARISON_OPERATOR_ALL" javaScriptEscape="true"/>';
    var xtabFilterMenu = '<spring:message code="ADH_1210_DYNAMIC_FILTER_TITLE" javaScriptEscape="true"/>';
    var saveConfirmation = "<spring:message code='ADH_107_SAVE_CONFIRMATION' javaScriptEscape='true'/>";
    //Error messages
    var addFilterErrorMessage = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE' javaScriptEscape='true'/>";
    var addFilterErrorMessageMeasureAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_MEASURE_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessageAllLevelAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_ALL_LEVEL_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessageGroupAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_GROUP_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessageSpacerAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_SPACER_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessagePercentOfParentCalcFieldAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_PERCENT_OF_PARENT_CALC_FIELD_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessageConstantAdd = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_CONSTANT_ADD' javaScriptEscape='true'/>";
    var addFilterErrorMessageAnotherHierarchy = "<spring:message code='ADH_1224_DYNAMIC_FILTER_ERR_MESSAGE_ANOTHER_HIERARCHY' javaScriptEscape='true'/>";
    var noColumnsAddedMessage = "<spring:message code='ADH_164_NO_COLUMNS_ADDED_MESSAGE' javaScriptEscape='true'/>";
    var ajaxError = "<spring:message code='ADH_1001_SERVER_COMMUNICATION_ERROR' javaScriptEscape='true'/>";
    var ajaxErrorHeader = "<spring:message code='ADH_1001_SERVER_COMMUNICATION_ERROR_HEADER' javaScriptEscape='true'/>";
    var errorAddTpGroups = "<spring:message code='ADH_1001_ERROR_ADD_TO_GROUPS' javaScriptEscape='true'/>";
    //dynamic filtering error
    var dynamicFilterInputError = "<spring:message code='ADH_1216_DYNAMIC_FILTER_NUMERIC_INPUT_ERROR' javaScriptEscape='true'/>";
    //Notification messages
    var adHocSessionExpireCode = "<spring:message code='ADH_107_DESIGNER_SESSION_EXPIRATION' javaScriptEscape='true'/>";
    var adHocExitConfirmation = "<spring:message code='ADH_107_DESIGNER_EXIT' javaScriptEscape='true'/>";
    var noTopicsMessage = "<spring:message code='ADH_117a_NO_TOPICS' javaScriptEscape='true'/>";
    //pretty names for functions
    var functionMap = {'Highest':'<spring:message code="ADH_071_MENU_MAXIMUM" javaScriptEscape="true"/>', 'Lowest':'<spring:message code="ADH_072_MENU_MINIMUM" javaScriptEscape="true"/>','Average':'<spring:message code="ADH_073_MENU_AVERAGE" javaScriptEscape="true"/>','Sum':'<spring:message code="ADH_074_MENU_SUM" javaScriptEscape="true"/>','DistinctCount':'<spring:message code="ADH_163_MENU_COUNT_DISTINCT" javaScriptEscape="true"/>','Count':'<spring:message code="ADH_075_MENU_COUNT_ALL" javaScriptEscape="true"/>'};
    //no summary indicator
    var noSummaryLabel = '<spring:message code="ADH_078_MENU_NO_SUMMARY" javaScriptEscape="true"/>';
    var filtersWaitMessage = '<spring:message code="ADH_184_FILTERS_WAIT_MESSAGE" javaScriptEscape="true"/>';
    var missingICMessage = '<spring:message code="ADH_186_FILTERS_MISSING_IC" javaScriptEscape="true"/>';
    // re-entrance message
    var disabledFolderTooltip = '<spring:message code="ADH_106_DISABLED_FOLDER_TOOLTIP" javaScriptEscape="true"/>';
    var rowLimitMessage = '<spring:message code="ADH_294_HIT_ROW_LIMIT_SHORT_NOTIFICATION"  javaScriptEscape="true"/>';
	var itemsSelectedSuffix = '<spring:message code="ADH_055_ITEMS_SELECTED" javaScriptEscape="true"/>';
    var hasVisibleInputControls = "${requestScope.hasVisibleInputControls}";
    var reportForceControlsOnStart = "${requestScope.reportForceControlsOnStart}";
    var moreValuesLabel = '<spring:message code="ADH_1229_DYNAMIC_FILTER_ADVANCED_MORE" javaScriptEscape="true"/>';
    var layoutManagerLabels = {
        column: {
            table: '<spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>',
            ichart: '<spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>',
            olap_ichart: '<spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>',
            crosstab: '<spring:message code="ADH_1213_DISPLAY_MANAGER_COLUMNS_TITLE"/>'
        },
        row: {
            table: '<spring:message code="ADH_1213_DISPLAY_MANAGER_GROUPS_TITLE"/>',
            ichart: '<spring:message code="ADH_1213_DISPLAY_MANAGER_ROWS_TITLE"/>',
            olap_ichart: '<spring:message code="ADH_1213_DISPLAY_MANAGER_ROWS_TITLE"/>',
            crosstab: '<spring:message code="ADH_1213_DISPLAY_MANAGER_ROWS_TITLE"/>'
        }
    };
    <js:out javaScriptEscape="true">
    //dummy vars in case IE loses race condition
    var toolbarButtonModule;
    var tabModule;
    var dashboard;
    var defaultTopic = "${defaultTopic}";
    var defaultTopicDir = "${defaultTopicDir}";
    var urlContext = "${pageContext.request.contextPath}";
    var startTopic = "${startTopic}";
    var serverTimeoutInterval = ${serverTimeoutInterval};
    var localContext = window; //default context until we de-globalize
    //filters
    var addFilterWidgetByDefault = ${addFilterWidgetByDefault};
    var filterAutoSubmitTimer = ${filterAutoSubmitTimer};
    // Init root object modifier variables.
    var organizationId = "${organizationId}";
    var publicFolderUri = "${publicFolderUri}";
    // init flowExecutionKey for use in ajax
    var flowExecutionKey = "${flowExecutionKey}";
    var selectedThemeId = "${requestScope.viewModel.theme}";
    var saveFolder = "${requestScope.aruFolder}";
    var saveUri = "${requestScope.aruUri}";
    var saveLabel = "${requestScope.aruLabel}";
    var saveDesc = "${requestScope.aruDesc}";
    // default save name (if new)
    var defaultSaveName = "${requestScope.defaultAruName}";
    var defaultReportSuffix = '<spring:message code="dialog.generateResource.defaultNameSuffix" javaScriptEscape="true"/>';
    //put default masks in an array
    var defaultMasks = new Array();
    defaultMasks['int']="#,##0";
    defaultMasks['dec']="#,##0.00";
    defaultMasks['date']="medium,hide";
    // parameters
    var usingAdhocLauncher = '${param.adhocLauncher}';
    <c:if test="${requestScope.formulaDistribution != null}">
        // formulas by types
        __jrsConfigs__.adhocFormulaDistribution = '${requestScope.formulaDistribution}';
    </c:if>
    // numeric separators
    var decimalSeparator = '${requestScope.decimalSeparatorForUserLocale}';
    var groupingSeparator = "${requestScope.groupingSeparatorForUserLocale}";
    //launch type
    var launchType = "${param.launchType}";
    var isDomainType = null;
    <c:choose>
        <c:when test="${requestScope.isItDomainReport}">
            isDomainType = true;
        </c:when>
        <c:otherwise>
            isDomainType = false;
        </c:otherwise>
    </c:choose>
    var constantFieldsLevel = "${constant_fields_level}";
    var isAnalysisFeatureSupported = "${isAnalysisFeatureSupported}";
    var isDesignView = "${isDesignView}" === "true";
    var clientKey = "${clientKey}";

    var reportUnitURI = "${reportURI}";

    if (typeof __jrsConfigs__.Report === "undefined") {
        __jrsConfigs__.Report = {}; // prepare variable to store all intermediate variables
    }

    __jrsConfigs__.Report.reportUnitURI = reportUnitURI;

    var alreadyEditing = false;
    <c:if test='${param.alreadyEditing}'>
        alreadyEditing = true;
    </c:if>

    var isEmbeddedDesigner = "${isEmbeddedDesigner}" === "true";
    var embeddedName = "${embeddedName}";
    var embeddedSaveAsUri = "${embeddedSaveAsUri}";
    var embeddedSaveAsOverwrite = "${embeddedSaveAsOverwrite}" === "true";
    </js:out>
</script>

