define(["require","backbone","underscore","./view/TabView","./view/BodyView","text!./template/visualChooserTemplate.htm"],function(e){var t=e("backbone"),i=e("underscore"),n=e("./view/TabView"),o=e("./view/BodyView"),s=e("text!./template/visualChooserTemplate.htm");return t.View.extend({template:i.template(s),el:function(){return this.template({options:this.options})},constructor:function(e){this.options=i.defaults(e||{},this.defaults),t.View.apply(this,arguments)},initialize:function(){i.bindAll(this,"_onGroupSelectionChange","_onTypeChange"),this.tabView=new n,this.bodyView=new o,this.listenTo(this.tabView,"change:groupSelected",this._onGroupSelectionChange),this.listenTo(this.bodyView,"change:visualizationType",this._onTypeChange)},render:function(){return this.$(".jr-mVisualchooser-panel").html(this.tabView.render().$el),this.$(".jr-mVisualchooser-body").html(this.bodyView.render().$el),this},remove:function(){this.tabView.remove(),this.bodyView.remove(),t.View.prototype.remove.call(this)},setSelectedType:function(e){this.bodyView.setSelectedType(e)},setDisabledTypes:function(e){this.bodyView.setDisabledTypes(e)},_onGroupSelectionChange:function(e){this.bodyView.trigger("change:groupSelected",e)},_onTypeChange:function(e){this.trigger("change:visualizationType",e)}})});