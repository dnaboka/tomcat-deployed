<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>
<%@ page import="com.jaspersoft.ji.license.LicenseCheckStatus" %>

<%@ taglib prefix="spring" uri="/spring" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<tiles:insertTemplate template="/WEB-INF/jsp/templates/aboutBox.jsp">
    <tiles:putAttribute name="containerClass" value="hidden centered_vert centered_horz"/>
    <tiles:putAttribute name="bodyContent">
        <%
            LicenseManager licenseManager = LicenseManager.getInstance();
            LicenseCheckStatus licenseCheckStatus = licenseManager.checkLicense();

            if (!licenseCheckStatus.isLicenseAccepted()) { %>
        <p class="message"><%=licenseCheckStatus.getMessage()%></p>
        <%  } else { %>
            <p class="message"><spring:message code='NAV_146_ABOUT_LICENSE_PRODUCT_EDITION'/>:&nbsp;<span class="emphasis"><%= licenseManager.getProductEditionName() %></span></p>
            <%  String supportedFeatureNames = licenseManager.getSupportedFeatureNames();
                if (supportedFeatureNames != null) {    %>
            <p class="message"><spring:message code="NAV_147_ABOUT_LICENSE_FEATURES"/>: <span class="emphasis"><%=supportedFeatureNames%></span></p>
            <%  }   %>
            <p class="message"><spring:message code="dialog.aboutBox.productVersion"/>: <span class="emphasis"><spring:message code='PRO_VERSION'/></span></p>
            <p class="message"><spring:message code="dialog.aboutBox.build"/>: <span class="emphasis"><spring:message code='BUILD_DATE_STAMP'/>_<spring:message code='BUILD_TIME_STAMP'/></span></p>
            <%
                String licenseType;
                if (licenseManager.isDevelopmentEnvironmentType()) {
                    licenseType = LicenseManager.ENV_TYPE_DEVELOPMENT;
                } else {
                    licenseType = licenseManager.getLicenseTypeString();
                }
            %>
            <p class="message"><spring:message code="NAV_142_ABOUT_LICENSE_TYPE"/>: <span class="emphasis"><%=licenseType%></span></p>
            <p class="message"><spring:message code="NAV_143_ABOUT_LICENSE_EXPIRATION"/>: <span class="emphasis"><%=licenseManager.getFormattedExpirationDate()%></span></p>
        <%  } %>

    </tiles:putAttribute>
</tiles:insertTemplate>