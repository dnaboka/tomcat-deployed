define(["require","underscore","common/util/featureDetection","actionModel.modelGenerator","backbone","adhoc/filter/enum/filterOperators","adhoc/filter/factory/filterOperatorLabelFactory","adhoc/filter/factory/valueEditorFactory","adhoc/filter/factory/possibleOperatorsFactory","bundle!AdHocFiltersBundle","text!adhoc/filter/editor/template/filterEditorTemplate.htm"],function(e){"use strict";var t=e("underscore"),i=e("common/util/featureDetection"),r=e("actionModel.modelGenerator"),o=e("backbone"),l=(e("adhoc/filter/enum/filterOperators"),e("adhoc/filter/factory/filterOperatorLabelFactory")),n=e("adhoc/filter/factory/valueEditorFactory"),a=e("adhoc/filter/factory/possibleOperatorsFactory"),s=e("bundle!AdHocFiltersBundle"),d=e("text!adhoc/filter/editor/template/filterEditorTemplate.htm");return o.View.extend({template:t.template(d),isOlap:!1,el:function(){var e=this.model.toJSON();return e.i18n=s,this.template(e)},events:function(){var e={"click .header .operator":"showOperatorMenu","click .header .button.disclosure":"onToggleFilter"};return i.supportsTouch?e["click .header .mutton"]="showFilterMenu":e["mouseover .header .mutton"]="showFilterMenu",e}(),operators:{},initialize:function(){var e=this;this.valueEditorUIChanged=!1,t.bindAll(this,"removeFilter","upFilter","downFilter","drawToggleFilter"),this.operationsMenuActionModel=this.createOperationsMenuActionModel(),this.filterMenuActionModel=this.createFilterMenuActionModel(),this.listenTo(this.model,"operationChange",this.render),this.listenTo(this.model,"ready",this.render),this.listenTo(this.model,"change:filterPodMinimized",this.drawToggleFilter),this.listenTo(this.model,"change:filterLetter",this.redrawFilterTitle),this.listenTo(this.model,"change:label",this.redrawFilterTitle),this.model.loadAdditionalServerData(!0).done(function(){e.model.trigger("ready",e.model)})},redrawFilterTitle:function(){this.$(".filterName span").text(this.model.get("filterLetter")+"."+this.model.get("label")),this.$(".filterName span").attr("title",this.model.get("filterLetter")+"."+this.model.get("label"))},resizeTitle:function(){var e=this.$(".header .button.disclosure").width()+this.$(".header .button.operator div").width()+this.$(".header .button.operator .icon").width()+this.$(".header .button.mutton").width()+15,t=this.$(".header .title").width(),i=this.$(".header .filterName");i.css({overflow:"visible",width:"auto"});var r=i.find("span").width()+this.$(".header .button.disclosure").width()+15;i.css("overflow","hidden"),i.width(Math.min(t-e,r))},render:function(){var e=(this.model.get("operatorName"),this.getValueEditorFactory());return this.renderOperator(),this.valueEditor&&this.valueEditor.constructor==e.constructor||(this.valueEditor?(this.stopListening(this.valueEditor,"rendered",this.uiChanged),this.valueEditor.remove()):(this.$(".filter.panel").addClass("minimized"),t.defer(t.bind(this.drawToggleFilter,this))),this.valueEditor=this.createValueEditor()),this.valueEditor.updateData(),this},uiChanged:function(){this.trigger("uiChange:filters",this)},createValueEditor:function(){var e=this.getValueEditorFactory(),t=e.createInstance(this.model);return this.listenTo(t,"rendered",this.uiChanged),this.$(".body").html(t.$el),t},renderOperator:function(){this.$(".operator div").text(l(this.model.get("operatorName"),this.model.get("filterDataType"))),this.resizeTitle()},showOperatorMenu:function(e){r.showDynamicMenu("filterOperation_"+this.cid,e.originalEvent,"menu vertical dropDown fitable",null,this.operationsMenuActionModel)},showFilterMenu:function(e){r.showDynamicMenu(this.cid,e.originalEvent,"menu vertical dropDown fitable",null,this.filterMenuActionModel),e.stopPropagation()},onToggleFilter:function(){this.model.set("filterPodMinimized",!this.model.get("filterPodMinimized")),this.model.trigger("toggle",this.model)},drawToggleFilter:function(){this.$(".filter.panel")[this.model.get("filterPodMinimized")?"addClass":"removeClass"]("minimized")},removeFilter:function(e){var t=e&&e.force;this.model.get("used")&&!t?this.model.trigger("destroyConfirm",this.model,this.model.collection):this.model.trigger("destroy",this.model,this.model.collection)},upFilter:function(){this.model.trigger("move",this.model,{direction:-1})},downFilter:function(){this.model.trigger("move",this.model,{direction:1})},getValueEditorFactory:function(){var e=n(this.model.get("filterDataType"),this.model.get("operatorName"),this.isOlap);if(!e)throw"Value editor for filter data type '"+this.model.get("filterDataType")+"' and operator '"+this.model.get("operatorName")+"' does not exist";return e},createOperationsMenuActionModel:function(){var e=this,i={};return i["filterOperation_"+this.cid]=t.map(a(this.model.get("filterDataType"),this.isOlap),function(t){return r.createMenuElement("optionAction",{text:l(t,e.model.get("filterDataType")),action:function(t){e.model.set("operatorName",t)},actionArgs:[t],isSelectedTest:function(t){return e.model.get("operatorName")===t},isSelectedTestArgs:[t]})}),i},createFilterMenuActionModel:function(){var e={};return e[this.cid]=[r.createMenuElement("simpleAction",{text:s.ADH_1217_DYNAMIC_FILTER_REMOVE_FILTER,action:this.removeFilter}),r.createMenuElement("separator"),r.createMenuElement("simpleAction",{text:s.ADH_084_MOVE_UP,action:this.upFilter}),r.createMenuElement("simpleAction",{text:s.ADH_085_MOVE_DOWN,action:this.downFilter})],e},remove:function(){return this.valueEditor&&this.valueEditor.remove(),o.View.prototype.remove.call(this),this}})});