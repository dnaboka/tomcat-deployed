AdHocTable.GRID_SELECTOR_MENU_CLASS="menu vertical dropDown",AdHocTable.ACTION_MODEL_CONTEXT_SUFFIX="_mutton",AdHocTable.mouseDownHandler=function(){},AdHocTable.mouseUpHandler=function(e){if(Draggables.dragging!=designerBase.COLUMN_LEVEL&&Draggables.dragging!=designerBase.GROUP_LEVEL&&!TouchController.element_scrolled){var a=isSupportsTouch()?getTouchedElement(e):e.element(),t=null,n=null,o=null;if(("dimensionsTree"==Draggables.dragging||"measuresTree"==Draggables.dragging)&&(t=matchAny(a,[adhocDesigner.COLUMN_OVERLAY_PATTERN],!0),t&&(o=a.identify(),n=n?n:AdHocTable.digitRegex.exec(o)[0],isSupportsTouch()||(AdHocTable.hoverColumn=n),AdHocTable.deactivateVisualDropCue(e,n),AdHocTable.isHoverGreaterThan50Percent(e,n)&&AdHocTable.hoverColumn++),t=matchAny(a,[adhocDesigner.COLUMN_SIZER_PATTERN],!0),t&&(o=a.identify(),n=parseInt(AdHocTable.digitRegex.exec(o)[0]),AdHocTable.hoverColumn=n+1,AdHocTable.deactivateVisualDropCue(e,n))),!isSupportsTouch()||!TouchController.element_scrolled){if(t=matchAny(a,[adhocDesigner.COLUMN_OVERLAY_PATTERN],!0),t&&!isRightClick(e)){o=a.identify(),n=AdHocTable.digitRegex.exec(o)[0];var l=localContext._getTableHeaders()[n],d={};d.header=l,d.index=n,d.model=localContext.state.table.columns[n],localContext.selectTableColumn(e,d)}if(a.match(adhocDesigner.GROUP_OVERLAY_PATTERN)&&!isRightClick(e)&&a){var i={id:a.identify(),fieldName:a.readAttribute("data-fieldName"),mask:a.readAttribute("data-mask"),dataType:a.readAttribute("data-dataType"),index:a.readAttribute("data-index"),label:a.readAttribute("data-label")};localContext.selectGroup(e,i)}a.match(adhocDesigner.SUMMARY_OVERLAY_PATTERN)&&!isRightClick(e)&&(o=a.identify(),localContext.selectGrandRowCell(e,AdHocTable.digitRegex.exec(o)[0]))}}},AdHocTable.mouseOutHandler=function(e){var a,t,n=e.targetElement?e.targetElement:e.element(),o=matchAny(n,[adhocDesigner.COLUMN_OVERLAY_PATTERN],!0);o&&(n.removeClassName("over"),Draggables.dragging&&!Draggables.activeDraggable.element.hasClassName("columnSizer")&&(a=n.identify(),t=parseInt(AdHocTable.digitRegex.exec(a)[0]),AdHocTable.deactivateVisualDropCue(e,t),AdHocTable.deactivateVisualDropCue(e,t-1))),o=matchAny(n,[adhocDesigner.SUMMARY_OVERLAY_PATTERN,adhocDesigner.GROUP_OVERLAY_PATTERN],!0),o&&n.removeClassName("over"),n.match("#designer .columnSizer")&&(theBody.style.cursor="default",adhocDesigner.overlayDraggedColumn&&adhocDesigner.overlayDraggedColumn.destroy())},AdHocTable.mouseOverHandler=function(e){var a=e.targetElement?e.targetElement:e.element(),t=Draggables.dragging==designerBase.GROUP_LEVEL;if(AdHocTable.updateColumnWhileDrag(e,a,function(a,t){AdHocTable.deactivateVisualDropCue(e,t?a-1:a),AdHocTable.activateVisualDropCue(e,t?a:a-1)}),Draggables.dragging!=designerBase.AVAILABLE_FIELDS_AREA&&!AdHocTable.draggingColumnSizer){if(matched=matchAny(a,[adhocDesigner.SUMMARY_OVERLAY_PATTERN,adhocDesigner.GROUP_OVERLAY_PATTERN,"th.label"],!0),matched){var n=jQuery(matched),o=n.attr("data-index");"th"==n.get(0).tagName.toLowerCase()&&o?jQuery("#columnOverlay_"+o).addClass("over"):matched.addClassName("over")}t&&(AdHocTable.draggingMoveOverGroupIndex=a.match(adhocDesigner.GROUP_OVERLAY_PATTERN)?a.getAttribute("data-index"):-1),AdHocTable.resizeColumnWhenSizerDrag(a)}},AdHocTable.mouseClickHandler=function(e){},AdHocTable.contextMenuHandler=function(e){var a,t=e.element(),n=t.identify();if(matchAny(t,[adhocDesigner.COLUMN_OVERLAY_PATTERN],!0)){a=AdHocTable.digitRegex.exec(n)[0];var o=localContext._getTableHeaders()[a],l={};l.header=o,l.index=a,l.model=localContext.state.table.columns[a],designerBase.isInSelection(l)||localContext.selectTableColumn(e,l);var d=_.chain(selObjects).pluck("model").pluck("name").value();actionModel.setSelected(_.filter(localContext.state.columns,function(e){return _.contains(d,e.name)})),o.readAttribute("data-fieldname")!==designerBase.ARTIFICIAL_NAME&&adhocDesigner.showDynamicMenu(e,designerBase.COLUMN_LEVEL,null,AdHocTable.generateAvailableSummaryCalculationsMenu)}if(t.match(adhocDesigner.SUMMARY_OVERLAY_PATTERN)){a=AdHocTable.digitRegex.exec(n)[0];var i=$("grandSummaryRow").cells,c=i[a];designerBase.isInSelection(c)||localContext.selectGrandRowCell(e,a),actionModel.setSelected(_.map(selObjects,function(e){return e.model})),adhocDesigner.showDynamicMenu(e,designerBase.SUMMARY_LEVEL,null,AdHocTable.generateAvailableSummaryCalculationsMenu)}if(t.match(adhocDesigner.GROUP_OVERLAY_PATTERN)&&t){var r=t.readAttribute("data-index"),s={id:n,fieldName:t.readAttribute("data-fieldName"),mask:t.readAttribute("data-mask"),dataType:t.readAttribute("data-dataType"),index:r,label:t.readAttribute("data-label"),model:localContext.state.table.groups[r]};designerBase.isInSelection(s)||localContext.selectGroup(e,s),actionModel.setSelected(_.map(selObjects,function(e){return e.model})),adhocDesigner.showDynamicMenu(e,designerBase.GROUP_LEVEL)}},AdHocTable.treeMenuHandler=function(e){var a,t=e.memo.node;a=designerBase[t.isParent()||!adhocDesigner.isOnlyFieldsSelected()?"FIELDSET_MENU_LEVEL":"FIELD_MENU_LEVEL"],adhocDesigner.showDynamicMenu(e.memo.targetEvent,a,null)},AdHocTable.initKeyEvents=function(){function e(e){return null!=e.target.up(".dialog")}document.stopObserving("key:right"),document.observe("key:right",function(a){if(localContext.getMode()==designerBase.TABLE&&!e(a)){var t=Object.clone(a.memo.targetEvent),n=adhocDesigner.getSelectedColumnOrGroup();n&&designerBase.isInSelection(n)&&AdHocTable.canMoveColumnsRight()&&AdHocTable.moveColumnRight(function(){AdHocTable.updateSelectedIndexes(1),localContext.selectTableColumn(t,n)})}}),document.stopObserving("key:left"),document.observe("key:left",function(a){if(localContext.getMode()==designerBase.TABLE&&!e(a)){var t=Object.clone(a.memo.targetEvent),n=adhocDesigner.getSelectedColumnOrGroup();n&&designerBase.isInSelection(n)&&AdHocTable.canMoveColumnsLeft()&&AdHocTable.moveColumnLeft(function(){AdHocTable.updateSelectedIndexes(-1),localContext.selectTableColumn(t,n)})}})},AdHocTable.generateAvailableSummaryCalculationsMenu=function(e,a){var t=_.find(a,function(e){return"AdHocTable.selectedColumnShowsSummaryOptions"===e.clientTest});if(t){var n=actionModel.selObjects[0],o=_.findWhere(localContext.state.columns,{name:n.name});o&&adhocDesigner.generateAvailableSummaryCalculationsMenu(o.fieldName,t,{action:AdHocTable.functionSelected,isSelectedTest:AdHocTable.isSelectedSummaryFunction})}return a},AdHocTable.lmHandlersMap={addItems:function(e,a,t){this[t].addItems(_.pluck(e,"id"),a)},group:{addItem:function(e,a,t){AdHocTable.addFieldAsGroup(t,a)},addItems:function(e,a){AdHocTable.addFieldAsGroup(e,a)},removeItem:function(e,a){AdHocTable.removeGroup(a)},moveItem:function(e,a,t){AdHocTable.moveGroup(a,t)},switchItem:function(e,a,t){AdHocTable.switchToGroup(e,a,t)},contextMenu:function(e,a){var t=a.extra.name,n=_.find(localContext.state.groups,function(e){return e.name===t});localContext.selectGroup(a.targetEvent,{id:"group"+n.level+"HeaderRow0",fieldName:n.name,mask:n.mask,dataType:n.numericType,index:n.level,label:n.currentDisplayName}),actionModel.setSelected([n]),adhocDesigner.showDynamicMenu(a.targetEvent,"displayManagerRow",null,null)}},column:{addItem:function(e,a,t){AdHocTable.addFieldAsColumnAtPosition(t,a)},addItems:function(e,a){AdHocTable.addFieldAsColumnAtPosition(e,a)},removeItem:function(e,a){AdHocTable.removeColumn(a)},moveItem:function(e,a,t){AdHocTable.moveColumn(a,t,null,!0)},switchItem:function(e,a,t){AdHocTable.switchToColumn(e,a,t)},contextMenu:function(e,a){var t=a.extra,n=localContext._getTableHeaders()[t.index];localContext.selectTableColumn(a.targetEvent,{header:n,index:t.index,ftype:t.isMeasure?"measure":"dimension",model:localContext.state.table.columns[t.index]}),actionModel.setSelected([localContext.state.columns[t.index]]),adhocDesigner.showDynamicMenu(a.targetEvent,"displayManagerColumn",null,null)}}};