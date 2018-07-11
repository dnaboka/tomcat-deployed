<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%--<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_custom.css"/>" type="text/css" media="screen"/>--%>

<!-- These resources only needed for dash in dash -->
<c:if test='${!empty param.viewAsDashboardFrame && param.viewAsDashboardFrame != "false"}'>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/runtime/${jsOptimizationProperties.runtimeHash}/themes/reset.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="themeMinimal.css"/>" type="text/css" media="all,print"/>

	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="jasper-ui/jasper-ui.css"/>" type="text/css" media="all,print"/>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="jquery-ui/jquery-ui.css"/>" type="text/css" media="all,print"/>

    <!--[if IE]>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_ie.css"/>" type="text/css" media="screen"/>
<![endif]-->

	<style type="text/css">
		body {background:#fff;}
		.hidden {display:none;}
		.column.decorated.primary {border:none;border-radius:0;}
		.column.decorated.primary>.corner,
		.column.decorated.primary>.edge,
		/*.column.decorated.primary>.content>.header,*/
		.column.decorated.primary>.content .title,
		.column.decorated.primary>.content>.footer {
			display:none !important;
		}

		.column.decorated.primary,
		.column.decorated.primary>.content,
	    .column.decorated.primary>.content>.body {
			top:0;
			bottom:0;
			left:0;
			right:0;
			margin:0;
		}

		#display {overflow: visible;}

		#pageDimmer {
			position: absolute;
			top:0;
			left:0;
			right:0;
			bottom: 0;
			background-color: #000;
			opacity:.6;
		}

        #title {
            display: block;
            top: 0 !important;
        }

        #dashboardViewerFrame {
            position: relative;
            top: 0;
        }

        #dashboardViewerFrame.withTitle {
            top: 35px !important;
        }

		@media print {
			.floatingMenuContainer {
    			display:none;
			}
			#button_print {
				display:none;
			}
		}
	</style>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_custom.css"/>" type="text/css" media="screen"/>
    <script type="text/javascript">
        if (typeof __jrsConfigs__.dashboardRuntime == "undefined") {
            __jrsConfigs__.dashboardRuntime = {};
        }
        __jrsConfigs__.dashboardRuntime.isRunInFrame = true;
	</script>
</c:if>

<%-- common input control imports --%>
<%@ include file="../inputControls/InputControlConstants.jsp"%>
<%@ include file="../inputControls/InputControlTemplates.jsp"%>
