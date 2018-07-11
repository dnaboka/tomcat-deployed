<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<script type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove

    if (typeof Administer === "undefined"){
        Administer = {
            _messages: {}
        };
    }


    Administer.flowExecutionKey = '${flowExecutionKey}';


    // Analysis and Designer Options messages
    Administer._messages["JAM_018_ERROR"]  = '<spring:message code="JAM_018_ERROR" javaScriptEscape="true"/>';
    Administer._messages["JAM_019_WHOLE_NUMBER_ERROR"]  = '<spring:message code="JAM_019_WHOLE_NUMBER_ERROR" javaScriptEscape="true"/>';
    Administer._messages["JAM_020_RATIO_NUMBER_ERROR"]  = '<spring:message code="JAM_020_RATIO_NUMBER_ERROR" javaScriptEscape="true"/>';
    Administer._messages["JAM_048_ZERO_OR_GREATER"]  = '<spring:message code="JAM_048_ZERO_OR_GREATER" javaScriptEscape="true"/>';
    Administer._messages["JAM_049_ONE_OR_GREATER"]  = '<spring:message code="JAM_049_ONE_OR_GREATER" javaScriptEscape="true"/>';
    Administer._messages["JAM_050_ONE_TO_99"]  = '<spring:message code="JAM_050_ONE_TO_99" javaScriptEscape="true"/>';
    Administer._messages["JAM_051_INVALID_CLASS"]  = '<spring:message code="JAM_051_INVALID_CLASS" javaScriptEscape="true"/>';
    Administer._messages["JAM_056_UPDATED"]  = '<spring:message code="JAM_056_UPDATED" javaScriptEscape="true"/>';
    Administer._messages["JAM_057_DONE"]  = '<spring:message code="JAM_057_DONE" javaScriptEscape="true"/>';

    // Ad Hoc Cache messages
    Administer._messages["ADH_270_CACHE_QUERY_CLEARED"]  = '<spring:message code="ADH_270_CACHE_QUERY_CLEARED" javaScriptEscape="true"/>';
    Administer._messages["ADH_270_CACHE_NO_QUERY_FOUND"]  = '<spring:message code="ADH_270_CACHE_NO_QUERY_FOUND" javaScriptEscape="true"/>';
    Administer._messages["ADH_270_CACHE_All_CLEARED"]  = '<spring:message code="ADH_270_CACHE_All_CLEARED" javaScriptEscape="true"/>';

    Administer.urlContext = "${pageContext.request.contextPath}";
</script>
