define(["require","underscore","adhoc/filter/enum/filterExpressionTypes"],function(e){"use strict";var n=(e("underscore"),e("adhoc/filter/enum/filterExpressionTypes"));return{_expressionRValue:function(){var e=this.get("value")[0],o=this.get("value")[1];return null==e&&console&&console.warn("Value is undefined or null for some reason",e),null==o&&console&&console.warn("Value is undefined or null for some reason",o),{start:encodeURIComponent(null==e?"":e),end:encodeURIComponent(null==o?"":o),dataType:this.get("filterDataType"),type:n.RANGE}}}});