define("home/homeDeprecatedMain",["require","prototype","commons.main","domReady","create.report","underscore"],function(e){"use strict";e("prototype"),e("commons.main");var o=e("domReady"),t=e("create.report"),i=e("underscore"),r={_locationMap:{},initialize:function(e){webHelpModule.setCurrentContext("bi_overview"),e.locationMap&&(this._locationMap=e.locationMap),this._initHandlers()},_initHandlers:function(){var e=$(document.body).select(".button.action.jumbo");e.each(function(e){$(e).observe("click",function(o){var t=e.identify();this._locationMap[t]&&(i.isFunction(this._locationMap[t])?this._locationMap[t]():document.location=this._locationMap[t])}.bindAsEventListener(r))})}};o(function(){r.initialize({locationMap:{viewReports:"flow.html?_flowId=searchFlow&mode=search&filterId=resourceTypeFilter&filterOption=resourceTypeFilter-reports&searchText=",createView:"flow.html?_flowId=adhocFlow",createReport:t.selectADV,createDashboard:"flow.html?_flowId=dashboardDesignerFlow&createNew=true",analyzeResults:"flow.html?_flowId=searchFlow&mode=search&filterId=resourceTypeFilter&filterOption=resourceTypeFilter-view&searchText=",manageServer:"flow.html?_flowId=adminHomeFlow"}})})});