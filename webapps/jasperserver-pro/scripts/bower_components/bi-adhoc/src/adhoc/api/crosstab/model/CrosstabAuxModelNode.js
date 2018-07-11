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
        LevelExpansionVisitor = require("./visitors/MultiAxisModelLevelExpansionVisitor"),
        MemberExpansionVisitor = require("./visitors/MultiAxisModelMemberExpansionVisitor");

    function Item(isTotal, isMeasure, value, children, expandable) {
        this.isTotal = isTotal;
        this.isMeasure = isMeasure;
        this.isExpandable = expandable;
        this.isExpanded = undefined;
        this.value = value;
        this.label = value;
        this.children = children;
        this.index = undefined;
        this.pixels = undefined;
    }

    Item.prototype.addTree = function (tree) {
        var res = false;
        if (this.value === tree.value) {
            tree.childFirst && (this.childFirst = true);
            tree.childLast && (this.childLast = true);
            this.isExpanded = tree.isExpanded;

            if (!tree.children.length) {
                // nothing to merge
                res = true;
            } else {
                // if there was only total and merging tree has all items including total,
                // just add everything, but keep old total
                if (this.children.length === 1 && this.children[0].isTotal) {
                    res = true;
                    if (tree.children[tree.children.length - 1].isTotal) {
                        res = this.children[0].addTree(tree.children[tree.children.length - 1]);
                        this.children = this.children.concat(tree.children.reverse().slice(1, tree.children.length)).reverse();
                    } else {
                        // if merging tree does not contain total, just put existing aside
                        this.ignoredTotal = this.children[0];
                        this.children = [].concat(tree.children);
                    }
                } else if (tree.children.length === 1 && tree.children[0].isTotal) {
                    // if tree to merge contains only total, it is required to check, if children have been completely loaded already
                    // it it not full, put it aside ad ignored total
                    if (this.children[this.children.length - 1].isTotal){
                        res = this.children[this.children.length - 1].addTree(tree.children[0]);
                    } else if (this.ignoredTotal){
                        res = this.ignoredTotal.addTree(tree.children[0]);
                    } else {
                        this.ignoredTotal = tree.children[0];
                        res = true;
                    }
                } else {
                    // children should be merged together.
                    // first look for same elements, then merge them and add missing
                    // if no same child found - the nodes cannot be merged together, because order is not determined except some special case
                    var existingIndex = -1,
                        treeIndex = 0,
                        found = false;
                    while (!found && ++existingIndex < this.children.length) {
                        if (tree.children[0].value === this.children[existingIndex].value || (tree.children[0].isTotal && this.children[existingIndex].isTotal)) {
                            found = true;
                            for (var i = 1; i + existingIndex < this.children.length && i < tree.children.length; i++){
                                found &= tree.children[i].value === this.children[existingIndex + i].value || (tree.children[i].isTotal && this.children[existingIndex + i].isTotal);
                            }
                        }
                    }

                    if (found) {
                        res = true;
                        for (; existingIndex < this.children.length && treeIndex < tree.children.length; existingIndex++, treeIndex++) {
                            if (!this.children[existingIndex].addTree(tree.children[treeIndex])) {
                                throw new Error("Merge did not happened, while was expected");
                            }
                        }
                        for (; treeIndex < tree.children.length; treeIndex++) {
                            this.children.push(tree.children[treeIndex]);
                        }
                    } else if (this.children[this.children.length - 1].childLast && !this.children[0].childFirst && tree.children[tree.children.length - 1].childLast){
                        // some extra data was already loaded previously, but without first node
                        // merge corresponding nodes and prepend new loaded
                        res = true;
                        var offset = tree.children.length - this.children.length;
                        for (var i = tree.children.length - 1; i>= 0; i--){
                            if (i - offset >= 0){
                                if (!this.children[i - offset].addTree(tree.children[i])) {
                                    throw new Error("Merge did not happened, while was expected");
                                }
                            } else {
                                this.children.unshift(tree.children[i])
                            }
                        }
                    }

                    // if real total was merged, replace it with previous total
                    if (this.ignoredTotal && this.children[this.children.length - 1].isTotal){
                        if (!this.ignoredTotal.addTree(this.children.pop())){
                            throw new Error("Merge did not happened, while was expected");
                        }
                        this.children.push(this.ignoredTotal);
                        this.ignoredTotal = undefined;
                    }
                }
            }
        }
        return res;
    };

    Item.prototype.applyExpansion = function(expansion, items, levelsState){
        if (expansion.level){
            for (var i = 1; i < items.length + 1; i++){
                if ((expansion.level.aggregation && items[i - 1].aggregations) || (items[i - 1].level && (expansion.level.fieldRef === items[i - 1].level.id))){
                    this.visit(new LevelExpansionVisitor(expansion.level.expanded, i));
                }
            }
        } else if (expansion.member){
            var member, parents = [];

            for (var i = 0; i < expansion.member.path.length - 1; i++){
                parents.push(expansion.member.path[i]);
                member = this.getItemByPath(parents);

                if (member){
                    member.isExpandable && expansion.member.expanded && (member.isExpanded = true);
                } else {
                    return;
                }
            }

            member = this.getItemByPath(expansion.member.path);
            if (member){
                member.visit(new MemberExpansionVisitor(expansion.member.expanded, expansion.member.path.length - 1, items, levelsState));
            }
        }
    };

    Item.prototype.applyExpansions = function (expansions, axis) {
        var items = axis.axis.toQueryMultiaxisAxisItems(),
            levels = _.filter(expansions, function (exp) {
                return exp.level
            }),
            membersExpanded = _.filter(expansions, function (exp) {
                return exp.member && exp.member.expanded
            }).sort(function (a, b) {
                return a.member.path.length - b.member.path.length;
            }),
            membersCollapsed = _.filter(expansions, function (exp) {
                return exp.member && !exp.member.expanded
            }).sort(function (a, b) {
                return b.member.path.length - a.member.path.length;
            });


        for (var i = 0; i < levels.length; i++) {
            this.applyExpansion(levels[i], items);
        }

        if (membersExpanded.length || membersCollapsed.length){
            var levelsState = _.map(items, function(item){
                var exp = axis.expansions.getByGroupByItem(item);
                return exp && exp.get("level").expanded;
            });

            for (var i = 0; i < membersCollapsed.length; i++) {
                this.applyExpansion(membersCollapsed[i], items, levelsState);
            }

            for (var i = 0; i < membersExpanded.length; i++) {
                this.applyExpansion(membersExpanded[i], items, levelsState);
            }
        }
    };

    Item.prototype.getItemByPath = function(path){
        if (!path.length){
            return this;
        }

        var value = path[0] === "empty_node" ? null : path[0];
        for (var i = 0; i < this.children.length; i++){
            if (this.children[i].value === value || (this.children[i].isTotal && value === "All") || (!value && !this.children[i].value)){
                return this.children[i].getItemByPath(path.slice(1));
            }
        }

        return null;
    };

    Item.prototype.visit = function(visitor, depth){
        if (!visitor.terminated){
            visitor.preVisit(this, depth || 0);

            if (!visitor.terminated){
                if (this.isExpanded || this.isExpanded === undefined){
                    for (var i = 0; i< this.children.length; i++){
                        this.children[i].visit(visitor, (depth || 0) + 1);
                    }
                } else {
                    if (this.ignoredTotal){
                        this.ignoredTotal.visit(visitor, (depth || 0) + 1);
                    } else {
                        for (var i = 0; i< this.children.length; i++){
                            if (this.children[i].isTotal || this.children[i].isMeasure){
                                this.children[i].visit(visitor, (depth || 0) + 1);
                            }
                        }
                    }
                }
                if (!visitor.terminated){
                    visitor.postVisit(this, depth || 0);
                }
            }
        }
    };

    return Item;
});