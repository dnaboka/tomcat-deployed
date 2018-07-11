/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Zakhar Tomchenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),

        config = require("jrs.configs"),

        queryExecutorHttpHeaders = require("../enum/QueryExecutorHttpHeaders"),

        visualizationTypesManager = require("../../visualChooser/visualizationTypesManager"),

        DefaultFormatMap = require("../enum/DefaultFormatMap"),

        AdHocQueryParametersModel = require("./AdHocQueryParametersModel"),
        AdHocQueryExpressionModel = require("./AdHocQueryExpressionModel"),
        AdHocQueryExpansionsCollection = require("./AdHocQueryExpansionsCollection"),
        AdHocQueryLevelCollection = require("./AdHocQueryLevelCollection"),
        AdHocQueryOrderByCollection = require("./AdHocQueryOrderByCollection");

    /**
     * @class AdHocQueryModel
     */
    var AdHocQueryModel = Backbone.Model.extend({

        initialize: function(attributes, options){
            this.contextPath = options && options.server;
            this.adHocModel = options.adHocModel;

            // READ ONLY FOR NOW!!
            this.where = new AdHocQueryExpressionModel({}, options);

            this.rows = {
                id:"rows"
            };
            this.cols = {
                id:"columns"
            };

            this._initializeAxes(options);
            this._initializeParameters(options);
            this._initializeExpansions(options);
            this._initializeOrderBy(options);

            this.listenTo(this.adHocModel, "change:visualizationType", function(root, type){
                var _type = type === "Table" ? AdHocQueryModel.type.MULTILEVEL : AdHocQueryModel.type.MULTIAXES;

                this.set({
                    _type: _type,
                    _chartMode: _type === AdHocQueryModel.type.MULTIAXES && type !== "Crosstab"
                });
            });

            this.on("change:_type", this._triggerChanged, this);
            this.on("change:_chartMode", this._triggerChanged, this);
        },

        toJSON: function(unwrap){
            var result,
                json = {},
                part,
                type = this.type();

            if (type !== AdHocQueryModel.type.PROVIDED){
                part = this.selectJSON();
                if (part){
                    json.select = clearIdsSelect(part);
                }

                part = this.whereJSON();
                if (part){
                    json.where = part;
                }

                part = this.groupByJSON();
                if (part){
                    json.groupBy = clearIdsGroupBy(part);
                }

                part = this.orderByJSON();
                if (part){
                    json.orderBy = part;
                }

                if (unwrap){
                    result = json;
                } else {
                    result = {};
                    result[type] = json;
                }
            }

            return result;
        },

        selectJSON: function(){
            return toQuerySelectJSON(this, this.adHocModel.component.getTableComponent());
        },

        whereJSON: function(){
            // TODO serialize objects
            return _.cloneDeep(this.get("where"));
        },

        groupByJSON: function(){
            return toQueryGroupByJSON(this);
        },

        orderByJSON: function(){
            return this.orderBy.toJSON(this.type() === AdHocQueryModel.type.MULTILEVEL);
        },

        acquire: function(data){
            var query;

            if (data[AdHocQueryModel.type.MULTILEVEL]){
                query = data[AdHocQueryModel.type.MULTILEVEL];
                query._type = AdHocQueryModel.type.MULTILEVEL;
            } else if (data[AdHocQueryModel.type.MULTIAXES]){
                query = data[AdHocQueryModel.type.MULTIAXES];
                query._type = AdHocQueryModel.type.MULTIAXES;
            } else {
                this.clear();
            }

            if (query){
                this.set(query);
                if (query.where) {
                    this.where.acquire(query.where.filterExpression);
                    this.parameters.acquire(query.where.parameters, this.where.readFilterInformation());
                }

                if (query.groupBy){
                    if (query.groupBy.rows && query.groupBy.columns){
                        var component = this.adHocModel.component.getMultiAxisComponent(),
                            measures = component.getMeasuresComponent();

                        this.rows.axis.reset(readMultiAxisItems(query.groupBy.rows.items, query.select.aggregations, this.adHocModel, component.getRowsComponent(), measures ), {silent: true});
                        this.cols.axis.reset(readMultiAxisItems(query.groupBy.columns.items, query.select.aggregations, this.adHocModel, component.getColumnsComponent(), measures), {silent: true});

                        this.rows.expansions.reset(query.groupBy.rows.expansions || [], {silent: true});
                        this.cols.expansions.reset(query.groupBy.columns.expansions || [], {silent: true});

                        // workaround for inconsistency handling in case when measures level is in the middle of the axis
                        this.rows.expansions.forEach(_.bind(workaroundAPIbug, this, this.rows));
                        this.cols.expansions.forEach(_.bind(workaroundAPIbug, this, this.cols));
                    }else {
                        this.rows.axis.reset(readMultiLevelGroups(query.groupBy, this.adHocModel), {silent: true});
                        this.cols.axis.reset(readMultiLevelColumns(query.select, this.adHocModel), {silent: true});

                        this.rows.expansions.reset([], {silent: true});
                        this.cols.expansions.reset([], {silent: true});
                    }
                } else {
                    this.cols.axis.reset(readMultiLevelColumns(query.select, this.adHocModel.schema), {silent: true});

                    this.rows.expansions.reset([], {silent: true});
                    this.cols.expansions.reset([], {silent: true});
                }

                if (query.orderBy){
                    this.orderBy.reset(query.orderBy, {silent: true});
                }
                this.trigger("query:componentsDataChange", this);
            }
        },

        type: function (type) {
            if (arguments.length) {
                this.set({_type: type});
            } else {
                var result = this.get("_type");

                if (!result) {
                    result = this.has("select") ? AdHocQueryModel.type.MULTILEVEL : AdHocQueryModel.type.PROVIDED;

                    if (this.has("groupBy") && this.get("groupBy").rows && this.get("groupBy").columns) {
                        result = AdHocQueryModel.type.MULTIAXES;
                    }
                }

                return result;
            }
        },
        
        headers: function(){
            var headers;

            if (this.type() === AdHocQueryModel.type.MULTILEVEL) {
                headers = {
                    "Accept": queryExecutorHttpHeaders.ACCEPT_MULTI_LEVEL_DATA,
                    "Content-Type": queryExecutorHttpHeaders.CONTENT_TYPE_MULTI_LEVEL_QUERY
                }
            } else if (this.type() === AdHocQueryModel.type.MULTIAXES) {
                headers = {
                    "Accept": queryExecutorHttpHeaders.ACCEPT_MULTI_AXES_DATA,
                    "Content-Type": queryExecutorHttpHeaders.CONTENT_TYPE_MULTI_AXES_QUERY
                }
            } else {
                headers = {
                    "Accept": queryExecutorHttpHeaders.ACCEPT_NO_FLAT,
                    "Content-Type": queryExecutorHttpHeaders.CONTENT_TYPE_PROVIDED_QUERY
                }
            }

            headers["Accept-Timezone"] = config.userTimezone;
            
            return headers;
        },

        _initializeAxes: function(options){
            this.cols.axis = new AdHocQueryLevelCollection([], options);
            this.rows.axis = new AdHocQueryLevelCollection([], _.extend({master:  this.cols.axis}, options));

            var handler = _.bind(function () {
                this.trigger("query:componentsDataChange", this);
                this._triggerChanged();
            }, this);

            this.listenTo(this.cols.axis, "add change remove reset", handler);
            this.listenTo(this.rows.axis, "add change remove reset", handler);
        },

        _initializeParameters: function(options){
            this.parameters = new AdHocQueryParametersModel({}, options);

            this.listenTo(this.parameters, "change", function(){
                if (this.has("where")) {
                    var where =  _.omit(this.get("where"), "parameters");
                    where.parameters = _.defaults(this.parameters.toJSON(), this.get("where").parameters);
                    this.set("where", where);
                }

                this._triggerChanged();
            }, this);
        },

        _initializeExpansions: function(options){
            this.rows.expansions = new AdHocQueryExpansionsCollection([], _.extend({query: this, axis: this.rows}, options));
            this.cols.expansions = new AdHocQueryExpansionsCollection([], _.extend({query: this, axis: this.cols}, options));

            this.listenTo(this.rows.expansions, "add change", _.bind(onExpansionsChange, this, this.rows));
            this.listenTo(this.cols.expansions, "add change", _.bind(onExpansionsChange, this, this.cols));

            this.listenTo(this.rows.expansions, "remove", _.bind(onExpansionsRemove, this, this.rows));
            this.listenTo(this.cols.expansions, "remove", _.bind(onExpansionsRemove, this, this.cols));
        },

        _initializeOrderBy: function(){
            this.orderBy = new AdHocQueryOrderByCollection();

            this.on("query:componentsDataChange", function () {
                this.orderBy.measures = _.reduce(this.rows.axis.models.concat(this.cols.axis.models), function (memo, item) {
                    item.isMeasure() && (memo[item.get("hierarchicalName")] = true);
                    return memo;
                }, {});
                this.orderBy.multiAxisItems =
                    _.reduce(this.rows.axis.toQueryMultiaxisAxisItems().concat(this.cols.axis.toQueryMultiaxisAxisItems()), function(memo, item){
                        if (item.level){
                            memo[item.level.id || item.level.field] = true;
                        }
                        return memo;
                    }, {});
            }, this);

            this.listenTo(this.orderBy, "add change remove", this._triggerChanged, this);
        },

        _triggerChanged: function () {
            this.trigger("query:changed", this);
        },

        _outputParameters: function(){
            var res = this.rows.axis.hasMeasures() || this.cols.axis.hasMeasures() ? [{id:"Measures"}] : [];
            if (this.type() === AdHocQueryModel.type.MULTIAXES){
                res = res.concat(this.rows.axis.multiAxisMap(toOutputParameter).concat(this.cols.axis.multiAxisMap(toOutputParameter)));
            } else {
                res = res.concat(this.rows.axis.map(toOutputParameter).concat(this.cols.axis.map(toOutputParameter)));
            }
            return _.compact(res);
        },

        toDataComponent: function () {
            return {
                metadata: {
                    availableVisualizationTypes: this.getAllowedTypesList(),
                    inputParameters: this.parameters.toDataComponent(),
                    outputParameters: this._outputParameters()
                }
            };
        },

        getTableComponents: function(){
            return createColumnComponents(this).concat(createGroupsComponents(this));
        },

        getCrosstabComponents: function(){
            return [createAxisComponent(this, this.cols), createAxisComponent(this, this.rows), createMeasuresComponent(this)];
        },

        getChartComponents: function(){
            return this.getCrosstabComponents();
        },

        getDisabledTypesList: function () {
            return visualizationTypesManager.getDisabledTypesList(this.cols.axis, this.rows.axis);
        },

        getAllowedTypesList: function () {
            return visualizationTypesManager.getAllowedTypesList(this.cols.axis, this.rows.axis);
        }
    }, {
        type: {
            "PROVIDED": "provided",
            "FLAT": "flat",
            "MULTILEVEL": "multiLevel",
            "MULTIAXES": "multiAxes"
        }
    });

    AdHocQueryModel.prototype.defaults =  {
        _type: AdHocQueryModel.type.PROVIDED
    };

    return AdHocQueryModel;

    function onExpansionsRemove(axis, expansion){
        var info = expansion.get("member") || expansion.get("level");
        info.expanded = false;

        onExpansionsChange.call(this, axis, expansion);
    }

    function onExpansionsChange(axis, expansion){
        var changed = removeLowerItems.call(this, axis, expansion);
        // order matters
        this._triggerChanged();
        axis.expansions.trigger("expansions:change", changed, axis);
    }

    function removeLowerItems(axis, expansion){
        var changed = [expansion.attributes];
        if (expansion.has("level")){
            changed = changed.concat(removeLowerLevels.apply(this, arguments));
        } else {
            changed = changed.concat(removeLowerMembers.apply(this, arguments));
        }
        return changed;
    }

    function removeLowerLevels(axis, expansion){
        var res,
            items = this.groupByJSON()[axis.id].items,
            level = expansion.get("level"),
            expanded = true,
            itemNumber = -1,
            itemMember;

        // find current expansion in items
        for (var i = 0; i < items.length; i++) {
            // if the item correspond to changed expansion
            if ((level.aggregation && items[i].aggregations) || (level.fieldRef && items[i].level && level.fieldRef === items[i].level.id)) {
                expanded = false;
                itemNumber = i;
            } else {
                // all levels higher then changed level should be expanded, lower - collapsed
                itemMember = axis.expansions.getByGroupByItem(items[i]);
                itemMember.attributes.level.expanded = expanded;
            }
        }

        res = _.reduce(axis.expansions.getMemberExpansions(), function (memo, exp) {
            if (exp.get("member").path.length - 1 > itemNumber) { // lower levels
                if (exp.get("member").expanded) {
                    memo.toApply.push(exp);
                } else {
                    memo.toRemove.push(exp);
                }
            } else if (exp.get("member").path.length - 1 === itemNumber) { // same level
                memo.toRemove.push(exp);
            } else { // upper levels
                if (exp.get("member").expanded) {
                    memo.toRemove.push(exp);
                } else {
                    memo.toApply.push(exp);
                }
            }
            return memo;
        }, {
            toRemove: [],
            toApply: []
        });

        axis.expansions.remove(res.toRemove, {silent: true});

        return _.map(res.toApply, function(exp){
            return exp.toJSON();
        });
    }

    function removeLowerMembers(axis, expansion) {
        var lowerMembers = axis.expansions.filter(function (exp) {
            return exp.has("member") && pathStartWith(expansion.get("member").path, exp.get("member").path);
        }),  res = _.map(lowerMembers, function(member){
            return {
                member: {
                    expanded: false,
                    path: member.attributes.member.path
                }}
        });

        axis.expansions.remove(lowerMembers, {silent: true});

        workaroundAPIbug(axis, expansion);

        return res;
    }

    function pathStartWith(parent, child) {
        if (parent.length < child.length) {
            for (var i = 0; i < parent.length; i++) {
                if (child[i] !== parent[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function workaroundAPIbug(axis, expansion){
        var items,
            member = expansion.get("member");

        if (member && axis.axis.hasMeasures() && !axis.axis.models[axis.axis.length - 1].isMeasure()) {
            items = axis.axis.toQueryMultiaxisAxisItems();

            var measuresLevelNumber = _.reduce(items, function(memo, item, index){
                if (item.aggregations){
                    return index;
                } else {
                    return memo;
                }
            });

            if (member.expanded && member.path.length >= measuresLevelNumber) {
                var newPath = member.path.slice(0, measuresLevelNumber);

                for (var i = 0; i<newPath.length; i++){
                    var exp = axis.expansions.getByPath(newPath.slice(0, i));

                    if (exp){
                        axis.expansions.remove(exp, {silent: true});
                    }
                }

                axis.expansions.add({
                    member: {
                        expanded: true,
                        path: member.path.slice(0, measuresLevelNumber)
                    }
                }, {silent: true});
            }

            if (!member.expanded && member.path.length < measuresLevelNumber){
                var basePath = [].concat(member.path),
                    measures = axis.axis.reduce(function(memo, item){
                        if (item.isMeasure()){
                            memo.push(item.has("id") ? item.get("id") : item.get("hierarchicalName"));
                        }

                        return memo;
                    }, []);

                for (var i = basePath.length; i < measuresLevelNumber; i++){
                    basePath.push("All");
                }

                for (var i = 0; i < measures.length; i++){
                    var exp = axis.expansions.getByPath(basePath.concat([measures[i]]));
                    if (exp){
                        exp.get("member").expanded = false;
                    } else {
                        axis.expansions.add({
                            member: {
                                expanded: false,
                                path: basePath.concat([measures[i]])
                            }
                        }, {silent: true});
                    }
                }
            }
        }
    }

    function extractFormats(axis, measures){
        return axis.components.reduce(function(memo, levelComp){
             if (levelComp.get("reference") === "Measures"){
                 memo = extractMeasures(memo, measures);
             } else {
                 memo[levelComp.get("reference")] = {
                     format: levelComp.get("format"),
                     formatId: levelComp.get("formatId"),
                     aggregationFormat:  levelComp.get("aggregationFormat"),
                     aggregationFormatId:  levelComp.get("aggregationFormatId")
                 }
             }

            return memo;
        }, {});
    }

    function extractMeasures(memo, measures){
        return measures.components.reduce(function(memo, measure){
            memo[measure.get("reference")] =  {
                aggregationFormat: measure.get("format"),
                aggregationFormatId: measure.get("formatId")
            };

            return memo;
        }, memo);
    }


    function readMultiAxisItems(items, aggregations, model, axisComponent, measuresComponent){
        var schema = model.schema,
            formats = extractFormats(axisComponent, measuresComponent);
        return _.reduce(items, function (memo, item) {
            if (item.level){
                var levelMetadata = schema.getByReference(item.level.field);

                memo.push(_.defaults(item.level, {
                    id: levelMetadata.hierarchicalName,
                    kind: levelMetadata.kind,
                    field: levelMetadata.name,
                    dimension: levelMetadata.hierarchicalName,
                    hierarchicalName: levelMetadata.hierarchicalName,
                    functionName: levelMetadata.aggregation,
                    type: levelMetadata.type,
                    label: levelMetadata.label,
                    labelId: levelMetadata.labelId,
                    includeAll: false,
                    format: formats[item.level.id || item.level.field].format,
                    formatId: formats[item.level.id || item.level.field].formatId,
                    aggregationFormat: formats[item.level.id || item.level.field].aggregationFormat,
                    aggregationFormatId: formats[item.level.id || item.level.field].aggregationFormatId
                }));

            } else if (item.aggregations){
                memo = memo.concat(readSelectAggregations(aggregations, schema, formats));
            } else {
                throw new Error('Unknown element in "GroupBy"');
            }
            return memo;
        }, []);
    }

    function readMultiLevelGroups(groupBy, model) {
        var schema = model.schema,
            formats = _.reduce(model.component.getTableComponent().getGroups(), function(memo, column){
                memo[column.get("reference")] = {
                    aggregationFormat:column.get("aggregationFormat"),
                    format:column.get("format")
                };
                return memo;
            }, {});

        return _.map(_.compact(_.pluck(groupBy, "group")), function(group){
            var levelMetadata = schema.getByReference(group.field);
            return _.defaults(group, {
                id: levelMetadata.hierarchicalName,
                kind: levelMetadata.kind,
                field: levelMetadata.name,
                dimension: levelMetadata.hierarchicalName,
                hierarchicalName: levelMetadata.hierarchicalName,
                functionName: levelMetadata.aggregation,
                type: levelMetadata.type,
                label: levelMetadata.label,
                labelId: levelMetadata.labelId,
                aggregationFormat: formats[group.id || group.field].aggregationFormat,
                aggregationFormatId: formats[group.id || group.field].aggregationFormatId,
                format: formats[group.id || group.field].format,
                formatId: formats[group.id || group.field].formatId,
                includeAll: true
            });
        });
    }

    function readMultiLevelColumns(select, model){
        var schema = model.schema,
            res = [],
            aggregations = [].concat(select.aggregations || []),
            fields = select.fields || [],
            formats = _.reduce(model.component.getTableComponent().getColumns(), function(memo, column){
                memo[column.get("reference")] = {
                    aggregationFormat:column.get("aggregationFormat"),
                    aggregationFormatId:column.get("aggregationFormatId"),
                    format:column.get("format"),
                    formatId:column.get("formatId")
                };
                return memo;
            }, {});

        for (var i = 0; i < fields.length; i++){
            var item = false;
            for (var j = 0; j < aggregations.length && !item; j++){
                if (aggregations[j] && (aggregations[j].fieldRef === fields[i].id || aggregations[j].fieldRef === fields[i].field)){
                    item = readSelectAggregation(aggregations[j], fields[i].id || fields[i].field, schema.getByReference(fields[i].field), formats);
                    aggregations[j] = false;
                }
            }

            if (item){
                res.push(item);
            } else {
                res.push(readSelectField(fields[i], schema, formats));
            }
        }

        return res.concat(readSelectAggregations(_.compact(aggregations), schema, formats, fields));
    }

    function readSelectAggregations(aggregations, schema, columns, fields){
        return _.map(aggregations, function (agg) {
            var ref, id;
            if (fields){
                ref = _.find(fields, function(field){
                    return agg.fieldRef === field.id || agg.fieldRef === field.field;
                });

                if (ref){
                    ref = ref.field;
                    id = ref.id || ref.field;
                } else {
                    ref = agg.fieldRef
                }
            } else {
                ref = agg.fieldRef;
            }
            return readSelectAggregation(agg, id, schema.getByReference(ref), columns);
        });
    }

    function readSelectAggregation(aggregation, id, levelMetadata, formats) {
        return _.defaults({
            field: aggregation.fieldRef,
            functionName: aggregation.functionName,
            aggregationType: aggregation.type,
            aggregationFormat: formats[aggregation.id || aggregation.fieldRef].aggregationFormat,
            aggregationFormatId: formats[aggregation.id || aggregation.fieldRef].aggregationFormatId,
            format: formats[aggregation.id || aggregation.fieldRef].format,
            formatId: formats[aggregation.id || aggregation.fieldRef].formatId,
            id: id || aggregation.id,
            firstLevelExpression: aggregation.firstLevelExpression,
            timeBalanceFunctionName: aggregation.timeBalanceFunctionName
        }, {
            id: levelMetadata.hierarchicalName,
            kind: levelMetadata.kind,
            field: levelMetadata.name,
            dimension: levelMetadata.hierarchicalName,
            hierarchicalName: levelMetadata.hierarchicalName,
            functionName: levelMetadata.aggregation,
            type: levelMetadata.type,
            label: levelMetadata.label,
            labelId: levelMetadata.labelId,
            includeAll: true
        });
    }

    function readSelectField(field, schema, formats) {
        var levelMetadata = schema.getByReference(field.field);
        return {
            id: field.id || field.field,
            kind: levelMetadata.kind,
            field: levelMetadata.name,
            dimension: levelMetadata.hierarchicalName,
            hierarchicalName: levelMetadata.hierarchicalName,
            functionName: levelMetadata.aggregation,
            aggregationFormat: formats[field.id || field.field].aggregationFormat,
            aggregationFormatId: formats[field.id || field.field].aggregationFormatId,
            format: formats[field.id || field.field].format,
            formatId: formats[field.id || field.field].formatId,
            type: levelMetadata.type,
            label: levelMetadata.label,
            labelId: levelMetadata.labelId,
            includeAll: true
        }
    }

    function toQuerySelectJSON(queryModel, tableComponent){
        var res, aggregations,
            showTotals = tableComponent.get("showTotals");
        
        if (queryModel.type() === AdHocQueryModel.type.MULTIAXES){
            res = {
                aggregations:  _.reduce(queryModel.cols.axis.models.concat(queryModel.rows.axis.models), function (memo, item) {
                    if (item.isMeasure()) {
                        memo.push({
                            id:  item.get("id"),
                            type: item.get("aggregationType"),
                            functionName: item.get("functionName"),
                            fieldRef: item.get("hierarchicalName"),
                            firstLevelExpression: item.get("firstLevelExpression"),
                            timeBalanceFunctionName: item.get("timeBalanceFunctionName")
                        });
                    }
                    return memo;
                }, [])
            };
        } else {
            res = {};

            aggregations = _.reduce(tableComponent.getColumns(), function (memo, column) {
                if (showTotals || column.hasSummary()){
                    var level = column.level();
                    level && memo.push({
                        id: level.get("id") || level.get("type"),
                        type: level.get("aggregationType"),
                        functionName: level.get("functionName"),
                        fieldRef: level.get("hierarchicalName"),
                        firstLevelExpression: level.get("firstLevelExpression"),
                        timeBalanceFunctionName: level.get("timeBalanceFunctionName")
                    });
                }
                return memo; 
            }, []);
            
            if (aggregations.length){
                res.aggregations = aggregations;
            }
            
            if (tableComponent.get("showDetails")){
                res.fields = queryModel.cols.axis.map(function (item) {
                    return {
                        id:  item.get("id"),
                        field: item.get("hierarchicalName")
                    }
                });
            }
        }

        return res;
    }

    function toQueryGroupByJSON(queryModel){
        var res;
        if (queryModel.type() === AdHocQueryModel.type.MULTIAXES){
            res = {
                rows: toQueryMultiaxisAxisJSON(queryModel.rows, queryModel.get("_chartMode")),
                columns: toQueryMultiaxisAxisJSON(queryModel.cols, queryModel.get("_chartMode"))
            }
        } else {
            res = [{allGroup: {}}].concat(queryModel.rows.axis.map(function(item){
                return {
                    group: {
                        id: item.get("id"),
                        field: item.get("hierarchicalName")
                    }
                }
            }));
        }

        return res;
    }

    function toQueryMultiaxisAxisJSON(axis, isChartMode){
        var result = {
            items: axis.axis.toQueryMultiaxisAxisItems()
        };

        if (axis.expansions.length){
            result.expansions = axis.expansions.toJSON({isChartMode: isChartMode});
        }
        
        return result;
    }

    // workaround for server side issue
    function clearIdsSelect(select) {
        var aggregations = select.aggregations || [],
            fields = select.fields || [];

        _.each(aggregations, function (field) {
            if (field.id === field.fieldRef) {
                delete field.id
            }
        });
        _.each(select.fields || [], function (field) {
            if (field.id === field.field) {
                delete field.id
            }
        });

        for (var i = 0; i < aggregations.length; i++){
            for (var j = 0; j < fields.length; j++){
                if (aggregations[i].id && aggregations[i].id == fields[j].id){
                    aggregations[i].fieldRef = fields[j].id;
                    delete aggregations[i].id;
                }
            }
        }

        return select;
    }

    // workaround for server side issue
    function clearIdsGroupBy(groupBy) {
        _.each((groupBy.rows && groupBy.columns) ? groupBy.rows.items.concat(groupBy.columns.items) : groupBy, function (item) {
            var obj = item.level || item.group;
            if (obj && obj.id && obj.id === obj.field) {
                delete obj.id;
            }
        });

        return groupBy;
    }

    function createAxisComponent(query, axis){
        var levels = axis.axis.multiAxisMap(function(level){
            var res;
            if (level.isMeasure()) {
                res = {
                    "componentType": "level",
                    "components": [],
                    "properties": {"reference": "Measures", "dimension": "Measures", "label": "Measures"}
                };
            } else if (level.isLevel()){
                res =  {
                    "componentType": "level",
                    "components": [],
                    "properties": {
                        "reference": level.has("id") ? level.get("id") : level.get("hierarchicalName"),
                        "dimension": level.get("dimension"),
                        "includeAll": level.get("includeAll"),
                        "format": level.get("format"),
                        "formatId": level.get("formatId"),
                        "aggregationFormat": level.get("aggregationFormat")
                    }
                }
            } else {
                throw new Error("Unknown kind: " + level.get("kind"));
            }
            return res;
        });

        return {
            "componentType": "axis",
            "components": levels,
            "properties": {"name": axis.id}
        }
    }

    function createMeasuresComponent(query) {
        var filterFn = function(model){return model.isMeasure()},
        measures = query.rows.axis.filter(filterFn).concat(query.cols.axis.filter(filterFn));

        return {
            "componentType": "measures",
            "components": _.map(measures, function (measureModel) {
                return {
                    "componentType": "measure",
                    "components": [],
                    "properties": {
                        "format": measureModel.get("aggregationFormat"),
                        "formatId": measureModel.get("aggregationFormatId"),
                        "reference": measureModel.get("id") || measureModel.get("hierarchicalName")
                    }
                }
            }),
            "properties": {}
        }
    }

    function createColumnComponents(query){
        return query.cols.axis.map(function(col){
            return {
                "componentType": "column",
                "components": [],
                "properties": {
                    "id": col.has("id") ? col.get("id") : col.get("hierarchicalName"),
                    "reference": col.has("id") ? col.get("id") : col.get("field"),
                    "detailFieldReference": col.get("hierarchicalName"),
                    "aggregatedFieldReferences": [
                        col.get("hierarchicalName")
                    ],
                    "aggregationFormat": col.get("aggregationFormat"),
                    "aggregationFormatId": col.get("aggregationFormatId"),
                    "format" : col.get("format"),
                    "formatId" : col.get("formatId")
                }
            }
        })
    }

    function createGroupsComponents(query){
        return query.rows.axis.map(function(col){
            return {
                "componentType": "group",
                "components": [],
                "properties": {
                    "reference": col.get("hierarchicalName"),
                    "format" : col.get("format"),
                    "formatId" : col.get("formatId")
                }
            }
        })
    }

    function toOutputParameter(level){
        if (level.isLevel()){
            return {
                id: level.get("id") || level.get("hierarchicalName"),
                type: level.get("type"),

            }
        }
    }
});