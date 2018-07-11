define(["require","underscore","jquery","bi/report/enum/scaleStrategies","backbone"],function(e){"use strict";function t(e){return{display:"table-cell","font-weight":e.get("bold")?"bold":"normal","font-style":e.get("italic")?"italic":"normal","text-decoration":e.get("underline")?"underline":"normal","font-family":e.get("font")||"inherit",color:e.get("color"),"text-overflow":1==e.get("scaleToFit")?"ellipsis":"","background-color":e.get("backgroundColor")}}var n=e("underscore"),i=e("jquery"),o=e("bi/report/enum/scaleStrategies"),s=e("backbone");return s.View.extend({initialize:function(){n.bindAll(this,"applyFontSize"),this.$el.css({"white-space":"nowrap",overflow:"hidden","line-height":1}),this.$content=i("<span></span>"),this.$el.append(this.$content),i(window).on("resize",this.applyFontSize)},remove:function(){i(window).off("resize",this.applyFontSize)},applyFontSize:function(e){function t(){$["text-align"]="center",$.fontSize=l()+"px",g.$content.css("padding",z*m+"px")}function i(){$["vertical-align"]="middle",$.fontSize=s()+"px",g.$content.css("padding",w*m+"px")}function s(){return p=Math.floor(r()/g.$content.height()*u)}function l(){for(p=Math.floor(a()/g.$content.width()*u),g.$el.css("fontSize",p+"px");a()<g.$content.width();)g.$el.css("fontSize",--p+"px");return g.$el.css("fontSize",Math.floor(u)+"px"),p}function r(){return(w-2*h)*(1-2*m)}function a(){return(z-2*h)*(1-2*m)}function c(){var e=(g.model.get("text")||"").length;return 1===e?.1/e:3>e?.2/e:.3/e}var d,h,p,g=this,f=this.model.get("scaleToFit"),u=this.model.get("size"),$={"text-align":this.model.get("alignment"),"vertical-align":this.model.get("verticalAlignment")},x={padding:0},m=c(),z=this.$el.parent().width(),w=this.$el.parent().height();!e||n.isUndefined(e.padding)?(d=this.$el.css("padding"),h=d&&d.indexOf("px")>0?+d.replace("px",""):0):h=+e.padding,this.$el.css("fontSize",Math.floor(u)+"px"),this.$content.css(x),this.$el.width(z),this.$el.height(w-2*h),f==o.WIDTH?t():f==o.HEIGHT?i():f==o.CONTAINER&&(l()>s()?i():t()),this.$el.css($)},toggleHyperlinkCssClass:function(){this.$el.toggleClass("hyperlink",this.model.get("exposeOutputsToFilterManager"))},render:function(e){return this.$el.css(t(this.model)),this.$content.text(n.isUndefined(e)?this.model.get("text")||"":e),n.defer(this.applyFontSize),this.toggleHyperlinkCssClass(),this}})});