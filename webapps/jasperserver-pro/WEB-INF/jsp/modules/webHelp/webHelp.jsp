<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<!--
 Utility for serving up Online Help Pages in a hosted environment
-->

<script type="text/javascript" >
 // ${sessionScope.XSS_NONCE} do not remove

    var webHelpModuleState = {};

    // Commented out because it is a work in progress. The architect will sort it out
    webHelpModuleState.contextMap = <%= WebHelpLookup.getInstance().getHelpContextMapAsJSON() %>;
    webHelpModuleState.hostURL = '<%= WebHelpLookup.getInstance().getHostURL() %>';
    webHelpModuleState.pagePrefix = '<%= WebHelpLookup.getInstance().getPagePrefix() %>';
</script>
