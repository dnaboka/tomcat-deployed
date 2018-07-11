define(["require","underscore","bundle!adhoc_messages","common/util/browserDetection","common/component/dialog/DialogWithModelInputValidation","text!adhoc/template/topBottomFilterDialogTemplate.htm"],function(t){"use strict";var o=t("underscore"),e=t("bundle!adhoc_messages"),i=(t("common/util/browserDetection"),t("common/component/dialog/DialogWithModelInputValidation")),n=t("text!adhoc/template/topBottomFilterDialogTemplate.htm");return i.extend({constructor:function(t){t||(t={}),this.options=t;var l=this.extendModel(this.options.model);i.prototype.constructor.call(this,{modal:!0,model:l,resizable:!1,title:e["top"===l.get("type")?"ADH_1236_DIALOG_TITLE_TOP":"ADH_1236_DIALOG_TITLE_BOTTOM"],content:o.template(n,{i18n:e,model:o.extend({},l.attributes)}),buttons:[{label:e.ADH_1236_DIALOG_OK,action:"ok",primary:!0},{label:e.ADH_1236_DIALOG_CANCEL,action:"cancel",primary:!1}]}),this.on("button:ok",o.bind(this._onOk,this)),this.on("button:cancel",o.bind(this._onCancel,this))},extendModel:function(t){return t.validation=o.extend({},{limit:[{required:!0,msg:e.ADH_1236_DIALOG_ERROR_AMOUNT_REQUIRED},{range:[1,999],msg:e.ADH_1236_DIALOG_ERROR_AMOUNT_RANGE}]}),t},open:function(){this.bindValidation(),i.prototype.open.apply(this,arguments)},close:function(){this.unbindValidation(),this.clearValidationErrors(),i.prototype.close.apply(this,arguments)},_onCancel:function(){this.close(),this.remove()},_onOk:function(){this.model.isValid(!0)&&(this.close(),this.remove(),this.options.ok&&this.options.ok(this.model.toJSON()))}})});