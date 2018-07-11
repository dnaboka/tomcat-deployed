var Mustache=function(){function e(e){return String(e).replace(/&(?!\w+;)|[<>"']/g,function(e){return a[e]||e})}var t=Object.prototype.toString;Array.isArray=Array.isArray||function(e){return"[object Array]"==t.call(e)};var r,n=String.prototype.trim;if(n)r=function(e){return null==e?"":n.call(e)};else{var i,s;/\S/.test("\xa0")?(i=/^[\s\xA0]+/,s=/[\s\xA0]+$/):(i=/^\s+/,s=/\s+$/),r=function(e){return null==e?"":e.toString().replace(i,"").replace(s,"")}}var a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},o={},c=function(){};return c.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":!0},context:{},render:function(e,t,r,n){if(n||(this.context=t,this.buffer=[]),!this.includes("",e))return n?e:void this.send(e);e=this.render_pragmas(e);var i=this.render_section(e,t,r);return i===!1&&(i=this.render_tags(e,t,r,n)),n?i:void this.sendLines(i)},send:function(e){""!==e&&this.buffer.push(e)},sendLines:function(e){if(e)for(var t=e.split("\n"),r=0;r<t.length;r++)this.send(t[r])},render_pragmas:function(e){if(!this.includes("%",e))return e;var t=this,r=this.getCachedRegex("render_pragmas",function(e,t){return new RegExp(e+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+t,"g")});return e.replace(r,function(e,r,n){if(!t.pragmas_implemented[r])throw{message:"This implementation of mustache doesn't understand the '"+r+"' pragma"};if(t.pragmas[r]={},n){var i=n.split("=");t.pragmas[r][i[0]]=i[1]}return""})},render_partial:function(e,t,n){if(e=r(e),!n||void 0===n[e])throw{message:"unknown_partial '"+e+"'"};return t&&"object"==typeof t[e]?this.render(n[e],t[e],n,!0):this.render(n[e],t,n,!0)},render_section:function(e,t,r){if(!this.includes("#",e)&&!this.includes("^",e))return!1;var n=this,i=this.getCachedRegex("render_section",function(e,t){return new RegExp("^([\\s\\S]*?)"+e+"(\\^|\\#)\\s*(.+)\\s*"+t+"\n*([\\s\\S]*?)"+e+"\\/\\s*\\3\\s*"+t+"\\s*([\\s\\S]*)$","g")});return e.replace(i,function(e,i,s,a,o,c){var u,f=i?n.render_tags(i,t,r,!0):"",h=c?n.render(c,t,r,!0):"",g=n.find(a,t);return"^"===s?u=!g||Array.isArray(g)&&0===g.length?n.render(o,t,r,!0):"":"#"===s&&(u=Array.isArray(g)?n.map(g,function(e){return n.render(o,n.create_context(e),r,!0)}).join(""):n.is_object(g)?n.render(o,n.create_context(g),r,!0):"function"==typeof g?g.call(t,o,function(e){return n.render(e,t,r,!0)}):g?n.render(o,t,r,!0):""),f+u+h})},render_tags:function(t,r,n,i){for(var s=this,a=function(){return s.getCachedRegex("render_tags",function(e,t){return new RegExp(e+"(=|!|>|&|\\{|%)?([^#\\^]+?)\\1?"+t+"+","g")})},o=a(),c=function(t,i,c){switch(i){case"!":return"";case"=":return s.set_delimiters(c),o=a(),"";case">":return s.render_partial(c,r,n);case"{":case"&":return s.find(c,r);default:return e(s.find(c,r))}},u=t.split("\n"),f=0;f<u.length;f++)u[f]=u[f].replace(o,c,this),i||this.send(u[f]);return i?u.join("\n"):void 0},set_delimiters:function(e){var t=e.split(" ");this.otag=this.escape_regex(t[0]),this.ctag=this.escape_regex(t[1])},escape_regex:function(e){if(!arguments.callee.sRE){var t=["/",".","*","+","?","|","(",")","[","]","{","}","\\"];arguments.callee.sRE=new RegExp("(\\"+t.join("|\\")+")","g")}return e.replace(arguments.callee.sRE,"\\$1")},find:function(e,t){function n(e){return e===!1||0===e||e}e=r(e);var i;if(e.match(/([a-z_]+)\./gi)){var s=this.walk_context(e,t);n(s)&&(i=s)}else n(t[e])?i=t[e]:n(this.context[e])&&(i=this.context[e]);return"function"==typeof i?i.apply(t):void 0!==i?i:""},walk_context:function(e,t){for(var r=e.split("."),n=void 0!=t[r[0]]?t:this.context,i=n[r.shift()];void 0!=i&&r.length>0;)n=i,i=i[r.shift()];return"function"==typeof i?i.apply(n):i},includes:function(e,t){return-1!=t.indexOf(this.otag+e)},create_context:function(e){if(this.is_object(e))return e;var t=".";this.pragmas["IMPLICIT-ITERATOR"]&&(t=this.pragmas["IMPLICIT-ITERATOR"].iterator);var r={};return r[t]=e,r},is_object:function(e){return e&&"object"==typeof e},map:function(e,t){if("function"==typeof e.map)return e.map(t);for(var r=[],n=e.length,i=0;n>i;i++)r.push(t(e[i]));return r},getCachedRegex:function(e,t){var r=o[this.otag];r||(r=o[this.otag]={});var n=r[this.ctag];n||(n=r[this.ctag]={});var i=n[e];return i||(i=n[e]=t(this.otag,this.ctag)),i}},{name:"mustache.js",version:"0.4.0",to_html:function(e,t,r,n){var i=new c;return n&&(i.send=n),i.render(e,t||{},r),n?void 0:i.buffer.join("\n")}}}();