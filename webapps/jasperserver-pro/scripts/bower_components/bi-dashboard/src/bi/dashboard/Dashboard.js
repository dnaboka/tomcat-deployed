/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */
define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        log = require("logger").register(module),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        biComponentErrorFactory = require("common/bi/error/biComponentErrorFactory"),
        SchemaValidationBiComponentError = require("common/bi/error/SchemaValidationBiComponentError"),
        BiComponent = require("common/bi/component/BiComponent"),
        DashboardBiComponentStateModel = require("./model/DashboardBiComponentStateModel"),
        WiringProducerViewModelCollection = require("dashboard/collection/filterManager/WiringProducerViewModelCollection"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        CanvasView = require('dashboard/view/base/CanvasView'),
        httpStatusCodes = require("common/enum/httpStatusCodes"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        DashboardModel = require('dashboard/model/DashboardModel'),
        sandboxFactory = require('dashboard/factory/sandboxFactory'),
        dashboardSchema = JSON.parse(require("text!./schema/Dashboard.json")),
        dashboardComponentSchema = JSON.parse(require("text!./schema/DashboardComponent.json"));

    var propertyNames = _.keys(dashboardSchema.properties),
        fieldNames = ['properties'],
        readOnlyFieldNames = ['data'],
        dashboardBiComponentEvents = {
            CAN_UNDO: "canUndo",
            CAN_REDO: "canRedo",
            CANVAS_READY: "__canvasReady__"
        };

    function checkContainerExistence(dfd, container) {
        var $container = $(container).first();

        if (!($container.length && $container[0].nodeType == "1")) {
            var err = biComponentErrorFactory.containerNotFoundError(container);
            log.error(err.toString());
            dfd.reject(err);
            return false;
        }

        return $container;
    }

    function tryRenderDashboard(dfd, instanceData, dashboardCanvas, resolveWith, stateModel) {
        var $container = checkContainerExistence(dfd, instanceData.properties.container);

        if ($container) {
            var $dashboardCanvasEl = dashboardCanvas.$el;

            // prefix with class "jr" to make it works with jasper-ui css
            $dashboardCanvasEl.addClass("jr");

            // cleanup container before getting height
            $container.empty();

            !$container.height() && $dashboardCanvasEl.height(dashboardSettings.DASHBOARD_CONTAINER_HEIGHT);

            $container.html($dashboardCanvasEl);

            for (var i = 0; i < dashboardCanvas.componentViews.length; i++){
                dashboardCanvas.componentViews[i].trigger("componentAttached", dashboardCanvas.componentViews[i]);
            }

            stateModel.set("_rendered", true);

            resolveWith && dfd.resolve(resolveWith);
        }
    }

    function updateParametersInData(instanceData, dashboardModel){
        instanceData.data.parameters = _.map(dashboardModel.currentFoundation.wiring.filter(function(m) {
            return m.component.isValueProducer();
        }), function(m) {
            return {
                id: m.component.get("type") === dashboardComponentTypes.INPUT_CONTROL || m.component.get("type") === dashboardComponentTypes.VALUE
                    ? m.component.id
                    : m.id,
                value: m.value
            };
        });
    }


    function run(dfd, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager) {
        var validationResult = this.validate(),
            self = this,
            dashboardId = dashboardModel.cid,
            err;

        if (validationResult) {
            err = biComponentErrorFactory.validationError(validationResult);
            log.error(err.toString());
            dfd.reject(err);
            return;
        }

        stateModel.state.set(stateModel.toJSON());

        if (!stateModel.get("_fetched")) {
            // check if we have correct container (only in case it is provided)
            if (instanceData.properties.container) {
                if (!checkContainerExistence(dfd, instanceData.properties.container)) {
                    return;
                }
            }

            // we assume that this cannot be changed and are set only once
            dashboardSettings.CONTEXT_PATH = instanceData.properties.server;
            dashboardModel.set("uri", instanceData.properties.resource);
            dashboardModel.contextPath = instanceData.properties.server;

            // so make it read-only
            biComponentUtil.createReadOnlyProperty(this, "server", instanceData, true, stateModel);
            biComponentUtil.createReadOnlyProperty(this, "resource", instanceData, true, stateModel);

            // dirty hack to init everything with values passes through params()
            dashboardModel.once("resourcesDataFetched", function() {
                var foundation = _.findWhere(dashboardModel.get("foundations"), { id: dashboardModel.get("defaultFoundation") }),
                    components = dashboardModel.resources.get(foundation.components).resource.content;

                for (var id in instanceData.properties.params) {
                    if (instanceData.properties.params.hasOwnProperty(id)) {
                        var component = _.findWhere(components, { id: id });

                        if (component) {
                            component.value = instanceData.properties.params[id];
                        } else if (_.isString(id) && id.indexOf(":") > -1) {
                            var idParts = id.split(":"),
                                outputParameter;

                            component = _.findWhere(components, { id: idParts[0] });

                            if (component && component.outputParameters) {
                                outputParameter = _.findWhere(component.outputParameters, { id: idParts[1] });

                                if (outputParameter) {
                                    outputParameter.value = instanceData.properties.params[id];
                                }
                            }
                        }
                    }
                }
            });

            dashboardModel
                .fetch()
                .done(function () {
                    stateModel.set("_fetched", true);

                    if (dashboardCanvas.componentViews.length) {
                        $.when.apply($, _.pluck(dashboardCanvas.componentViews, "ready")).then(function () {
                            dashboardCanvas.ready.resolve();
                            stateModel.set("_canvasReady", true);
                        });
                    }

                    dashboardCanvas.enableAutoRefresh();

                    updateParametersInData(instanceData, dashboardModel);

                    instanceData.data.components = dashboardModel.currentFoundation.components.getComponents();

                    eventManager.listenTo(dashboardModel.currentFoundation.components, "change add reset remove paramsModelChanged", function() {
                        instanceData.data.components = dashboardModel.currentFoundation.components.getComponents();
                    });

                    if (instanceData.properties.linkOptions) {
                        putLinkOptionsToSandbox(instanceData.properties.linkOptions, dashboardModel.cid);
                    }

                    sandboxFactory.get(dashboardId).set("reportSettings", biComponentUtil.cloneDeep(instanceData.properties.report));

                    if (instanceData.properties.container) {
                        tryRenderDashboard(dfd, instanceData, dashboardCanvas, self.data(), stateModel);
                    } else {
                        dfd.resolve(self.data());
                    }
                })
                .fail(function (xhr) {
                    err = biComponentErrorFactory.requestError(xhr);
                    log.error(err.toString());
                    dfd.reject(err);
                });
        } else {
            var changedAttrs = stateModel.state.changedAttributes(),
                dfds = {
                    setParams: new $.Deferred(),
                    runReports: new $.Deferred(),
                    render: new $.Deferred()
                };

            if (changedAttrs && "params" in changedAttrs) {
                var availableParameters = instanceData.data.parameters,
                    params,
                    appliedValues = [],
                    notify = {};

                params = _.reduce(availableParameters, function(memo, param) {
                    if (param.id in instanceData.properties.params){
                        memo[param.id] = instanceData.properties.params[param.id];
                    }
                    return memo;
                }, {});

                for (var id in params) {
                    var componentModel = dashboardModel.currentFoundation.components.get(id);

                    if (componentModel) {
                        componentModel.prepareForAcquire(params);
                    }
                }

                dashboardModel.currentFoundation.components.setMuteFilterPanels(true);

                for (var id in params) {
                    var componentModel = dashboardModel.currentFoundation.components.get(id);

                    if (componentModel) {
                        appliedValues.push(componentModel.acquireValue(params));
                    } else if (_.isString(id) && id.indexOf(":") > -1) {
                        var idParts = id.split(":"),
                            outputParameter;

                        componentModel = dashboardModel.currentFoundation.components.get(idParts[0]);

                        if (componentModel && componentModel.has("outputParameters")) {
                            outputParameter = _.findWhere(componentModel.get("outputParameters"), { id: idParts[1] });

                            if (outputParameter) {
                                notify[componentModel.id] || (notify[componentModel.id] = { model: componentModel, signals: {} });
                                notify[componentModel.id].signals[outputParameter.id] = params[id];
                            }
                        }
                    }
                }

                _.forEach(_.values(notify), function(obj) {
                    obj.model.notify(obj.signals);
                });

                // wait for reports re-rerun first before triggering refresh. This will eliminate race conditions
                dfds.runReports
                    .done(function () {
                        $.when.apply($, appliedValues).done(function () {
                            dashboardModel.currentFoundation.components.setMuteFilterPanels(false);

                            dashboardModel.currentFoundation.components.getDashboardPropertiesComponent().applyParameters();

                            dfds.setParams.resolve();
                        }).fail(function () {
                            dashboardModel.currentFoundation.components.setMuteFilterPanels(false);
                        });
                    }).fail(function () {
                    dashboardModel.currentFoundation.components.setMuteFilterPanels(false);
                });
            } else {
                dfds.setParams.resolve();
            }

            if (changedAttrs && ("linkOptions" in changedAttrs || "report" in changedAttrs)) {
                //set new linkOptions to all visualizations
                "linkOptions" in changedAttrs  && putLinkOptionsToSandbox(instanceData.properties.linkOptions, dashboardId);

                "report" in changedAttrs && sandboxFactory.get(dashboardId).set("reportSettings", biComponentUtil.cloneDeep(instanceData.properties.report));

                //resolve our deferred when all necessary views will be re-rendered
                $.when.apply(this, runReports(dashboardCanvas, instanceData))
                    .done(dfds.runReports.resolve)
                    .fail(dfds.runReports.reject);
            } else {
                dfds.runReports.resolve();
            }

            if (changedAttrs && "container" in changedAttrs) {
                $.when(dfds.setParams, dfds.runReports)
                    .done(function() {
                        tryRenderDashboard(dfds.render, instanceData, dashboardCanvas, true, stateModel);
                    });
            } else {
                dfds.render.resolve();
            }

            $.when.apply($, _.values(dfds))
                .done(function() {
                    dfd.resolve(self.data());
                })
                .fail(dfd.reject);

            return dfd;
        }
    }

    function runReports(dashboardCanvas, instanceData) {
        var views = dashboardCanvas.componentViews.filter(function(view) {
            return view.model.isVisualization() &&
                view.model.get("type") !== dashboardComponentTypes.WEB_PAGE_VIEW;
        });

        //re-render all visualizations which could depend on link options and other report options and collect promises
        return _.map(views, function(view) {
            return view.component.run();
        });
    }

    function render(dfd, instanceData, dashboardCanvas, stateModel) {
        tryRenderDashboard(dfd, instanceData, dashboardCanvas, dashboardCanvas.$el[0], stateModel);
    }

    function destroy(dfd, dashboardId, dashboardCanvas, stateModel, eventManager) {
        eventManager.stopListening();

        dashboardCanvas.remove();

        sandboxFactory.get(dashboardId).set("linkOptions", null);
        stateModel.set("_destroyed", true);

        dfd.resolve();
    }

    function refresh(componentId, dfd, stateModel, dashboardCanvas, instanceData, dashboardModel, eventManager) {
        if (_.isUndefined(componentId)) {
            var result = stateModel.get("_fetched")
                ? dashboardCanvas.refresh()
                : run.call(this, dfd, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager);

            result
                .done(dfd.resolve)
                .fail(dfd.reject);
        } else {
            if (!stateModel.get("_fetched")) {
                throw new Error("Cannot refresh dashboard component without running dashboard");
            }

            var component = _.findWhere(dashboardModel.currentFoundation.components.getComponents(), { id: componentId }),
                componentView;

            if (!component) {
                throw new Error("Component with id '" + componentId + "' was not found");
            }

            componentView = dashboardCanvas.getComponentViewByComponentId(componentId);

            // refresh only refreshable components, ignore others
            if (componentView && componentView.refresh) {
                componentView.refresh().then(dfd.resolve, dfd.reject);
            } else {
                dfd.resolve();
            }
        }
    }

    function cancel(componentId, dfd, stateModel, dashboardCanvas, instanceData, dashboardModel, eventManager) {
        if (_.isUndefined(componentId)) {
            if (!stateModel.get("_fetched")) {
                dfd.resolve();
            } else {
                dashboardCanvas.cancel()
                    .done(dfd.resolve)
                    .fail(dfd.reject);
            }
        } else {
            if (!stateModel.get("_fetched")) {
                dfd.resolve();
            } else {
                var component = _.findWhere(dashboardModel.currentFoundation.components.getComponents(), { id: componentId }),
                    componentView;

                if (!component) {
                    throw new Error("Component with id '" + componentId + "' was not found");
                }

                componentView = dashboardCanvas.getComponentViewByComponentId(componentId);

                // cancel refresh of only refreshable components, ignore others
                if (componentView && componentView.cancel) {
                    componentView.cancel().then(dfd.resolve, dfd.reject);
                } else {
                    dfd.resolve();
                }
            }
        }
    }

    function createRefreshAction(func, dashboardCanvas, stateModel, instanceData, dashboardModel, eventManager) {
        return function(componentId) {
            var dfd = new $.Deferred(),
                err,
                successCallback,
                errorCallback,
                completeCallback;

            if (stateModel.get("_destroyed")) {
                err = biComponentErrorFactory.alreadyDestroyedError();
                log.error(err.toString());

                dfd.reject(err);
            } else {
                try {
                    if (_.isString(arguments[0])) {
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    } else {
                        successCallback = arguments[0];
                        errorCallback = arguments[1];
                        completeCallback = arguments[2];
                    }

                    successCallback && _.isFunction(successCallback) && dfd.done(successCallback);
                    errorCallback && _.isFunction(errorCallback) && dfd.fail(errorCallback);
                    completeCallback && _.isFunction(completeCallback) && dfd.always(completeCallback);

                    func.call(this, componentId, dfd, stateModel, dashboardCanvas, instanceData, dashboardModel, eventManager);
                } catch (ex) {
                    err = biComponentErrorFactory.javaScriptException(ex);

                    log.error(err.toString());
                    dfd.reject(err);
                }
            }

            return dfd;
        }
    }

    function createUpdateComponentAction(dashboardModel, stateModel) {
        return function() {
            var dfd = new $.Deferred(),
                err,
                singleComponent = false,
                componentsToUpdate,
                successCallback,
                errorCallback,
                completeCallback;

            if (stateModel.get("_destroyed")) {
                err = biComponentErrorFactory.alreadyDestroyedError();
                log.error(err.toString());

                dfd.reject(err);
            } else if (!stateModel.get("_rendered")) {
                err = biComponentErrorFactory.notYetRenderedError();
                log.error(err.toString());

                dfd.reject(err);
            } else {
                try {
                    if (_.isArray(arguments[0])) {
                        componentsToUpdate = arguments[0];
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    } else if (_.isString(arguments[0])) {
                        singleComponent = true;
                        componentsToUpdate = [ _.extend({}, arguments[1], { id: arguments[0] }) ];
                        successCallback = arguments[2];
                        errorCallback = arguments[3];
                        completeCallback = arguments[4];
                    } else if (_.isFunction(arguments[0]) || _.isUndefined(arguments[0])) {
                        throw new Error("Invalid arguments supplied. No component to update");
                    } else {
                        singleComponent = true;
                        componentsToUpdate = [ arguments[0] ];
                        successCallback = arguments[1];
                        errorCallback = arguments[2];
                        completeCallback = arguments[3];
                    }

                    successCallback && _.isFunction(successCallback) && dfd.done(successCallback);
                    errorCallback && _.isFunction(errorCallback) && dfd.fail(errorCallback);
                    completeCallback && _.isFunction(completeCallback) && dfd.always(completeCallback);

                    var updatedComponentObjects = _.map(componentsToUpdate, function(component) {
                            return constructUpdatedComponentObject(dashboardModel, component);
                        }),
                        validationError = _.find(updatedComponentObjects, function(c) {
                            return c instanceof SchemaValidationBiComponentError;
                        }),
                        results;

                    if (validationError) {
                        dfd.reject(validationError);
                    } else {
                        results = _.map(updatedComponentObjects, function(componentToUpdate) {
                            var componentModel = dashboardModel.currentFoundation.components.get(componentToUpdate.id);

                            componentModel.updateFromDashboardComponentObject(componentToUpdate);

                            return componentModel.toDashboardComponentObject();
                        });

                        if (singleComponent) {
                            results = results[0];
                        }

                        dfd.resolve(results);
                    }
                }
                catch (ex) {
                    err = biComponentErrorFactory.javaScriptException(ex);

                    log.error(err.toString());
                    dfd.reject(err);
                }
            }

            return dfd;
        };
    }

    function constructUpdatedComponentObject(dashboardModel, component) {
        var componentToUpdate = _.findWhere(dashboardModel.currentFoundation.components.getComponents(), { id: component.id });

        if (!componentToUpdate) {
            throw new Error("Component with such name or id '" + component.id + "' was not found");
        }

        var updatedComponent = _.omit(_.extend(componentToUpdate, component), "id", "type", "name", "position"),
            validationResult = biComponentUtil.validateObject(dashboardComponentSchema, updatedComponent);

        return validationResult
            ? biComponentErrorFactory.validationError(validationResult)
            : _.extend(updatedComponent, { id: component.id });
    }

    function putLinkOptionsToSandbox(linkOptions, dashboardId) {
        if (linkOptions) {
            sandboxFactory.get(dashboardId).set("linkOptions", biComponentUtil.cloneDeep(linkOptions));
        }
    }

    function undoParams(dfd, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager, all){
        stateModel.prevUndoRedoOp.always(function () {
            dashboardModel.currentFoundation.components.once("parametersState:operationFinished", function(){
                dfd.resolve();
            });
            
            if (all) {
                dashboardModel.currentFoundation.components.resetParametersState();
            } else {
                dashboardModel.currentFoundation.components.popParametersState(-1);
            }

            dashboardModel.currentFoundation.components.getDashboardPropertiesComponent().applyParameters(true);
        });

        stateModel.prevUndoRedoOp = dfd;

        return dfd.promise();
    }

    function redoParams(dfd, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager){
        stateModel.prevUndoRedoOp.always(function () {
            dashboardModel.currentFoundation.components.once("parametersState:operationFinished", function(){
                dfd.resolve();
            });
            
            dashboardModel.currentFoundation.components.popParametersState(1);
            dashboardModel.currentFoundation.components.getDashboardPropertiesComponent().applyParameters(true);
        });

        stateModel.prevUndoRedoOp = dfd;

        return dfd.promise();
    }

    function createEventsFunction(instanceData, eventManager, dashboardModel, stateModel) {
        return function(events) {
            if (stateModel.get("_destroyed")) {
                throw biComponentErrorFactory.alreadyDestroyedError();
            }

            var self = this;

            if (!events || !_.isObject(events) || !_.keys(events).length) {
                return self;
            }

            instanceData.events || (instanceData.events = {});

            _.each(instanceData.events, function(value, key) {
                if (_.isFunction(value)) {
                    if (key === dashboardBiComponentEvents.CAN_REDO) {
                        eventManager.stopListening(stateModel, "change:_canRedo");
                    } else  if (key === dashboardBiComponentEvents.CAN_UNDO) {
                        eventManager.stopListening(stateModel, "change:_canRedo");
                    } else  if (key === dashboardBiComponentEvents.CANVAS_READY) {
                        eventManager.stopListening(stateModel, "change:_canvasReady");
                    }
                }
            });

            _.each(events, function (value, key) {
                if (_.isFunction(value)) {
                    if (key === dashboardBiComponentEvents.CAN_UNDO) {
                        instanceData.events[key] = function () {
                            value.call(self, stateModel.get("_canUndo"));
                        };
                    } else if (key === dashboardBiComponentEvents.CAN_REDO) {
                        instanceData.events[key] = function () {
                            value.call(self, stateModel.get("_canRedo"));
                        };
                    } else if (key === dashboardBiComponentEvents.CANVAS_READY) {
                        instanceData.events[key] = function () {
                            value.call(self, stateModel.get("_canvasReady"));
                        };
                    }
                }
            });

            _.each(instanceData.events, function(value, key) {
                if (_.isFunction(value)) {
                     if (key === dashboardBiComponentEvents.CAN_REDO) {
                        eventManager.listenTo(stateModel, "change:_canRedo", value);
                    } else if (key === dashboardBiComponentEvents.CAN_UNDO) {
                         eventManager.listenTo(stateModel, "change:_canUndo", value);
                    } else if (key === dashboardBiComponentEvents.CANVAS_READY) {
                         eventManager.listenTo(stateModel, "change:_canvasReady", value);
                    }
                }
            });

            return self;
        }
    }

    var Dashboard = function(properties) {
        properties || (properties = {});

        var instanceData = {
            properties: _.extend({
                report: {
                    chart: {},
                    loadingOverlay: true
                }
            }, properties),
            data: {
                components: [],
                parameters: []
            }
        };

        var stateModel = new DashboardBiComponentStateModel(biComponentUtil.cloneDeep(instanceData.properties)),
            dashboardModel = new DashboardModel(),
            eventManager = _.extend({}, Backbone.Events),
            dashboardId = dashboardModel.cid,
            dashboardCanvas = new CanvasView({
                model: dashboardModel,
                dashboardId: dashboardId
            }), origData;

        stateModel.prevUndoRedoOp = new $.Deferred().resolve();

        biComponentUtil.createInstancePropertiesAndFields(this, instanceData, propertyNames, fieldNames, readOnlyFieldNames, stateModel);

        eventManager.listenTo(dashboardModel.currentFoundation.components, "parametersState:canUndo", _.bind(stateModel.set, stateModel, "_canUndo"));
        eventManager.listenTo(dashboardModel.currentFoundation.components, "parametersState:canRedo", _.bind(stateModel.set, stateModel, "_canRedo"));

        origData = this.data;

        _.extend(this, {
            validate: biComponentUtil.createValidateAction(instanceData, dashboardSchema, stateModel),
            run: biComponentUtil.createDeferredAction(run, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager),
            render: biComponentUtil.createDeferredAction(render, stateModel, instanceData, dashboardCanvas, stateModel),
            refresh: createRefreshAction(refresh, dashboardCanvas, stateModel, instanceData, dashboardModel, eventManager),
            cancel: createRefreshAction(cancel, dashboardCanvas, stateModel, instanceData, dashboardModel, eventManager),
            destroy: biComponentUtil.createDeferredAction(destroy, stateModel, dashboardId, dashboardCanvas, stateModel, eventManager),
            updateComponent: createUpdateComponentAction(dashboardModel, stateModel),
            undoParams: biComponentUtil.createDeferredAction(undoParams, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager),
            undoAllParams: biComponentUtil.createDeferredAction(undoParams, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager, true),
            redoParams: biComponentUtil.createDeferredAction(redoParams, stateModel, instanceData, dashboardModel, dashboardCanvas, stateModel, eventManager),
            events: createEventsFunction(instanceData, eventManager, dashboardModel, stateModel),
            data: function(){
                updateParametersInData(instanceData, dashboardModel);
                return origData.apply(this, arguments);
            }
        });
    };

    Dashboard.prototype = new BiComponent();

    _.extend(Dashboard, {
        componentTypes: _.without(_.values(dashboardComponentTypes), dashboardComponentTypes.DASHBOARD_PROPERTIES),
        componentIdDomAttribute: dashboardSettings.COMPONENT_ID_ATTRIBUTE,
        canvas: {
            width: dashboardSettings.GRID_WIDTH,
            height: dashboardSettings.GRID_HEIGHT
        }
    });

    return Dashboard;
});