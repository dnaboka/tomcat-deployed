define(["require","underscore","./BaseComponentModel","../../visualChooser/visualizationTypesManager"],function(e){"use strict";var t=e("underscore"),i=e("./BaseComponentModel"),n=e("../../visualChooser/visualizationTypesManager");return i.extend({defaults:{xAxisRotation:-45,yAxisRotation:0,xAxisStep:1,yAxisStep:1,legend:"bottom",showDataPoints:!0,advancedProperties:[],alignment:"bottom",showMeasureOnValueAxis:!0,legendBorder:!0,showSingleMeasuresLabels:!0,autoScaleFonts:!0,showScatterLine:!1,type:"Column"},initialize:function(e,i){var n=this.get("advancedProperties");t.isArray(n)||this.set({advancedProperties:t.map(t.keys(n),function(e){return{name:e,value:n[e]}})})},getLegacyAdhocChartType:function(){var e=this;return n.findType({name:e.get("type")}).legacyAdhoc},isTimeSeries:function(){return n.isTimeSeriesType(this.get("type"))}})});