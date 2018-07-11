/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id: CrosstabAuxModel.js 1551 2017-05-23 19:04:53Z ztomchen $
 */

define(function (require,  exports, module) {
    var _ = require("underscore"),
        Visitor = require("./MultiAxisModelVisitor");

    _.extend(IndexVisitor.prototype, Visitor);

    function IndexVisitor(){
        this.startIndex;
        this.endIndex;
        this.counter = 0;
        this.index = 0;
        this.result = [];
        this.terminated = false;
    }
    
    IndexVisitor.prototype.preVisit = function (node) {
        if (!node.children.length) {
            if (node.index === undefined) {
                node.index = this.index;
                this.index++;
            }
            if (this.counter >= this.startIndex && this.counter < this.endIndex) {
                this.result.push(node.index);
            }
            this.counter++;
        }
    };
    
    IndexVisitor.prototype.getResult = function () {
        return this.result;
    };

    IndexVisitor.prototype.range = function (start, end) {
        this.startIndex = start;
        this.endIndex = end;
        this.counter = 0;
        this.result = [];

        return this;
    };

    return IndexVisitor;
});