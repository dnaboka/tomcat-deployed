define(["require","underscore","adhoc/filter/enum/filterExpressionTypes","adhoc/filter/enum/filterOperators","adhoc/filter/enum/filterDataTypes","jrs.configs"],function(e){"use strict";var r=(e("underscore"),e("adhoc/filter/enum/filterExpressionTypes"));e("adhoc/filter/enum/filterOperators"),e("adhoc/filter/enum/filterDataTypes"),e("jrs.configs");return{_expressionRValue:function(){var e=this.get("value");return{value:encodeURIComponent(e),dataType:this.get("filterDataType"),type:r.LITERAL}}}});