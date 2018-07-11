define(["require","jquery","underscore","common/bi/component/ComponentEngine","common/bi/component/BiComponent","request","common/bi/error/enum/biComponentErrorCodes","common/bi/error/biComponentErrorFactory","settings!auth","text!./Authentication.json"],function(o){"use strict";function n(o){return o.token?(o.tokenName||p.ticketParameterName||a)+"="+o.token:"j_username="+o.name+"&j_password="+o.password+"&orgId="+(o.organization?o.organization:"null")+(o.locale?"&userLocale="+o.locale:"")+(o.timezone?"&userTimezone="+o.timezone:"")}var e=o("jquery"),t=o("underscore"),r=o("common/bi/component/ComponentEngine"),i=o("common/bi/component/BiComponent"),c=o("request"),u=o("common/bi/error/enum/biComponentErrorCodes"),s=o("common/bi/error/biComponentErrorFactory"),a="ticket",p=o("settings!auth")||{ticketParameterName:a},m=o("text!./Authentication.json"),l={login:function(o,t){var r=e.Deferred();return t({url:o.url+(o.preAuth?"":"/j_spring_security_check")+"?"+n(o),headers:{Accept:"application/json"}}).done(function(o,n,e){var t=o;if("string"==typeof o)try{t=JSON.parse(o)}catch(i){r.reject(i)}t.success===!0?r.resolve(t):r.reject(e)}).fail(function(o){r.reject(o)}),r},logout:function(o,n){return n({url:o.url+"/logout.html"})}},f=function(o){var n=r.newInstance(m,o),e=this;n.decorateComponent(this,function(o,n){var e;e=o.properties&&o.properties.loginFn&&t.isFunction(o.properties.loginFn)?o.properties.loginFn:l.login,e(o.properties,c).done(function(e){o.data=!0,n.resolve(e)}).fail(function(o){n.reject(s.requestError(o,u.AUTHENTICATION_ERROR))})}),this.logout=function(o,e,r){var i,u=n.instanceData;return i=u.properties&&u.properties.logoutFn&&t.isFunction(u.properties.logoutFn)?u.properties.logoutFn:l.logout,i(u.properties,c).done(function(n){u.data=!1,o&&t.isFunction(o)&&o(n)}).fail(function(o){e&&t.isFunction(e)&&e(o)}).always(function(){r&&t.isFunction(r)&&r()})},this.login=function(o,n,t,r){return e.properties(o),e.run(n,t,r)}};return f.prototype=new i,f});