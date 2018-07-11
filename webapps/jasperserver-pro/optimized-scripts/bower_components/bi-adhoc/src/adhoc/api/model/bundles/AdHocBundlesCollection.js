define(["require","backbone","jquery","underscore","jrs.configs","./AdHocBundleModel"],function(e){"use strict";var t=e("backbone"),n=e("jquery"),o=e("underscore"),r=e("jrs.configs"),c=e("./AdHocBundleModel");return t.Collection.extend({model:c,initialize:function(e,t){if(!t||!t.contextPath)throw new Error("contextPath must be specified");this.CONTEXT_PATH=t.contextPath},getByLocale:function(e){var t=this.get(e);return t||(t=this.get(e.split("_")[0])),t||(t=this.get("")),t},getCurrent:function(){return this.getByLocale(r.userLocale)},bundle:function(e){var t,c;return o.isUndefined(e)&&(e=r.userLocale||""),this.models.length?(t=this.getByLocale(e))?t._contentDfd?c=t._contentDfd:(c=t._contentDfd=new n.Deferred,t.resource.contentJSON?c.resolve(t.resource.contentJSON):t.resource.fetchContent().done(function(){c.resolve(t.resource.contentJSON)})):c=(new n.Deferred).reject({errorCode:"bundle.not.found",message:"The bundle for locale is not found",properties:[e]}):c=(new n.Deferred).resolve({}),c.promise()}})});