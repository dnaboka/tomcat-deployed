!function(t){function i(t,i){return this.name=t.name||t,this.parent=i,this}function e(t){return parseInt(t,10)-.5}function s(t){for(var i=t.length,e=0;i--;)e+=t[i];return e}function r(t,i,e,s,o){var n,h=t.length;for(o||(o=0),e.depth||(e.depth=0);h--;)n=t[h],s&&(n.parent=s),n.categories?r(n.categories,i,e,n,o+1):a(i,n,s);e.depth=d(e.depth,o)}function a(t,e,s){for(t.unshift(new i(e,s));s;)s.leaves++||(s.leaves=1),s=s.parent}function o(t,i){t.push("M",e(i[0]),e(i[1]),"L",e(i[2]),e(i[3]))}function n(t,i){return t.getPosition(t.axis.horiz,i,t.axis.tickmarkOffset)}function h(t,i,e){for(var s,r=t.length;r--;)s=t[r][i],s&&h(s,i,e),e(t[r])}var l=void 0,c=(Math.round,Math.min),d=Math.max,p=t.Axis.prototype,u=t.Tick.prototype,g=p.init,f=p.render,x=p.setCategories,b=u.getLabelSize,v=u.addLabel,y=u.destroy,G=u.render;i.prototype.toString=function(){for(var t=[],i=this;i;)t.push(i.name),i=i.parent;return t.join(", ")},p.init=function(t,i){g.call(this,t,i),"object"==typeof i&&i.categories&&this.setupGroups(i)},p.setupGroups=function(i){var e=t.extend([],i.categories),s=[],a={};r(e,s,a),this.categoriesTree=e,this.categories=s,this.isGrouped=0!==a.depth,this.labelsDepth=a.depth,this.labelsSizes=[],this.labelsGridPath=[],this.tickLength=i.tickLength||this.tickLength||null,this.directionFactor=[-1,1,1,-1][this.side],this.options.lineWidth=i.lineWidth||1},p.render=function(){if(this.isGrouped&&(this.labelsGridPath=[]),this.originalTickLength===l&&(this.originalTickLength=this.options.tickLength),this.options.tickLength=this.isGrouped?.001:this.originalTickLength,f.call(this),!this.isGrouped)return void(this.labelsGrid&&this.labelsGrid.attr({visibility:"hidden"}));var t,i=this,e=i.options,s=i.top,r=i.left,a=r+i.width,n=s+i.height,c=i.hasVisibleSeries,d=i.labelsDepth,p=i.labelsGrid,u=i.horiz,g=i.labelsGridPath,x=0,b=i.opposite?u?s:a:u?n:r;for(i.userTickLength&&(d-=1),p||(p=i.labelsGrid=i.chart.renderer.path().attr({strokeWidth:e.lineWidth,stroke:e.lineColor}).add(i.axisGroup));d>=x;)b+=i.groupSize(x),t=u?[r,b,a,b]:[b,s,b,n],o(g,t),x++;p.attr({d:g,visibility:c?"visible":"hidden"}),i.labelGroup.attr({visibility:c?"visible":"hidden"}),h(i.categoriesTree,"categories",function(t){var e=t.tick;e&&(e.startAt+e.leaves-1<i.min||e.startAt>i.max?(e.label.hide(),e.destroyed=0):e.label.show())})},p.setCategories=function(t,i){this.categories&&this.cleanGroups(),this.setupGroups({categories:t}),x.call(this,this.categories,i)},p.cleanGroups=function(){var t,i=this.ticks;for(t in i)i[t].parent;delete i[t].parent,h(this.categoriesTree,"categories",function(t){var i,e=t.tick;if(e){e.label.destroy();for(i in e)delete e[i];delete t.tick}})},p.groupSize=function(t,i){var e=this.labelsSizes,r=this.directionFactor;return i!==l&&(e[t]=d(e[t]||0,i+10)),t===!0?s(e)*r:e[t]?e[t]*r:0},u.addLabel=function(){var t;v.call(this),this.axis.categories&&(t=this.axis.categories[this.pos])&&(t.name&&this.label.attr("text",t.name),this.axis.isGrouped&&this.addGroupedLabels(t))},u.addGroupedLabels=function(t){for(var i,e=this,s=this.axis,r=s.chart,a=s.options.labels,o=a.useHTML,n=a.style,h={align:"center"},l=s.horiz?"height":"width",c=0;e;)c>0&&!t.tick&&(i=r.renderer.text(t.name,0,0,o).attr(h).css(n).add(s.labelGroup),e.startAt=this.pos,e.childCount=t.categories.length,e.leaves=t.leaves,e.visible=this.childCount,e.label=i,t.tick=e),s.groupSize(c,e.label.getBBox()[l]),t=t.parent,e=t?e.parent=t.tick||{}:null,c++},u.render=function(t,i){if(G.call(this,t,i),this.axis.isGrouped&&this.axis.categories[this.pos]&&!(this.pos>this.axis.max)){var e,s,r,a,h,l,p=this,u=p,g=p.axis,f=p.pos,x=p.isFirst,b=g.max,v=g.min,y=g.horiz,k=(g.categories[f],g.labelsGridPath),L=g.groupSize(0),z=(g.tickLength||L,g.directionFactor),S=n(p,f),m=y?S.y:S.x,T=1;for(x&&(e=y?[g.left,S.y,g.left,S.y+g.groupSize(!0)]:g.isXAxis?[S.x,g.top,S.x+g.groupSize(!0),g.top]:[S.x,g.top+g.len,S.x+g.groupSize(!0),g.top+g.len],o(k,e)),e=y?[S.x,S.y,S.x,S.y+L]:[S.x,S.y,S.x+L,S.y],o(k,e),L=m+L;u=u.parent;)h=n(p,d(u.startAt-1,v-1)),l=n(p,c(u.startAt+u.leaves-1,b)),a=u.label.getBBox(),s=g.groupSize(T),r=y?{x:(h.x+l.x)/2,y:a.height*z+L+4}:{x:L,y:(h.y+l.y+a.height)/2},u.label.attr(r),k&&(e=y?[l.x,L,l.x,L+s]:[L,l.y,L+s,l.y],o(k,e)),L+=s,T++}},u.destroy=function(){for(var t=this;t=t.parent;)t.destroyed++||(t.destroyed=1);y.call(this)},u.getLabelSize=function(){return this.axis.isGrouped===!0?s(this.axis.labelsSizes):b.call(this)}}(Highcharts);