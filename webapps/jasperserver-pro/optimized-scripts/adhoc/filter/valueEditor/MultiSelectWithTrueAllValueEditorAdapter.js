define(["require","underscore","adhoc/filter/valueEditor/MultiSelectValueEditorAdapter","components/multiSelect/view/MultiSelectWithTrueAll","adhoc/filter/format/OlapFilterValueFormatter","adhoc/filter/format/filterValueFormatter"],function(e){"use strict";var t=e("underscore"),l=e("adhoc/filter/valueEditor/MultiSelectValueEditorAdapter"),i=e("components/multiSelect/view/MultiSelectWithTrueAll"),r=e("adhoc/filter/format/OlapFilterValueFormatter"),a=e("adhoc/filter/format/filterValueFormatter");return l.extend({createList:function(){return new i({getData:t.bind(this.model.dataProvider.getData,this.model),selectedListOptions:{formatLabel:this.model.isOlap?new r(this.model.get("isFirstLevelInHierarchyAll")).format:a},resizable:!0})},_setValueToList:function(e){this.model.get("isAnyValue")?this.list.setTrueAll(!0):this.list.setValue(this.getValue(),e)}})});