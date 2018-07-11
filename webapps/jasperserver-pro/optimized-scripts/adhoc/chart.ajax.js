_.extend(AdHocChart,{addAsMeasure:function(e,s){designerBase.sendRequest("ch_insertMeasure",{fs:e,i:s})},addAsLastMeasure:function(e){designerBase.sendRequest("ch_insertMeasureLast",{fs:e})},replaceMeasure:function(e){designerBase.sendRequest("ch_replaceMeasures",{f:e})},moveMeasure:function(e,s){designerBase.sendRequest("ch_moveMeasure",["f="+e,"t="+s])},moveMeasureUp:function(){var e=parseInt(selObjects[0].index);designerBase.sendRequest("ch_moveMeasure",["f="+e,"t="+(e+1)])},moveMeasureDown:function(){var e=parseInt(selObjects[0].index);designerBase.sendRequest("ch_moveMeasure",["f="+e,"t="+(e-1)])},switchToMeasure:function(e,s,n){designerBase.sendRequest("ch_switchToMeasure",{fs:e,to:n})},setGroup:function(e){designerBase.sendRequest("ch_setGroup",["g="+encodeText(e)])},removeMeasure:function(e){e||0===e||(e=AdHocChart.getCurrentMeasure()),designerBase.sendRequest("ch_removeMeasure",["i="+e])},removeGroup:function(){designerBase.sendRequest("ch_removeGroup",[])},switchToGroup:function(e,s){designerBase.sendRequest("ch_switchToGroup",["fs="+encodeText(e),"from="+s])},changeChartType:function(e){designerBase.sendRequest("ch_changeType",["t="+e])},toggle3D:function(){designerBase.sendRequest("ch_toggle3D",[])},toggleStack:function(){designerBase.sendRequest("ch_toggleStack",[])},toggleOrientation:function(){designerBase.sendRequest("ch_toggleChartOrientation",[])},togglePoints:function(){designerBase.sendRequest("ch_togglePoints",[])},toggleLines:function(){designerBase.sendRequest("ch_toggleLines",[])},toggleGradient:function(){designerBase.sendRequest("ch_toggleGradient",[])},toggleBackground:function(){designerBase.sendRequest("ch_toggleBackground",[])},toggleLegend:function(){designerBase.sendRequest("ch_toggleLegend",[])},toggleXAxisLabel:function(){designerBase.sendRequest("ch_toggleXAxisLabel",[])},toggleYAxisLabel:function(){designerBase.sendRequest("ch_toggleYAxisLabel",[])},updateLegendLabel:function(e,s){e.blank()&&(e=" "),designerBase.sendRequest("ch_setLegendLabel",["l="+encodeText(e),"i="+s])},setSummaryFunction:function(e,s){designerBase.sendRequest("ch_setSummaryFunction",["f="+e,"i="+s])},setSummaryFunctionAndMask:function(e,s,n){designerBase.sendRequest("ch_setSummaryFunctionAndMeasureMask",["f="+e,"m="+encodeText(s),"i="+n])},setMask:function(e,s){designerBase.sendRequest("ch_setMeasureMask",["m="+encodeText(e),"i="+s])},moveChart:function(e,s){designerBase.sendRequest("ch_moveChart",["x="+e,"y="+s])},resizeChart:function(e,s){var n=AdHocChart.computeDimensions(e,s);n&&designerBase.sendRequest("ch_resizeChart",["w="+n[0],"h="+n[1]])}}),AdHocChart.updateViewCallback=function(e){adhocDesigner.updateStateAndRender(e)},AdHocChart.standardOpCallback=function(e){localContext.standardChartOpCallback(e)},AdHocChart.standardChartOpCallback=function(e){adhocDesigner.updateStateAndRender(e)};