define(["require","backbone"],function(t){"use strict";var i=t("backbone");return i.Model.extend({defaults:function(){return{counter:0,states:[],position:-1,canUndo:!1,canRedo:!1}},initialize:function(){this.on("change:position",function(){this.set({canUndo:this.hasPrevious(),canRedo:this.hasNext()})},this)},newState:function(){this.get("position")+2<this.get("states").length&&this.get("states").splice(this.get("position")+2,this.get("states").length-this.get("position")-2),this.set("counter",this.get("counter")+1),this.get("states")[this.get("position")+1]=this.get("counter"),this.set("position",this.get("position")+1)},previousState:function(){this.get("position")>0&&this.set("position",this.get("position")-1)},firstState:function(){this.set("position",0)},nextState:function(){this.get("position")+1<this.get("states").length&&this.set("position",this.get("position")+1)},hasPrevious:function(){return this.get("position")>0},hasNext:function(){return this.get("position")+1<this.get("states").length},currentState:function(){return this.get("states")[this.get("position")]}})});