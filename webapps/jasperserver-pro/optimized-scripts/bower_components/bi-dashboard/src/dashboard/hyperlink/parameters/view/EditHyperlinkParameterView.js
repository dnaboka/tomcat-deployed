define(["require","underscore","backbone","bundle!DashboardBundle","text!../template/EditHyperlinkParameterTemplate.htm"],function(e){"use strict";var t=e("underscore"),i=e("backbone"),a=e("bundle!DashboardBundle"),d=e("text!../template/EditHyperlinkParameterTemplate.htm");return i.View.extend({template:t.template(d),tagName:"tr",className:"edit",initialize:function(e,t){t=t||{},this.editMode=t.editMode,this.render(),this.originalModelValues=this.model.toJSON(),this.listenTo(this.model,"validated",this._onValidated)},events:{"click .save.button":"_save","click .cancel.button":"_cancel"},render:function(){return this.$el.html(this.template(t.extend({},this.model.attributes,{i18n:a}))),this},_save:function(){var e=this._getValues();this.model.set(e,{validate:!0}),this.model.isValid()&&this.trigger(this.editMode?"edit":"add",this,this.model)},_onValidated:function(){this.model.validationError&&this.model.validationError.name?(this.$("td.name").addClass("error"),this.$("td.name .warning").removeClass("hidden")):(this.$("td.name").removeClass("error"),this.$("td.name .warning").addClass("hidden")),this.model.validationError&&this.model.validationError.value?(this.$("td.value").addClass("error"),this.$("td.value .warning").removeClass("hidden")):(this.$("td.value").removeClass("error"),this.$("td.value .warning").addClass("hidden"))},_getValues:function(){return{name:this.$("input[name='name']").val(),value:this.$("input[name='value']").val()}},_cancel:function(){this.trigger("cancel",this,this.model,this.originalModelValues)}})});