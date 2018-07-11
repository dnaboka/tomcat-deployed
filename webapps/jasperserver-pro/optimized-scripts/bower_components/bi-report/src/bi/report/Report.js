define(["require","exports","module","underscore","jquery","backbone","logger","common/bi/component/util/biComponentUtil","common/bi/component/BiComponent","common/bi/error/enum/biComponentErrorCodes","./error/biComponentErrorFactoryReportProxy","./model/ReportModel","./ReportController","./model/ReportExportModel","./model/ReportPropertiesModel","./view/ReportView","./enum/reportOutputFormats","./jive/enum/jiveTypes","./jive/enum/interactiveComponentTypes","./enum/reportEvents","text!./schema/Report.json","text!./schema/ReportExport.json","text!./schema/ReportSearch.json","text!./schema/ReportSave.json","text!./schema/Chart.json","text!./schema/CrosstabDataColumn.json","text!./schema/CrosstabRowGroup.json","text!./schema/TableColumn.json"],function(e,r,t){"use strict";function o(e){var r=null;return e&&v.keys(e).length&&(r={reportParameter:v.map(e,function(e,r){return{name:r,value:e}})}),r}function n(e,r,t,n,a){var s,i,c,p,d=this.validate(),u=this;if(d)return p=S.validationError(d),h.error(p.toString()),void e.reject(p);if(r.properties.isolateDom&&(v.isUndefined(r.properties.defaultJiveUi)||r.properties.defaultJiveUi.enabled!==!1))return p=S.genericError(T.UNSUPPORTED_CONFIGURATION_ERROR,"Default JIVE UI should be disabled when isolateDom option is true"),h.error(p.toString()),void e.reject(p);if(r.properties.container){var l=f(r.properties.container);if(!l.length||"1"!=l[0].nodeType)return p=S.containerNotFoundError(r.properties.container),h.error(p.toString()),void e.reject(p);t.view.setContainer(l)}t.model.set("reportURI",r.properties.resource),t.model.contextPath=r.properties.server,O.createReadOnlyProperty(this,"server",r,!0,a),O.createReadOnlyProperty(this,"resource",r,!0,a),O.createReadOnlyProperty(this,"ignorePagination",r,!0,a),c=t.model.execution.get("parameters"),s=t.model.execution.get("pages"),i=t.model.execution.get("anchor");var m=v.isObject(r.properties.pages)?r.properties.pages.pages:r.properties.pages,E=v.isObject(r.properties.pages)?r.properties.pages.anchor:void 0;v.isUndefined(m)?(v.extend(t.model.getExport(D.HTML).get("options"),{pages:void 0,anchor:E}),t.model.execution.set({pages:void 0,anchor:E,ignorePagination:r.properties.ignorePagination,parameters:o(r.properties.params)})):(v.extend(t.model.getExport(D.HTML).get("options"),{pages:m,anchor:E}),t.model.execution.set({pages:m,anchor:E,ignorePagination:r.properties.ignorePagination,parameters:o(r.properties.params)}));var R=t.model.execution.changedAttributes(),g=R&&"parameters"in R,A=R&&("pages"in R||"anchor"in R),C=function(){var e,r=f.Deferred();if(!v.isObject(t.updateComponent))return r.resolve();var o=t.updateComponent&&t.updateComponent.componentId,n=t.updateComponent&&t.updateComponent.componentProps,a=!v.isUndefined(o)&&v.findWhere(t.components.getComponents(),{name:o})||v.findWhere(t.components.getComponents(),{id:o});if(!a)throw new Error("Component with such name or id '"+o+"' was not found");var s=v.extend(a,n),i=H[s.componentType];if(!i)throw new Error("Cannot validate component - unknown component type '"+s.componentType+"'");var c=O.validateObject(i,a);if(c)e=S.validationError(c),h.error(e.toString()),r.reject(e);else{var p=t.components.updateComponents([s]);p&&v.isArray(p)&&(p=v.compact(p)),p&&v.isArray(p)&&p.length?(p.silent=!0,t.runReportAction(p).done(function(){r.resolve(v.findWhere(t.components.getComponents(),{name:o}))}).fail(function(t){"export"===t.source||"execution"===t.source?(e=S.reportStatus(t),v.include([T.REPORT_EXECUTION_FAILED,T.REPORT_EXECUTION_CANCELLED,T.REPORT_EXPORT_FAILED,T.REPORT_EXPORT_CANCELLED],e)?h.error(e.toString()):h.error("Report "+t.source+("export"===t.source?" to format '"+t.format+"'":"")+" "+t.status+": "+e.toString()),r.reject(e)):"highchartsInternalError"===t.type?(e=S.reportRender(t),h.error(e.toString()),r.reject(e)):(e=S.requestError(t),h.error(e.toString()),r.reject(e))})):r.resolve(v.findWhere(t.components.getComponents(),{name:o}))}return r},_=function(){var e=new f.Deferred;return h.debug("Starting trying to render report"),r.properties.container?t.renderReport().done(function(){try{var r=u.data();a.set("_rendered",!0),e.resolve(r)}catch(t){h.error(t.toString()),e.reject(t)}}).fail(function(r){var t=S.reportRender(r),o=t.data&&t.data.error&&t.data.error.stack?"\n"+t.data.error.stack:"";h.error(t.toString()+o),e.reject(t)}):e.resolve(u.data()),e},P=function(){_().done(function(){r.data.totalPages=t.model.get("totalPages"),r.data.components=t.components.getComponents(),r.data.links=t.components.getLinks(),r.data.bookmarks=t.components.getBookmarks(),r.data.reportParts=t.components.getReportParts(),e.resolve(u.data())}).fail(e.reject)},j=function(o){var n;t.view.hideOverlay(),g&&t.model.execution.set({parameters:c},{silent:!0}),A&&(t.model.execution.set({pages:s,anchor:i},{silent:!0}),v.isUndefined(i)?r.properties.pages=s:r.properties.pages=v.isUndefined(s)?{anchor:i}:{pages:s,anchor:i}),o.errorDescriptor&&o.errorDescriptor.errorCode?(n=S.genericError(o.errorDescriptor.errorCode,o.errorDescriptor.message,o.errorDescriptor.parameters),h.error(n.toString()),e.reject(n)):"export"===o.source||"execution"===o.source?(n=S.reportStatus(o),v.include([T.REPORT_EXECUTION_FAILED,T.REPORT_EXECUTION_CANCELLED,T.REPORT_EXPORT_FAILED,T.REPORT_EXPORT_CANCELLED],n)?h.error(n.toString()):h.error("Report "+o.source+("export"===o.source?" to format '"+o.format+"'":"")+" "+o.status+": "+n.toString()),e.reject(n)):"highchartsInternalError"===o.type?(n=S.reportRender(o),h.error(n.toString()),e.reject(n)):(n=S.requestError(o),h.error(n.toString()),e.reject(n))};t.view.showOverlay(),t.model.isNew()?t.executeReport(n).then(P,j):C().done(function(){g||n?t.applyReportParameters(n).then(P,j):A||t.updateComponent?t.fetchReportHtmlExportAndJiveComponents().then(P,j):_().then(e.resolve,e.reject)}).fail(e.reject)}function a(e,r,t,o){if(t.view.setContainer(r.properties.container)===!1){var n=S.containerNotFoundError(r.properties.container);return h.error(n.toString()),void e.reject(n)}t.renderReport().done(function(){o.set("_rendered",!0),e.resolve(t.view.$el[0])}).fail(function(r){var t=S.reportRender(r);h.error(t.toString()),e.reject(t)})}function s(e,r,t,o){if(o.get("_rendered"))t.view.applyScale(),e.resolve();else{var n=S.notYetRenderedError();h.error(n.toString()),e.reject(n)}}function i(e,r){r.cancelReportExecution().done(e.resolve).fail(function(r){var t=S.requestError(r);h.error(t.toString()),e.reject(t)})}function c(e,r){r.undoReportAction().done(e.resolve).fail(function(r){var t=S.requestError(r);h.error(t.toString()),e.reject(t)})}function p(e,r){r.undoAllReportAction().done(e.resolve).fail(function(r){var t=S.requestError(r);h.error(t.toString()),e.reject(t)})}function d(e,r){r.redoReportAction().done(e.resolve).fail(function(r){var t=S.requestError(r);h.error(t.toString()),e.reject(t)})}function u(e,r,t){r.destroy().done(function(){t.set("_destroyed",!0),e.resolve()}).fail(function(r){var t=S.requestError(r);h.error(t.toString()),e.reject(t)})}function l(e){return function(r,t,o,n){var a=new f.Deferred,s=t,i=o,c=n,p=r;v.isFunction(r)&&(p=void 0,s=r,i=t,c=o),s&&v.isFunction(s)&&a.done(s),i&&v.isFunction(i)&&a.fail(i),c&&v.isFunction(c)&&a.always(c);var d=p?O.validateObject(w,p):void 0;if(d){var u=S.validationError(d);h.error(u.toString()),a.reject(u)}else e.save(p).done(a.resolve).fail(function(e){var r,t=e&&e.responseText?JSON.parse(e.responseText):null;r=t&&t.result&&t.result.code&&t.result.msg?S.genericError(t.result.code,t.result.msg):S.requestError(e),h.error(r.toString()),a.reject(r)});return a}}function m(e,r){return function(t,o,n,a){var s,i,c;if(r.get("_destroyed"))c=S.alreadyDestroyedError(),h.error(c.toString()),s=(new f.Deferred).reject(c);else try{i=O.validateObject(N,t),i?(s=new f.Deferred,c=S.validationError(i),h.error(c.toString()),s.reject(c)):s=e.exportReport(t)}catch(p){s=new f.Deferred,c=S.javaScriptException(p),h.error(c.toString()),s.reject(c)}return s.done(o).fail(n).always(a),s}}function E(e,r){return function(t){var o,n,a;if(r.get("_destroyed"))a=S.alreadyDestroyedError(),h.error(a.toString()),o=(new f.Deferred).reject(a);else try{n=O.validateObject(b,t),n?(o=new f.Deferred,a=S.validationError(n),h.error(a.toString()),o.reject(a)):o=e.searchReportAction(t).then(function(e){var r=e;return r.result&&r.result.actionResult&&r.result.actionResult.searchResults?r.result.actionResult.searchResults:[]})}catch(s){o=new f.Deferred,a=S.javaScriptException(s),h.error(a.toString()),o.reject(a)}return o}}function R(e,r){return function(){var t,o,n,a,s,i,c=this,p=f.Deferred();if(v.isString(arguments[0])?(s=arguments[0],t=arguments[1],o=arguments[2],n=arguments[3],a=arguments[4]):(t=arguments[0],s=t.id,o=arguments[1],n=arguments[2],a=arguments[3]),o&&v.isFunction(o)&&p.done(o),n&&v.isFunction(n)&&p.fail(n),a&&v.isFunction(a)&&p.always(a),r.get("_destroyed"))i=S.alreadyDestroyedError(),h.error(i.toString()),p.reject(i);else try{e.updateComponent={componentId:s,componentProps:t},c.run().always(function(){e.updateComponent=null}).fail(function(r){e.view.hideOverlay(),p.reject(r)}).done(function(){p.resolve(!v.isUndefined(s)&&v.findWhere(e.components.getComponents(),{name:s})||v.findWhere(e.components.getComponents(),{id:s}))})}catch(d){i=S.javaScriptException(d),h.error(i.toString()),p.reject(S.javaScriptException(d))}return p}}function g(e,r,t,o){return function(n){if(o.get("_destroyed"))throw S.alreadyDestroyedError();var a=this;return n&&v.isObject(n)&&v.keys(n).length?(v.each(e.events,function(e,o){v.isFunction(e)&&(o===B.CHANGE_TOTAL_PAGES?r.stopListening(t.model,"change:totalPages",e):o===B.CAN_REDO||o===B.CAN_UNDO?r.stopListening(t.stateStack,"change:position",e):o===B.REPORT_COMPLETED?r.stopListening(t,x.REPORT_COMPLETED,e):o===B.PAGE_FINAL?r.stopListening(t,x.PAGE_FINAL,e):o===B.BEFORE_RENDER?r.stopListening(t.view,x.BEFORE_RENDER,e):o===B.CHANGE_PAGES_STATE?r.stopListening(t,x.CURRENT_PAGE_CHANGED,e):o==B.BOOKMARKS_READY?r.stopListening(t.components,B.BOOKMARKS_READY,e):o==B.REPORTPARTS_READY&&r.stopListening(t.components,B.REPORTPARTS_READY,e))}),v.each(n,function(r,o){v.isFunction(r)&&(o===B.CHANGE_TOTAL_PAGES?e.events[o]=function(){r.call(a,t.model.get("totalPages"))}:o===B.CAN_UNDO?e.events[o]=function(){r.call(a,t.stateStack.get("canUndo"))}:o===B.CAN_REDO?e.events[o]=function(){r.call(a,t.stateStack.get("canRedo"))}:o===B.PAGE_FINAL?e.events[o]=function(e){r.call(a,e)}:o===B.REPORT_COMPLETED?e.events[o]=function(e,t){if(t)try{t="export"===t.source||"execution"===t.source?S.reportStatus(t):S.requestError(t)}catch(o){t=S.javaScriptException(o)}r.call(a,e,t)}:o===B.BEFORE_RENDER?e.events[o]=v.bind(r,a):o===B.CHANGE_PAGES_STATE?e.events[o]=v.bind(r,a):o==B.BOOKMARKS_READY?e.events[o]=function(e){e.length&&r.call(a,e)}:o==B.REPORTPARTS_READY&&(e.events[o]=function(e){e.length&&r.call(a,e)}))}),v.each(e.events,function(e,o){v.isFunction(e)&&(o===B.CHANGE_TOTAL_PAGES?r.listenTo(t.model,"change:totalPages",e):o===B.CAN_REDO?r.listenTo(t.stateStack,"change:canRedo",e):o===B.CAN_UNDO?r.listenTo(t.stateStack,"change:canUndo",e):o===B.PAGE_FINAL?r.listenTo(t,x.PAGE_FINAL,e):o===B.REPORT_COMPLETED?r.listenTo(t,x.REPORT_COMPLETED,e):o===B.BEFORE_RENDER?r.listenTo(t.view,x.BEFORE_RENDER,e):o===B.CHANGE_PAGES_STATE?r.listenTo(t,x.CURRENT_PAGE_CHANGED,e):o==B.BOOKMARKS_READY?r.listenTo(t.components,B.BOOKMARKS_READY,e):o==B.REPORTPARTS_READY&&r.listenTo(t.components,B.REPORTPARTS_READY,e))}),a):a}}var v=e("underscore"),f=e("jquery"),A=e("backbone"),h=e("logger").register(t),O=e("common/bi/component/util/biComponentUtil"),C=e("common/bi/component/BiComponent"),T=e("common/bi/error/enum/biComponentErrorCodes"),S=e("./error/biComponentErrorFactoryReportProxy"),_=(e("./model/ReportModel"),e("./ReportController")),P=(e("./model/ReportExportModel"),e("./model/ReportPropertiesModel")),D=(e("./view/ReportView"),e("./enum/reportOutputFormats")),j=(e("./jive/enum/jiveTypes"),e("./jive/enum/interactiveComponentTypes")),x=e("./enum/reportEvents"),y=JSON.parse(e("text!./schema/Report.json")),N=JSON.parse(e("text!./schema/ReportExport.json")),b=JSON.parse(e("text!./schema/ReportSearch.json")),w=JSON.parse(e("text!./schema/ReportSave.json")),L=JSON.parse(e("text!./schema/Chart.json")),F=JSON.parse(e("text!./schema/CrosstabDataColumn.json")),k=JSON.parse(e("text!./schema/CrosstabRowGroup.json")),G=JSON.parse(e("text!./schema/TableColumn.json")),U=v.keys(y.properties),I=["properties"],M=["data"],B={CHANGE_TOTAL_PAGES:"changeTotalPages",CHANGE_PAGES_STATE:"changePagesState",CAN_UNDO:"canUndo",CAN_REDO:"canRedo",BEFORE_RENDER:"beforeRender",PAGE_FINAL:"pageFinal",REPORT_COMPLETED:"reportCompleted",BOOKMARKS_READY:"bookmarksReady",REPORTPARTS_READY:"reportPartsReady"},H={};H[j.CHART]=L,H[j.CROSSTAB_COLUMN]=F,H[j.CROSSTAB_ROW]=k,H[j.TABLE_COLUMN]=G;var J=function(e){e||(e={});var r=e.events,t={properties:v.extend({pages:1,autoresize:!0,chart:{},loadingOverlay:!0},e),data:{totalPages:void 0,components:[],links:[],bookmarks:[],reportParts:[]},events:{}};delete t.properties.events;var o=new P(O.cloneDeep(t.properties));O.createInstancePropertiesAndFields(this,t,U,I,M,o);var f=new _(o),h=v.extend({},A.Events);f.view.$el.addClass("visualizejs _jr_report_container_ jr"),h.listenTo(f.model,"change:totalPages",function(){t.data.totalPages=f.model.get("totalPages")}),h.listenTo(f.components,"change add reset remove",function(){t.data.components=f.components.getComponents(),t.data.links=f.components.getLinks(),t.data.bookmarks=f.components.getBookmarks(),t.data.reportParts=f.components.getReportParts()}),v.extend(this,{validate:O.createValidateAction(t,y,o),run:O.createDeferredAction(n,o,t,f,!1,o),refresh:O.createDeferredAction(n,o,t,f,!0,o),render:O.createDeferredAction(a,o,t,f,o),resize:O.createDeferredAction(s,o,t,f,o),cancel:O.createDeferredAction(i,o,f),undo:O.createDeferredAction(c,o,f),undoAll:O.createDeferredAction(p,o,f),redo:O.createDeferredAction(d,o,f),search:E(f,o),save:l(f),destroy:O.createDeferredAction(u,o,f,o),"export":m(f,o),updateComponent:R(f,o),events:g(t,h,f,o)}),this.events(r)};return J.prototype=new C,v.extend(J,{exportFormats:["pdf","xlsx","xls","rtf","csv","xml","odt","ods","docx","pptx","json"],chart:{componentTypes:["chart"],types:L.properties.chartType["enum"]},table:{componentTypes:["tableColumn"],column:{types:["numeric","boolean","datetime","string","time"]}},crosstab:{componentTypes:["crosstabDataColumn","crosstabRowGroup"]}}),J});