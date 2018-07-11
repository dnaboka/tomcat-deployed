/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

define(function (require) {

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),

        jiveTypes = require("../enum/jiveTypes"),
        log = require("logger").register("ReportComponentCollection");

    function processLinkOptions(collection, linkOptions){
        var processed = _.clone(linkOptions);

        if (linkOptions.events){
            var newEvents = {};
            _.each(_.keys(linkOptions.events), function(key) {
                newEvents[key] = (function(handler, collection) {
                    return function(id, event) {
                        handler.call(this, event, _.isObject(id) ? id  : _.findWhere(collection.getLinks(), {id: id}));
                    }
                })(linkOptions.events[key], collection);
            });

            processed.events = newEvents;
        }

        return processed;
    }

    return Backbone.Collection.extend({
        initialize: function(models, options){
            var self = this;

            this._parts = [];
            this._root = null;
            this.stateModel = options.stateModel;
            this.report = options.report;

            this.componentsMeta = options.componentsMeta;

            this.stateModel.get("linkOptions") && (this.linkOptions = processLinkOptions(this, this.stateModel.get("linkOptions")));
            this.listenTo(this.stateModel, "change:linkOptions",function(model, value){
                self.linkOptions = processLinkOptions(self, value);
            });

            // very dirty hack for JIVE code
            this.on("change add reset remove", function() {
                _.each(jiveTypes, function(value) {
                    self[value] = [];
                });

                self.forEach(function(componentModel) {
                    self[componentModel.get("type")] && _.isArray(self[componentModel.get("type")]) && self[componentModel.get("type")].push(componentModel);
                });
            });

            this.on("reset", function(collection) {
                _.each(collection.models, function(model) {
                    if (model && model.get("type")) {
                        model.get("type") === "bookmarks" && self.trigger("bookmarksReady", model.get("bookmarks"));
                        model.get("type") === "reportparts" && self.trigger("reportPartsReady", model.get("reportParts"));
                    }
                });
            });
        },

        registerPart: function(part){
            var self = this;

            if (part) {
                if (!part.get("parentId")) {
                    self._root = part;

                    _.each(this._parts, function (part) {
                        self._root.registerPart(part);
                    });
                } else {
                    if (self._root) {
                        self._root.registerPart(part);
                    } else {
                        self._parts.push(part);
                    }
                }
            }
        },

        fetch: function() {
            var self = this,
                modules = [],
                metaModels = [],
                models = [],
                dfd = new $.Deferred();

            this.componentsMeta.forEach(function(model) {
                // these modules could be paths in the components JSON or requirejs module mappings inside require.config.js
                model.get("type") && model.get("type") === "table" && modules.push("../model/TableComponentModel");
                model.get("type") && model.get("type") === "column" && modules.push("../model/ColumnComponentModel");

                model.get("type") && model.get("type") === "chart" && modules.push("bi/chart/jr/jive/highcharts/model/ChartComponentModel");

                model.get("type") && (model.get("type") === "fusionChart" || model.get("type") === "fusionMap" || model.get("type") === "fusionWidget") && modules.push("../model/FusionComponentModel");
                model.get("type") && model.get("type") === "googlemap" && modules.push("../model/GooglemapComponentModel");
                model.get("type") && model.get("type") === "tibco-maps" && modules.push("../model/TibcomapComponentModel");
                model.get("type") && model.get("type") === "crosstab" && modules.push("../model/CrosstabComponentModel");
                model.get("type") && model.get("type") === "webfonts" && modules.push("../model/WebfontsComponentModel");
                model.get("type") && model.get("type") === "hyperlinks" && modules.push("../model/HyperlinksComponentModel");
                model.get("type") && model.get("type") === "bookmarks" && modules.push("../model/BookmarksComponentModel");
                model.get("type") && model.get("type") === "reportparts" && modules.push("../model/ReportPartsComponentModel");
                model.get("type") && model.get("type") === "CVComponent" && modules.push("../model/CustomComponentModel");
                model.get("type") && metaModels.push(model.attributes);
            });

            require(modules, function() {
                var args = _.toArray(arguments),
                    options = {
                        parent: self.report,
                        linkOptions: self.linkOptions,
                        collection: self,
                        parse: true
                    };

                _.each(args, function(Module, index) {
                    var instance = new Module(metaModels[index], options);
                    models.push(instance);
                    self.registerPart(instance);
                });

                self.reset(models);
                dfd.resolve();
            }, dfd.reject);

            return dfd;
        },

        add: function(models, options) {
            var allowedModels = [];
            if (this.stateModel.get("isolateDom")) {
                _.each(models, function(model, index, models) {
                    if (model.get("type") && (model.get("type").indexOf("fusion") !== -1 || model.get("type").indexOf("tibco-maps") !== -1)) {

                        if (model.get("type").indexOf("fusion") !== -1) {
                            log.info("Fusion components usage deprecated when isolateDom option enabled for report");
                        }
                        if (model.get("type").indexOf("tibco-maps") !== -1) {
                            log.info("Tibco maps components usage deprecated when isolateDom option enabled for report");
                        }
                    } else {
                        allowedModels.push(models[index]);
                    }
                });
                models = allowedModels;
            }
            return Backbone.Collection.prototype.add.call(this, models, options);
        },

        getComponents: function() {
            var comps = this.reduce(function(memo, model) {
                if (model.toReportComponentObject){
                    var obj = model.toReportComponentObject();
	                if (!obj) {
		                return memo;
	                }
                    if (_.isArray(obj)){
                        memo = memo.concat(obj);
                    }else {
                        memo.push(obj);
                    }
                }
                return memo;
            },[]);

            _.forEach(comps, function(component) {
                if (component.name === undefined) {
                    delete component.name;
                }
            });

            return comps;
        },

        getLinks: function() {
            return this.reduce(function(memo, model) {
                return memo.concat(model.get("hyperlinks") || []);
            },[]);
        },

        getBookmarks: function() {
            return this.reduce(function(memo, model) {
                return memo.concat(model.get("bookmarks") || []);
            },[]);
        },

        getReportParts: function() {
            return this.reduce(function(memo, model) {
                return memo.concat(model.get("reportParts") || []);
            },[]);
        },

        // hackish way to get changes to components
        updateComponents: function(reportComponents) {
            var self = this,
                actions = [],
                collection = new Backbone.Collection(this.map(function(model) {
                    var newModel = new Backbone.Model(model.attributes);
                    _.extend(newModel, {
                        updateFromReportComponentObject: model.updateFromReportComponentObject,
                        actions: model.actions,
                        parent: model.parent,
                        headingFormat: model.headingFormat,
                        detailsRowFormat: model.detailsRowFormat,
                        conditions: model.conditions
                    });

                    if (model.attachEvents) {
                        model.attachEvents.call(newModel);
                    }

                    return newModel;
                }));

            collection.forEach(function(model) {
                _.each(model.actions, function(func, action) {
                    self.listenToOnce(model, action, function(model, property, obj) {
                        actions.push(model.actions[action].call(model, obj));
                    });
                });
            });

            _.each(reportComponents, function(component) {
                var model = collection.get(component.id.split("/")[0]);

                if (model) {
                    model.updateFromReportComponentObject(component);
                }
            });

            return actions;
        }
    });
});

