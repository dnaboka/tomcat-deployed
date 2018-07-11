define(["require","underscore","./Dialog","common/util/xssUtil","text!./template/alertDialogTemplate.htm","bundle!js-sdk/CommonBundle"],function(t){"use strict";var e=t("underscore"),s=t("./Dialog"),o=t("common/util/xssUtil"),i=t("text!./template/alertDialogTemplate.htm"),n=t("bundle!js-sdk/CommonBundle");return s.extend({contentTemplate:e.template(i),constructor:function(t){t||(t={}),s.prototype.constructor.call(this,{modal:t.modal!==!1,message:t.message,additionalCssClasses:"alertDialog "+(t.additionalCssClasses||""),title:t.title||n["dialog.exception.title"],buttons:[{label:n["button.close"],action:"close",primary:!0}]},t)},initialize:function(t){s.prototype.initialize.apply(this,arguments),this.on("button:close",this.close),this.setMessage(t.message)},setMessage:function(t){t=o.escape(t,{softHTMLEscape:!0,whiteList:["br"]}),this.content=this.contentTemplate({message:t});var e=this.renderContent();this.$contentContainer.html(e)}})});