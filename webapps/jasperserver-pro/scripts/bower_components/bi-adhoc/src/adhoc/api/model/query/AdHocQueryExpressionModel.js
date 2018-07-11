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
        $ = require("jquery"),
        Backbone = require("backbone"),
        
        AdHocQueryParametersModel = require("./AdHocQueryParametersModel"),
        AdHocQueryExpansionsCollection = require("./AdHocQueryExpansionsCollection");

    /**
     * @class AdHocQueryExpressionModel
     */

    function toNode(serverNode){
        var key = _.keys(serverNode)[0],
            res = _.omit(serverNode[key], "operands", "start", "end");

        res.nodeType = key;

        if (key == "range") {
            res.operands = [toNode(serverNode[key].start), toNode(serverNode[key].end)];
        } else if (key == "boundary") {
            res = toNode(serverNode[key]);
        } else if (serverNode[key].operands) {
            res.operands = _.map(serverNode[key].operands, toNode);
        }

        if (serverNode[key].value) {
            res.nodeType = "literal";
            res.type = key;
        }

        return res;
    }

    function findNodesOfType(root, type, memo){
        memo || (memo = []);

        if (root.nodeType === type){
            memo.push(root);
        }

        if (root.operands){
            for (var i = 0; i<root.operands.length; i++){
                findNodesOfType(root.operands[i], type, memo);
            }
        }

        return memo;
    }

    var AdHocQueryExpressionModel = Backbone.Model.extend({

        initialize: function(attributes, options){
            this.schema = options.adHocModel.schema;
        },

        acquire: function(resp){
            resp && resp.object && this.set(toNode(resp.object));
        },

        readFilterInformation: function () {
            var self = this,
                filters = _.filter(findNodesOfType(this.attributes, "function"), function (fun) {
                return fun.functionName === "filter";
            });

            return _.compact(_.map(filters, function (filter) {
                if (filter.operands[1].value !== "DYNAMIC") return;

                var variables = findNodesOfType(filter.operands[2], "variable"),
                    type = _.reduce(variables, function(memo, variable){
                        if (!memo){
                            var levelData = self.schema.getByReference(variable.name);
                            levelData && (memo = levelData.type);
                        }
                        return memo;
                    }, null);

                return {
                    id: filter.operands[0].value,
                    isDynamic: filter.operands[1].value === "DYNAMIC",
                    levelName: filter.operands[2].operands[0].name,
                    filterExpression: filter.operands[2],
                    variables: _.map(variables, function(variable){
                        return {
                            name: variable.name,
                            type: type
                        }
                    })
                }
            }));
        }
    });

    return AdHocQueryExpressionModel;
});