define(["require","exports","module","backbone","../enum/tooltipPlacements","backbone.validation","underscore","logger"],function(e,t,i){"use strict";var o=e("backbone"),n=e("../enum/tooltipPlacements"),l=e("backbone.validation"),r=e("underscore"),a=e("logger").register(i),s=o.Model.extend({defaults:{visible:!1,content:{title:void 0,text:void 0},x:0,y:0,placement:n.BOTTOM,position:{x:0,y:0}},validation:{y:{type:"number"},x:{type:"number"},visible:{type:"boolean"},content:{type:"object"}},initialize:function(e){e=e||{},this.log=e.log||a,this.listenTo(this,"invalid",function(e,t){this.log.error(t)})}});return r.extend(s.prototype,l.mixin),s});