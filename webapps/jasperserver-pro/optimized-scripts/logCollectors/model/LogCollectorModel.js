define(["require","underscore","jrs.configs","bundle!all","logCollectors/enum/collectorStatusEnum","common/model/BaseModel","backbone.validation","settings!globalConfiguration"],function(e){"use strict";var t=e("underscore"),o=e("jrs.configs"),r=e("bundle!all"),s=e("logCollectors/enum/collectorStatusEnum"),n=e("common/model/BaseModel"),i=e("backbone.validation"),a=e("settings!globalConfiguration"),l=a.resourceIdNotSupportedSymbols.slice(1,a.resourceIdNotSupportedSymbols.length-1),u=n.extend({urlRoot:o.contextPath+"/rest_v2/diagnostic/collectors/",defaults:{id:null,name:"",status:"",verbosity:"LOW",filterBy:{userId:"",resource:{uri:"",includeDataSnapshot:!1}}},validation:{name:[{required:!0,msg:r["logCollectors.form.validation.specifyCollectorName"]},{maxLength:30,msg:r["logCollectors.form.validation.too.long.name"]},{doesNotContainSymbols:l,msg:r["logCollectors.form.validation.invalid.chars.name"]}],resourceUri:function(e,t,o){return o.includeDataSnapshot!==!0||e?void 0:r["logCollectors.form.validation.specifyResourceUri"]}},constructor:function(e,t){n.prototype.constructor.apply(this,arguments)},initialize:function(e,t){this.options=t},parse:function(e){return e.userId=e.filterBy.userId||"",e.resourceUri="",e.filterBy.resource&&(e.resourceUri=e.filterBy.resource.uri||""),e.name=e.name||e.id,e.includeDataSnapshot=!1,e.filterBy.resource&&(e.includeDataSnapshot=e.filterBy.resource.includeDataSnapshot===!0||"true"===e.filterBy.resource.includeDataSnapshot),delete e.filterBy,e},toJSON:function(){var e=t.cloneDeep(this.attributes);return e.filterBy={userId:e.userId,resource:{uri:e.resourceUri,includeDataSnapshot:e.includeDataSnapshot===!0?"true":"false"}},this.isNew()&&(delete e.id,delete e.status),delete e.userId,delete e.resourceUri,delete e.includeDataSnapshot,e},sendStopSignal:function(){if(this.isInRunningMode()){var e=this.get("status");this.set({status:s.STOPPED},{silent:!0});var t=this.save();return this.set({status:e},{silent:!0}),t}},isInRunningMode:function(){return this.get("status").toLowerCase()===s.RUNNING.toLowerCase()},isInShuttingDownMode:function(){return this.get("status").toLowerCase()===s.SHUTTING_DOWN.toLowerCase()},isInStoppedMode:function(){return this.get("status").toLowerCase()===s.STOPPED.toLowerCase()}});return t.extend(u.prototype,i.mixin),u});