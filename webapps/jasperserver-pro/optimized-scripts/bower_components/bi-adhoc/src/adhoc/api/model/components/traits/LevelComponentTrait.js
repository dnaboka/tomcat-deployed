define(["require"],function(e){"use strict";return{level:function(){var e=this,t=function(t){return e.get("reference")===t.get("id")},i=function(t){return e.get("reference")===t.get("hierarchicalName")};return this.adHocModel.dataSet.query.cols.axis.find(t)||this.adHocModel.dataSet.query.rows.axis.find(t)||this.adHocModel.dataSet.query.cols.axis.find(i)||this.adHocModel.dataSet.query.rows.axis.find(i)},label:function(e){return this.has("label")?this.get("label"):this.level().label(e)}}});