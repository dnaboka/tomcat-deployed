define(["require","bi/repository/model/RepositoryFileModel","bi/repository/enum/repositoryFileTypes","common/util/parse/javaProperties","underscore"],function(e){"use strict";function t(e){return i.reduce(e,function(e,t,o){return e[o]=t.replace(/\\u\w\w\w\w/g,function(e){return String.fromCharCode("0x".concat(e.slice(2)))}),e},{})}var o=e("bi/repository/model/RepositoryFileModel"),r=e("bi/repository/enum/repositoryFileTypes"),n=e("common/util/parse/javaProperties"),i=e("underscore");return o.extend({stringifyContent:!1,defaults:function(){return i.extend({},o.prototype.defaults,{type:r.PROP})}(),setContent:function(e){this.content=e,this.contentJSON=t(n(e))},toJSON:function(e){var t=o.prototype.call(this);return e&&(t.content=this._encodeContent(this.content)),t}})});