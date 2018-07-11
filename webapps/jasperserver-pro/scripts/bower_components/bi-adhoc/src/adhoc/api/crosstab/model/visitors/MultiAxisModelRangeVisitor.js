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
    var _ = require("underscore"),
        Visitor = require("./MultiAxisModelVisitor");

    _.extend(RangeVisitor.prototype, Visitor);

    function RangeVisitor(start, end){
        this.startIndex = start;
        this.endIndex = end;
        this.index = 0;
        this.missingIndex = -1;
        this.line = [];
        this.result = [];
        this.resultPixels = [];
        this.top = 0;
        this.bottom = 0;
        this.addBottom = true;
        this.terminated = false;
    }


    RangeVisitor.prototype.preVisit = function (node, depth) {
        if (depth > 0) {
            this.line[depth - 1] = node;
        }
    };

    RangeVisitor.prototype.postVisit = function (node, depth) {
        if (!node.children.length) {
            if (this.index < this.startIndex){
                if (node.pixels !== undefined && this.top !== -1){
                    this.top += node.pixels;
                } else {
                    this.top = -1;
                }
            } else {
                if (this.index < this.endIndex){
                    this.result.push([].concat(this.line));
                    if (node.pixels !== undefined && this.resultPixels){
                        this.resultPixels.push(node.pixels);
                    } else {
                        this.resultPixels = null;
                    }

                    // TODO Refactor and move to sepaprate visitor
                    for (var i = 0; i < this.line.length; i++) {
                        if (this.line[i].isExpanded && !this.line[i].isEmpty && this.line[i].children.length == 1 && this.line[i].children[0].isTotal) {
                            this.terminated = true;
                            this.missingIndex = Math.max(this.index - 1 , 0);
                        }
                    }
                    /////////////////
                } else {
                    if (node.pixels !== undefined && this.addBottom){
                        this.bottom += node.pixels;
                    } else {
                        this.addBottom = false;
                    }
                }
            }

            this.index++;
        }
    };

    RangeVisitor.prototype.getResult = function(){
        var result = {
            missingIndex: this.missingIndex
        };

        if (result.missingIndex === -1){
            if (this.result.length){
                result.missingIndex = findMissingIndex(this.result, this.startIndex, this.endIndex);
            } else {
                if (this.index === 0){
                    result.missingIndex = 0;
                }
            }
        } else {
            if (this.result.length) {
                var postCheckIndex = findMissingIndex(this.result, this.startIndex, this.endIndex);
                if (postCheckIndex !== -1){
                    result.missingIndex = Math.min(result.missingIndex, postCheckIndex);
                }
            }
        }

        if (result.missingIndex === -1){
            result.range = this.result.length && this.result[0].length ? this.result : [];
            result.loaded = this.index + 1;
            result.top = this.top;
            result.bottom = this.bottom;
            result.resultPixels = this.resultPixels;

            if (this.result.length){
                result.hasFirst = _.reduce(this.result[0], function(memo, item){
                    return memo && item.childFirst;
                }, true);

                result.hasLast = _.reduce(this.result[this.result.length - 1], function(memo, item){
                    return memo && item.childLast;
                }, true);
            }
        }

        return result;
    };


    function findMissingIndex(result, startIndex, endIndex){
        // for each new element, its children must start from first and children for previous element must end with last
        var parent, firstChild, prevLastChild;
        for (var cols = 0; cols < result[0].length - 1; cols++){
            parent = result[0][cols];
            for (var rows = 0; rows < result.length; rows++){
                if (result[rows][cols] !== parent){
                    parent = result[rows][cols];
                    firstChild = result[rows][cols + 1];
                    if (firstChild){
                        if (firstChild.childFirst || (!parent.isExpanded && firstChild.isTotal)) {
                            prevLastChild = result[rows - 1][cols + 1];
                            if (prevLastChild && !prevLastChild.childLast) {
                                //Missing last
                                return startIndex + rows - 1;
                            }
                        } else {
                            //Missing first
                            return startIndex + rows - 1;
                        }
                    }
                }
            }
        }

        // if size less than expected, make sure that last row consist of from last childs only
        if (result.length && (result.length < endIndex - startIndex)){
            var lastRow = result[result.length - 1], end = true;

            for (var i = 0; i<lastRow.length; i++){
                end &= lastRow[i].childLast
            }

            if (!end){
                return startIndex + result.length - 1;
            }
        }

        return -1;
    }

    return RangeVisitor;
});