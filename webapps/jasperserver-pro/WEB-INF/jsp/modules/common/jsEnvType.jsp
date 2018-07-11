<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%
    LicenseManager licenseManager = LicenseManager.getInstance();
    request.setAttribute("isDevelopmentEnvironmentType", licenseManager.isDevelopmentEnvironmentType());
%>