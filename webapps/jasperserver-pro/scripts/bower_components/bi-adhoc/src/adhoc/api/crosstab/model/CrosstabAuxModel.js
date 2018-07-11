/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id$
 */

define(function (require,  exports, module) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        
        NodeBuider = require("./CrosstabAuxModelNodeBuilder"),
        
        RangeVisitor = require("./visitors/MultiAxisModelRangeVisitor"),
        IndexVisitor = require("./visitors/MultiAxisModelIndexVisitor"),

        log = require("logger").register(module);

    var CrosstabAuxModel = Backbone.Model.extend({
        initialize: function(attrs, opts){
            _.bindAll(this, "_checkAvailability", "_onExpansionsChange", "_onError", "_onSuccess");

            this.EMPTY_CELL = {label:""};
            this.adHocModel = opts.dataModel;

            this._clear();

            this.listenTo(this.adHocModel.dataSet.query.cols.expansions, "expansions:change", this._onExpansionsChange);
            this.listenTo(this.adHocModel.dataSet.query.rows.expansions, "expansions:change", this._onExpansionsChange);

            this.on("change", this._checkAvailability);
        },

        dispose: function () {
            this.stopListening();
        },

        reset: function(){
            this._clear();
            
            this.set({
                colsOffset: 0,
                colsPageSize: 50,
                rowsOffset: 0,
                rowsPageSize: 50
            }, {silent: true});

            this._checkAvailability();
        },

        keepAxis: function(id){
            if (id === "rows"){
                this.colIndex = new IndexVisitor();
                this.colsAuxModel = null;
            } else {
                this.rowIndex = new IndexVisitor();
                this.rowsAuxModel = null;
            }
            this.dataModel = [];
        },

        _clear: function(){
            this.watchDog = 0;
            this.colsAuxModel = null;
            this.rowsAuxModel = null;

            this.rowIndex = new IndexVisitor();
            this.colIndex = new IndexVisitor();

            this.dataModel = [];
        },

        _checkAvailability: function () {
            var rows = this._readHeader(1),
                columns = this._readHeader(0),
                parameters = false;

            if (rows.range) {
                this.trigger("data:rows", rows.range);
            } else {
                parameters = this._toParameters();
                parameters.offset[1] = rows.missingIndex;
            }

            if (columns.range) {
                this.trigger("data:columns", columns.range);
            } else {
                parameters = parameters || this._toParameters();
                parameters.offset[0] = columns.missingIndex;
            }

            if (parameters){
                if (rows.loaded){
                    while(parameters.offset[1] >= rows.loaded){
                        parameters.offset[1] -= parameters.pageSize[1]
                    }
                    parameters.offset[1] = Math.max(parameters.offset[1], 0);
                }

                if (columns.loaded){
                    while(parameters.offset[0] >= columns.loaded){
                        parameters.offset[0] -= parameters.pageSize[0]
                    }
                    parameters.offset[0] = Math.max(parameters.offset[0], 0);
                }
            } else {
                var data = this._readData(rows, columns);

                if (data.data) {
                    this.watchDog = 0;
                    this.trigger("data:data", {
                        data: data.data,
                        columns: columns,
                        rows: rows
                    });
                    this.trigger("data:loading", false);
                } else {
                    parameters = this._toParameters(data);
                }
            }

            if (parameters){
                this.watchDog++;
                this.adHocModel.dataSet.set("params", parameters);
                this.trigger("data:loading", true);
                this.adHocModel.dataSet.data().fail(this._onError).done(this._onSuccess);
            }
        },

        _toParameters: function(requiredRegion){
            var rHeight, rWidth, params = {
                offset: [
                    this.get("colsOffset"), this.get("rowsOffset")
                ], pageSize: [
                    Math.max(this.get("colsPageSize"), 100), Math.max(this.get("rowsPageSize"), 100)
                ]
            };

            if (requiredRegion){
                rHeight = requiredRegion.bottom - requiredRegion.top + 1;
                rWidth = requiredRegion.right - requiredRegion.left + 1;

                // vertical scroll
                if (rHeight !== this.get("rowsPageSize") && rWidth === this.get("colsPageSize")){
                    if (requiredRegion.top === 0){// scroll up, load ahead
                        params.offset[1] = Math.max(0, this.get("rowsOffset") - params.pageSize[1] + rHeight);
                    } else if (requiredRegion.bottom + 1 === this.get("rowsPageSize")){//scroll down, load ahead
                        params.offset[1] = this.get("rowsOffset") + this.get("rowsPageSize") - rHeight;
                    } else { // load missing region
                        params.offset[1] += requiredRegion.top;
                        params.pageSize[1] = rHeight;
                    }
                } else
                // horizontal scroll
                if (rHeight === this.get("rowsPageSize") && rWidth !== this.get("colsPageSize")){
                    if (requiredRegion.left === 0){// scroll left, load ahead
                        params.offset[0] = Math.max(0, this.get("colsOffset") - params.pageSize[1] + rWidth);
                    } else if (requiredRegion.right + 1 === this.get("colsPageSize")){//scroll right, load ahead
                        params.offset[0] = this.get("colsOffset") + this.get("colsPageSize") - rWidth;
                    } else {// load missing region
                        params.offset[0] += requiredRegion.left;
                        params.pageSize[0] = rWidth;
                    }
                } else
                // missing region inside, surrounded by loaded cells
                if (rHeight !== this.get("rowsPageSize") && rWidth !== this.get("colsPageSize")){
                    params.offset[0] += requiredRegion.left;
                    params.pageSize[0] = rWidth;

                    params.offset[1] += requiredRegion.top;
                    params.pageSize[1] = rHeight;
                } else {
                    // page is completely empty, keep defaults
                }
            }
            return params;
        },

        _readHeader: function(horizontal){
            var auxModel = horizontal ? this.rowsAuxModel : this.colsAuxModel,
                offset = horizontal ? this.get("rowsOffset") : this.get("colsOffset"),
                limit = horizontal ? this.get("rowsPageSize") : this.get("colsPageSize"),
                range = new RangeVisitor(offset, offset + limit);

            auxModel && auxModel.visit(range);

            return range.getResult();
        },

        _readData: function(rows, columns){
            var result = {
                top: -1, bottom: -1,
                left: -1, right: -1
            };

            if (rows.range.length && columns.range.length){
                var res = [], row, colsIndex, obj,
                    rowsRange = rows.range, rowsRangeIndex = rows.range[0].length - 1,
                    colsRange = columns.range, colsRangeIndex = columns.range[0].length - 1;

                for (var i = 0; i < rows.range.length; i++){
                    row = [];
                    obj = this.dataModel[rowsRange[i][rowsRangeIndex].index];

                    if (obj){
                        for (var j = 0; j < columns.range.length; j++){
                            colsIndex = colsRange[j][colsRangeIndex].index;
                            if (obj[colsIndex]){
                                row.push(obj[colsIndex]);
                            } else {
                                result.left = result.left < 0 ? j : Math.min(result.left, j);
                                result.right = Math.max(result.right, j);

                                result.top = result.top < 0 ? i : Math.min(result.top, i);
                                result.bottom = Math.max(result.bottom, i);
                            }
                        }
                        res.push(row);
                    } else {
                        result.left = 0;
                        result.right = colsRange.length;

                        result.top = result.top < 0 ? i : Math.min(result.top, i);
                        result.bottom = Math.max(result.bottom, i);
                    }
                }

                if (result.top == -1 && result.bottom == -1 && result.left == -1 && result.right == -1){
                    result.data = res;
                } 
            } else {
                result.data = [];
            }

            return result;
        },

        _writeData: function () {
            var rowIndexes, colIndexes, rowsIndex, colsIndex, obj, value,
                data = this.adHocModel.dataSet.get("dataset").data,
                params = this.adHocModel.dataSet.get("params");

            this.colsAuxModel.visit(this.colIndex.range(params.offset[0], params.offset[0] + params.pageSize[0]));
            this.rowsAuxModel.visit(this.rowIndex.range(params.offset[1], params.offset[1] + params.pageSize[1]));

            rowIndexes = this.rowIndex.getResult();
            colIndexes = this.colIndex.getResult();

            for (var r = 0; r < rowIndexes.length; r++){
                rowsIndex = rowIndexes[r];
                for (var c = 0; c < colIndexes.length; c++){
                    colsIndex = colIndexes[c];
                    obj = this.dataModel[rowsIndex];
                    if (obj) {
                        obj = obj[colsIndex];
                    } else {
                        this.dataModel[rowsIndex] = [];
                    }

                    if (!obj) {
                        value = data[c][r];
                        if (value === ""){
                            this.dataModel[rowsIndex][colsIndex] = this.EMPTY_CELL;
                        } else {
                            this.dataModel[rowsIndex][colsIndex] = {
                                label: value
                            }
                        }
                    }
                }
            }
        },

        _onExpansionsChange: function (expansions, axis) {
            var auxModel = axis.id === "rows" ? this.rowsAuxModel : this.colsAuxModel;

            if (auxModel) {
                auxModel.applyExpansions(expansions, axis);

                this._ignoreExpansionsChange || this._checkAvailability();
            }
        },

        _onSuccess: function () {
            var auxModel, additionalRowExpansions, additionalColExpansions,
                items = this.adHocModel.dataSet.query.groupByJSON();

            try {
                auxModel = NodeBuider.buildFromDataSet(this.adHocModel.dataSet, this.adHocModel.dataSet.query.cols);
                if (this.colsAuxModel) {
                    if (!this.colsAuxModel.addTree(auxModel.rootNode)) {
                        throw new Error("Cannot merge cols");
                    }
                } else {
                    this.colsAuxModel = auxModel.rootNode;
                }

                additionalColExpansions = auxModel.requiredExpansions;
            } catch (e) {
                log.error(e, this.colsAuxModel, auxModel);
                this._onError();
                return;
            }

            try {
                auxModel = NodeBuider.buildFromDataSet(this.adHocModel.dataSet, this.adHocModel.dataSet.query.rows);
                if (this.rowsAuxModel) {
                    if (!this.rowsAuxModel.addTree(auxModel.rootNode)) {
                        throw new Error("Cannot merge rows");
                    }
                } else {
                    this.rowsAuxModel = auxModel.rootNode;
                }

                additionalRowExpansions = auxModel.requiredExpansions;
            } catch (e) {
                log.error(e, this.rowsAuxModel, auxModel);
                this._onError();
                return;
            }

            this._writeData();

            if (this.watchDog < 7) {
                if (additionalColExpansions.length || additionalRowExpansions.length){
                    try{
                        this._ignoreExpansionsChange = true;
                        this.adHocModel.dataSet.query.cols.expansions.add(additionalColExpansions);
                        this.adHocModel.dataSet.query.rows.expansions.add(additionalRowExpansions);
                        this._ignoreExpansionsChange = false;
                    } catch (e){
                        this._ignoreExpansionsChange = false;
                        log.error(e, this.rowsAuxModel, additionalColExpansions, additionalRowExpansions);
                        this._onError();
                    }
                }

                this._checkAvailability();
            } else {
                log.error("Endless recursion", this.attributes, items);
                this._onError();
            }
        },

        _onError: function(err){
           this.trigger("data:error", err);
           this.trigger("data:loading", false);
        }
    });

    return CrosstabAuxModel;
});