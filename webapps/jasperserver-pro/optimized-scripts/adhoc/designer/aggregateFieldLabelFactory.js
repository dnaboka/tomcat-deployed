define(["require","bundle!adhoc_messages","adhoc/enum/AggregateFunctionEnum"],function(e){"use strict";function n(e){var n=u[a+e];return n||e}var u=e("bundle!adhoc_messages"),a=(e("adhoc/enum/AggregateFunctionEnum"),"adh.function.aggregate.name.");return{localizeAggregation:n,getLabel:function(e){if(!e)return null;var u=e.fieldDisplay||e.name;return e.defaultAggregateFunction===e.functionOrDefault?u:u+" ("+n(e["function"])+")"}}});