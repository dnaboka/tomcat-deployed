define(["require","jquery","scheduler/model/jobModel","dashboard/dashboardSettings","schedulerPro/enum/scheduledResourceTypeEnum"],function(e){var r=e("jquery"),d=e("scheduler/model/jobModel"),a=e("dashboard/dashboardSettings"),o=e("schedulerPro/enum/scheduledResourceTypeEnum");return d.extend({loadParameters:function(){this.resourceType==o.DASHBOARD?this.update("source",{parameters:{parameterValues:{}}}):d.prototype.loadParameters.apply(this,arguments)},validate:function(e,s){var t=d.prototype.validate.apply(this,arguments);if(this.resourceType==o.DASHBOARD){var h,i,u=e.source.referenceWidth,n=e.source.referenceHeight;u?n?r.isNumeric(u)?r.isNumeric(n)?u<a.DASHBOARD_MIN_WIDTH||u>a.DASHBOARD_MAX_WIDTH?(h="dashboard.error.dashboard.width.range",i=[a.DASHBOARD_MIN_WIDTH,a.DASHBOARD_MAX_WIDTH]):(n<a.DASHBOARD_MIN_HEIGHT||n>a.DASHBOARD_MAX_HEIGHT)&&(h="dashboard.error.dashboard.height.range",i=[a.DASHBOARD_MIN_HEIGHT,a.DASHBOARD_MAX_HEIGHT]):h="dashboard.error.dashboard.height.integer":h="dashboard.error.dashboard.width.integer":h="dashboard.error.dashboard.height.required":h="dashboard.error.dashboard.width.required",h&&t.push({field:"outputSize",errorCode:h,errorArguments:i})}return t.length?this.trigger("invalid",t):this.trigger("valid",[]),t}})});