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
        
        Item = require("./CrosstabAuxModelNode");

    function getAuxModel(dataSet, queryAxis) {
        var expansion, expansions,
            index = queryAxis.id === "rows" ? 1 : 0,
            data = dataSet.get("dataset"),
            items = queryAxis.axis.toQueryMultiaxisAxisItems(),
            axis = data.axes[index],
            maxExpandableDepth = calculateLastExpandableDepth(axis.levels),
            isStart = !dataSet.get("params").offset[index],
            isEnd = dataSet.get("params").offset[index] + dataSet.get("params").pageSize[index] >= dataSet.get("totalCounts")[index],
            root = new Item(false, false, "", processChildren(axis.axisNode, axis.levels, 0, maxExpandableDepth), false);

        if (!root.children.length) {
            root.children.push(new Item(true, false, "", [], false));
        }

        for (var i = items.length - 1; i >= 0; i--){
            expansion = queryAxis.expansions.getByGroupByItem(items[i]);
            if (expansion && expansion.get("level").expanded){
                i = -1;
            }
        }
        if (expansion){
            expansions = [expansion.attributes];
        } else {
            if (items.length){
                throw new Error("No expansion to apply");
            }
        }

        expansions = _.reduce(queryAxis.expansions.getMemberExpansions(), function(memo, member){
            memo.push(member.attributes);
            return memo;
        }, expansions || []);

        root.applyExpansions(expansions, queryAxis);
        
        setEndAndBegin(root, isStart, isEnd);
        
        return {
            rootNode: root,
            requiredExpansions: findMissingExpansions(root, queryAxis.expansions, [], [], data.empty)
        };
    }

    function calculateLastExpandableDepth(levels) {
        for (var i = levels.length - 1; i >= 0; i--) {
            if (levels[i].level) {
                return i;
            }
        }

        return 0;
    }

    function processChildren(node, levels, depth, maxExpandableDepth) {
        var res;

        if (node.children && node.children.length && levels[depth]){
            res = _.map(node.children, function (nodeChild) {
                return new Item(
                    nodeChild.all,
                    !!levels[depth].aggregation,
                    levels[depth].level ? levels[depth].level.members[nodeChild.memberIdx] : levels[depth].aggregation.fields[nodeChild.memberIdx].reference,
                    processChildren(nodeChild, levels, depth + 1, maxExpandableDepth),
                    maxExpandableDepth > depth && !nodeChild.all
                );
            });
        } else {
            res = []
        }

       return res;
    }

    function findMissingExpansions(self, expansionCollection, path, requiredExpansions, empty){
        path.push(self.isTotal ? "All": (self.label || "empty_node"));

        if (self.isExpandable && self.isExpanded === true && self.children.length == 1 &&
            self.children[0].isTotal && self.children[0].childFirst && self.children[0].childLast) {
            var slicedPath = path.slice(1);
            if (empty || expansionCollection.getByPath(slicedPath)) {
                self.isEmpty = true;
            } else {
                requiredExpansions.push({
                    member: {
                        expanded: true,
                        path: slicedPath
                    }
                });
            }
        }

        for (var i = 0; i< self.children.length; i++){
           findMissingExpansions(self.children[i], expansionCollection, path, requiredExpansions, empty);
        }

        path.pop();

        return requiredExpansions;
    }

    function setEndAndBegin(self, isZero, isEnd, isNotFirst, isNotLast) {
        var child;
        if (isEnd) {
            self.childLast = true;
        }

        if (isZero) {
            self.childFirst= true;
        }

        if (isNotFirst){
            child = self;
            while (child.children.length) {
                child = child.children[0];
                child.childFirst = true;
            }
        }

        if (isNotLast) {
            child = self;
            while (child.children.length) {
                child = child.children[child.children.length - 1];
                child.childLast= true;
            }
        }

        if (self.children.length) {
            setEndAndBegin(self.children[0], isZero, false, false, self.children.length > 1 || self.children[0].isTotal);

            for (var i = 1; i < self.children.length - 1; i++){
                setEndAndBegin(self.children[i], false, false, true, true);
            }

            setEndAndBegin(self.children[self.children.length - 1], false, isEnd, self.children.length > 1 || self.children[self.children.length - 1].isTotal, false);
        }
    }

    return {
        buildFromDataSet: getAuxModel
    };
});