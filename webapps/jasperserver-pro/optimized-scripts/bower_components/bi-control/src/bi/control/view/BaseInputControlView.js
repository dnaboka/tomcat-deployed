define(["require","exports","module","underscore","backbone","jquery","domReady","mustache","logger","bundle!jasperserver_messages"],function(e,t,s){"use strict";var i=e("underscore"),n=e("backbone"),r=e("jquery"),l=(e("domReady"),e("mustache")),d=(e("logger").register(s),e("bundle!jasperserver_messages"));return n.View.extend({constructor:function(e){if(!(e&&e.model&&e.model instanceof n.Model))throw new Error("View should have associated Backbone.Model");n.View.apply(this,arguments)},initialize:function(){this.i18n=d,this.listenTo(this.model.state,"reset change",this.updateWarningMessage,this),this.listenTo(this.model,"change:label",this.render),this.render()},render:function(){return this.renderStructure(),this.renderState(),this.model.get("visible")&&this.bindCustomEventListeners(),this.updateWarningMessage(),this.model.get("readOnly")&&this.disable(),this},renderStructure:function(){var e=i.extend(this.model.toJSON(),{uuid:"jr-label-id-"+i.uniqueId(this.model.get("id"))});return this.$el=r(l.to_html(this.template||"",e)),this},renderState:function(){this.updateValue(this.model.state.get("value"))},updateValue:function(){},bindCustomEventListeners:function(){},enable:function(){return this.$el.removeClass("jr-isDisabled"),this.multiSelect?void this.multiSelect.setDisabled(!1):this.singleSelect?void this.singleSelect.setDisabled(!1):void this.$el.find("input, select").prop("disabled",!1)},disable:function(){return this.$el.addClass("jr-isDisabled"),this.multiSelect?void this.multiSelect.setDisabled(!0):this.singleSelect?void this.singleSelect.setDisabled(!0):void this.$el.find("input, select").prop("disabled",!0)},updateWarningMessage:function(){var e=this.$el.find(".jr-mInput-alert");!this.model.state.get("error")||this.model.get("isDesignerMode")?e.addClass("jr-isInvisible").text(""):e.removeClass("jr-isInvisible").text(this.model.state.get("error"))},remove:function(){this.model.state.off("reset change",this.updateWarningMessage,this),n.View.prototype.remove.call(this)}})});