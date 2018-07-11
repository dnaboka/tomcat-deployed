<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code="menu.adhoc.cache"/></t:putAttribute>
    <t:putAttribute name="bodyID" value="designerCache"/>
    <t:putAttribute name="bodyClass" value="twoColumn"/>
    <t:putAttribute name="moduleName" value="administerPro/administerAdhocCacheMain"/>
    <t:putAttribute name="headerContent">
        <%@ include file="administerState.jsp" %>
	</t:putAttribute>
    <t:putAttribute name="bodyContent">
		<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
            <t:putAttribute name="containerID" value="settings"/>
		    <t:putAttribute name="containerClass" value="column decorated primary"/>
		    <t:putAttribute name="containerTitle"><spring:message code="menu.adhoc.cache"/></t:putAttribute>
		    <t:putAttribute name="headerContent">
                <ul id="sortMode" class="list tabSet text control horizontal">
                    <li id="sortMode_item1" class="label first" tabindex="-1" disabled="disabled"><p
                            class="wrap button"><spring:message code="SEARCH_SORT_BY"/>:</p></li>
                    <li id="age" class="tab selected" tabindex="-1"><p class="wrap button"><spring:message code="ADH_270_CACHE_SORTING_AGE"/></p></li>
                    <li id="idle" class="tab" tabindex="-1"><p class="wrap button"><spring:message code="ADH_270_CACHE_SORTING_IDLE"/></p></li>
                    <li id="memUsed" class="tab" tabindex="-1"><p class="wrap button"><spring:message code="ADH_270_CACHE_SORTING_MEMORY"/></p></li>
                    <li id="dataSourceURI" class="tab last" tabindex="-1"><p class="wrap button"><spring:message code="ADH_270_CACHE_SORTING_DATASOURCE"/></p></li>
                </ul>
            </t:putAttribute>
		    <t:putAttribute name="bodyClass" value=""/>
		    <t:putAttribute name="bodyContent">

				<t:insertTemplate template="/WEB-INF/jsp/templates/nothingToDisplay.jsp">
					<t:putAttribute name="bodyContent">
						<p class="message"><spring:message code="ADH_270_CACHE_NO_DATASETS"/></p>
				    </t:putAttribute>
				</t:insertTemplate>
				<c:set var="show_mem" value="true"/>
<%-- 				<c:set var="show_mem" value="${param.show_mem}"/>	 --%>
                <c:if test="${! empty dsList}">

                    <ol class="list tabular fiveColumn" id="dsContainer">

                        <li class="list header">
                            <div class="wrap">
                                <div class="column one">
                                    <p class="data"><spring:message code="ADH_270_CACHE_AGE"/></p>
                                </div>
                                <div class="column two">
                                    <p class="data"><spring:message code="ADH_270_CACHE_QUERY_AND_SOURCE"/></p>
                                </div>
                                <div class="column three">
                                	<p class="data">
		                                <c:choose>
										   <c:when test="${show_mem}"><spring:message code="ADH_270_CACHE_QUERY_FETCH_TIME"/></c:when>
										   <c:otherwise><spring:message code="ADH_270_CACHE_QUERY_TIME"/></c:otherwise>
										</c:choose>
	    	                        </p>
                                </div>
                                <div class="column four">
                                	<p class="data">
		                                <c:choose>
										   <c:when test="${show_mem}"><spring:message code="ADH_270_CACHE_MEM_USED"/></c:when>
										   <c:otherwise><spring:message code="ADH_270_CACHE_FETCH_TIME"/></c:otherwise>
										</c:choose>
	    	                        </p>
                                </div>
                                <div class="column five">
                                </div>
                            </div>
                        </li>

                        <c:forEach var="ds" items="${dsList}" varStatus="n">
                            <li class="list ${ds.isComplete ? '' : 'running'}" id="qItem_${ds.id}">
                                <div class="wrap">
                                    <div class="column one">
                                        <p class="data">${ds.age}</p>
                                    </div>
                                    <div class="column two">
                                        <h3 class="query"><a name="${ds.id}">${ds.query}</a></h3>
                                        <p class="data path">${ds.datasourceURI}</p>
                                    </div>
                                    <div class="column three">
	                                	<p class="data">
			                                <c:choose>
											   <c:when test="${show_mem}">${ds.queryTime}/${ds.fetchTime}</c:when>
											   <c:otherwise>${ds.queryTime}</c:otherwise>
											</c:choose>
		    	                        </p>
                                    </div>
                                    <div class="column four">
	                                	<p class="data">
			                                <c:choose>
											   <c:when test="${show_mem}">${ds.memUsed}</c:when>
											   <c:otherwise>${ds.fetchTime}</c:otherwise>
											</c:choose>
		    	                        </p>
                                    </div>
                                    <div class="column five">
                                        <button class="button action up" name="${ds.id}">
                                            <span class="wrap">
                                                <c:choose>
                                                    <c:when test="${ds.isComplete}">
                                                        <spring:message code="button.clear"/>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <spring:message code="button.cancel"/>
                                                    </c:otherwise>
                                                </c:choose>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </c:forEach>

                    </ol>
                </c:if>

                <form id="changeSortType" method="get" class="hidden">
                   <input type="hidden" name="_flowId" value="designerCacheFlow">
                   <input type="hidden" name="sort" value="${requestScope.sort}">
                </form>

                <jsp:include page="templateDetails.jsp"/>

		    </t:putAttribute>
		    <t:putAttribute name="footerContent">
                <button id="clearAllCache" class="button action up" ${(! empty dsList) ? '' : 'disabled=""'}><span class="wrap"><spring:message code="ADH_270_CACHE_CLEAR_ALL"/></span></button>
            </t:putAttribute>
		</t:insertTemplate>

		<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
		    <t:putAttribute name="containerID" value="serverSettingsMenu"/>
		    <t:putAttribute name="containerClass" value="column decorated secondary sizeable"/>
            <t:putAttribute name="containerElements">
                <div class="sizer horizontal"></div>
                <button class="button minimize"></button>
            </t:putAttribute>
		    <t:putAttribute name="containerTitle"><spring:message code="menu.settings"/></t:putAttribute>
		    <t:putAttribute name="bodyClass" value=""/>
		    <t:putAttribute name="bodyContent">
		    	<!--
		    	   NOTE: these objects serve as navigation links, load respective pages
		    	 -->
                <ul class="list responsive filters">
                    <li class="leaf"><p class="wrap button" id="navLogSettings"><b class="icon"></b><spring:message code="menu.log.Settings"/></p></li>
                    <li class="leaf"><p class="wrap button" id="logCollectors"><b class="icon"></b><spring:message code="logCollectors.title"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navDesignerOptions"><b class="icon"></b><spring:message code="menu.adhoc.options"/></p></li>
                    <li class="leaf selected"><p class="wrap button" id="navDesignerCache"><b class="icon"></b><spring:message code="menu.adhoc.cache"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navAnalysisOptions"><b class="icon"></b><spring:message code="menu.mondrian.properties"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navAwsSettings"><b class="icon"></b><spring:message code="menu.aws.settings"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navCustomAttributes"><b class="icon"></b><spring:message code="menu.server.attributes"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navResetSettings"><b class="icon"></b><spring:message code="menu.edit.settings"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navImport"><b class="icon"></b><spring:message code="import.import"/></p></li>
                    <li class="leaf"><p class="wrap button" id="navExport"><b class="icon"></b><spring:message code="export.export"/></p></li>
                    <li class="leaf" disabled="disabled"><p class="wrap separator" href="#"><b class="icon"></b></p></li>
                </ul>
		    </t:putAttribute>
		    <t:putAttribute name="footerContent">
		    </t:putAttribute>
		</t:insertTemplate>
	</t:putAttribute>

</t:insertTemplate>
