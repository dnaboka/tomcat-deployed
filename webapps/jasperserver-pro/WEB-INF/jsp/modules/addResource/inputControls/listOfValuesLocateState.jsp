<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc.
  ~ http://www.jaspersoft.com.
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU Affero General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU Affero General Public License for more details.
  ~
  ~ You should have received a copy of the GNU Affero General Public License
  ~ along with this program.  If not, see <https://www.gnu.org/licenses/>.
  --%>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>
<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove
    if (typeof resourceListOfValuesLocate === "undefined") {
        resourceListOfValuesLocate = {};
    }

    if (typeof resourceListOfValuesLocate.messages === "undefined") {
        resourceListOfValuesLocate.messages = {};
    }

    resourceListOfValuesLocate.messages["resource.ListOfValuesLocate.Title"] = '<spring:message code="resource.ListOfValuesLocate.Title" javaScriptEscape="true"/>';

    __jrsConfigs__.resourceListOfValuesLocate = resourceListOfValuesLocate;

</script>