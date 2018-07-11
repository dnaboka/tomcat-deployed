define(["require","underscore","jquery","backbone","bundle!adhoc_messages","adhoc/intelligentChart/formattingDialog/view/AdvancedPropertyView","adhoc/intelligentChart/formattingDialog/model/AdvancedPropertyModel","adhoc/intelligentChart/formattingDialog/view/EditAdvancedPropertyView","common/component/dialog/ConfirmationDialog","common/component/dialog/AlertDialog","adhoc/intelligentChart/formattingDialog/collection/AdvancedPropertiesCollection","text!adhoc/intelligentChart/formattingDialog/template/AdvancedSectionTemplate.htm","css!attributes.css"],function(t){"use strict";var e=t("underscore"),i=t("jquery"),o=t("backbone"),n=t("bundle!adhoc_messages"),r=t("adhoc/intelligentChart/formattingDialog/view/AdvancedPropertyView"),s=t("adhoc/intelligentChart/formattingDialog/model/AdvancedPropertyModel"),a=t("adhoc/intelligentChart/formattingDialog/view/EditAdvancedPropertyView"),c=t("common/component/dialog/ConfirmationDialog"),l=t("common/component/dialog/AlertDialog"),d=t("adhoc/intelligentChart/formattingDialog/collection/AdvancedPropertiesCollection"),h=t("text!adhoc/intelligentChart/formattingDialog/template/AdvancedSectionTemplate.htm");return t("css!attributes.css"),o.View.extend({className:"advancedSection",template:e.template(h),initialize:function(){this._subviews=[],this.collection=new d,this.confirmationDialog=new c,this.listenTo(this.collection,"add",this.addAdvancedPropertyView),this.listenTo(this.collection,"reset",this.onCollectionReset),this.listenTo(this.collection,"validation:invalid",this.onCollectionValidationError),this.listenTo(this.collection,"validation:valid",this.onCollectionValid),this.listenTo(o,"advancedProperty:delete",this.onDelete),this.render()},events:{"click .addNewItem":"addNewItem"},render:function(){return this.$el.html(this.template({i18n:n})),this},calculateZIndexes:function(){setTimeout(function(){i("#chartFormatDialog").css("z-index",+i("#dialogDimmer").css("z-index")-1),i("#chartTypeSelector").css("z-index",+i("#dialogDimmer").css("z-index")-2)},0)},reset:function(t){this.collection.reset(t)},toJSON:function(){return this.collection.toJSON()},resetState:function(){this.isEditing=!1,this.showAddBtn(),this._currentPropertyView&&this._currentPropertyView.$el.show(),this._currentPropertyView=null,this._currentEditPropertyView&&this._currentEditPropertyView.remove(),this._currentEditPropertyView=null},renderAdvancedProperty:function(t){var e=new r({model:t});return this.$("tbody").append(e.$el),this.listenTo(e,"edit",this.onEdit),e},addAdvancedPropertyView:function(t){var e=this.renderAdvancedProperty(t);this._subviews.push(e)},showAddBtn:function(){this.$(".addNewItem").show()},hideAddBtn:function(){this.$(".addNewItem").hide()},onEdit:function(t){var e=this;this.isEditing?(this.confirmationDialog.setContent(n.ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_STOP_EDITING),this.confirmationDialog.open(),this.calculateZIndexes(),this.listenToOnce(this.confirmationDialog,"button:yes",function(){e.showEditAdvancedPropertyView(t)})):this.showEditAdvancedPropertyView(t)},onCancel:function(t,e,i){e.set(i),this.removeEditAdvancedPropertyView()},onCollectionReset:function(){e.invoke(this._subviews,"remove"),this.collection.each(this.addAdvancedPropertyView,this)},onCollectionValid:function(){this.removeEditAdvancedPropertyView()},onCollectionValidationError:function(t,e,i){var o,r=this;i.message===t.validationMessages.DUPLICATE_MODEL_EDIT?(o=new l({message:n.ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_PROPERTY_ALREADY_EXISTS_NO_OVERRIDE.replace("{0}",e.get("name"))}),this.listenToOnce(o,"button:close",function(){o.remove()}),o.open(),this.calculateZIndexes()):i.message===t.validationMessages.DUPLICATE_MODEL_ADD&&(this.confirmationDialog.setContent(n.ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_PROPERTY_ALREADY_EXISTS.replace("{0}",e.get("name"))),this.confirmationDialog.open(),this.calculateZIndexes(),this.listenToOnce(this.confirmationDialog,"button:yes",function(){t.get(e).set({value:e.get("value")}),r.removeEditAdvancedPropertyView()}).listenToOnce(this.confirmationDialog,"button:no",function(){r.stopListening(r.confirmationDialog)}))},onSaveItem:function(t,e){this.collection.add(e)},onDelete:function(t,i){var o=this;this.confirmationDialog.setContent(n.ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_CONFIRM_DELETE_PROPERTY.replace("{0}",i.get("name"))),this.confirmationDialog.open(),this.calculateZIndexes(),this.listenToOnce(this.confirmationDialog,"button:yes",function(){i.trigger("destroy",i),o._subviews=e.reject(o._subviews,function(e){return t===e})}),this.listenToOnce(this.confirmationDialog,"button:no",function(){o.stopListening(o.confirmationDialog)})},addNewItem:function(){this.showEditAdvancedPropertyView()},scrollTo:function(t){var e=i(".table-container");e.animate({scrollTop:t.position().top+e.scrollTop()-29},1e3),t.find("input:first").focus()},showEditAdvancedPropertyView:function(t){var e=t?new a({model:t.model},{editMode:!0}):new a({model:new s});this.listenTo(e,"add edit",this.onSaveItem).listenTo(e,"cancel",this.onCancel),this._currentEditPropertyView&&this._currentEditPropertyView.remove(),this.isEditing=!0,this.hideAddBtn(),this._currentEditPropertyView=e,t?(this._currentPropertyView&&this._currentPropertyView.$el.show(),this._currentPropertyView=t,e.$el.insertAfter(t.$el),t.$el.hide()):this.$("tbody").append(e.$el),this.scrollTo(e.$el)},removeEditAdvancedPropertyView:function(){this._currentEditPropertyView&&(this.stopListening(this._currentEditPropertyView),this._currentEditPropertyView.remove(),this._currentEditPropertyView=null),this.showAddBtn(),this.isEditing=!1,this._currentPropertyView&&(this._currentPropertyView&&this._currentPropertyView.$el.show(),this._currentPropertyView=null)},remove:function(){e.invoke(this._subviews,"remove"),o.View.prototype.remove.call(this)}})});