define(["require","jquery","underscore"],function(r){function t(r){r.$(".jrPage").each(function(r,t){var e=n(t),i=e.attr("style")||"",a=e.css("transform"),o=e.css("transform-origin");i.indexOf("transform")>=0&&-1==i.indexOf("-webkit-transform")&&e.attr("style",[i,"-webkit-transform:",a,"; -webkit-transform-origin:",o,";"].join(""))})}var e,n=r("jquery"),i=r("underscore");return{prepareForExport:function(r){t(r)},applyReferenceSize:function(r,t){var n,i=r.$(".dashboardCanvas:first");e=e||i.attr("style")||!1,n=Math.min(3508/t.width,2480/t.height),i.attr("style","-webkit-transform: scale("+n+"); transform-origin: left top; transform: scale("+n+"); -webkit-transform-origin: left top; width: "+t.width+"px; height: "+t.height+"px;")},removeReferenceSize:function(r){i.isUndefined(e)||(r.$(".dashboardCanvas:first").attr("style",e?e:null),e=void 0)}}});