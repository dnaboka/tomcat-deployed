define(["jquery","highcharts"],function($,Highcharts){var JRDefaultHighchartsSettingService={perform:function(t,n){var e=this;$.each(n,function(n,o){o&&e.setProperty(t,o.prop,o.val,o.isFunction)})},setProperty:function(options,propertyPath,propertyValue,isFunction){var tokens=propertyPath.split("."),obj=options,idx,tokenToProp=function(t){var n=/^([a-zA-Z0-9$_]+)(?:\[(\d+)\])$/.exec(t);return n?{name:n[1],position:parseInt(n[2])}:{name:t,position:-1}},setProp=function(t,n,e){var o,r,i=t[n.name],p=Math.max(n.position,0);return $.isArray(i)?r=i[p]=e(i[p]):n.position<0?r=t[n.name]=e(i):(o=t[n.name]=new Array(n.position+1),"undefined"!=typeof i&&null!=i&&(o[0]=i),r=o[p]=e(o[p])),r};for(idx=0;idx<tokens.length-1;++idx)obj=setProp(obj,tokenToProp(tokens[idx]),function(t){return"undefined"==typeof t||null==t?{}:t});setProp(obj,tokenToProp(tokens[idx]),function(){return isFunction?eval("["+propertyValue+"][0]"):propertyValue})}};return JRDefaultHighchartsSettingService});