define(["require","./CollectionView","../../../enum/dashboardWiringStandardIds","../../../enum/dashboardComponentTypes"],function(e){"use strict";var n=e("./CollectionView"),t=e("../../../enum/dashboardWiringStandardIds");e("../../../enum/dashboardComponentTypes");return n.extend({initCollectionEventHandlers:function(){this.listenTo(this.collection,"add remove change:id change:parameter",this.render)},addSubview:function(e){return e.get("parameter")!==t.APPLY_SLOT&&(!e.component||e.component.isParametrized())?n.prototype.addSubview.call(this,e):void 0}})});