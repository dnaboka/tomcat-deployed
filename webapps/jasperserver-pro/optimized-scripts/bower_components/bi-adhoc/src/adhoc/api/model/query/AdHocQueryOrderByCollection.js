define(["require","exports","module","underscore","backbone","logger"],function(e,t,r){"use strict";var l=e("underscore"),i=e("backbone");e("logger").register(r);return i.Collection.extend({initialize:function(){this.measures={},this.multiAxisItems={}},reset:function(e,t){return i.Collection.prototype.reset.call(this,l.map(e,function(e){return e.member||e.level||e.bottomN||e.topN?e:{level:e}}),t)},toJSON:function(e){if(this.length){if(e)return this.reduce(function(e,t){return t.has("level")&&!t.get("level").aggregation&&e.push(l.clone(t.get("level"))),e},[]);var t=this.measures,r=this.multiAxisItems;return l.filter(i.Collection.prototype.toJSON.apply(this,arguments),function(e){return!e.level||e.level.aggregation||!(t[e.level.fieldRef]||!r[e.level.fieldRef])})}}})});