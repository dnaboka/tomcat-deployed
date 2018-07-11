/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";


    /**
     * @constructor
     * @alias factory:dashboardComponentViewFactory
     * @param {object} options - specific related component view properties and model
     * @param {DashboardComponentModel} options.model
     * @param {boolean} isDesigner - if true uses dashletTrait, otherwise uses dashletDesignerTrait
     * @classdesc returns dashboard component view factory. Allows to get view by model type.
     * @returns {ComponentView|DesignerComponentView}
     */


    var _ = require("underscore"),
        ComponentView = require("../view/base/ComponentView"),
        DesignerComponentView = require("../view/designer/DesignerComponentView"),
        reportTrait = require("../view/base/componentViewTrait/reportTrait"),
        webPageTrait = require("../view/base/componentViewTrait/webPageTrait"),
        textTrait = require("../view/base/componentViewTrait/textTrait"),
        imageTrait = require("../view/base/componentViewTrait/imageTrait"),
        filterGroupTrait = require("../view/base/componentViewTrait/filterGroupTrait"),
        inputControlTrait = require("../view/base/componentViewTrait/inputControlTrait"),
        dashletTrait = require("../view/base/componentViewTrait/dashletTrait"),
        designerDashletTrait = require("../view/designer/componentViewTrait/designerDashletTrait"),
        designerInputControlTrait = require("../view/designer/componentViewTrait/designerInputControlTrait"),
        designerAdhocViewTrait = require("../view/designer/componentViewTrait/designerAdhocViewTrait"),
        designerFilterGroupTrait = require("../view/designer/componentViewTrait/designerFilterGroupTrait"),
        designerVisualizationTrait = require("../view/designer/componentViewTrait/designerVisualizationTrait"),
        designerTextTrait = require("../view/designer/componentViewTrait/designerTextTrait"),
        designerImageTrait = require("../view/designer/componentViewTrait/designerImageTrait"),
        dashboardComponentTypes = require("../enum/dashboardComponentTypes");

    var viewerTypeToConstructorMap = {},
        designerTypeToConstructorMap = {};

    viewerTypeToConstructorMap[dashboardComponentTypes.WEB_PAGE_VIEW] = webPageTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = filterGroupTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.FREE_TEXT] = textTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.IMAGE] = imageTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = inputControlTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.REPORT] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.ADHOC_VIEW] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.CROSSTAB] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.CHART] = reportTrait;
    viewerTypeToConstructorMap[dashboardComponentTypes.TABLE] = reportTrait;

    designerTypeToConstructorMap[dashboardComponentTypes.INPUT_CONTROL] = designerInputControlTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.ADHOC_VIEW] = designerAdhocViewTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.CROSSTAB] = designerVisualizationTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.CHART] = designerVisualizationTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.TABLE] = designerVisualizationTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.FILTER_GROUP] = designerFilterGroupTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.FREE_TEXT] = designerTextTrait;
    designerTypeToConstructorMap[dashboardComponentTypes.IMAGE] = designerImageTrait;


    /**
     * @memberof factory:dashboardComponentViewFactory
     * @param {object} type - designerDashletTrait or dashletTrait
     * @param {object} trait - specific component view trait, depends on model.
     * @desc mixes two traits - designerDashletTrait or dashletTrait plus specific component view trait which depends on model.
     */
    function mixin(type, trait){
        for (var field in trait){
            if (type[field] && _.isFunction(type[field]) && _.isFunction(trait[field])){
                type[field] = combineFunctions(type[field], trait[field]);
            } else {
                type[field] = trait[field];
            }
        }
    }

    /**
     * @memberof factory:dashboardComponentViewFactory
     * @param {object} first - method from designerDashletTrait or dashletTrait trait
     * @param {object} second - method from specific component view trait, depends on model.
     * @desc combines two traits functions (if such, with the same name, exists in each of the traits)
     * @returns {function}
     */
    function combineFunctions(first, second){
        return function(){
            first.apply(this, arguments);
            return second.apply(this, arguments)
        }
    }

    return function(options, isDesigner) {
        var modelType = options.model.get("type"),
            typeMap = isDesigner && modelType in designerTypeToConstructorMap ? designerTypeToConstructorMap : viewerTypeToConstructorMap,
            trait = modelType !== dashboardComponentTypes.INPUT_CONTROL ? _.extend({}, isDesigner ? designerDashletTrait : dashletTrait) : {};

        mixin(trait, modelType in typeMap ? typeMap[modelType] : {});

        var baseConstructor = isDesigner ? DesignerComponentView : ComponentView,
            viewClass = baseConstructor.extend(trait);

        return new viewClass(options);
    };
});
