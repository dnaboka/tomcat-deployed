define(["require","underscore","backbone","bundle!DashboardBundle","common/component/menu/HoverMenu","common/component/dialog/Dialog","dashboard/dashboardMessageBus","dashboard/enum/dashboardMessageBusEvents","text!dashboard/template/designerToolbarTemplate.htm","../viewer/ViewerToolbarView","dashboard/enum/dashboardComponentTypes","dashboard/view/designer/propertiesDialog/PropertiesDialogController","./SaveDialogView","./filterManager/FilterManagerDialog"],function(e){"use strict";var t=e("underscore"),i=(e("backbone"),e("bundle!DashboardBundle")),o=e("common/component/menu/HoverMenu"),s=(e("common/component/dialog/Dialog"),e("dashboard/dashboardMessageBus")),r=e("dashboard/enum/dashboardMessageBusEvents"),a=e("text!dashboard/template/designerToolbarTemplate.htm"),n=e("../viewer/ViewerToolbarView"),l=e("dashboard/enum/dashboardComponentTypes"),d=e("dashboard/view/designer/propertiesDialog/PropertiesDialogController"),h=e("./SaveDialogView"),p=e("./filterManager/FilterManagerDialog");return n.extend({events:{"click #grid":"toggleLayoutGrid","click #presentation":"togglePreviewMode","click #filterManager":"showFilterManagerDialog","click #filterPopup":"toggleFilterPopupDialog","click #properties":"togglePropertiesDialog","click #undo":"undo","click #undoAll":"undoAll","click #redo":"redo"},el:t.template(a,{i18n:i}),initialize:function(e){n.prototype.initialize.apply(this,arguments);var i=this.model.currentFoundation;this.dashboardId=e.dashboardId,this.state=e.state,this.saveDialog=new h({model:this.model}),this.listenTo(this.model,"change:uri",t.bind(function(){this._initSaveMenu()},this)),this.listenTo(this.model,"change:label",function(){this.setTitle(this.model.get("label"))},this),this.listenTo(i,"addComponent",function(e){e.get("type")===l.DASHBOARD_PROPERTIES&&this._initDashboardPropertiesDialogController(e)}),this.listenTo(this.saveDialog,"save",function(){this.trigger("dashboard:save")},this),this.listenTo(this.state,"change:currentState",this._onDashboardStateChange),this.listenTo(i,"addComponent removeComponent",this._onComponentsChange),this.listenTo(i.wiring,"init",function(){this.model.currentFoundation.wiring.initialized&&this.model.currentFoundation.hasVisualComponents()&&this.$("#filterManager").removeAttr("disabled").removeClass("disabledButton")},this),this.listenTo(s,r.OPEN_FILTER_MANAGER,this.showFilterManagerDialog),this._initSaveMenu(),this._initDashboardPropertiesDialogController(i.components.getDashboardPropertiesComponent()),this.setTitle(this.model.get("label"))},undo:function(){this.trigger("button:undo")},undoAll:function(){this.trigger("button:undoAll")},redo:function(){this.trigger("button:redo")},togglePreviewMode:function(){this.previewIsOn?(this.previewIsOn=!1,this.showAllButtons(["filterPopup"]),this.$("#presentation").removeClass("down"),this.$("#filterPopup").removeClass("pressed").removeClass("down"),this.filterPopupIsVisible=!1,this.$(".toolbar").removeClass("previewMode"),this.trigger("preview:off"),this.propertiesIsOn&&(this.$("#properties").addClass("down"),this.propertiesDialogController.dialog.open()),this.gridIsOn&&this.$("#grid").addClass("down"),this.setVisibility({"export":!1}),this._onDashboardStateChange()):(this.previewIsOn=!0,this.hideAllButtons(["save","presentation","export","filterPopup","undo","redo","undoAll"]),this.$(".toolbar").addClass("previewMode"),this.$("#presentation").addClass("down"),this.$("#filterPopup").removeClass("pressed").removeClass("down"),this.filterPopupIsVisible=!1,this.trigger("preview:on"),this.propertiesIsOn&&(this.$("#properties").removeClass("down"),this.propertiesDialogController.dialog.close()),this.gridIsOn&&this.$("#grid").removeClass("down"),this.setVisibility({"export":this.model.currentFoundation.components.getDashboardPropertiesComponent().get("showExportButton")})),s.trigger(r.TOGGLE_PREVIEW_MODE,this.previewIsOn)},toggleLayoutGrid:function(){this.gridIsOn?(this.gridIsOn=!1,this.$("#grid").removeClass("down"),this.trigger("grid:off")):(this.gridIsOn=!0,this.$("#grid").addClass("down"),this.trigger("grid:on"))},showFilterManagerDialog:function(){this.filterManagerDialog||(this.filterManagerDialog=new p({model:this.model.currentFoundation,dashboardId:this.dashboardId})),this.filterManagerDialog.open()},_initDashboardPropertiesDialogController:function(e){this.propertiesDialogController&&(this.stopListening(this.propertiesDialogController.dialog),this.propertiesDialogController.dialog.remove()),this.propertiesDialogController=new d(e),this.listenTo(this.propertiesDialogController.dialog,"close",function(){this.$("#properties").removeClass("down")},this),this.listenTo(this.propertiesDialogController.dialog,"button:cancel",function(){this.propertiesIsOn=!1},this),this.listenTo(this.propertiesDialogController.dialog,"button:ok",function(){this.propertiesIsOn=!1},this),this.listenTo(this.propertiesDialogController.dialog.content.original,"change",this._onDashboardPropertiesChange)},togglePropertiesDialog:function(){var e=this.$("#properties");this.propertiesIsOn?(e.removeClass("down"),this.propertiesDialogController.dialog.close(),this.propertiesIsOn=!1):(e.addClass("down"),this.propertiesDialogController.dialog.open(),this.propertiesIsOn=!0)},hideAllButtons:function(e){var i=this.$(".toolbar button");e&&t.isArray(e)&&e.length>0&&(i=i.not(t.map(e,function(e){return"[id='"+e+"']"}).join(","))),i.addClass("hidden").hide()},showAllButtons:function(e){var i=this.$(".toolbar button");e&&t.isArray(e)&&e.length>0&&(i=i.not(t.map(e,function(e){return"[id='"+e+"']"}).join(","))),i.removeClass("hidden").show()},_onDashboardStateChange:function(){this.state.hasPreviousState()?this.$("#undo, #undoAll").removeAttr("disabled").removeClass("over disabledButton"):this.$("#undo, #undoAll").attr("disabled","disabled").addClass("disabledButton").removeClass("over"),this.state.hasNextState()?this.$("#redo").removeAttr("disabled").removeClass("over disabledButton"):this.$("#redo").attr("disabled","disabled").addClass("disabledButton").removeClass("over")},_onDashboardPropertiesChange:function(e){"dashletFilterShowPopup"in e.changedAttributes()&&(this.setVisibility({filterPopup:e.get("dashletFilterShowPopup")}),e.get("dashletFilterShowPopup")||this.closeFilterPopupDialog())},_onComponentsChange:function(){var e=this.$("#save").removeClass("over"),t=this.$("#presentation").removeClass("over");this.model.currentFoundation.hasVisualComponents()?(e.removeAttr("disabled").removeClass("disabledButton"),t.removeAttr("disabled").removeClass("disabledButton"),this.model.currentFoundation.wiring.initialized&&this.$("#filterManager").removeAttr("disabled").removeClass("disabledButton")):(e.attr("disabled","disabled").addClass("disabledButton"),t.attr("disabled","disabled"),this.$("#filterManager").attr("disabled","disabled").addClass("disabledButton"))},_initSaveMenu:function(){this.saveMenu&&(this.stopListening(this.saveMenu),this.saveMenu.remove());var e=[{label:i["dashboard.save.label"],action:"save"}];this.model.isNew()||e.push({label:i["dashboard.save.as.label"],action:"saveAs"}),this.saveMenu=new o(e,this.$("#save")),this.listenTo(this.saveMenu,"option:save",t.bind(function(){this._onSaveMenuOptionSelected()},this)),this.listenTo(this.saveMenu,"option:saveAs",t.bind(function(){this._onSaveAsMenuOptionSelected()},this))},_onSaveMenuOptionSelected:function(){this.saveMenu.hide(),this.saveDialog.save()},_onSaveAsMenuOptionSelected:function(){this.saveMenu.hide(),this.saveDialog.saveAs()},remove:function(){this.saveMenu&&this.saveMenu.remove(),this.saveDialog&&this.saveDialog.remove(),this.propertiesDialogController.dialog&&this.propertiesDialogController.dialog.remove(),n.prototype.remove.apply(this,arguments)}})});