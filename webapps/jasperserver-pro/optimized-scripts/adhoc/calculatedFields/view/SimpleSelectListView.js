define(["require","common/extension/jQueryDoubletapExtension","underscore","jquery","backbone","common/util/featureDetection","text!adhoc/calculatedFields/template/SimpleSelectListTemplate.htm"],function(e){"use strict";e("common/extension/jQueryDoubletapExtension");var t=e("underscore"),i=e("jquery"),l=e("backbone"),n=e("common/util/featureDetection"),c=e("text!adhoc/calculatedFields/template/SimpleSelectListTemplate.htm");return l.View.extend({template:t.template(c),events:{mousedown:"clickHandler"},initialize:function(){n.supportsTouch?this.$el.doubletap(t.bind(this.dblClickHandler,this)):this.events.dblclick="dblClickHandler"},render:function(e){this.$el.empty();var t={};return t.items=e,this.$el.html(this.template(t)),this},clickHandler:function(e){this.triggerEvent(e,"item:click")},dblClickHandler:function(e){this.triggerEvent(e,"item:dblClick")},triggerEvent:function(e,t){var l=e.target.match(".pickList li")?e.target:i(e.target).parents(".pickList li")[0];l&&(this.clearSelection(),i(l).addClass("selected"),this.trigger(t,l.readAttribute("itemId")))},clearSelection:function(){this.$el.find("li.selected").removeClass("selected")}})});