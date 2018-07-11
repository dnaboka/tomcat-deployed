/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id: $
 */

define(function (require,  exports, module) {
    var _ = require("underscore"),
        Visitor = require("./MultiAxisModelVisitor");

    _.extend(LevelExpansionVisitor.prototype, Visitor);
    
    function LevelExpansionVisitor(value, levelNumber){
        this.value = value;
        this.levelNumber = levelNumber;

        if (this.value){
            this.preVisit = op;
            this.postVisit = noop;
        } else {
            this.preVisit = noop;
            this.postVisit = op;
        }
    }
    
    function op(node, depth){
        if (node.isExpandable) {
            if (depth > this.levelNumber) {
                node.isExpanded = false;
            } else if (depth === this.levelNumber) {
                node.isExpanded = this.value;
            } else {
                node.isExpanded = true;
            }
        }
    }

    function noop(){}

    return LevelExpansionVisitor;
});