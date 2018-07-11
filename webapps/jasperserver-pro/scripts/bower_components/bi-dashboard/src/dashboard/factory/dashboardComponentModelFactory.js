/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require){
    "use strict";


    /**
     * @constructor
     * @alias factory:dashboardComponentModelFactory
     * @param {object} componentObj - component object
     * @param {string} componentObj.type - component object type.
     * @param {object} options
     * @param {boolean} [options.createComponentObj] - create component object in top of given object.
     * @param {object} additionalOptions - options required to create component object
     * @param {DashboardComponentCollection} additionalOptions.collection
     * @param {DashboardResourceModel} additionalOptions.resource
     * @classdesc returns dashboard component model factory. Allows to get model by given object with specific type.
     * @returns {ComponentModel} model
     */


    var DashletModel = require("dashboard/model/component/DashletModel"),
        InputControlDashboardComponentModel = require("dashboard/model/component/InputControlDashboardComponentModel"),
        PropertiesDashboardComponentModel = require("dashboard/model/component/PropertiesDashboardComponentModel"),
        ReportDashletModel = require("dashboard/model/component/ReportDashletModel"),
        AdhocViewDashletModel = require("dashboard/model/component/AdhocViewDashletModel"),
        WebPageDashletModel = require("dashboard/model/component/WebPageDashletModel"),
        TextDashletModel = require("dashboard/model/component/TextDashletModel"),
        ImageDashletModel = require("dashboard/model/component/ImageDashletModel"),
        VisualizationDashletModel = require("dashboard/model/component/VisualizationDashletModel"),
        FilterGroupDashletModel = require("dashboard/model/component/FilterGroupDashletModel"),
        ValueDashboardComponentModel = require("dashboard/model/component/ValueDashboardComponentModel"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var typeToConstructorMap = {};
    typeToConstructorMap[dashboardComponentTypes.WEB_PAGE_VIEW] = WebPageDashletModel;
    typeToConstructorMap[dashboardComponentTypes.FREE_TEXT] = TextDashletModel;
    typeToConstructorMap[dashboardComponentTypes.IMAGE] = ImageDashletModel;
    typeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = FilterGroupDashletModel;
    typeToConstructorMap[dashboardComponentTypes.CHART] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.CROSSTAB] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.TABLE] = AdhocViewDashletModel;
    typeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = InputControlDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.VALUE] = ValueDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.DASHBOARD_PROPERTIES] = PropertiesDashboardComponentModel;
    typeToConstructorMap[dashboardComponentTypes.REPORT] = ReportDashletModel;
    typeToConstructorMap[dashboardComponentTypes.ADHOC_VIEW] = AdhocViewDashletModel;


    /**
     * @memberof factory:dashboardComponentModelFactory
     * @description creates component object in top of give object which can be not full or have another properties
     * @access private
     * @param {object} componentObj - object to be converted into true componentObj
     * @param {DashboardResourceModel} dashboardResource
     * @returns {componentObj}
     */
    var createComponentObj = function(componentObj, dashboardResource){
        return {
            type: (componentObj.id && componentObj.resourceType !== dashboardComponentTypes.INPUT_CONTROL) ?
                componentObj.id :
                componentObj.type && componentObj.resourceType !== dashboardComponentTypes.INPUT_CONTROL ? componentObj.type : componentObj.resourceType,

            label: componentObj.label,
            resourceId: dashboardResource ? componentObj.id : undefined,
            resource: dashboardResource ? componentObj.uri : undefined
        }
    };


    /**
     * @memberof factory:dashboardComponentModelFactory
     * @access private
     * @desc factory function. Creates new component model
     * @param {object} componentObj - component object
     * @param {string} componentObj.type - component object type.
     * @param {object} options
     * @param {boolean} [options.createComponentObj] - create component object in top of given object.
     * @param {object} additionalOptions - options required to create component object
     * @param {DashboardComponentCollection} additionalOptions.collection
     * @param {DashboardResourceModel} additionalOptions.resource
     * @returns {Backbone.Model} DashboardComponentModel
     */
    var factoryFunction = function(componentObj, additionalOptions, options) {
        var componentObj = options && options.createComponentObj ? createComponentObj(componentObj, additionalOptions.resource) : componentObj;
        var constructor = componentObj.type in typeToConstructorMap
            ? typeToConstructorMap[componentObj.type]
            : DashletModel;

        return new constructor(componentObj, additionalOptions);
    };

    // hack to make Backbone.Collection#set method find idAttribute when factory function is used as model constructor
    factoryFunction.prototype.idAttribute = DashletModel.prototype.idAttribute;

    return factoryFunction;
});
