<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>
<%--These varables need to be loaded first--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

{
    "decimalSeparator":"${requestScope.decimalSeparatorForUserLocale}",
    "groupingSeparator":"${requestScope.groupingSeparatorForUserLocale}",
    "selectedThemeId":"${requestScope.viewModel.theme}",
    "viewType":"${requestScope.viewModel.viewType}",

    "flowExecutionKey": "${flowExecutionKey}",
    "clientKey":"${clientKey}",
    "serverTimeoutInterval":${serverTimeoutInterval},
    "addFilterWidgetByDefault":${addFilterWidgetByDefault},
    "filterAutoSubmitTimer":${filterAutoSubmitTimer},
    "organizationId":"${organizationId}",
    "publicFolderUri":"${publicFolderUri}",
    "constantFieldsLevel":"${constant_fields_level}",
    "isAnalysisFeatureSupported":${isAnalysisFeatureSupported},

    "usingAdhocLauncher":"${param.adhocLauncher}",

    "adhocActionModel":${viewModel.clientActionModelDocument}
}