var FormulaMenuHandlerMap={af:{addField:function(){var e=selectedFormula.formulaId,a=adhocCalculatedFields.prepareParametersForAddCalcField();adhocCalculatedFields.createCalculatedField(e,a)},deleteField:function(){var e=designerBase.getSelectedObject(),a=adhocDesigner.getNameForSelected(e);if(adhocDesigner.isInUse(a))throw adhocCalculatedFields.ERROR_CODE_1;adhocCalculatedFields.deleteCalculatedField(a,e)},updateField:function(){var e=adhocCalculatedFields.fields[0],a=selectedFormula.formulaId,l=adhocDesigner.getNameForSelected(e),t=adhocCalculatedFields.prepareParametersForUpdateField();adhocDesigner.isInUse(l)?localContext.updateCalcFieldAndView(l,a,t):adhocCalculatedFields.updateCalculatedField(l,a,t)}},columnLevel:{addField:function(){var e=selectedFormula.formulaId,a=adhocCalculatedFields.prepareParametersForAddCalcField();adhocCalculatedFields.createCalculatedField(e,a)},updateField:function(){var e=adhocCalculatedFields.fields[0],a=selectedFormula.formulaId,l=adhocDesigner.getNameForSelected(e),t=adhocCalculatedFields.prepareParametersForUpdateField();adhocDesigner.isInUse(l)?localContext.updateCalcFieldAndView(l,a,t):adhocCalculatedFields.updateCalculatedField(l,a,t)}},tg:{}},adhocCalculatedFields={currentField:null,currentFormula:null,currentInputValue:null,currentFieldNames:null,numericFirst:!1,visible:!1,calcType:null,createCustom:!0,fieldName:"[field name]",dialog:null,submitBtn:$("createCalcField"),cancelBtn:$("cancelCalcField"),CALCULATION_TYPE_DATE:"twoDates",CALCULATION_TYPE_MULTIPLE_NUMS:"multipleNumbers",CALCULATION_TYPE_SINGLE_NUM:"singleField",CALCULATION_TYPE_TWO_NUMS:"twoNumbers",fields:[],ERROR_CODE_1:calculatedFieldErrorCode1,ERROR_CODE_2:calculatedFieldErrorCode2,ERROR_CODE_3:calculatedFieldErrorCode3,ERROR_CODE_4:calculatedFieldErrorCode4,ERROR_CODE_5:calculatedFieldErrorCode5,ERROR_CODE_6:calculatedFieldErrorCode6,ERROR_CODE_7:calculatedFieldErrorCode7,ERROR_CODE_8:calculatedFieldErrorCode8,CALCULATION_OPTIONS:{ADH_404_ADD_NUM:"singleField",ADH_408_SUBTRACT_NUM:"singleField",ADH_409_MULTIPLY_BY_NUM:"singleField",ADH_410_DIVIDE_BY_NUM:"singleField",ADH_406_ROUND:"singleField",ADH_406_RANK:"singleField",ADH_406_PERCENT:"singleField",ADH_406_PERCENT_OF_ROW_PARENT:"singleField",ADH_406_PERCENT_OF_COLUMN_PARENT:"singleField",ADH_421_DATEDIFF_SECS_UNIT:"twoDates",ADH_421_DATEDIFF_MINS_UNIT:"twoDates",ADH_421_DATEDIFF_HOURS_UNIT:"twoDates",ADH_421_DATEDIFF_DAYS_UNIT:"twoDates",ADH_421_DATEDIFF_WEEKS_UNIT:"twoDates",ADH_421_DATEDIFF_MONTHS_UNIT:"twoDates",ADH_421_DATEDIFF_QUARTERS_UNIT:"twoDates",ADH_421_DATEDIFF_YEARS_UNIT:"twoDates",ADH_405_ADD_ALL:"multipleNumbers",ADH_415_MULTIPLY_ALL:"multipleNumbers",ADH_405_ADD:"twoNumbers",ADH_411_SUBTRACT:"twoNumbers",ADH_412_MULTIPLY:"twoNumbers",ADH_413_DIVIDE:"twoNumbers"},CALCULATION_REQUEST_PARAMS:{singleField:"Basic@@Number@@OneAndConstant",twoNumbers:"Basic@@Number@@Two",multipleNumbers:"Basic@@Number@@Many",twoDates:"Special@@Date@@Two"},launchDialog:function(e){if(this.dialog=$("calculatedField"),!(selObjects.length>0))throw this.ERROR_CODE_4;if(this.fields=selObjects.clone(),this.createCustom=e?!1:!0,2==selObjects.length){var a=adhocDesigner.getNameForSelected(selObjects[0]),l=adhocDesigner.getNameForSelected(selObjects[1]);a=this.getDisplayLabelByFieldName(a),l=this.getDisplayLabelByFieldName(l),this.currentFieldNames=a+"@@"+l;var t=adhocDesigner.checkIfFieldIsNumeric(adhocDesigner.getNameForSelected(selObjects[0]));t?this.calcType=this.CALCULATION_TYPE_TWO_NUMS:this.calcType=this.CALCULATION_TYPE_DATE}else if(selObjects.length>2)this.calcType=this.CALCULATION_TYPE_MULTIPLE_NUMS;else{this.currentFieldNames=null;var i=adhocDesigner.getNameForSelected(selObjects[0]);if(this.currentFieldNames=this.getDisplayLabelByFieldName(i),this.createCustom)this.calcType=this.CALCULATION_TYPE_SINGLE_NUM;else{if(!this.isCustomFieldByFieldName(i))throw this.ERROR_CODE_2;var d=null,r=this.currentField=adhocDesigner.findFieldByName(i),s=this.currentFormula=r.formulaRef.formulaId,n=this.CALCULATION_OPTIONS[s];if(n&&(this.calcType=n),this.calcType==this.CALCULATION_TYPE_SINGLE_NUM)if(1==r.formulaRef.args.length){if(!isNotNullORUndefined(r.formulaRef.args[0].fieldRef))throw this.ERROR_CODE_3;d=r.formulaRef.args[0].fieldRef,this.currentFieldNames=this.getDisplayLabelByFieldName(d)}else isNotNullORUndefined(r.formulaRef.args[0].fieldRef)?(d=r.formulaRef.args[0].fieldRef,this.currentFieldNames=this.getDisplayLabelByFieldName(d)):(this.numericFirst=!0,d=r.formulaRef.args[1].fieldRef,this.currentFieldNames=this.getDisplayLabelByFieldName(d));else if(this.calcType==this.CALCULATION_TYPE_TWO_NUMS){var o=this.getDisplayLabelByFieldName(r.formulaRef.args[0].fieldRef),u=this.getDisplayLabelByFieldName(r.formulaRef.args[1].fieldRef);this.currentFieldNames=o+"@@"+u}}}this._prepareCalculatedFieldProcessing()},_launchDialogCallBack:function(){this._updateButton(this.createCustom),this.dialog.addClassName(this.calcType),dialogs.popup.show(this.dialog),this.visible=!0,this._preSelectFirstRadioBtn(),this.createCustom||this.updatingExistingCustomField(this.currentFieldNames,this.currentField,this.currentFormula)},_updateButton:function(e){e?($("updateCalcField").addClassName("hidden"),$("createCalcField").removeClassName("hidden")):($("createCalcField").addClassName("hidden"),$("updateCalcField").removeClassName("hidden"))},hideDialog:function(){this.dialog.setAttribute("style",""),dialogs.popup.hide(this.dialog),[this.CALCULATION_TYPE_TWO_NUMS,this.CALCULATION_TYPE_DATE,this.CALCULATION_TYPE_MULTIPLE_NUMS].each(function(e){this.dialog.hasClassName(e)&&this.dialog.removeClassName(e)}.bind(this)),selectedFormula.reset(),designerBase.unSelectAll(),this._resetDialog(),this.calcType=null,this.numericFirst=!1,this.currentField=null,this.currentFormula=null,this.currentFieldNames=null,this.currentInputValue=null,this.visible=!1},_getAllRadioBtnsInGroup:function(){return $$("input[type=radio][name='functions']")},_resetDialog:function(){for(var e=this._getAllRadioBtnsInGroup(),a=e.length,l=0;a>l;l++){e[l].checked=!1;var t=$(e[l]).identify(),i=$(t+".input");i&&(i.value="")}$("calculatedField")&&$("calculatedField").removeClassName("swap")},_clearOutInputs:function(){for(var e=this._getAllRadioBtnsInGroup(),a=e.length,l=0;a>l;l++){var t=$(e[l]).identify(),i=$(t+".input");i&&(i.value="")}},_clearOutInputsExcept:function(e){for(var a=this._getAllRadioBtnsInGroup(),l=a.length,t=0;l>t;t++){var i=$(a[t]).identify(),d=$(i+".input");d&&d.identify()!=e&&(d.value="")}},_preSelectFirstRadioBtn:function(){var e=this._getAllRadioBtnsInGroup();e&&e.length>0&&(e[0].checked=!0)},initialize:function(){$("calculatedField")&&($("calculatedField").observe("mouseup",function(e){var a=e.element(),l=null;if(l=matchAny(a,["#cancelCalcField.button"],!0),l&&this.hideDialog(),l=matchAny(a,["#createCalcField.button","#updateCalcField.button"],!0)){var t=this._processCalculatedField();t&&this.hideDialog()}l=matchAny(a,["#swap.button"],!0),l&&(this.dialog.hasClassName("swap")?(this.dialog.removeClassName("swap"),selectedFormula.isSwapped=!1):(this.dialog.addClassName("swap"),selectedFormula.isSwapped=!0))}.bind(this)),$("calculatedField").observe("keypress",function(e){var a=e.element(),l=e.keyCode?e.keyCode:e.which;if(l==Event.KEY_ESC&&(this.visible&&this.hideDialog(),Event.stop(e)),l==Event.KEY_RETURN&&Event.stop(e),a.match("input")){var t=($(a).value,this.checkValidDecimalInput(e));t||Event.stop(e)}}.bind(this)),$("calculatedField").observe("keyup",function(e){var a=e.element();a.match("input")&&(this.currentInputValue=a.value,Event.stop(e))}.bind(this)),$("calculatedField").observe("click",function(e){var a=e.element(),l=null;if(l=matchAny(a,["#cancelCalcField.button","#createCalcField.button","#updateCalcField.button","#swap.button"],!0),l&&Event.stop(e),a.match("input")){var t=null,i=a.identify(),d=a.readAttribute("type");if(d)if("radio"===d)t=$(i+".input"),this._clearOutInputs(),t&&(t.value=this.currentInputValue?this.currentInputValue:"");else if("text"===d&&i){this._clearOutInputsExcept(i);var r=i.replace(/.input$/,"");r&&!$(r).checked&&($(r).checked=!0,$(i).value=this.currentInputValue?this.currentInputValue:"")}}}.bind(this)))},_getParentForCalculated:function(e){if(!e||!e.formulaRef||!e.formulaRef.args||e.formulaRef.args.length<1)return null;var a=e.formulaRef.args[0];if(!a.fieldRef)return null;var l=adhocDesigner.dimensionsTree.findNodeById(a.fieldRef);return l?l.parent:null},_addToAvailableFields:function(e){var a=adhocDesigner.measuresTree;if(a){var l,t=adhocDesigner.findFieldByName(e),i=null,d=adhocDesigner.getFieldIndexByName(e);this.fields.length>0&&selectionCategory.area==designerBase.AVAILABLE_FIELDS_AREA?(l=this.fields[0].parent,i=l.param.uri+"/"+t.name):(l=this._getParentForCalculated(t),null!=l?i=l.param.uri+"/"+t.name:(l=a.rootNode,i="/"+t.name));var r=t.defaultDisplayName,s=t.name,n={id:s,label:r,type:"com.jaspersoft.jasperserver.api.metadata.common.domain.NewNode",uri:i,extra:{id:s,name:s,dimensionId:adhocDesigner.MEASURES,isMeasure:!0,dataType:t.type,formulaRef:t.formulaRef},order:d,cssClass:"calculatedField"},o=a.processNode(n);o.isloaded=!0,o.editable=!1,l.addChild(o),o.refreshStyle(),adhocDesigner.DIMENSIONS_TREE_DOM_ID===o.getTreeId()&&adhocDesigner.moveToMeasuresOrAttributes(o),jQuery.event.trigger("add_field",[t.name,t.defaultDisplayName])}},_removeFromAvailableFields:function(e){if(e){if(!e.parent)throw this.ERROR_CODE_5;var a=e.parent,l=e.param.extra.isMeasure;a.removeChild(e),0==a.childs.length&&!l&&a.parent&&a.parent.removeChild(a)}},isCustomField:function(e){return e.param&&e.param.extra&&e.param.extra.formulaRef},isCustomFieldByFieldName:function(e){var a=adhocDesigner.findFieldByName(e);return isNotNullORUndefined(a.formulaRef)},getDisplayLabelByFieldName:function(e){var a=adhocDesigner.findFieldByName(e);return isNotNullORUndefined(a.defaultDisplayName)?a.defaultDisplayName:e},_processCalculatedField:function(){var e=this._getSelectedCalcOption();if(e){this._setFormulaProperties(e);var a=!0;if(this.calcType==this.CALCULATION_TYPE_SINGLE_NUM){e=this._getSelectedCalcOption();var l=$(e).identify()+".input";$(l)&&(a=ValidationModule.validate([{validator:adhocDesigner.isValidNumericValue,element:$(l)}]))}return a&&(this.createCustom?this.createField():this.updateField()),a}},createField:function(){var e=null,a=FormulaMenuHandlerMap[selectionCategory.area];if(null!=a&&(e=a.addField),null==e)throw this.ERROR_CODE_6;e()},deleteField:function(){var e=null,a=FormulaMenuHandlerMap[selectionCategory.area];if(null!=a&&(e=a.deleteField),null==e)throw this.ERROR_CODE_7;e()},updateField:function(){var e=null,a=FormulaMenuHandlerMap[selectionCategory.area];if(null!=a&&(e=a.updateField),null==e)throw this.ERROR_CODE_8;e()},updatingExistingCustomField:function(e,a,l){if(!this.createCustom){var t=$(l);t&&(t.checked=!0);for(var i=!1,d=null,r=a.formulaRef,s=r.args.length,n=0;s>n;n++){var o=r.args[n];if(o&&o.type&&"Numeric"==o.type&&o.value){this.currentInputValue=d=o.value,i=!0;break}}if(i){var u=$(l+".input");u&&(u.value=d)}}if(adhocDesigner.isInUse(a.name)){var c,h=this._getAllRadioBtnsInGroup();for(c=h.length-1;c>=0;c--){var m=h[c].identify();if(m.startsWith("ADH_406_PERCENT")){var f=$(m).up("li.leaf");f&&f.remove()}}}},_getSelectedCalcOption:function(){for(var e=null,a=this._getAllRadioBtnsInGroup(),l=a.length,t=0;l>t;t++)if(a[t].checked){e=a[t];break}return e},_setFormulaProperties:function(e){var a=$(e).identify(),l=null,t="."+a.split(".")[a.split(".").length-1];selectedFormula.formulaId=a.replace(t,""),selectedFormula.isChanged=!0,selectedFormula.act=t,selectedFormula.isEdited=!this.createCustom,this.calcType==this.CALCULATION_TYPE_SINGLE_NUM&&(l=$(a+".input"),l&&(selectedFormula.constant=l.value))},findFormulaById:function(e){if(isNotNullORUndefined(formulaInfo))for(var a=formulaInfo.length,l=0;a>l;l++){var t=formulaInfo[l];if(t.id==e)return t}return null},prepareParametersForAddCalcField:function(){for(var e=selectedFormula.formulaId,a=this.findFormulaById(e),l=[],t=0;t<this.fields.length;t++){var i=adhocDesigner.getNameForSelected(this.fields[t]);l.push(i)}return 1==this.fields.length&&(2&a.mask)>0&&selectedFormula.constant&&l.push(selectedFormula.constant),selectedFormula.isSwapped&&2==l.length&&l.reverse(),l.join("|")},prepareParametersForUpdateField:function(){var e,a=selectedFormula.formulaId,l=this.fields[0],t=adhocDesigner.getNameForSelected(l),i=[],d=adhocDesigner.findFieldByName(t),r=this.findFormulaById(a);if((1&r.mask)>0)e=null!=d.formulaRef.args[0].fieldRef?d.formulaRef.args[0].fieldRef:d.formulaRef.args[1].fieldRef,i.push(e);else if(selectedFormula.constant&&(2&r.mask)>0)e=null!=d.formulaRef.args[0].fieldRef?d.formulaRef.args[0].fieldRef:d.formulaRef.args[1].fieldRef,i.push(e),i.push(selectedFormula.constant);else for(var s=0;s<d.formulaRef.args.length;s++)if(d.formulaRef.args[s]){var n=d.formulaRef.args[s].fieldRef;i.push(n)}return(!this.numericFirst&&selectedFormula.isSwapped||this.numericFirst&&!selectedFormula.isSwapped&&2==i.length)&&i.reverse(),i.join("|")},_updateLocalContextFromState:function(e){localContext.state.allColumns=e.allColumns,localContext.state.canRedo=e.canRedo,localContext.state.canUndo=e.canUndo},createCalculatedFieldCallback:function(e){var a=localContext.state.allColumns.length,l=e.newCalcFieldName;if(this._updateLocalContextFromState(e),localContext.state.allColumns.length>a){var t=adhocDesigner.findFieldByName(l);selectionCategory.area===designerBase.COLUMN_LEVEL&&localContext.addThisFieldAsColumn(t.name),this._addToAvailableFields(t.name),adhocDesigner.updateAllFieldLabels()}},deleteCustomFieldCallback:function(e,a,l){var t=localContext.state.allColumns.length;this._updateLocalContextFromState(l),localContext.state.allColumns.length<t&&a&&(this._removeFromAvailableFields(a),adhocDesigner.updateAllFieldLabels())},updateCalculatedFieldCallback:function(e){this._updateLocalContextFromState(e),adhocDesigner.updateAllFieldLabels()},createCalculatedField:function(e,a){var l=function(e){this.createCalculatedFieldCallback(e),adhocDesigner.enableCanUndoRedo()}.bind(adhocCalculatedFields);designerBase.sendRequest("co_addField",new Array("formula="+e,"args="+a),l,null)},deleteCalculatedField:function(e,a){var l=function(l){this.deleteCustomFieldCallback(e,a,l),adhocDesigner.enableCanUndoRedo()}.bind(adhocCalculatedFields);designerBase.sendRequest("co_deleteField",new Array("fieldName="+e),l)},updateCalculatedField:function(e,a,l){var t=function(e){this.updateCalculatedFieldCallback(e),adhocDesigner.enableCanUndoRedo()}.bind(adhocCalculatedFields);designerBase.sendRequest("co_updateField",new Array("fieldName="+e,"formula="+a,"args="+l),t)},render:function(e,a){if(e&&!_.isEmpty(e)){var l=adhocDesigner.registerTemplate(adhocCalculatedFields,"calcFieldsTemplate");jQuery(a).html(l(e))}},_prepareCalculatedFieldProcessing:function(){var e=function(e){this.render(e,"#calculatedFields-container"),this._launchDialogCallBack()}.bind(adhocCalculatedFields),a=this.CALCULATION_REQUEST_PARAMS[adhocCalculatedFields.calcType];a&&designerBase.sendRequest("co_setFormulaMap",new Array("params="+a,"calcType="+this.calcType,"fieldNames="+encodeText(this.currentFieldNames),"numericFirst="+this.numericFirst),e,null)},checkValidDecimalInput:function(e){var a=null,l=e.element();return a=this.getKeyCharFromEvt(e),"-"==a?!0:verifyIsInputNumericDecimalSeparator(e)?numberOfDecimals(l.value)<1:verifyIsDigitInput(e)},getKeyCharFromEvt:function(e){e=getEvent(e);var a=e.keyCode?e.keyCode:e.which;return String.fromCharCode(a)}};