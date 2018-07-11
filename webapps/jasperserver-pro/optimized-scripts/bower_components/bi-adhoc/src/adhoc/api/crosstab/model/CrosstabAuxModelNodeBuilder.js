define(["require","exports","module","underscore","./CrosstabAuxModelNode"],function(e,n,r){function l(e,n){var r,l,o="rows"===n.id?1:0,c=e.get("dataset"),u=n.axis.toQueryMultiaxisAxisItems(),g=c.axes[o],p=t(g.levels),f=!e.get("params").offset[o],x=e.get("params").offset[o]+e.get("params").pageSize[o]>=e.get("totalCounts")[o],m=new h(!1,!1,"",i(g.axisNode,g.levels,0,p),!1);m.children.length||m.children.push(new h(!0,!1,"",[],!1));for(var v=u.length-1;v>=0;v--)r=n.expansions.getByGroupByItem(u[v]),r&&r.get("level").expanded&&(v=-1);if(r)l=[r.attributes];else if(u.length)throw new Error("No expansion to apply");return l=s.reduce(n.expansions.getMemberExpansions(),function(e,n){return e.push(n.attributes),e},l||[]),m.applyExpansions(l,n),d(m,f,x),{rootNode:m,requiredExpansions:a(m,n.expansions,[],[],c.empty)}}function t(e){for(var n=e.length-1;n>=0;n--)if(e[n].level)return n;return 0}function i(e,n,r,l){var t;return t=e.children&&e.children.length&&n[r]?s.map(e.children,function(e){return new h(e.all,!!n[r].aggregation,n[r].level?n[r].level.members[e.memberIdx]:n[r].aggregation.fields[e.memberIdx].reference,i(e,n,r+1,l),l>r&&!e.all)}):[]}function a(e,n,r,l,t){if(r.push(e.isTotal?"All":e.label||"empty_node"),e.isExpandable&&e.isExpanded===!0&&1==e.children.length&&e.children[0].isTotal&&e.children[0].childFirst&&e.children[0].childLast){var i=r.slice(1);t||n.getByPath(i)?e.isEmpty=!0:l.push({member:{expanded:!0,path:i}})}for(var d=0;d<e.children.length;d++)a(e.children[d],n,r,l,t);return r.pop(),l}function d(e,n,r,l,t){var i;if(r&&(e.childLast=!0),n&&(e.childFirst=!0),l)for(i=e;i.children.length;)i=i.children[0],i.childFirst=!0;if(t)for(i=e;i.children.length;)i=i.children[i.children.length-1],i.childLast=!0;if(e.children.length){d(e.children[0],n,!1,!1,e.children.length>1||e.children[0].isTotal);for(var a=1;a<e.children.length-1;a++)d(e.children[a],!1,!1,!0,!0);d(e.children[e.children.length-1],!1,r,e.children.length>1||e.children[e.children.length-1].isTotal,!1)}}var s=e("underscore"),h=e("./CrosstabAuxModelNode");return{buildFromDataSet:l}});