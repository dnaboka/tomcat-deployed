define(["require","underscore","jquery","request","./AdHocDataSetModel","./AdHocSchemaModel","bi/repository/model/RepositoryResourceModel","common/bi/error/biComponentErrorFactory","./bundles/AdHocBundlesCollection","./factory/componentsFactory","common/util/classUtil"],function(e){"use strict";function t(e,t,o){var r,s=o.getResponseHeader("Content-Type");s&&0===s.indexOf("application/repository.adhocDataView")?0!==s.indexOf("application/repository.adhocDataView")||Object.prototype.hasOwnProperty.call(e,"query")||(r={message:"OLAP based Ad Hoc view is not supported",errorCode:"resource.is.olap.adhoc",parameters:[e.uri]}):r={message:"Resource "+e.uri+" is not an Ad Hoc View.",errorCode:"resource.not.adhoc",parameters:[e.uri]},r?this._metadata.reject(r):(this.bundles.length&&this.bundles.bundle(),this._metadata.resolve())}function o(e){var t=c.requestError(e);this._metadata.reject(t)}var r=e("underscore"),s=e("jquery"),n=(e("request"),e("./AdHocDataSetModel")),a=e("./AdHocSchemaModel"),i=e("bi/repository/model/RepositoryResourceModel"),c=e("common/bi/error/biComponentErrorFactory"),d=e("./bundles/AdHocBundlesCollection"),h=e("./factory/componentsFactory"),u=(e("common/util/classUtil"),i.extend({initialize:function(e,t){this.contextPath=t&&t.server,this.schema=new a({},{contextPath:this.contextPath}),this.bundles=new d([],{contextPath:this.contextPath}),this.dataSet=new n({dataSourceUri:e.uri},r.extend({adHocModel:this},t)),this.componentsFactory=h(this),this.listenTo(this.dataSet.query,"query:componentsDataChange",function(e){this.component.parseQuery(e)},this),this.on("change:uri",function(){this._metadata=!1},this)},parse:function(e){return e.schema&&(this.schema.set(e.schema),e.schema=void 0),e.component&&(this.component=this.componentsFactory.create(e.component,{adHocModel:this}),e.component=void 0),e.query&&(this.dataSet.query.acquire(e.query),e.query=void 0),e.bundles&&(this.bundles.set(e.bundles),e.bundles=void 0),e},metadata:function(){return this._metadata||(this._metadata=new s.Deferred,this.fetch().done(r.bind(t,this)).fail(r.bind(o,this))),this._metadata},toJSON:function(){var e=i.prototype.toJSON.call(this);return e.query=this.dataSet.query.toJSON(),e.component=this.component.toJSON(),e.schema=this.schema.toJSON(),e.bundles=this.bundles.toJSON(),e}}));return u});