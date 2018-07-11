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

    _.extend(MemberExpansionVisitor.prototype, Visitor);

    function MemberExpansionVisitor(value, levelNumber, items, levelsState){
        this.value = value;
        this.levelsState = levelsState.slice(levelNumber);

        this.levelNumber = 0;

        for (var i = levelNumber + 1, next = true; next && items[i + 1]; i++){
            if (items[i + 1].level){
                if (!items[i + 1].level.includeAll){
                    this.levelNumber = i - levelNumber;
                } else {
                    next = false;
                }
            }
        }
    }

    MemberExpansionVisitor.prototype.preVisit = function (node, depth) {
        if (node.isExpandable) {
            if (depth > this.levelNumber) {
                node.isExpanded = this.value ? this.levelsState[depth] : false;
            } else {
                node.isExpanded = this.value;
            }
        }
    };

    return MemberExpansionVisitor;
});