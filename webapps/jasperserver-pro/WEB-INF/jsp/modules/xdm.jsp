<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<!--
* Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
* http://www.jaspersoft.com.
*
* Unless you have purchased  a commercial license agreement from Jaspersoft,
* the following license terms  apply:
*
* This program is free software: you can redistribute it and/or  modify
* it under the terms of the GNU Affero General Public License  as
* published by the Free Software Foundation, either version 3 of  the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero  General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public  License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
-->

<jsp:include page="setScriptOptimizationProps.jsp"/>

<!DOCTYPE html>
<html>
<head>
    <!-- ${sessionScope.XSS_NONCE} do not remove -->


    <%@ include file="common/jsEdition.jsp" %>

        <script type="text/javascript" src="${scriptsUri}/bower_components/requirejs/require.js"></script>
        <script type="text/javascript" src="${scriptsUri}/require.config.js"></script>

        <c:if test="${param['logEnabled'] == 'true'}">
            <script type="text/javascript">
                requirejs.config({
                    config: {
                        logger: {enabled: true}
                    }
                });

                <c:if test="${param['logLevel'] != null}">
                requirejs.config({
                    config: {
                        logger: {level: "${param['logLevel']}"}
                    }
                });
                </c:if>
            </script>
        </c:if>

    <script type="text/javascript">
        // ${sessionScope.XSS_NONCE} do not remove

        requirejs.config({
            baseUrl: "${scriptsUri}"
        });
        requirejs(["xdmRemote/xdmRemoteMain"]);
    </script>

</head>
<body></body>
</html>
