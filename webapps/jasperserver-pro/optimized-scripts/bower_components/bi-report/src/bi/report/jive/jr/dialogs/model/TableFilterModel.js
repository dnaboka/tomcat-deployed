define(["require","backbone.epoxy","underscore"],function(e){"use strict";var t=e("backbone.epoxy"),r=e("underscore");return t.Model.extend({defaults:{operator:null,value:null},computeds:{isMultiValueOperator:function(){var e=this.get("operator");return e&&-1!==e.toLowerCase().indexOf("between")?!0:!1}},initialize:function(){this.on("change:operator",this._onOperatorChange),t.Model.prototype.initialize.apply(this,arguments)},reset:function(){return this.clear({silent:!1}).set(this.defaults),this},_onOperatorChange:function(){var e,t=this.get("value"),n=this.get("operator");e=n&&-1!==n.toLowerCase().indexOf("between"),e===!0?r.isArray(t)||this.set({value:[t]}):e===!1&&r.isArray(t)&&this.set({value:t[0]})},remove:function(){}})});