/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:
 * @version: $Id$
 */

define(function(require) {
    var _ = require("underscore"),
        ContextMenu = require("common/component/menu/ContextMenu");

    return _.memoize(function(id, tableView) {
        var columns = tableView.dataModel.metadata().view().measures(),
            selected = tableView.table.getSelection(),
            maxIndex = _.reduce(selected, function(memo, sel) {
                return Math.max(memo, columns.index({id: sel.id}));
            }, 0),
            minIndex = _.reduce(selected, function(memo, sel) {
                return Math.min(memo, columns.index({id: sel.id}));
            }, columns.length - 1),
            menuOptions = [
            {
                label: "Move Left",
                action: tableView.moveColumnLeft,
                test: function() { return minIndex > 0; }
            },
            {
                label: "Move Right",
                action: "move:right",
                test: function() {return maxIndex < columns.length - 1}
            }
        ];
        return new ContextMenu(menuOptions);
    });
});