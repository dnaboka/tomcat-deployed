define(["require","backbone.marionette"],function(e){var o=e("backbone.marionette");return o.Behavior.extend({events:{mouseover:"_onMouseOver",mouseout:"_onMouseOut"},_onMouseOver:function(e){this.view.trigger("mouseover",this.view.model,e)},_onMouseOut:function(e){this.view.trigger("mouseout",this.view.model,e)}})});