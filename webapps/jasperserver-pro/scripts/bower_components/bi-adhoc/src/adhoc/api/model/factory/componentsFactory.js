/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id: chartTypes.js 1025 2016-08-11 12:58:43Z psavushc $
 */

define(function(require) {
    var _ = require("underscore");

    var RootComponentModel = require("../components/RootComponentModel"),
        ChartComponentModel = require("../components/ChartComponentModel"),
        TableComponentModel = require("../components/TableComponentModel"),
        CrosstabComponentModel = require("../components/CrosstabComponentModel"),
        FiltersComponentModel = require("../components/FiltersComponentModel"),
        FilterComponentModel = require("../components/FilterComponentModel"),
        AxisComponentModel = require("../components/AxisComponentModel"),
        MeasuresComponentModel = require("../components/MeasuresComponentModel"),
        LevelComponentModel = require("../components/LevelComponentModel"),
        MeasureComponentModel = require("../components/MeasureComponentModel"),
        ColumnComponentModel = require("../components/ColumnComponentModel"),
        GroupComponentModel = require("../components/GroupComponentModel"),

        LevelComponentTrait = require("../components/traits/LevelComponentTrait"),
        ColumnsAndRowsComponentTrait = require("../components/traits/ColumnsAndRowsComponentTrait"),

        ComponentsCollection = require("../components/ComponentsCollection");

    var componentsMap = {
        "root": RootComponentModel.extend(ColumnsAndRowsComponentTrait),
        "chart": ChartComponentModel.extend(ColumnsAndRowsComponentTrait),
        "table": TableComponentModel,
        "crosstab": CrosstabComponentModel.extend(ColumnsAndRowsComponentTrait),
        "filters": FiltersComponentModel,
        "filter": FilterComponentModel,
        "axis": AxisComponentModel,
        "measures": MeasuresComponentModel,
        "level": LevelComponentModel.extend(LevelComponentTrait),
        "measure": MeasureComponentModel.extend(LevelComponentTrait),
        "column": ColumnComponentModel.extend(LevelComponentTrait),
        "group": GroupComponentModel.extend(LevelComponentTrait)
    };

    return function(adHocModel){
        var componentsFactory = {
            create: function (attr, options) {
                var ComponentModel = componentsMap[attr.componentType],
                    component = new ComponentModel(attr, options);

                component.components = new ComponentsCollection(attr.components, {
                    model: function (attr, options) {
                        return componentsFactory.create(attr, options);
                    }
                });

                component.adHocModel = adHocModel;

                return component;
            }
        };

        return componentsFactory;
    };
});


