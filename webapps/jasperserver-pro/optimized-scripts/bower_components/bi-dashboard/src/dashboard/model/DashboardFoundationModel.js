define(["require","backbone","underscore","jquery","../enum/dashboardComponentTypes","../enum/dashboardWiringStandardIds","../collection/DashboardWiringCollection","../collection/DashboardComponentCollection"],function(t){"use strict";var n=t("backbone"),i=t("underscore"),e=t("jquery"),o=t("../enum/dashboardComponentTypes"),s=t("../enum/dashboardWiringStandardIds"),r=t("../collection/DashboardWiringCollection"),h=t("../collection/DashboardComponentCollection");return n.Model.extend({defaults:{id:void 0,description:void 0,wiring:void 0,layout:void 0,components:void 0},initialize:function(t,n){this.components=new h,this.wiring=new r,this.listenTo(this.components,"add",i.bind(function(t,n,i){this.trigger("addComponent",t,this),t.acceptWiringVisitor(this.wiring)},this)),this.listenTo(this.components,"remove",i.bind(function(t,n,i){this.trigger("removeComponent",t,this),t.get("type")===o.INPUT_CONTROL?(this.wiring.unregister(t),t.getParent()&&(t.getParent().getChildren().length?t.getParent().notify(!0):this.components.remove(t.getParent()))):t.get("type")===o.FILTER_GROUP?(this.components.remove(t.getChildren()),t.notify(!0),this.wiring.unregister(t)):this.wiring.unregister(t)},this)),this.listenTo(this.components,"change",i.bind(function(t,n,e){var s=t.changedAttributes();s&&(("width"in s||"height"in s)&&this.trigger("resizeComponent",t,this),("x"in s||"y"in s)&&this.trigger("moveComponent",t,this),"selected"in s&&this.trigger("selectComponent",t,this)),i.contains(i.values(o),t.get("type"))&&this.trigger("changeProperties",t,this)},this)),this.listenTo(this.components,"edit",i.bind(function(t){this.trigger("editComponent",t,this)},this)),this.listenTo(this.components,"changedControlProperties",i.bind(function(t){this.trigger("changedControlProperties",t,this)},this)),this.listenTo(this.wiring,"add change remove",i.bind(function(t,n,i){this.trigger("changeWiring",t,this)},this))},startLoadingSequence:function(){var t=this.wiring,n=this,i=this.components.getDashboardPropertiesComponent();e.when.apply(null,this.components.reduce(function(t,n){return n.componentInitializedDfd&&t.push(n.componentInitializedDfd),t},[])).then(function(){e.when.apply(null,n.components.reduce(function(t,n){return n.paramsDfd&&t.push(n.paramsDfd),t},[])).then(function(){t.initialized=!0,t.trigger("init")}),n.components.setEnabledCascading(!0),n.components.setMuteFilterPanels(!1),n.components.setCurrentParametersStateAsDefault(),i.trigger(s.INIT_SIGNAL,{}),t.enableAutowiring()})},hasVisualComponents:function(){return this.components.any(function(t){return t.isVisible()})}})});