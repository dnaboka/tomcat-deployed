define(["require","exports","module","jquery","underscore","request","bundle!DashboardBundle","common/util/i18nMessage","dashboard/dashboardSettings","bi/repository/enum/repositoryResourceTypes","dashboard/util/Dashboardi18nMessage"],function(e,r,t){"use strict";function s(e,r,t){var s;try{s=e.getParametrizationResult("dashletHyperlinkUrl",t)}catch(i){r.reject(new c("dashboard.error.dialog.text.url.parameters.not.set",i))}if(s&&0===s.indexOf("repo:/")&&e.get("dashletHyperlinkTarget")){var n,d=s.indexOf("?"),u="";0>d?n=s.substring("repo:".length):(n=s.substring("repo:".length,d),u=s.substring(d+"?".length)),l({headers:{Accept:"application/json"},url:h.CONTEXT_PATH+"/rest_v2/discovery"+n}).fail(function(){r.reject(new c("dashboard.error.dialog.text.url.resource.not.accessible",n))}).done(function(e){s=a(n,e.repositoryType,u),s?o(r,s):r.reject(new c("dashboard.error.dialog.text.url.unsupported.resource.type",n,e.repositoryType))})}else s?o(r,s):r.reject(new c("dashboard.error.dialog.text.url.empty"))}function o(e,r){-1===r.toLowerCase().indexOf("javascript:")?e.resolve(r):e.reject(new c("dashboard.error.dialog.text.url.empty"))}function a(e,r,t){var s,o=h.CONTEXT_PATH||"";switch(r){case p.DASHBOARD:s=o+"/dashboard/viewer.html?"+t+"#"+e;break;case p.REPORT_UNIT:s=o+"/flow.html?_flowId=viewReportFlow&standAlone=true&ParentFolderUri="+e.substring(0,e.lastIndexOf("/"))+"&reportUnit="+e+"&"+t;break;case p.ADHOC_DATA_VIEW:s=o+"/flow.html?_flowId=adhocFlow&ParentFolderUri="+e.substring(0,e.lastIndexOf("/"))+"&resource="+e+"&"+t}return s}var i=e("jquery"),n=e("underscore"),l=e("request"),d=e("bundle!DashboardBundle"),u=e("common/util/i18nMessage").extend({bundle:d}),h=e("dashboard/dashboardSettings"),p=e("bi/repository/enum/repositoryResourceTypes"),c=e("dashboard/util/Dashboardi18nMessage");return{defaults:{exposeOutputsToFilterManager:!1,dashletHyperlinkTarget:"",dashletHyperlinkUrl:void 0},validation:{dashletHyperlinkUrl:[{fn:function(e,r,t){return""!==t.dashletHyperlinkTarget&&t.exposeOutputsToFilterManager&&n.isEmpty(e)?"URL is required":void 0},msg:new u("dashboard.component.error.url.required")}]},mixin:{isValueProducer:function(){return this.get("exposeOutputsToFilterManager")&&this.has("outputParameters")&&this.get("outputParameters").length},getLinkUrl:function(e){var r=this.get("dashletHyperlinkUrl")&&this.get("dashletHyperlinkUrl").indexOf("$P{")>0;return(!this._linkUrlDfd||r&&e)&&(this._linkUrlDfd=i.Deferred(),s(this,this._linkUrlDfd,e||{})),this._linkUrlDfd}}}});