<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<html>
<!-- ${sessionScope.XSS_NONCE} do not remove -->
<center><h1>Error</h1></center>
<table width=100% height=100% bgcolor="#ffaa22">
<tr><td>
<%= request.getAttribute("error") %>
</td></tr>
</table>
</html>


 