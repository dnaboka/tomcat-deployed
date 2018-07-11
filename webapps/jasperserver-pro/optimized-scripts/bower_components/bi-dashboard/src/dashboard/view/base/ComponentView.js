define(["require","exports","module","backbone","underscore","jquery","common/util/domUtil","common/component/dialog/AlertDialog","bundle!DashboardBundle"],function(e,i,o){"use strict";var t=e("backbone"),n=e("underscore"),r=e("jquery"),s=e("common/util/domUtil"),h=e("common/component/dialog/AlertDialog"),a=e("bundle!DashboardBundle");return t.View.extend({template:n.template(""),el:function(){return this.template({i18n:a})},initialize:function(e){this.ready=new r.Deferred,this.dashboardProperties=e.dashboardProperties,this.dashboardId=e.dashboardId,this.listenTo(this.model,"change",this._onPropertiesChange),this.listenTo(this.model,"change:interactive",function(){this.model.get("interactive")?this.removeOverlay():this.addOverlay()}),n.bindAll(this,"_onWindowResize"),r(window).on("resize",this._onWindowResize),this._onViewInitialize&&this._onViewInitialize(),this._initComponent&&this._initComponent()},render:function(){return this._onViewRender&&this._onViewRender(),this._renderComponent&&this._renderComponent(),this},resize:function(){this._onViewResize&&this._onViewResize(),this._resizeComponent&&this._resizeComponent()},remove:function(e){this.removeOverlay(),this._errorDialog&&this._errorDialog.remove(),r(window).off("resize",this._onWindowResize),this._removeComponent&&this._removeComponent(e),this._onViewRemove&&this._onViewRemove(),t.View.prototype.remove.apply(this,arguments)},addOverlay:function(){},removeOverlay:function(){this.$overlay&&this.$overlay.remove(),this.$overlay=null},showErrorDialog:function(e){var i=s.getElementOffset(this.$el[0]),o=this.$el.width(),t=this.$el.height();this._errorDialog||(this._errorDialog=new h({modal:!1})),this._errorDialog.setMessage(e.toString()),this._errorDialog.open({top:t/3+i.top,left:o/3+i.left})},_onPropertiesChange:function(){this._onComponentPropertiesChange&&this._onComponentPropertiesChange()},_onWindowResize:function(e){e.target.tagName||(this.resizeTimer&&clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(n.bind(this.resize,this),300))}})});