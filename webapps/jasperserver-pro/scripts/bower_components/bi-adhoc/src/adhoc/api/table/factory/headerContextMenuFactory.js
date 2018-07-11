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
        ContextMenu = require("common/component/menu/ContextMenu"),
        cascadingMenuTrait = require("common/component/menu/cascadingMenuTrait");


    var CascadingContextMenu = ContextMenu.extend(cascadingMenuTrait);

    return _.memoize(function (id, tableView) {
        var columns = tableView.dataModel.metadata().view().measures(),
            index = columns.index({id: id}),
            column = columns[index],

            menuOptions = [
                { label: "Use for Sorting..." },
                { label: "Remove Summary" },
                {
                    label: "Change Function",
                    children: [
                        {label : "Distinct Count"},
                        {label : "Count All"}
                    ]
                },
                {
                    label: "Change Data Format",
                    test: function() {return column.isMeasure;},
                    children: [
                        { label : "-1,234.56" },
                        { label : "-1235" },
                        { label : "($1,234.56)" },
                        { label : "($1,235)" }
                    ]
                },
                {
                    label: "Move Left",
                    action: tableView.moveColumnLeft,
                    test: function() { return index > 0; }
                },
                {
                    label: "Move Right",
                    action: "move:right",
                    test: function() {return index < columns.length - 1}
                }];

        return new CascadingContextMenu(menuOptions);
    });
});