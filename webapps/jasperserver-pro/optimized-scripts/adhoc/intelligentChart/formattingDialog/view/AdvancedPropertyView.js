define(["require","underscore","jquery","backbone","common/component/tooltip/Tooltip","bundle!adhoc_messages","adhoc/intelligentChart/formattingDialog/model/AdvancedPropertyModel","text!adhoc/intelligentChart/formattingDialog/template/AdvancedPropertyTooltipTemplate.htm","text!adhoc/intelligentChart/formattingDialog/template/AdvancedPropertyTemplate.htm"],function(t){"use strict";var e=t("underscore"),o=t("jquery"),i=t("backbone"),n=t("common/component/tooltip/Tooltip"),l=t("bundle!adhoc_messages"),a=(t("adhoc/intelligentChart/formattingDialog/model/AdvancedPropertyModel"),t("text!adhoc/intelligentChart/formattingDialog/template/AdvancedPropertyTooltipTemplate.htm")),r=t("text!adhoc/intelligentChart/formattingDialog/template/AdvancedPropertyTemplate.htm");return i.View.extend({template:e.template(r),tagName:"tr",initialize:function(){this.listenTo(this.model,"destroy",this.remove),this.listenTo(this.model,"change",this.render),this.render()},events:{"click .edit.button":"_edit","click .delete.button":"_delete","mouseover [data-tooltip]":"showTooltip"},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.tooltip=new n({attachTo:this.$el,i18n:l,contentTemplate:a}),this},showTooltip:function(t){var e={};e[o(t.target).data("bind")]=!0,this.tooltip.show(this.model,e)},_edit:function(){this.trigger("edit",this)},_delete:function(){i.trigger("advancedProperty:delete",this,this.model)},remove:function(){this.tooltip&&this.tooltip.remove(),i.View.prototype.remove.apply(this,arguments)}})});