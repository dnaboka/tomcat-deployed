domain.ItemNode=function(e){dynamicTree.TreeNode.call(this,e),this.Types={Folder:new dynamicTree.TreeNode.Type("ItemGroupType"),Leaf:new dynamicTree.TreeNode.Type("ItemType")},this.nodeHeaderTemplateDomId="list_responsive_collapsible_fields:fields",this._hidden=!1,this.disabled=!1},domain.ItemNode.prototype=deepClone(dynamicTree.TreeNode.prototype),domain.ItemNode.addMethod("hide",function(e){if(e&&this.hasChilds())for(var t=0;t<this.getChildCount();t++)this.childs[t].hide(!0);var i=(this.childs.findAll(function(e){return e.disabled}).length,this.childs.findAll(function(e){return e.isHidden()}).length),a=this.childs.length-i;this.disabled||0!==a?this.getType()===this.Types.Leaf&&(this.deselect(),this.disable(domain.getMessage(domain.disabledFolderTooltip))):(this._hidden=!0,this.deselect(),this.refreshStyle())}),domain.ItemNode.addMethod("show",function(){this._hidden=!1,this._getElement()&&this.refreshStyle(this._getElement())}),domain.ItemNode.addMethod("disable",function(e){e&&(this.tooltip=e),this.disabled=!0,this._getElement()&&this.refreshStyle(this._getElement())}),domain.ItemNode.addMethod("enable",function(e){e&&(this.tooltip=e),this.disabled=!1,this._getElement()&&this.refreshStyle(this._getElement())}),domain.ItemNode.addMethod("refreshStyle",function(e){if(e||(e=this._getElement())){dynamicTree.TreeNode.prototype.refreshStyle.call(this,e),this.isHidden()?e.addClassName(layoutModule.HIDDEN_CLASS):e.removeClassName(layoutModule.HIDDEN_CLASS);var t=e.select("p").first();t&&(this.tooltip?t.title=this.tooltip:t.title="",this.disabled?(buttonManager.disable(t),buttonManager.disable(e)):(buttonManager.enable(t),buttonManager.enable(e)))}}),domain.ItemNode.addMethod("isHidden",function(){return this._hidden}),domain.ItemNode.addMethod("toJSON",function(){var e=this.param.extra,t={id:this.param.id,label:this.name,type:this.param.type};return e&&(t.labelId=e.labelId||"",t.descr=e.descr,t.descrId=e.descrId||"",t.dataType=e.dataType||"",t.resourceId=e.resourceId),this.isParent()&&(t.children=_.chain(this.childs).filter(function(e){return!e.isHidden()}).invoke("toJSON").value()),t}),domain.ItemNode.addMethod("hasVisibleChilds",function(){return this.hasChilds()&&!!this.childs.find(function(e){return!e.isHidden()})}),domain.ItemNode.addMethod("hasEnabledChilds",function(){return this.hasChilds()&&!!this.childs.find(function(e){return!e.disabled})}),domain.ItemNode.addMethod("removeChilds",function(){this.hasChilds()&&this.childs.each(function(e){this.removeChild(e)}.bind(this))}),domain.FieldsCopyMoveController=function(){domain.NodeCopyMoveController(this)},domain.FieldsCopyMoveController.prototype=deepClone(domain.NodeCopyMoveController.prototype),domain.FieldsCopyMoveController.addMethod("_buildMetanode",function(e){var t=deepClone(e.param);return t.label=e.name,t.order=e.orderNumber,t.tooltip=e.tooltip,t}),domain.TwoColumnNode=function(e){dynamicTree.TreeNode.call(this,e),this.Types={Folder:new dynamicTree.TreeNode.Type("ItemGroupType",{}),Leaf:new dynamicTree.TreeNode.Type("ItemType",{})},this.nodeHeaderTemplateDomId="list_responsive:twoColumn"},domain.TwoColumnNode.prototype=deepClone(dynamicTree.TreeNode.prototype),domain.TwoColumnNode.addMethod("_createNode",function(){var e=this.id,t=(dynamicTree.trees[this.getTreeId()],this._getHeaderTemplateElement());t.id=this.NODE_ID_PREFIX+e,this.refreshStyle(t),t.treeNode=this;var i=t.childElements()[0];this.tooltip&&(i.title=this.tooltip);var a=i.childElements()[0];a.id=this.HANDLER_ID_PREFIX+e;var d=i.childElements()[1],o=this.param.extra&&this.param.extra.label?this.param.extra.label:this.name;d.insert(xssUtil.escape(o));var s=i.childElements()[2];s.insert(xssUtil.escape(this.name)),this._element=t}),domain.TwoColumnNode.addMethod("_getTitle",function(){var e=this._getElement().childElements()[0].childElements()[2];return e.cleanWhitespace(),0===e.childNodes.length&&e.appendChild(document.createTextNode("")),e.childNodes[0]}),domain.TwoColumnNode.addMethod("toJSON",function(){var e=this.param.extra,t={id:this.param.id,label:this.name,type:this.param.type,order:this.orderNumber.toString()};return e&&(t.labelId=e.labelId||"",t.dataType=e.dataType||"",t.resourceId=e.resourceId),this.isParent()&&(t.children=_.invoke(this.childs,"toJSON")),t}),domain.TwoColumnNode.addMethod("expandAllChilds",function(){var e=dynamicTree.trees[this.getTreeId()];this.isParent()&&!this.isOpen()&&(e.writeStates(this.id,dynamicTree.TreeNode.State.OPEN),this.refreshNode()),this.hasChilds()&&this.childs.each(function(e){e.expandAllChilds()})}),domain.TablesNode=function(e){dynamicTree.TreeNode.call(this,e),this.Types={Folder:new dynamicTree.TreeNode.Type("level"),Leaf:new dynamicTree.TreeNode.Type("item")},this.nodeHeaderTemplateDomId="list_responsive_collapsible_type_tables:tables"},domain.TablesNode.prototype=deepClone(domain.ItemNode.prototype),domain.TablesNode.addMethod("toJSON",function(){var e=this.param.extra,t={id:this.param.id,label:this.name,type:this.param.type};return e&&(t.originalId=e.originalId,t.datasourceId=e.datasourceId,t.repoId=e.repoId,t.itemId=e.itemId,t.dataSource=e.dataSource,t.table=e.table,this.isParent()?(t.query=e.query,t.dataSetType=e.dataSetType):(t.expression=e.expression,t.islandId=e.islandId,t.isConstant=e.isConstant,t.JavaType=e.JavaType,t.JdbcType=e.JdbcType),e.fieldDbName&&(t.fieldDbName=e.fieldDbName)),this.isParent()&&(t.children=_.chain(this.childs).filter(function(e){return!e.isHidden()}).invoke("toJSON").value()),t}),domain.TablesNode.addVar("CONSTANT_TABLE_ID","constant_fields_level"),domain.TablesNode.addVar("CROSSTABLES_FIELDS_TABLE_ID","crossTablesFieldsLevel"),domain.TablesNode.addVar("INVALID_NODE_CLASS","invalid"),domain.TablesNode.addVar("DATA_ISLAND_CLASS","dataIsland"),domain.TablesNode.addVar("DERIVED_TABLE_CLASS","table derived"),domain.TablesNode.addVar("CONSTANT_TABLE_CLASS","table constant"),domain.TablesNode.addVar("CALCULATED_FIELD_CLASS","field calculated"),domain.TablesNode.addMethod("refreshStyle",function(e){(e||(e=this._getElement()))&&(domain.ItemNode.prototype.refreshStyle.call(this,e),this.param.extra&&"true"===this.param.extra.isInvalid?e.addClassName(this.INVALID_NODE_CLASS):e.removeClassName(this.INVALID_NODE_CLASS),this.param.extra&&this.param.extra.expression&&e.addClassName(this.CALCULATED_FIELD_CLASS),this.param.extra&&this.param.extra.query&&e.addClassName(this.DERIVED_TABLE_CLASS),this.param.id===this.CONSTANT_TABLE_ID&&e.addClassName(this.CONSTANT_TABLE_CLASS),this.param.extra&&this.param.extra.isIsland&&e.addClassName(this.DATA_ISLAND_CLASS))}),domain.TablesNode.addMethod("edit",function(e){e&&"dblclick"!==e.type||domain.ItemNode.prototype.edit.call(this,e)}),domain.TablesCustomNode=function(e){domain.TablesNode.call(this,e),this.nodeHeaderTemplateDomId=e.param.type===this.Types.Folder.name?"list_responsive_collapsible_type_tables:tables":"list_responsive_collapsible_type_tables:fields"},domain.TablesCustomNode.prototype=deepClone(domain.TablesNode.prototype),domain.TablesCopyMoveController=function(){domain.NodeCopyMoveController(this)},domain.TablesCopyMoveController.prototype=deepClone(domain.NodeCopyMoveController.prototype),domain.TablesCopyMoveController.addMethod("_buildMetanode",function(e){var t={id:e.param.id,label:e.name,type:e.param.type,uri:e.param.uri};return e.param.extra&&(t.extra={originalId:e.param.extra.originalId,table:e.param.extra.table,itemId:e.param.extra.itemId,datasourceId:e.param.extra.datasourceId,repoId:e.param.extra.repoId,dataSource:e.param.extra.dataSource,dataSetType:e.param.extra.dataSetType,query:e.param.extra.query},e.param.extra.expression&&(t.extra.expression=e.param.extra.expression),e.param.extra.fieldDbName&&(t.extra.fieldDbName=e.param.extra.fieldDbName),e.isParent()||(t.extra.JavaType=e.param.extra.JavaType,t.extra.JdbcType=e.param.extra.JdbcType,t.extra.sourceItem=e.parent.param.extra.originalId)),t}),domain.TablesCopyMoveController.addMethod("_handleDuplicatedNode",function(e,t){if(e.isParent()){for(var i=1,a=e.param.extra.datasourceId+"."+e.param.extra.itemId+i,d=dynamicTree.trees[t.getTreeId()];d.findNodeChildByMetaName(t,a);)i++,a=e.param.extra.datasourceId+"."+e.param.extra.itemId+i;return e.param.id=a,e.param.extra.itemId+=i,e.name=e.param.extra.itemId,e.param.extra.originalId=e.param.extra.itemId,t.addChild(e),e.isloaded=!0,e.hasChilds()&&e.childs.each(function(t){this._handleDuplicatedNode(t,e)}.bind(this)),a}e.param.id=e.parent.param.id+"."+e.param.extra.itemId,e.param.extra.originalId=e.parent.param.extra.originalId+"."+e.param.extra.itemId}),domain.DerivedTablesNode=function(e){domain.TablesNode.call(this,e),e.param.type===this.Types.Folder.name&&e.param.extra&&e.param.extra.query&&(this.isSelectable=!0)},domain.DerivedTablesNode.prototype=deepClone(domain.TablesNode.prototype),domain.JoinsList=function(e,t){dynamicList.List.call(this,e,t)},domain.JoinsList.prototype=deepClone(dynamicList.List.prototype),domain.JoinsList.addMethod("_changeHandler",function(e){var t=this.getItemByEvent(e);t&&(t._respondOnItemEvents&&!e.isInvoked&&this.fire("item:change",{targetEvent:e,item:t}),e.isInvoked=!0)}),domain.JoinsList.addMethod("_initEvents",function(){dynamicList.List.prototype._initEvents.call(this);var e=this._getElement();jQuery(e).off("change").on("change","select",_.bind(this._changeHandler,this))}),domain.JoinsListItem=function(e){dynamicList.ListItem.call(this,e),this._hidden=!1},domain.JoinsListItem.prototype=deepClone(dynamicList.ListItem.prototype),domain.JoinsListItem.addMethod("hide",function(e){this._hidden=!!e,this.refreshStyle()}),domain.JoinsListItem.addMethod("refreshStyle",function(){dynamicList.ListItem.prototype.refreshStyle.call(this),this._getElement()&&(this._hidden?this._getElement().addClassName(layoutModule.HIDDEN_CLASS):this._getElement().removeClassName(layoutModule.HIDDEN_CLASS))}),domain.JoinsListItem.addMethod("processTemplate",function(e){var t=e.childElements()[0];t.cleanWhitespace();var i=t.childElements()[1],a=t.childElements()[2],d=t.childElements()[3],o=d.childElements()[0],s=o.childElements();return i.update(xssUtil.escape(this._value.left.table.label)+":"+xssUtil.escape(this._value.left.label)),a.update(xssUtil.escape(this._value.right.table.label)+":"+xssUtil.escape(this._value.right.label)),s.each(function(e){e.selected=e.value===this._value.type}.bind(this)),e}),domain.JoinsListItem.addMethod("setJoinType",function(e){this.getValue().type=e;var t=this._getElement();if(t){var i=t.childElements()[0].childElements()[3].childElements()[0];$(i).value=e}}),domain.JoinsListItem.addMethod("toJSON",function(){return{left:this._value.left.id,right:this._value.right.id,type:this._value.type}}),domain.DisplayNode=function(e){domain.ItemNode.call(this,e),this.Types={Folder:new dynamicTree.TreeNode.Type("ItemGroupType"),Leaf:new dynamicTree.TreeNode.Type("ItemType")},this.nodeHeaderTemplateDomId="list_responsive_collapsible_type_sets:sets"},domain.DisplayNode.prototype=deepClone(domain.ItemNode.prototype),domain.DisplayNode.addMethod("toJSON",function(){var e=this.param.extra,t={id:this.param.id,type:this.param.type};return e&&(t.itemId=e.itemId,t.descr=e.descr,t.labelId=e.labelId||"",t.descrId=e.descrId||"",t.resourceId=e.resourceId||""),e&&e.label&&(t.label=e.label),this.isParent()?t.children=_.chain(this.childs).filter(function(e){return!e.isHidden()&&!e._markAsDeleted}).invoke("toJSON").value():(t.dataType=e.dataType,t.dimensionOrMeasure=e.dimensionOrMeasure,t.defaultMask=e.defaultMask,t.defaultAgg=e.defaultAgg),t}),domain.DisplayNode.addVar("INVALID_NODE_CLASS","invalid"),domain.DisplayNode.addMethod("refreshStyle",function(e){(e||(e=this._getElement()))&&(domain.ItemNode.prototype.refreshStyle.call(this,e),this.param.extra&&"true"===this.param.extra.isInvalid?e.addClassName(this.INVALID_NODE_CLASS):e.removeClassName(this.INVALID_NODE_CLASS))}),domain.genericTreeParams={rootUri:"/",showRoot:!1,nodeClass:domain.ItemNode,treeClassName:"",multiSelectEnabled:!0},domain.createItemsTree=function(e){return e=Object.extend(deepClone(domain.genericTreeParams),e),new dynamicTree.TreeSupport(e.treeId,e)},domain.confirmDialog={MODE_OK_CANCEL:"okCancel",MODE_YES_NO:"yesNo",_CONFIRM_DIALOG_DOM_ID:"standardConfirm",_CONFIRM_DIALOG_BODY_DOM_PATTERN:"#standardConfirm > .content > .body",_CONFIRM_DIALOG_OK_BUTTON_ID:"#confirmYes",_CONFIRM_DIALOG_CANCEL_BUTTON_ID:"#confirmNo",_CONFIRM_DIALOG_OK_PATTERN:"#confirmYes > span",_CONFIRM_DIALOG_CANCEL_PATTERN:"#confirmNo > span",_yesMessageHolder:null,_noMessageHolder:null,_dialog:null,_onOk:null,_onCancel:null,_customEventHandler:null,_templateDomId:null,_visible:!1,init:function(){domain.confirmDialog._init.bind(domain.confirmDialog)()},show:function(e,t,i,a,d){domain.confirmDialog._show.bind(domain.confirmDialog,e,t,i,a,d)()},hideForDetails:function(){dialogs.popup.hide(domain.confirmDialog._dialog)},showFromDetails:function(){dialogs.popup.show(domain.confirmDialog._dialog,!0)},visible:function(){return domain.confirmDialog._visible},_init:function(){this._dialog=$(this._CONFIRM_DIALOG_DOM_ID),this._yesMessageHolder=$$(this._CONFIRM_DIALOG_OK_PATTERN).first(),this._noMessageHolder=$$(this._CONFIRM_DIALOG_CANCEL_PATTERN).first(),domain.registerClickHandlers([this._clickEventHandler.bind(this)])},_show:function(e,t,i,a,d){this._onOk=t,this._onCancel=i,this._customEventHandler=a,this._templateDomId=e,d&&d==this.MODE_YES_NO?(this._yesMessageHolder.update(domain.getMessage("yes")),this._noMessageHolder.update(domain.getMessage("no"))):(this._yesMessageHolder.update(domain.getMessage("ok")),this._noMessageHolder.update(domain.getMessage("cancel"))),$(this._templateDomId).removeClassName(layoutModule.HIDDEN_CLASS),dialogs.popup.show(this._dialog,!0),this._visible=!0},_hide:function(e){$(this._templateDomId).addClassName(layoutModule.HIDDEN_CLASS),dialogs.popup.hide(this._dialog),this._visible=!1,e&&e()},_clickEventHandler:function(e){return domain.elementClicked(e,this._CONFIRM_DIALOG_OK_BUTTON_ID)?(this._hide(this._onOk),!0):domain.elementClicked(e,this._CONFIRM_DIALOG_CANCEL_BUTTON_ID)?(this._hide(this._onCancel),!0):this._customEventHandler?this._customEventHandler(e):void 0}},domain.detailsDialog={_DETAIL_DIALOG_DOM_ID:"detail",_DETAIL_DIALOG_CLOSE_BUTTON_ID:"#close",_DETAIL_DIALOG_LIST_DOM_ID:"detailsList",_DETAIL_DIALOG_TEXT_DOM_ID:"detailsText",_LIST_TEMPLATE:"defaultListTemplate",_LIST_ITEM_TEMPLATE:"dynamicListItemTemplate",_dialog:null,_showConfirmAfterClose:!1,_list:null,_listItems:null,init:function(){domain.detailsDialog._init.bind(domain.detailsDialog)()},show:function(e){domain.detailsDialog._show.bind(domain.detailsDialog,e)()},_init:function(){this._dialog=$(this._DETAIL_DIALOG_DOM_ID),domain.registerClickHandlers([this._clickEventHandler.bind(this)])},_show:function(e){domain.confirmDialog.visible()?(domain.confirmDialog.hideForDetails(),this._showConfirmAfterClose=!0):this._showConfirmAfterClose=!1,this._createMessage(e),dialogs.popup.show(this._dialog,!0),$(this._DETAIL_DIALOG_LIST_DOM_ID).parentNode.scrollTop=0},_createMessage:function(e){"string"==typeof e?($(this._DETAIL_DIALOG_LIST_DOM_ID).addClassName(layoutModule.HIDDEN_CLASS),$(this._DETAIL_DIALOG_TEXT_DOM_ID).removeClassName(layoutModule.HIDDEN_CLASS).update(e)):($(this._DETAIL_DIALOG_TEXT_DOM_ID).addClassName(layoutModule.HIDDEN_CLASS),$(this._DETAIL_DIALOG_LIST_DOM_ID).removeClassName(layoutModule.HIDDEN_CLASS),this._items&&(this._list.removeItems(this._items),this._items=null,this._list=null),this._items=e.collect(function(e){return new dynamicList.ListItem({label:e})}),this._list=new dynamicList.List(this._DETAIL_DIALOG_LIST_DOM_ID,{listTemplateDomId:this._LIST_TEMPLATE,itemTemplateDomId:this._LIST_ITEM_TEMPLATE,items:this._items}),this._list.show())},_close:function(){dialogs.popup.hide(this._dialog),this._showConfirmAfterClose&&domain.confirmDialog.showFromDetails()},_clickEventHandler:function(e){return domain.elementClicked(e,this._DETAIL_DIALOG_CLOSE_BUTTON_ID)?(this._close(),!0):void 0}};