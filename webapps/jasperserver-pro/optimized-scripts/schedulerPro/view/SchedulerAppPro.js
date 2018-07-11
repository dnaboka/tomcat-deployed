define(["require","jquery","underscore","!domReady","backbone","jrs.configs","scheduler/util/schedulerUtils","scheduler/view/SchedulerApp","schedulerPro/model/jobModelPro","schedulerPro/enum/scheduledResourceTypeEnum","schedulerPro/view/jobsViewPro","schedulerPro/view/jobEditorViewPro"],function(e){"use strict";var t=e("jquery"),i=e("underscore"),r=e("!domReady"),o=e("backbone"),s=e("jrs.configs"),n=e("scheduler/util/schedulerUtils"),d=e("scheduler/view/SchedulerApp"),a=e("schedulerPro/model/jobModelPro"),h=e("schedulerPro/enum/scheduledResourceTypeEnum"),u=e("schedulerPro/view/jobsViewPro"),c=e("schedulerPro/view/jobEditorViewPro");return r(function(){i.extend(ControlsBase,s.inputControlsConstants)}),d.extend({initialize:function(e){this.options=i.extend({},e),this.runInBackgroundMode=0===document.location.hash.indexOf("#runInBackground@"),n.saveCurrentLocation(),this.schedulerStartupParams=n.getParamsFromUri(),this.masterViewMode=!this.schedulerStartupParams.reportUnitURI,this.childViewInitParams={model:new a,runInBackgroundMode:this.runInBackgroundMode,masterViewMode:this.masterViewMode,isDashboard:"DashboardModelResource"===this.schedulerStartupParams.resourceType,reportUri:this.schedulerStartupParams.reportUnitURI,parentReportURI:this.schedulerStartupParams.parentReportURI||null},this.childViewInitParams.model.resourceType=this.schedulerStartupParams.resourceType,t.ajaxSetup({headers:{"X-Suppress-Basic":!0}}),t(document).on("ajaxError",function(e,t,i,r){(401===t.status||"Unauthorized"===r)&&location.reload()}),this.runInBackgroundMode?this.runNowRequest():this.openJobsListInterface()},prepareJobsView:function(){this.jobsView||(this.jobsView=new u(this.childViewInitParams),this.listenTo(this.jobsView,"createNewJobRequest",this.createNewJobRequest),this.listenTo(this.jobsView,"runNowRequest",this.runNowRequest),this.listenTo(this.jobsView,"backButtonPressed",this.backButtonPressed),this.listenTo(this.jobsView,"editJobPressed",this.openEditJobInterface))},prepareJobEditorView:function(){this.jobEditorView&&this.jobEditorView.remove(),this.jobEditorView=new c(this.childViewInitParams),this.listenTo(this.jobEditorView,"errorEditingJob",this.errorEditingJob),this.listenTo(this.jobEditorView,"cancelJobCreation",this.cancelJobCreation),this.listenTo(this.jobEditorView,"jobHasBeenCreated",this.jobHasBeenCreated)},openEditJobInterface:function(e){var t,r=this;this.childViewInitParams.masterViewMode?(t=new o.Model,t.urlRoot=r.childViewInitParams.model.urlRoot,t.set({id:e}),t.fetch({headers:{Accept:"application/job+json"}}).done(function(){var o=t.get("source");r.childViewInitParams.isDashboard=!i.isUndefined(o.referenceWidth)&&!i.isUndefined(o.referenceHeight),r.childViewInitParams.model.resourceType=r.childViewInitParams.isDashboard?h.DASHBOARD:"",r.childViewInitParams.model._fetched=t.attributes,d.prototype.openEditJobInterface.call(r,e)})):d.prototype.openEditJobInterface.apply(this,arguments)}})});