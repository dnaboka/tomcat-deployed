dd_joins.deleteJoinValidator={_DELETE_CALCFIELDS_TEMPLATE_ID:"calcFieldsForJoinConfirmMessage",_CALC_FIELDS_DETAILS_LINK_ID:"#calcFieldsForJoinsDetails",_DELETE_FILTERS_TEMPLATE_ID:"filtersForJoinConfirmMessage",_callback:null,_validateUnjoinedTableForCalcFields:null,_buildDataIslands:null,_getNotJoinedTablesAfterDeleting:null,_involvedFieldsIds:null,_involvedFieldsExpressionIds:null,init:function(i,e,s){dd_joins.deleteJoinValidator._init.bind(dd_joins.deleteJoinValidator,i,e,s)()},validate:function(i,e,s){dd_joins.deleteJoinValidator._validate.bind(dd_joins.deleteJoinValidator,i,e,s)()},_init:function(i,e,s){this._validateUnjoinedTableForCalcFields=i,this._buildDataIslands=e,this._getNotJoinedTablesAfterDeleting=s},_validate:function(i,e,s){this._callback=s;var n=this._findLostTable(i,e);n?this._validateUnjoinedTableForCalcFields(n,this._validationCallback.bind(this,i,e)):this._validateIfJoinFiledsUsedInfilters(i,e)},_validationCallback:function(i,e,s){return"success"===s?void this._validateIfJoinFiledsUsedInfilters(i,e):(this._involvedFieldsIds=s.involvedFieldsIds,this._involvedFieldsExpressionIds=s.involvedFieldsExpressionIds,void domain.confirmDialog.show(this._DELETE_CALCFIELDS_TEMPLATE_ID,this._validateIfJoinFiledsUsedInfilters.bind(this,i,e),this._onCancel.bind(this),this._showAffectedResources.bind(this)))},_validateIfJoinFiledsUsedInfilters:function(i,e){var s=this._getNotJoinedTablesAfterDeleting(i,e);s.first()?domain.confirmDialog.show(this._DELETE_FILTERS_TEMPLATE_ID,this._onOk.bind(this),this._onCancel.bind(this),this._showAffectedResources.bind(this)):this._onOk()},_onOk:function(){this._callback&&this._callback(this._involvedFieldsIds,this._involvedFieldsExpressionIds)},_onCancel:function(){},_showAffectedResources:function(i){return domain.elementClicked(i,this._CALC_FIELDS_DETAILS_LINK_ID)?(domain.detailsDialog.show(this._involvedFieldsExpressionIds),!0):void 0},_findLostTable:function(i,e){var s=this._buildDataIslands(i),n=this._buildDataIslands(i.without(e)),a=null;return s.each(function(i){if(i.each(function(i){var e=!1;if(n.each(function(s){s.each(function(s){i==s&&(e=!0)})}),!e)throw a=i,$break}),a)throw $break}),a}},dd_joins.createJoinValidator={_CREATE_COMPOSITE_KEY:"createCompositeKeyConfirmMessage",_callback:null,validate:function(i,e,s,n){dd_joins.createJoinValidator._validate.bind(dd_joins.createJoinValidator,i,e,s,n)()},_validate:function(i,e,s,n){this._callback=n;var a=i.parent.param.id,t=e.parent.param.id,o=!1;return s.each(function(i){var e=i.left.table.id===a||i.right.table.id===a,s=i.left.table.id===t||i.right.table.id===t;if(e&&s)throw o=!0,$break}),o?void domain.confirmDialog.show(this._CREATE_COMPOSITE_KEY,this._onOk.bind(this),this._onCancel.bind(this),null):void this._onOk()},_onOk:function(){this._callback&&this._callback()},_onCancel:function(){}},dd_joins.checkDesignValidator={_INVALID_DESIGN_TEMPLATE_DOM_ID:"invalidDesignConfirmMessage",_INVALID_DESIGN_LINK_ID:"#designDetails",_DONE_BUTTON_ID:"done",_callback:null,_validationCallback:null,_errorMessage:null,_showConfirmation:null,init:function(i){dd_joins.checkDesignValidator._init.bind(dd_joins.checkDesignValidator)(i)},validate:function(i,e){dd_joins.checkDesignValidator._validate.bind(dd_joins.checkDesignValidator,i,e)()},_init:function(i){this._validationCallback=i},_validate:function(i,e){this._callback=e,this._showConfirmation=i,dd.emptySetsValidator.validate(this._emptySetsCallback.bind(this))},_emptySetsCallback:function(i){"empty"===i&&domain.enableButton(this._DONE_BUTTON_ID,!1),dd.checkDesign.bind(dd,this._checkDesignCallback.bind(this))()},_checkDesignCallback:function(i){if(this._validationCallback(i),"success"===i)this._callback?this._callback():dialogs.systemConfirm.show(domain.getMessage("designIsValid"));else{this._errorMessage=i.errorMessage;var e,s=domainUtil.getUsedResourcesList(i.errorMessage,domain._messages.ITEM_BEING_USED_BY_RESOURCE);e=s.length||domainUtil.indexOfNoAccessMessage(i.errorMessage,domain._messages.resourcesWithNoAccess)>-1?domainUtil.getUsedResourcesFormattedMessage(s,i.errorMessage,{"resource.label":domain._messages["resource.label"],"field.label":domain._messages["field.label"],ITEM_BEING_USED_BY_RESOURCE:domain._messages.ITEM_BEING_USED_BY_RESOURCE,resourcesWithNoAccess:domain._messages.resourcesWithNoAccess}):this._errorMessage,this._showConfirmation&&(s.length||domainUtil.indexOfNoAccessMessage(i.errorMessage,domain._messages.resourcesWithNoAccess)>-1)?domain.confirmDialog.show(this._INVALID_DESIGN_TEMPLATE_DOM_ID,this._onOk.bind(this),this._onCancel.bind(this),_.bind(function(i){this._showAffectedResources(i,e)},this),domain.confirmDialog.MODE_YES_NO):domain.detailsDialog.show(e)}},_onOk:function(){this._callback&&this._callback()},_onCancel:function(){},_showAffectedResources:function(i,e){return domain.elementClicked(i,this._INVALID_DESIGN_LINK_ID)?(domain.detailsDialog.show(e),!0):void 0}};