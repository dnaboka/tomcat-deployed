!function(e,t){"use strict";"function"==typeof define&&define.amd?define(["underscore","jquery","adhoc/api/chart/adhocToHighchartsAdapter/adhocDataProcessor","adhoc/api/chart/adhocToHighchartsAdapter/palette/defaultPalette","adhoc/api/chart/adhocToHighchartsAdapter/enum/dateTimeFormats","adhoc/api/chart/adhocToHighchartsAdapter/enum/adhocToHighchartsTypes","highcharts"],e):t.highchartsDataMapper=e(_,jQuery,AdhocDataProcessor,hcDefaultPalette,hcDateTimeFormats,adhocToHighchartsTypes,Highcharts)}(function(e,t,a,r,i,s,n){"use strict";var o=e.chain({}).extend(e.cloneDeep(r)).extend(i).value();return e.extend(o,{SeriesType:{COMMON:0,PIE:1,DUAL_LEVEL_PIE:2,HEAT_MAP:3,HEAT_MAP_TIME_SERIES:4,SEMI_PIE:5,DUAL_MEASURE_TREE_MAP:6,TREE_MAP:7,ONE_PARENT_TREE_MAP:8},chartType:null,fullGroupHierarchyNames:!0,defaultPiesPerRow:8,maxPieRows:4,HEATMAP_LEGEND_TICK_INTERVAL:150,categories:[],categoryNames:{},groupedCategories:!1,highchartsCategories:[],measureMin:null,measureMax:null,extendDefaultPalette:function(a){var i,s;if(i=e.find(a.chartState.advancedProperties,function(e){return"colors"===e.name}))try{s=JSON.parse(i.value),o.colors=t.extend(e.clone(r.colors),s)}catch(n){o.colors=e.clone(r.colors)}else o.colors=e.clone(r.colors)},getSeriesByType:function(e,t,r,i){var s,n;this.extendDefaultPalette(i),i.metadata.isOLAP?(s=a.getNodeListForDimLevelRadio(0,t),n=a.getNodeListForDimLevelRadio(1,r)):(s=a.getNodeListForSliderLevel(0,t),n=a.getNodeListForSliderLevel(1,r));var l;switch(e){case o.SeriesType.COMMON:l=o.getCommonSeries(s,n,i);break;case o.SeriesType.PIE:l=o.getPieSeries(s,n,t,r,i);break;case o.SeriesType.SEMI_PIE:l=o.getSemiPieSeries(s,n,t,r,i);break;case o.SeriesType.DUAL_LEVEL_PIE:l=o.getDualLevelPieSeries(s,n,t,r,i);break;case o.SeriesType.HEAT_MAP:l=o.getHeatMapOptions(s,n,i);break;case o.SeriesType.HEAT_MAP_TIME_SERIES:l=o.getHeatMapTimeSeriesOptions(s,n,i);break;case o.SeriesType.DUAL_MEASURE_TREE_MAP:l=o.getDualMeasureSingleFieldTreeMapOptions(s,n,i);break;case o.SeriesType.TREE_MAP:l=o.getTreeMapOptions(s,n,i);break;case o.SeriesType.ONE_PARENT_TREE_MAP:l=o.getTreeMapOptions(s,n,i);break;default:throw"Unknown series type!"}return l},getColor:function(e){return o.colors[e%o.colors.length]},getColorWithAlpha:function(e,t){var a=o.rgbColors[e%o.colors.length];return"rgba("+a[0]+", "+a[1]+", "+a[2]+", "+t+")"},generateXAxisLabelsOptions:function(t){var a={step:t.step,maxStaggerLines:1,style:{fontSize:"1em"}};return 0!==t.rotation&&(e.extend(a,{rotation:t.rotation}),t.adjustPosition&&90===t.rotation?a.x=-4:270===t.rotation&&(a.x=4)),a},doAxisSwap:function(e){return-1!=e.indexOf("bar")},getLegendOptions:function(e){var t={borderWidth:e.chartState.legendBorder?1:0,itemStyle:{fontWeight:"normal",fontSize:"1em"}};switch("none"===e.chartState.legend?t.enabled=!1:o.isScatterOrBubbleChart(e.chartState.chartType)?t.enabled=!o.isTotalSelectedOnly(e,1):t.enabled=!0,e.chartState.legend){case"top":t.align="center",t.verticalAlign="top";break;case"left":case"right":t.align=e.chartState.legend,t.verticalAlign="middle",t.layout="vertical"}return t},getGeneralOptions:function(e){return{chart:{renderTo:"chartContainer",zoomType:"xy",type:o.adHocToHighchartsChartTypeMap[e.chartState.chartType],polar:o.isSpiderChart(e.chartState.chartType),style:{fontSize:"1em"}},credits:{enabled:!1},title:{text:null},tooltip:{valueDecimals:2,useHTML:!0,style:{fontSize:"1em"}}}},getCommonSeriesGeneralOptions:function(t){var a=o.doAxisSwap(t.chartState.chartType),r=e.extend(o.getGeneralOptions(t),{xAxis:o.getXAxisOptions(a,t),yAxis:o.isDualOrMultiAxisChart(t.chartState.chartType)?[]:o.getYAxisOptions(a,t),plotOptions:{series:{marker:{enabled:t.chartState.showDataPoints},tooltip:{dateTimeLabelFormats:t.isTimeSeries?o.getDateTimeLabelFormats(t.chartState.timeSeriesCategorizerName):void 0,xDateFormat:t.isTimeSeries?o.getDateTimeTooltipFormats(t.chartState.timeSeriesCategorizerName):void 0}}},series:[],legend:o.getLegendOptions(t)});return o._isTooltipFollowPointerEnabled(t.chartState.chartType)&&(r.tooltip.followPointer=!0),o.isDualOrMultiAxisChart(t.chartState.chartType)||o.isSpiderChart(t.chartState.chartType)?r.tooltip.shared=!0:r.tooltip.shared=!1,r},isTotalSelectedOnly:function(t,a){var r=0===a?t.chartState.rowsSelectedLevels:t.chartState.columnsSelectedLevels,i=!0;return t.metadata.isOLAP?e.each(r,function(e){"(All)"!=e.name&&(i=!1)}):i=0===r.length,i},getXAxisOptions:function(e,t){var a={categories:[],title:{text:o.isScatterOrBubbleChart(t.chartState.chartType)?t.metadata.measures[0]:""}};return o.isSpiderChart(t.chartState.chartType)&&(a.tickmarkPlacement="on",a.lineWidth=0),a.labels=o.generateXAxisLabelsOptions({rotation:e?t.chartState.yAxisRotation:t.chartState.xAxisRotation,adjustPosition:!e,step:e?t.chartState.yAxisStep:t.chartState.xAxisStep}),e&&Math.abs(t.chartState.xAxisRotation)>=75&&(a.labels.align="right"),a.offset=Math.abs(t.chartState.xAxisRotation)>60?5:0,t.isTimeSeries&&(a.dateTimeLabelFormats=o.getDateTimeLabelFormats(t.chartState.timeSeriesCategorizerName),a.type="datetime"),a},getYAxisOptions:function(e,t){var a={title:{text:" "},labels:{rotation:e?t.chartState.xAxisRotation:t.chartState.yAxisRotation,step:e?t.chartState.xAxisStep:t.chartState.yAxisStep,style:{fontSize:"1em"}}};return o.isScatterOrBubbleChart(t.chartState.chartType)?a.title.text=t.metadata.measures[1]:t.chartState.showMeasureOnValueAxis&&1==t.metadata.measures.length&&(a.title.text=t.metadata.measures[0]),o.isSpiderChart(t.chartState.chartType)&&(a.gridLineInterpolation="polygon",a.lineWidth=0,a.min=0,a.labels.rotation>0&&(a.labels.x=-(a.labels.rotation/90*10))),a},getDateTimeLabelFormats:function(e){return o.dateTimeLabelFormatsMap[e]},getDateTimeTooltipFormats:function(e){return o.dateTimeTooltipFormatsMap[e]},getCommonSeries:function(e,t,a){var r=a.isTimeSeries,i=a.chartState.chartType;o.groupedCategories=!1,o.highchartsCategories=[],o.measureMin=null,o.measureMax=null;var s=this.getCommonSeriesGeneralOptions(a);return o.setupOptionsSeries(t,s,i,a),o.setupOptionsYAxis(t,s,i,a),o.populateOptionsDataAndCategories(e,t,s,i,r,a),o.setCategories(s,r||o.isScatterOrBubbleChart(i),i),s},setupOptionsSeries:function(e,t,a,r){for(var i=o.isScatterOrBubbleChart(a),s=r.metadata.measures.length,n=i?e.length/s:e.length,l=0;n>l;l++){var u,c=i&&!o._isMeasureFirst(r.metadata)?e[l*s]:e[l],p=o.assembleFullGroupLinearName(1,c,r),h=l==n-1;if(o.isScatterOrBubbleChart(a)){var m=(r.chartState.columnsSelectedLevels.length>0,r.chartState.rowsSelectedLevels.length>0);u={headerFormat:m?"{point.key}<br/>":"",pointFormat:o.constructTooltipPointFormat(a,r),followPointer:!0}}t.series.push({name:p,data:[],color:i?o.getColorWithAlpha(l,.75):o.getColor(l),type:o.isDualOrMultiAxisChart(a)?o.getDualOrMultiAxisHighchartsType(a,h):void 0,yAxis:o.isMultiAxisChart(a)?l:0,tooltip:u,columnsOutputParams:o.createOutputParameters(c,1,r)})}},createOutputParameters:function(e,t,r){var i=r.metadata.measures,s=r.chartState.chartType,n=o.getActiveAxisLevels(t,r),l=a.getLabelNameArray(t,e).reverse();l.splice(0,l.length-n.length);for(var u=[],c=0;c<n.length;c++)u.push({name:n[c],value:o._isMeasuresDimension(n[c].dimension)&&o.isScatterOrBubbleChart(s)?i:l[c]});return u},getActiveAxisLevels:function(t,r){var i,s=r.metadata.axes[t];if(r.metadata.isOLAP){var n=0===t?r.chartState.rowsSelectedLevels:r.chartState.columnsSelectedLevels;i=e.filter(n,function(e){return"(All)"!=e.name})}else{for(var o=0===t?r.chartState.rowsSelectedLevels[0]:r.chartState.columnsSelectedLevels[0],l=o?1:0;o&&(s[l-1].dimension!=o.dimension||s[l-1].name!=o.name);)l++;i=[].concat(s),i.splice(l,i.length-l)}if(r.metadata.measureAxis==t){var u=a.getMeasureLevelNumber(r.metadata),c=s[u-1];r.metadata.isOLAP?u>i.length?i.push(c):i.splice(u-1,0,c):u>i.length&&i.push(c)}return i},constructTooltipPointFormat:function(e,t){var a=t.chartState.columnsSelectedLevels.length>0,r=o.isTotalSelectedOnly(t,1),i="";return a&&!r&&(i+='<span style="color:{series.color}">{series.name}</span> <br/>'),i+=t.metadata.measures[0]+" : <b>{point.x:,.2f}</b><br/>"+t.metadata.measures[1]+" : <b>{point.y:,.2f}</b>"+(o.isBubbleChart(e)?"<br/>"+t.metadata.measures[2]+" : <b>{point.z:,.2f}</b> ":"")},setupOptionsYAxis:function(e,t,a,r){if(o.isDualAxisChart(a)){t.series[e.length-1].yAxis=1;var i=r.chartState.showMeasureOnValueAxis&&2==t.series.length?t.series[0].name:"";t.yAxis.push(o.getYAxisForDualOrMultiAxisChart(r,0,i)),t.yAxis.push(o.getYAxisForDualOrMultiAxisChart(r,e.length-1,t.series[e.length-1].name))}else if(o.isMultiAxisChart(a))for(var s=0;s<e.length;s++)t.yAxis.push(o.getYAxisForDualOrMultiAxisChart(r,s,t.series[s].name))},populateOptionsDataAndCategories:function(t,a,r,i,s,n){for(var l=o.isScatterOrBubbleChart(i),u=n.metadata.measures.length,c=l?a.length/u:a.length,p=0;p<t.length;p++){for(var h=t[p],m=0;c>m;m++){var g=r.series[m];if(l){var d=[];if(n.chartState.showScatterLine&&(g.lineWidth=1),o._isMeasureFirst(n.metadata))for(var x=0;u>x;x++){var y=o.getDataValue(h,a[m+x*c],!0);d.push(y)}else for(var f=0;u>f;f++)d.push(o.getDataValue(h,a[m*u+f],!0));var S=e.every(d,function(e){return null==e});if(!S){d=e.map(d,function(e){return null==e?0:e}),o.measureMinMax(d[0]),o.measureMinMax(d[1]);var M;if(o.isScatterChart(i))M={x:d[0],y:d[1],name:o.assembleFullGroupHierarchyName(0,h,n),rowsOutputParams:o.createOutputParameters(h,0,n)};else{if(!o.isBubbleChart(i))throw"Unexpected chart type";M={x:d[0],y:d[1],z:d[2],name:o.assembleFullGroupHierarchyName(0,h,n),rowsOutputParams:o.createOutputParameters(h,0,n)}}g.data.push(M)}}else{var T=o.getDataValue(h,a[m],!0);if(s){if(null!=T.value&&null!=T.timestamp){o.measureMinMax(T.value);var b=o.createOutputParameters(h,0,n);b[0].value=T.timestamp,g.data.push({x:T.timestamp,y:T.value,rowsOutputParams:b})}}else o.measureMinMax(T),g.data.push({y:T,rowsOutputParams:o.createOutputParameters(h,0,n)})}}if(!s&&!l){var O=o.assembleFullGroupHierarchyName(0,h,n);r.xAxis.categories.push({name:O})}}o.isBubbleChart(i)&&1===c&&(r.xAxis.startOnTick=!0,r.xAxis.endOnTick=!0)},getYAxisForDualOrMultiAxisChart:function(e,t,a){var r=o.getYAxisOptions(o.doAxisSwap(e.chartState.chartType),e);return r.opposite=0!==t,r.labels.style={color:o.getColor(t),fontSize:"1em"},r.title={text:a,style:{color:o.getColor(t)}},r.opposite===!1&&(r.offset=Math.abs(e.chartState.yAxisRotation)>60?5:0),r},setCategories:function(e,t,a){t?e.xAxis.categories=void 0:o.groupedCategories&&this.areCategoriesSupported(a)&&(e.xAxis.categories=o.highchartsCategories)},areCategoriesSupported:function(e){return-1==e.indexOf("spider")&&(e.indexOf("column")>=0||e.indexOf("area")>=0||e.indexOf("line")>=0||e.indexOf("spline")>=0)},getPieSeries:function(t,r,i,s,n){o.measureMin=null,o.measureMax=null;var l,u=(e.isArray(s)?s.length:s)+n.metadata.measureAxis,c=15,p=10,h=c*u+p,m=n.width,g=n.height,d=(n.chartState.chartType,a.getDataStyle()),x=e.extend(o.getGeneralOptions(n),{xAxis:{categories:[]},plotOptions:{pie:{slicedOffset:0,point:{events:{legendItemClick:o._getLegendItemClickHandler}}}},series:[],labels:{items:[]},legend:o.getLegendOptions(n)});if(0===d)if(n.metadata.axes[0].length>0){var y=r[0],f=1,S=f+1,M=100/S,T=M,b=50,O=[],v=T+"%",A=b+"%";O.push(v),O.push(A);var C=a.getMessage("totalsLabelForChart");n.metadata.measures[0].name&&(C=n.metadata.measures[0].name),x.series.push({type:"pie",name:C,data:[],center:O,size:2*M+"%",showInLegend:!0,dataLabels:{enabled:!1},columnsOutputParams:o.createOutputParameters(y,1,n)});for(var _=0;_<t.length;_++){var P=t[_],L=o.getDataValue(P,y);o.measureMinMax(L),l=o.assembleFullGroupLinearName(0,P,n),x.series[0].data.push({name:l,y:L,rowsOutputParams:o.createOutputParameters(P,0,n)})}}else{var D=t[0],N=n.metadata.axes[1].length<=1?!0:!1,k=a.isMeasuresLastOnAxis(1),E=n.metadata.measures.length,f=1;N||(f=k?r.length/E:r.length);for(var H=o.getSquareSideLength(f,m,g),F=0;f>F;F++){var B=o.computePieParams(F+1,H,m,g,h,f),w=F;if(l=a.getMessage("allLabelForChart"),!N)if(k){w=F*E;var I=r[w];l=I.parent.label}else l=r[F].label;var O=[],v=B.xAxisPositionPercent+"%",A=B.yAxisPositionPercent+"%";O.push(v),O.push(A);var w=F;k&&(N||(w=F*E));var R=F>0?!1:!0;x.series.push({type:"pie",name:r[w].label,data:[],center:O,size:B.pieSizePercent+"%",showInLegend:R,dataLabels:{enabled:!1},title:{text:l,verticalAlign:"top",y:-h},columnsOutputParams:o.createOutputParameters(r[w],1,n)})}if(N)for(var _=0;_<r.length;_++){var z=r[_],L=o.getDataValue(D,z);o.measureMinMax(L),l=o.assembleFullGroupLinearName(1,z,n),x.series[0].data.push({x:l,y:L,rowsOutputParams:o.createOutputParameters(D,0,n)})}else if(k)for(var G=(r[0].label,0),V=0,_=0;_<r.length;_++){var z=r[_];if(V++,V>E){if(G++,G>=f)throw"highchart.datamapper getPieSeries: exceeded numberOfPies="+numberOfPies;V=1}var L=o.getDataValue(D,z);o.measureMinMax(L),l=z.label,x.series[G].data.push({name:l,y:L,rowsOutputParams:o.createOutputParameters(D,0,n)})}else for(var _=0;_<r.length;_++){var z=r[_],L=o.getDataValue(D,z);o.measureMinMax(L),l=o.assembleFullGroupHierarchyName(1,z,n),x.series[_].data.push({name:l,y:L,rowsOutputParams:o.createOutputParameters(D,0,n)})}}if(2==d||1==d){for(var H=o.getSquareSideLength(r.length,m,g),F=0;F<r.length;F++){var B=o.computePieParams(F+1,H,m,g,h,r.length),U=r[F].label,l=o.assembleFullGroupHierarchyName(1,r[F],n),j=U,O=[],v=B.xAxisPositionPercent+"%",A=B.yAxisPositionPercent+"%";O.push(v),O.push(A);var R=F>0?!1:!0;x.series.push({type:"pie",name:j,data:[],center:O,size:B.pieSizePercent+"%",showInLegend:R,dataLabels:{enabled:!1},title:{text:l,verticalAlign:"top",y:-h},columnsOutputParams:o.createOutputParameters(r[F],1,n)})}for(var _=0;_<r.length;_++)for(var z=r[_],W=0;W<t.length;W++){var P=t[W],L=o.getDataValue(P,z);o.measureMinMax(L),l=o.assembleFullGroupLinearName(0,P,n),x.series[_].data.push({name:l,y:L,rowsOutputParams:o.createOutputParameters(P,0,n)})}}return x},getSemiPieSeries:function(e,t,a,r,i){var s,n,o=this.getPieSeries(e,t,a,r,i);o.plotOptions.pie.startAngle=-90,o.plotOptions.pie.endAngle=90;for(var l=0;l<o.series.length;l++)n=parseFloat(o.series[l].size),s=parseFloat(o.series[l].center[1]),s+=s*n/100/2,o.series[l].center[1]=s+"%";return o},getDualLevelPieSeries:function(t,r,i,s,l){o.measureMin=null,o.measureMax=null;var u,c,p,h,m,g=[],d=r[0],x="(empty axis)"===d.label?"Value":d.label,y=o.colors,f=y.length,S=0,M=-1,T=!1;l.chartState.chartType;l.metadata.isOLAP?"(All)"!==l.metadata.axes[0][0].name&&(i[0].level-=1,g=a.getNodeListForDimLevelRadio(0,i)):o._isMeasureFirst(l.metadata)&&(g=a.getNodeListForSliderLevel(0,i-1));var b=e.extend(o.getGeneralOptions(l),{xAxis:{categories:[]},plotOptions:{pie:{dataLabels:{style:{fontWeight:"normal",textShadow:"none"}},slicedOffset:0,point:{events:{legendItemClick:o._getLegendItemClickHandlerDisabled}}}},series:[],labels:{items:[]},legend:o.getLegendOptions(l)});b.series.push({name:x,data:[],center:["50%","50%"],size:"60%",showInLegend:!1,dataLabels:{color:"white",distance:-50,style:{fontSize:"1em"}},columnsOutputParams:o.createOutputParameters(d,1,l)});for(var O=0;O<g.length;O++)h=g[O],c=o.getDataValue(h,r[0]),u=o.assembleFullGroupLinearName(0,h,l),h.parent.color=y[O%f],b.series[0].data.push({name:u,y:c,color:y[O%f],rowsOutputParams:o.createOutputParameters(h,0,l)});0===b.series[0].data.length&&(T=!0),b.series.push({name:x,data:[],center:["50%","50%"],size:"90%",innerSize:"60%",showInLegend:!0,dataLabels:{enabled:!1,style:{fontSize:"1em"}},columnsOutputParams:o.createOutputParameters(d,1,l)});for(var O=0;O<t.length;O++)p=t[O],p===p.parent.children[0]||l.metadata.isOLAP&&p===p.parent.children[0].children[0]?(S=0,M++,T&&(b.series[0].data.push({name:o.assembleFullGroupLinearName(0,p.parent,l),y:0,color:y[M%f],rowsOutputParams:o.createOutputParameters(p,0,l)}),p.parent.color=y[M%f])):S++,c=o.getDataValue(p,d),u=o.assembleFullGroupLinearName(0,p,l),m=.2-S/p.parent.children.length/5,b.series[1].data.push({name:u,y:c,color:n.Color(p.parent.color||y[0]).brighten(m).get(),rowsOutputParams:o.createOutputParameters(p,0,l)}),T&&(b.series[0].data[M].y+=c);return t.length||(b.series[0].data=[]),b},getCommonHeatMapOptions:function(t,a,r,i){var s=o.getCommonSeriesGeneralOptions(r);e.include(["bottom","top"],r.chartState.legend);return s=e.extend(s,{colorAxis:e.extend(e.clone(o.colorAxis),{labels:{style:{fontSize:"1em"}},tickPixelInterval:o.HEATMAP_LEGEND_TICK_INTERVAL}),series:[{borderWidth:1,data:[],dataLabels:{enabled:!1},chartType:"heatmap",columnsOutputParams:o.createOutputParameters(a[0],1,r)}],tooltip:{valueDecimals:2,formatter:function(){return this.series.yAxis.categories[this.point.y]+", "+this.series.xAxis.categories[this.point.x]+"<br/>"+a[0].label+": <b>"+(i&&null===this.point.value?null:n.numberFormat(this.point.value,2))+"</b>"},useHTML:!0,style:{fontSize:"1em"}}}),s.yAxis.title=null,s.xAxis.gridLineWidth=s.yAxis.gridLineWidth=i?0:1,s},getHeatMapOptions:function(e,t,a){var r=!0;o.measureMin=null,o.measureMax=null;var i=o.getCommonHeatMapOptions(e,t,a,r);i.legend.padding=15;var s=o.computeHeatMapMatrixData(e,t,r,a);return i.series[0].data=s.data,i.series[0].heatmapXCategories=s.xCategories,i.xAxis.categories=s.xCategories,i.yAxis.categories=s.yCategories,1!==s.xCategories.length&&(i.xAxis.minRange=1),1!==s.yCategories.length&&(i.yAxis.minRange=1),i.colorAxis.min=o.measureMin,i.colorAxis.max=o.measureMax,i},computeHeatMapMatrixData:function(t,a,r,i){var s,n,l=!1,u={data:[],xCategories:[],yCategories:[]};return e.each(a,function(a,c){n=a.parent,u.xCategories.push(n.label),e.each(t,function(e,t){l||u.yCategories.push(e.label),s=o.getDataValue(e,n.children[0],!0),(null!==s||r)&&(o.measureMinMax(s),u.data.push({x:c,y:t,value:s,rowsOutputParams:o.createOutputParameters(e,0,i)}))}),l=!0}),u},getHeatMapTimeSeriesOptions:function(t,a,r){var i=!0,s=o.getCommonHeatMapOptions(t,a,r,i);if(s.series[0].chartType="timeseries_heatmap",s.legend.padding=15,!t.length)return s;var l,u,c,p,h={},m=new Date,g={},d=864e5,x=o.getDataValue(t[0],a[0]);o.measureMin=o.measureMax=x.value,l=u=x.timestamp,e.each(t,function(e){var t=o.getDataValue(e,a[0],!0),r=t.value;h[t.timestamp]=r,l=Math.min(l,t.timestamp),u=Math.max(u,t.timestamp),o.measureMinMax(r)});var y=o.createOutputParameters(t[0],0,r),f=new Date(u);m.setTime(l);do{if(h.hasOwnProperty(m.getTime()))c=h[m.getTime()];else{if(!i){m.setUTCHours(m.getUTCHours()+1);continue}c=null}p=m.getUTCHours(),g[p]=!0,m.setUTCHours(0),y[0].value=m.getTime(),s.series[0].data.push({x:m.getTime(),y:p,value:c,rowsOutputParams:e.cloneDeep(y)}),m.setUTCHours(p+1)}while(f>=m);s.colorAxis.min=o.measureMin,s.colorAxis.max=o.measureMax,g=e.map(g,function(e,t){return parseInt(t,10)}),s.yAxis=e.extend(s.yAxis,{startOnTick:!1,endOnTick:!1,reversed:!0,tickPositioner:function(e,t){return g.slice(Math.round(e),Math.round(t)+1)},minRange:8,labels:e.extend(s.yAxis.labels,{format:"{value}:00"})}),s.series[0].name=a[0].label,s.series[0].colsize=d,s.series[0].borderWidth=0,m.setTime(l),m.setUTCHours(0),s.xAxis.min=m.getTime(),m.setTime(u),m.setUTCHours(0),s.xAxis.max=m.getTime(),s.xAxis.minRange=30*d,s.xAxis.type="datetime",s.xAxis.categories=null,s.xAxis.endOnTick=!1,s.xAxis.labels=e.extend(s.xAxis.labels,{format:"{value:%B}"}),s.xAxis.tickPositions=[],m.setTime(l);do s.xAxis.tickPositions.push(m.getTime()),1!==m.getUTCDate()&&m.setUTCDate(1),m.setUTCMonth(m.getUTCMonth()+1);while(m.getTime()<=u);return s.tooltip=e.extend(s.tooltip,{backgroundColor:null,borderWidth:0,shadow:!1,useHTML:!0,style:{padding:0,color:"black",fontSize:"1em"},formatter:function(){return'<span style="color:{series.color}">\u25cf</span> '+a[0].label+"<br/>"+n.dateFormat("%e %b %Y",this.point.x)+" "+this.point.y+":00 <b>"+(i&&null===this.point.value?null:n.numberFormat(this.point.value,2))+"</b>"}}),s.chart.isHeatMapTimeSeriesChart=!0,s},getDualMeasureSingleFieldTreeMapOptions:function(t,a,r){var i=o.getCommonSeriesGeneralOptions(r);delete i.xAxis,delete i.yAxis,delete i.legend,delete i.plotOptions;var s=[];e.each(t,function(e,t){var r,i=o.getDataValue(e,a[0],!0),n=o.getDataValue(e,a[1],!0);r=e.label,""===r&&(r=" "),s.push({id:"row_"+t,name:r,measure1Name:a[0].label,measure2Name:a[1].label,value:i,colorValue:n})});var l=function(){var e=this.point.value,t=this.point.colorValue,a=this.point.measure1Name,r=this.point.measure2Name;return e=null===e?null:n.numberFormat(e,2),t=null===t?null:n.numberFormat(t,2),this.key+"</br>"+a+": <b>"+e+"</b></br>"+r+": <b>"+t+"</b>"},u=!0,c="center",p="bottom",h="horizontal";switch(r.chartState.legend){case"top":c="center",p="top",h="horizontal";break;case"right":c="right",p="middle",h="vertical";break;case"bottom":c="center",p="bottom",h="horizontal";break;case"left":c="left",p="middle",h="vertical";break;case"none":u=!1}return e.extend(i,{plotOptions:{treemap:{}},legend:{title:{text:a[1].label},enabled:u,align:c,layout:h,borderWidth:r.chartState.legendBorder?1:0,backgroundColor:"rgba(255,255,255,0.85)",verticalAlign:p,padding:15},colorAxis:{minColor:"#FFFFFF",maxColor:n.getOptions().colors[0],maxPadding:2,tickWidth:1},series:[{borderWidth:1,data:s,dataLabels:{enabled:!1},layoutAlgorithm:"squarified",chartType:"treemap",allowDrillToNode:!0,levels:[{level:1,dataLabels:{enabled:!0},borderWidth:3}]}],tooltip:{valueDecimals:2,formatter:l,useHTML:!0,style:{fontSize:"1em"}}})},getTreeMapOptions:function(t,r,i){var s=!1;"one_parent_tree_map"===i.chartState.chartType&&(s=!0);var l=r[0].label,u=[],c={},p=function(t,a){return"/@#/"+e.clone(t).slice(a).reverse().join("/@#/")},h=function(e,t){var a,r;for(a=t;a<e.length;a++)if(r=e[a]," "!==r)return r;return" "};e.each(t,function(t){var i,n,m,g,d,x,y,f=a.getLabelNameArray(null,t),S=o.getDataValue(t,r[0],!0);for(e.each(f,function(e,t){""===e&&(f[t]=" ")}),n=p(f,0),m=p(f,1),i=1;i<f.length&&(y=h(f,i),g=p(f,i),d=p(f,i+1),c[g]||(c[g]={id:g,name:y,value:0,measureName:l,tooltipLabel:e.clone(f).slice(i).join(", ")},s===!1&&"/@#/"!==d&&(c[g].parent=d)),c[g].value+=S,!s);i++);x={id:n,name:f[0],value:S,measureName:l,tooltipLabel:e.clone(f).join(", ")},"/@#/"!==m&&(x.parent=m),u.push(x)}),e.each(c,function(e){u.push(e)});for(var m,g=0,d=n.getOptions().colors,x=0,y=u.length;y>x;x++)m=u[x],m.parent||(m.color=d[g%d.length],g++);var f=o.getCommonSeriesGeneralOptions(i);delete f.xAxis,delete f.yAxis,delete f.legend,delete f.plotOptions,0!==Object.keys(c).length&&(f.chart.marginTop=50);var S=function(){var e=this.point.tooltipLabel?this.point.tooltipLabel+"</br>":"",t=this.point.value,a=this.point.measureName;return t=null===t?null:n.numberFormat(t,2),e+a+": <b>"+t+"</b>"};return e.extend(f,{plotOptions:{treemap:{},series:{dataLabels:{overflow:"none"}}},series:[{borderWidth:1,data:u,dataLabels:{enabled:!1},layoutAlgorithm:"squarified",chartType:"treemap",allowDrillToNode:!0,drillUpButton:{relativeTo:"plotBox",position:{y:-45}},levels:[{level:1,dataLabels:{enabled:!0},borderWidth:3}],levelIsConstant:!1}],tooltip:{valueDecimals:2,formatter:S,useHTML:!0,style:{fontSize:"1em"}}})},_getLegendItemClickHandler:function(t){t.preventDefault();var a=e.flatten(e.pluck(this.series.chart.series,"data")),r=this;e.each(a,function(e){e.name==r.name&&e.setVisible(!e.visible)})},_getLegendItemClickHandlerDisabled:function(e){e.preventDefault()},getSquareSideLength:function(e,t,a){if(e>t*a)return 0;var r=a/t,i=Math.sqrt(e/r),s=i*r,n=Math.max(1,Math.floor(i)),o=Math.max(1,Math.floor(s)),l=Math.floor(t/n),u=Math.floor(a/o),c=Math.min(l,u);if(n=Math.floor(t/c),o=Math.floor(a/c),e>n*o)if(e>(n+1)*o&&e>n*(o+1))l=Math.floor(t/(n+1)),u=Math.floor(a/(o+1)),c=Math.min(l,u);else{var p=Math.ceil(e/o),h=Math.ceil(e/n);l=Math.min(Math.floor(t/p),Math.floor(a/o)),u=Math.min(Math.floor(t/n),Math.floor(a/h)),c=Math.max(l,u)}return c},computePieParams:function(e,t,a,r,i,s){var n=10,o=5,l=Math.min(Math.floor(a/t),s),u=Math.min(Math.floor(r/t),s),c=(a-t*l)/l,p=(r-t*u)/u,h=e%l===0?l:e%l,m=Math.floor(e/l)+(e%l===0?0:1),g=t*h-t/2+c*h/2,d=t*m-t/2+p*m/2,x=i+n;return{xAxisPositionPercent:100*(g-x/2)/a,yAxisPositionPercent:100*(d+x/2+o)/r,pieSizePercent:100*(t-x)/(r>a?a:r)}},measureMinMax:function(e){null!==e&&(null===o.measureMin?(o.measureMin=e,o.measureMax=e):(o.measureMin=Math.min(e,o.measureMin),o.measureMax=Math.max(e,o.measureMax)))},yAxisTickAdjust:function(t){if(!(o.measureMin<0)&&t.yAxis){var a=e.isArray(t.yAxis)?t.yAxis:[t.yAxis];0!==o.measureMin&&o.measureMin--,e.each(a,function(e){e.min||(e.min=o.measureMin,e.startOnTick=!0)})}},assembleFullGroupName:function(e,t,r,i){var s=i.chartState.chartType,n="",l=a.getLabelNameArray(e,t),u=i.metadata;if(1==e&&o.isScatterOrBubbleChart(s)&&(o._isMeasureFirst(u)?l.pop():l.shift()),!i.chartState.showSingleMeasuresLabels&&1===u.measures.length&&u.measureAxis===e){l=l.reverse();for(var c=u.axes[u.measureAxis],p=0,h=c.length;h>p;p++)"Measures"===c[p].dimension&&(p<l.length?l.splice(p,1):l.pop());l=l.reverse(),l.length||l.push("\xa0")}var m="<br>";o.isBarChart(s)?(l=l.reverse(),m=", "):o.isScatterOrBubbleChart(s)&&(m=", ");for(var g=l.length,d=0;g>d;d++)n+=l[d],g-1>d&&(n+=r?m:", ");return 0===e&&g>1&&(o.groupedCategories=!0,o.addLeaf2HighchartsCategory(l)),n},assembleFullGroupHierarchyName:function(e,t,a){return o.assembleFullGroupName(e,t,!0,a)},assembleFullGroupLinearName:function(e,t,a){return o.assembleFullGroupName(e,t,!1,a)},addLeaf2HighchartsCategory:function(e){if(null==o.highchartsCategories&&(o.highchartsCategories=[]),e.length<=1)return void o.highchartsCategories.push(e[0]);for(var t=o.highchartsCategories,a=e.length-1;a>=0;a--){var r=e[a];if(0===a)return void t.push(r);for(var i=null,s=0;s<t.length;s++)t[s].name===e[a]&&(i=t[s]);null==i&&(i={name:e[a],categories:[]},t.push(i)),t=i.categories}},getDataValue:function(e,t,r){var i=a.getDataFromRowColumn(e,t);return"object"!=typeof i&&isNaN(i)&&(i=null),r?i:null==i?0:i}}),e.extend(o,{_isTooltipFollowPointerEnabled:function(t){return!e.contains(["line","spline","area","stacked_area","percent_area","spline_area","line_time_series","spline_time_series","area_time_series","spline_area_time_series","pie","semi_pie","dual_level_pie","heat_map","heat_map_time_series","dual_measure_tree_map","tree_map","one_parent_tree_map"],t)},_isMeasureFirst:function(e){var t=e.axes[e.measureAxis];return t.length>0&&o._isMeasuresDimension(t[0].dimension)},_isMeasuresDimension:function(e){return"Measures"===e}}),e.extend(o,{isDualOrMultiAxisChart:function(e){return o.isDualAxisChart(e)||o.isMultiAxisChart(e)},isDualLevelPieChart:function(e){return"dual_level_pie"===e},isSpiderChart:function(t){return e.contains(["spider_column","spider_line","spider_area"],t)},isDualAxisChart:function(t){return e.contains(["column_line","column_spline","stacked_column_line","stacked_column_spline"],t)},isMultiAxisChart:function(t){return e.contains(["multi_axis_line","multi_axis_spline","multi_axis_column"],t)},isScatterChart:function(t){return e.contains(["scatter"],t)},isBubbleChart:function(t){return e.contains(["bubble"],t)},isScatterOrBubbleChart:function(e){return o.isScatterChart(e)||o.isBubbleChart(e)},isBarChart:function(e){return-1!=e.indexOf("bar")},isHeatMapChart:function(e){return"heat_map"===e},isHeatMapTimeSeriesChart:function(e){return"heat_map_time_series"===e},isDualMeasureTreeMapChart:function(e){return"dual_measure_tree_map"===e},isTreeMapChart:function(e){return"tree_map"===e},isOneParentTreeMapChart:function(e){return"one_parent_tree_map"===e}}),e.extend(o,{getHighchartsOptions:function(t,a,r,i){var s=o.typeToOptionsMap[t](a,r,i);o.setTurboThreshold(s),o.defaultPlotShadow(s,!(o.isDualLevelPieChart(t)||o.isHeatMapChart(t)||o.isBubbleChart(t)||o.isDualMeasureTreeMapChart(t)||o.isTreeMapChart(t)||o.isOneParentTreeMapChart(t)));var n=function(a){var r=(o.isSpiderChart(t)||o.isBarChart(t),150);if(a.length>0)if(e.isObject(a[0]))e.each(a,function(e){e.name=l(e.name,r),e.categories&&n(e.categories)});else for(var i=0;i<a.length;i++)a[i]=l(a[i],r)},l=function(e,t){return e?(e=e.substring(0,t),e=e.replace(/</g,"&lt;").replace(/>/g,"&gt;"),e=e.replace(/&lt;br&gt;/g,"<br>")):e="",e};return e.each(["xAxis","yAxis"],function(t){var a=e.isArray(s[t])?s[t]:[s[t]];e.each(a,function(e){e&&(e.categories&&n(e.categories),e.title&&e.title.text&&(e.title.text=e.title.text.replace(/</g,"&lt;").replace(/>/g,"&gt;")))})}),o.isSpiderChart(t)&&(s.chart.spacingTop=1.8*(s.xAxis.categories[0].name.split("<br>").length-1),s.chart.spacingTop*=8*(1+Math.abs(Math.sin((s.xAxis.labels.rotation||0)*Math.PI/180)))),o.isTreeMapChart(t)||(s.colors=o.colors),s=o.correctEmptySeriesNames(s)},setTurboThreshold:function(t){if(t.plotOptions){var a=-(1/0);e.each(t.series,function(e){a=Math.max(e.data.length,a)}),a>1e3&&((t.plotOptions.series||t.plotOptions.pie||t.plotOptions.treemap).turboThreshold=a+1)}},defaultPlotShadow:function(t,a){var r=t.plotOptions,i=t.chart?t.chart.type:void 0,s=i?[i]:[];0===s.length&&(s=e.pluck(t.series,"type")),r||(r={}),e.each(s,function(e){r[e]||(r[e]={}),r[e].shadow=a})},typeToOptionsMap:{column:function(e,t,a){return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},stacked_column:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="normal",r},percent_column:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="percent",r},bar:function(e,t,a){return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},stacked_bar:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="normal",r},percent_bar:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="percent",r},spider_column:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.pointPlacement="on",r},line:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},area:function(e,t,a){return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},spline_area:function(e,t,a){return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},stacked_area:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="normal",r},percent_area:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="percent",r},spider_line:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.pointPlacement="on",r},spider_area:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.pointPlacement="on",r},pie:function(e,t,a){return o.getSeriesByType(o.SeriesType.PIE,e,t,a)},semi_pie:function(e,t,a){return o.getSeriesByType(o.SeriesType.SEMI_PIE,e,t,a)},dual_level_pie:function(e,t,a){return o.getSeriesByType(o.SeriesType.DUAL_LEVEL_PIE,e,t,a)},spline:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},line_time_series:function(e,t,a){a.isTimeSeries=!0;var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},spline_time_series:function(e,t,a){a.isTimeSeries=!0;var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},area_time_series:function(e,t,a){return a.isTimeSeries=!0,o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},spline_area_time_series:function(e,t,a){return a.isTimeSeries=!0,o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},column_line:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},column_spline:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},stacked_column_line:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="normal",o.yAxisTickAdjust(r),r},stacked_column_spline:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return r.plotOptions.series.stacking="normal",o.yAxisTickAdjust(r),r},multi_axis_line:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},multi_axis_spline:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},multi_axis_column:function(e,t,a){
return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},scatter:function(e,t,a){var r=o.getSeriesByType(o.SeriesType.COMMON,e,t,a);return o.yAxisTickAdjust(r),r},bubble:function(e,t,a){return o.getSeriesByType(o.SeriesType.COMMON,e,t,a)},heat_map:function(e,t,a){return o.getSeriesByType(o.SeriesType.HEAT_MAP,e,t,a)},heat_map_time_series:function(e,t,a){return o.getSeriesByType(o.SeriesType.HEAT_MAP_TIME_SERIES,e,t,a)},dual_measure_tree_map:function(e,t,a){return o.getSeriesByType(o.SeriesType.DUAL_MEASURE_TREE_MAP,e,t,a)},tree_map:function(e,t,a){return o.getSeriesByType(o.SeriesType.TREE_MAP,e,t,a)},one_parent_tree_map:function(e,t,a){return o.getSeriesByType(o.SeriesType.ONE_PARENT_TREE_MAP,e,t,a)}},adHocToHighchartsChartTypeMap:s,getDualOrMultiAxisHighchartsType:function(e,t){var a,r={column_line:"column",column_spline:"column",stacked_column_line:"column",stacked_column_spline:"column"},i={column_line:"line",column_spline:"spline",stacked_column_line:"line",stacked_column_spline:"spline"},s={multi_axis_line:"line",multi_axis_spline:"spline",multi_axis_column:"column"};if(o.isDualAxisChart(e))a=t?i[e]:r[e];else{if(!o.isMultiAxisChart(e))throw"Unsupported chart type [chartType="+e+"]";a=s[e]}return a},correctEmptySeriesNames:function(t){return e.each(t.series,function(e){""===e.name&&(e.name=" ")}),t}}),{getHighchartsOptions:o.getHighchartsOptions,isDualOrMultiAxisChart:o.isDualOrMultiAxisChart,isDualAxisChart:o.isDualAxisChart,isMultiAxisChart:o.isMultiAxisChart,isScatterChart:o.isScatterChart,isBubbleChart:o.isBubbleChart,isScatterOrBubbleChart:o.isScatterOrBubbleChart,isBarChart:o.isBarChart,isSpiderChart:o.isSpiderChart,isDualLevelPieChart:o.isDualLevelPieChart,isHeatMapChart:o.isHeatMapChart,isHeatMapTimeSeriesChart:o.isHeatMapTimeSeriesChart,isDualMeasureTreeMapChart:o.isDualMeasureTreeMapChart,isTreeMapChart:o.isTreeMapChart,isOneParentTreeMapChart:o.isOneParentTreeMapChart,_getLegendItemClickHandler:o._getLegendItemClickHandler,_getLegendItemClickHandlerDisabled:o._getLegendItemClickHandlerDisabled,_HDM:o}},this);