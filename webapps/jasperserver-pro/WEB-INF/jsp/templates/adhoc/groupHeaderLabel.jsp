<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<t:useAttribute name="headerClass" id="headerClass" classname="java.lang.String" ignore="false"/>
<t:useAttribute name="id" id="id" classname="java.lang.String" ignore="false"/>
<t:useAttribute name="levelName" id="levelName" classname="java.lang.String" ignore="false"/>
<t:useAttribute name="dimensionName" id="dimensionName" classname="java.lang.String" ignore="false"/>
<t:useAttribute name="isExpandable" id="isExpandable" classname="java.lang.Boolean" ignore="false"/>
<t:useAttribute name="isLevelExpanded" id="isLevelExpanded" classname="java.lang.Boolean" ignore="false"/>
<t:useAttribute name="cellContent" id="cellContent" classname="java.lang.String" ignore="false"/>
<t:useAttribute name="rowspan" id="rowspan" classname="java.lang.Long" ignore="true"/>
<t:useAttribute name="colspan" id="colspan" classname="java.lang.Long" ignore="true"/>

<th
    class="${headerClass}"
    id="${id}"
    data-level="${levelName}"
    data-dimension="${dimensionName}"
    data-expanable="${isExpandable}"
    <c:if test="${rowspan != null}">rowspan="${rowspan}"</c:if>
    <c:if test="${colspan != null}">colspan="${colspan}"</c:if>>

    <c:if test="${isExpandable}">
        <span class="button disclosure icon ${isLevelExpanded ? 'open' : 'closed'}"></span>
    </c:if>
    ${cellContent}
</th>

<!-- ${sessionScope.XSS_NONCE} do not remove -->