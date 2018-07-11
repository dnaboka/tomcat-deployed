dc.display={ITEMS_TREE_DOM_ID:"foldersTreeRoot",CONTAINER_TREE_DOM_ID:"containerTree",MOVE_BUTTON_IDS:["#toTop","#upward","#downward","#toBottom"],treeItemsModel:null,treeItemsMap:{},listItemsModel:null,listItemsMap:{},itemOriginalLabels:null,flatList:null,flatListOrderChanged:!1,itemsTree:null,changeOrderController:new domain.NodeChangeOrderController,lastSelectedNode:null,fillForm:function(){$("slSortedQueryTree").writeAttribute("value",dc.display.getTreeItemsModelJSON()),$("slSortedQueryList").writeAttribute("value",dc.display.getListItemsModelJSON()),$("isSimpleListCheckbox").writeAttribute("value",dc.display.flatList?"true":"false"),$("unsavedChangesPresent").writeAttribute("value",dc.isUnsavedChangesPresent().toString())},getTreeItemsModelJSON:function(){return dc.display.convertNodesModelToJSON(dc.display.treeItemsModel)},getListItemsModelJSON:function(){return dc.display.convertNodesModelToJSON(dc.display.listItemsModel)},convertNodesModelToJSON:function(e){var t="";return e.children&&e.children.each(function(e){t&&(t+=","),t+=dc.display._convertNodeToJSON(e)}),"["+t+"]"},_prepareNodeForJSON:function(e){var t={};if(t.id=e.id,t.label=e.label,t.type=e.type,t.order=e.order,e.extra&&(t.labelId=e.extra.labelId?e.extra.labelId:"",t.dataType=e.extra.dataType?e.extra.dataType:"",t.resourceId=e.extra.resourceId),e.children){for(var i=e.children,s=new Array(i.length),r=0;r<i.length;r++)s[r]=dc.display._prepareNodeForJSON(i[r]);s.sort(function(e,t){return e.order-t.order}),t.children=s}return t},_convertNodeToJSON:function(e){var t=dc.display._prepareNodeForJSON(e);return Object.toJSON(t)},init:function(e){this.setUpJSONModels(e),this.initTree(),this.initFlatListOrderChanged(),this.initTreeEvents(),domain.resetTreeSelectionHandler.init(this.MOVE_BUTTON_IDS.concat(["#"+this.ITEMS_TREE_DOM_ID]),function(){return[this.itemsTree]}.bind(this),this.itemSelectionClearCallback.bind(this)),domain.registerClickHandlers([this.moveButtonsClickEventHandler.bind(this),this.displayAsButtonsClickEventHandler.bind(this)]),this.updateMoveButtonsState(),this.itemsTree.renderTree(),this.flatList||this.itemsTree.getRootNode()&&this.itemsTree.getRootNode().expandAllChilds()},setUpJSONModels:function(e){this.treeItemsModel=e.treeItemsModel,this.listItemsModel=e.listItemsModel,this.itemOriginalLabels=e.itemOriginalLabels,this.flatList=e.isFlatList},buildMapModelFromNode:function(e,t){t[e.id]=e,e.tooltip&&delete e.tooltip,e.children&&e.children.length>0&&e.children.each(function(i){i.parent=e,this.buildMapModelFromNode(i,t)}.bind(this))},buildTreeFromModel:function(e){this.itemsTree&&this.itemsTree.getRootNode()&&this.itemsTree.getRootNode().childs.each(function(e){e&&e.parent.removeChild(e)});var t=e?this.listItemsModel:this.treeItemsModel;this.itemsTree.setRootNode(this.itemsTree.processNode(t));for(var i in dynamicTree.nodes){var s=dynamicTree.nodes[i];if(this.itemOriginalLabels[s.param.id]&&(s.param.extra.label=this.itemOriginalLabels[s.param.id],e&&!s.isParent())){var r=this.treeItemsMap[s.param.id].parent;if(r){var d=this.itemOriginalLabels[r.id];s.param.extra.label=d+"."+s.param.extra.label}}s.getTreeId()===this.ITEMS_TREE_DOM_ID&&(s.editable=!0)}this.itemsTree.renderTree()},buildLeafArrayFromItemsMap:function(e){var t=[];for(var i in e){var s=e[i];s.children||t.push(s)}return t},initFlatListOrderChanged:function(){if(this.flatList)for(var e=this.buildLeafArrayFromItemsMap(this.treeItemsMap),t=this.buildLeafArrayFromItemsMap(this.listItemsMap),i=0;i<e.length;i++)if(e[i].id!==t[i].id){this.flatListOrderChanged=!0;break}},initTree:function(){if(this.itemsTree=domain.createItemsTree({treeId:this.ITEMS_TREE_DOM_ID,nodeClass:domain.TwoColumnNode,templateDomId:"list_responsive"}),this.itemsTree.NODE_CUSTOM_PATTERNS=[layoutModule.COLUMN_NODE_WRAPPER_PATTERN],this.itemsTree.LEAF_CUSTOM_PATTERNS=[layoutModule.COLUMN_LEAF_WRAPPER_PATTERN],[{rootNode:this.treeItemsModel,map:this.treeItemsMap},{rootNode:this.listItemsModel,map:this.listItemsMap}].each(function(e){this.buildMapModelFromNode(e.rootNode,e.map)}.bind(this)),this.buildTreeFromModel(this.flatList),isIPad()){var e=$("containerTree");new TouchController(e,e.up(1))}},deselectAllExceptSiblings:function(e){if(e&&e.parent&&e!=this.itemsTree.getRootNode()){var t=e.parent.childs.collect(function(e){return{node:e,selected:e.isSelected()}}),i=this.itemsTree.selectedNodes.collect(function(e){return e});this.itemsTree.resetSelected(),t.each(function(e){e.selected&&e.node.select()}),i.each(function(e){e.refreshStyle()})}},buildFlatLabel:function(e,t){if(e){for(var i=e.parent,s=dynamicTree.trees[e.getTreeId()],r=t?e.name:e.param.extra.label;i&&i!=s.getRootNode();)-1==r.indexOf(i.name)&&(r=t?i.name+"."+r:i.param.extra.label+"."+r),i=i.parent;return r}},updateListItemsMapByNode:function(e){e&&(e.isParent()?e.hasChilds()&&e.childs.each(function(e){this.updateListItemsMapByNode(e)}.bind(this)):this.listItemsMap[e.param.id].label=this.buildFlatLabel(e,!0))},nodeMouseup:function(e){var t=e.memo.node;t&&(null!=dynamicTree.treeNodeEdited&&dynamicTree.treeNodeEdited!==t&&dynamicTree.treeNodeEdited.doEndEdit(),(null==dynamicTree.treeNodeEdited||dynamicTree.treeNodeEdited!==t)&&(this.flatList||this.deselectAllExceptSiblings(t),1===this.itemsTree.selectedNodes.length&&this.lastSelectedNode===t&&t.edit()),1===this.itemsTree.selectedNodes.length?this.lastSelectedNode=this.itemsTree.selectedNodes.first():this.lastSelectedNode=null,this.updateMoveButtonsState(),sessionManager.resetSession(dc.flowExecutionKey),Event.stop(e))},nodeEdit:function(e){var t=e.memo.node,i=e.memo.newValue;t&&t.name!==i&&(t.name=i,this.treeItemsMap[t.param.id].label=i,this.treeItemsMap[t.param.id].extra.labelId="",this.flatList?(this.listItemsMap[t.param.id].label=i,this.listItemsMap[t.param.id].extra.labelId=""):this.updateListItemsMapByNode(t)),t.deselect(),this.updateMoveButtonsState(),sessionManager.resetSession(dc.flowExecutionKey),Event.stop(e)},initTreeEvents:function(){for(var e in this.treeEventFactory)this.itemsTree.observe(e,this.treeEventFactory[e].bind(this))},updateNodeOrderNumberInItemsMap:function(e,t){this.flatList?(this.flatListOrderChanged=!0,this.listItemsMap[e.param.id].order=t):this.treeItemsMap[e.param.id].order=t},updateMoveButtonsState:function(){if(this.itemsTree&&this.itemsTree.selectedNodes.length>0){var e=this.itemsTree.selectedNodes[0].parent,t=this.changeOrderController.findMaxSiblingNode(e.childs,!1,!0),i=this.changeOrderController.findMaxSiblingNode(e.childs,!0,!1),s=t&&t.orderNumber<i.orderNumber;["toTop","upward"].each(function(e){domain.enableButton(e,s)});var r=this.changeOrderController.findMaxSiblingNode(e.childs,!1,!1),d=this.changeOrderController.findMaxSiblingNode(e.childs,!0,!0),a=r&&r.orderNumber>d.orderNumber;["downward","toBottom"].each(function(e){domain.enableButton(e,a)})}else["toTop","upward","downward","toBottom"].each(function(e){domain.enableButton(e,!1)})},moveButtonsClickEventHandler:function(e){var t=!1;return this.moveButtonsClickEventMap.each(function(i){if(domain.elementClicked(e,i.key)){var s=this.itemsTree.selectedNodes,r=s.sort(i.value.upward?this.changeOrderController.nodeAscSorter:this.changeOrderController.nodeDescSorter),d=i.value.upward?r.first():r.last();throw r.each(function(e){this.changeOrderController.moveNode(e,i.value.upward,i.value.maxmove,this.updateNodeOrderNumberInItemsMap.bind(this))}.bind(this)),this.itemsTree.resortSubtree(s[0].parent),this.itemsTree.renderTree(),d.scroll($(this.CONTAINER_TREE_DOM_ID)),this.updateMoveButtonsState(),sessionManager.resetSession(dc.flowExecutionKey),t=!0,$break}}.bind(this)),t},itemSelectionClearCallback:function(){null!=dynamicTree.treeNodeEdited&&dynamicTree.treeNodeEdited.doEndEdit(),this.updateMoveButtonsState()},convertTreeModelToListModel:function(e,t,i){if(e){if(!e.isParent()){var s=this.treeItemsMap[e.param.id],r={id:s.id,tooltip:s.tooltip,type:s.type,uri:s.uri};r.extra=deepClone(s.extra),r.label=this.buildFlatLabel(e,!0),r.extra.label=this.buildFlatLabel(e,!1),r.order=t++,i.push(r)}return e.hasChilds()&&e.childs.each(function(e){t=this.convertTreeModelToListModel(e,t,i)}.bind(this)),t}},convertTreeViewToListView:function(){var e=[];this.convertTreeModelToListModel(this.itemsTree.getRootNode(),1,e),this.listItemsModel.children=e,this.buildMapModelFromNode(this.listItemsModel,this.listItemsMap)},displayAsButtonsClickEventHandler:function(e){var t=!1;return this.displayAsButtonsClickEventMap.each(function(i){if(domain.elementClicked(e,i.key)){if(this.flatList!==i.value.flatListState)return;if(this.flatListOrderChanged&&!confirm(domain.getMessage("sortingInfoWillBeLost")))return;throw this.flatListOrderChanged=!1,this.flatList=!this.flatList,this.flatList&&this.convertTreeViewToListView(),this.buildTreeFromModel(this.flatList),this.itemsTree.resortTree(),this.itemsTree.renderTree(),this.flatList||this.itemsTree.getRootNode()&&this.itemsTree.getRootNode().expandAllChilds(),i.value.removeClassName&&$("foldersTree").removeClassName(i.value.removeClassName),i.value.addClassName&&$("foldersTree").addClassName(i.value.addClassName),this.itemsTree.resetSelected(),this.updateMoveButtonsState(),sessionManager.resetSession(dc.flowExecutionKey),t=!0,$break}}.bind(this)),t}};var dc_display=dc.display;dc_display.treeEventFactory={"leaf:mouseup":dc_display.nodeMouseup,"node:mouseup":dc_display.nodeMouseup,"node:edit":dc_display.nodeEdit,"leaf:edit":dc_display.nodeEdit},dc_display.moveButtonsClickEventMap=$H({"#toTop":{upward:!0,maxmove:!0},"#upward":{upward:!0,maxmove:!1},"#downward":{upward:!1,maxmove:!1},"#toBottom":{upward:!1,maxmove:!0}}),dc_display.displayAsButtonsClickEventMap=$H({"#nestedList":{flatListState:!0,removeClassName:"flat"},"#flatList":{flatListState:!1,addClassName:"flat"}}),"undefined"==typeof require&&document.observe("dom:loaded",dc.initialize.bind(dc));