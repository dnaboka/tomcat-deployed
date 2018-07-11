/*
 * Copyright (C) 2005 - 2017 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id:$
 */


define(function(require, exports, module) {
    var $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        i18n = require("bundle!AdHocBundle"),
        Backbone = require("backbone"),

        biComponentErrorCodes = require("common/bi/error/enum/biComponentErrorCodes"),

        AdHocModel = require("adhoc/api/model/AdHocModel"),
        AdHocQueryModel = require("adhoc/api/model/query/AdHocQueryModel"),

        Validation = require("adhoc/api/model/validators/Validation"),

        ChartView = require("adhoc/api/chart/ChartView"),
        TableView = require("adhoc/api/table/TableView"),
        CrosstabView = require("adhoc/api/crosstab/CrosstabView"),

        Overlay = require("components/overlay/Overlay"),
        Message = require("components/message/Message"),
        messageTypes = require("components/message/enums/messageTypes"),

        VisualChooserDialog = require("adhoc/api/visualChooser/VisualChooserDialog"),

        template = require("text!./template/generalLayout.htm");

    var ADHOC_CONTAINER_HEIGHT = 400;

    var types = {
        table: TableView,
        chart: ChartView,
        crosstab: CrosstabView
    };

    var Facade = Backbone.View.extend({

        el: function () {
            return $(template)[0];
        },

        events: {
            "click .jr-jAdhocLauncher": "_onVisualizationSwitcherClick",

            "mouseenter .jr-jAdhocLauncherButton": "_onMouseEnterVisualizationButton",
            "mouseleave .jr-jAdhocLauncherButton": "_onMouseLeaveVisualizationButton"
        },

        initialize: function(instanceData, options) {
            _.bindAll(this, "resize");

            this.instanceData = instanceData;
            this.options = instanceData.properties;
            this.stateModel = options.stateModel;
            this.container = this.options.container;
            this.$container = $(this.container);
            this.dataComponents = {};

            // cleanup container before getting height
            this.$container.empty();

            this.$el.height(this.$container.height() ? "100%" : ADHOC_CONTAINER_HEIGHT);
            this.$el.children(".jr-jAdhocVizualization").height(this.$container.height() ? "100%" : ADHOC_CONTAINER_HEIGHT);

            this.$container[0] && this.$container.append(this.el);

            this.model = new AdHocModel({uri: this.options.resource}, {server: this.options.server});

            this._initalizeMainOverlay();
            this._initializeMessage();

            this.optionsValidators = Validation(this.model);

            this.$canvas = this.$(".jr-jAdhocVisualizationContainer");
            this.$title = this.$(".jr-jAdhocVisualizationTitle");
            this.$titleText = this.$(".jr-jAdhocVisualizationTitleText");
            this.$visualizationLauncher = this.$(".jr-jAdhocLauncher");
            this.$visualizationLauncherIcon = this.$(".jr-jAdhocLauncherIcon");

            this.$el.css({position: "relative"});

            this.listenTo(this.model.dataSet, "change:dataset", this._updateDisabledVisualizationTypes, this);
            this.listenTo(this.model.dataSet, "error:dataset", this._showError, this);

            this.listenTo(this.model, "data:available", function(componentId, componentModel){
                this.dataComponents[componentId] = componentModel;
                this.instanceData.data = _.extend(this.instanceData.data, componentModel.toDataComponent());
            }, this);

            this.listenTo(this.model, "component:error",  this._showError, this);
        },

        visualChooserDialog: function(){
            if (!this._visualChooserDialog){
                this._visualChooserDialog = new VisualChooserDialog();
                this._visualChooserDialog.visualChooserView.on("change:visualizationType", this._onVisalizationTypeChange, this);
            }
            return this._visualChooserDialog;
        },

        _initalizeMainOverlay: function(){
            this.loadingOverlay = new Overlay({
                el: this.$(".jr-jOverlay")
            });

            this.listenTo(this.stateModel, "change:loadingOverlay", function () {
                if (this.stateModel.get("loadingOverlay")) {
                    this.loadingOverlay.show();
                } else {
                    this.loadingOverlay.hide();
                }
            }, this);

            this.listenTo(this.model, "component:busy", function(show){
                if (show) {
                    this.loadingOverlay.show(200);
                } else {
                    this.loadingOverlay.hide();
                }
            });

            this.stateModel.trigger("change:loadingOverlay");
        },

        _initializeMessage: function(){
            this.message = new Message({title: null, text: null, type: messageTypes.Type.Error, visible: false});
            this.$(".jr-jAdhocMessage").append(this.message.el);
        },

        _onMouseEnterVisualizationButton: function(event) {
            this.$(event.currentTarget).addClass("jr-isHovered");
        },
        _onMouseLeaveVisualizationButton: function(event) {
            this.$(event.currentTarget).removeClass("jr-isHovered");
        },

        _initComponentListeners: function() {
            var rootComponent = this.model.component;

            this.listenTo(rootComponent, "change:showTitle", this._updateTitleVisibility, this);
            this.listenTo(rootComponent, "change:title", this._updateTitleText, this);

            this.listenTo(rootComponent, "change:visualizationType", this._onVisualizationTypeChanged, this);
        },

        _onVisualizationSwitcherClick: function() {
            this.visualChooserDialog().open();
        },

        _onVisalizationTypeChange: function (type) {
            this.stateModel.set({loadingOverlay: true});

            this._hideError();

            this._manageComponentType(type);

            this.component.render(this.$canvas)
                .always(_.bind(this.stateModel.set, this.stateModel, {loadingOverlay: false}));
        },

        _updateTitleVisibility: function() {
            if (this.model.component.get("showTitle")) {
                this.$title.removeClass("jr-isHidden");

                this.$visualizationLauncher.removeClass("jr-isMinimized");
                this.$visualizationLauncherIcon.removeClass("jr-meatball");
                this.$visualizationLauncherIcon.addClass("jr-chartColumn");
            } else {
                this.$title.addClass("jr-isHidden");

                this.$visualizationLauncher.addClass("jr-isMinimized");
                this.$visualizationLauncherIcon.addClass("jr-meatball");
                this.$visualizationLauncherIcon.removeClass("jr-chartColumn");
            }

            this._updateCanvasHeight();
        },

        _updateTitleText: function() {
            this.$titleText.text(this.model.component.has("title") ? this.model.component.get("title") : "");
            this._updateCanvasHeight();
        },

        _updateCanvasHeight: function () {
            var height = (this.$container.height() || ADHOC_CONTAINER_HEIGHT) - parseFloat(this.$canvas.css("marginBottom"));

            if (this.model.component && this.model.component.get("showTitle")) {
                height -= this.$title.height() + parseFloat(this.$title.css("marginTop")) + parseFloat(this.$title.css("marginBottom"));
            }

            this.$canvas.height(height);
        },

        _applyProperties: function() {
            this.visualChooserDialog().visualChooserView.setSelectedType(this.model.component.get("visualizationType"));
            this._updateDisabledVisualizationTypes();

            this.options.hasOwnProperty("showTitle") && this.model.component.set("showTitle", this.options.showTitle);
        },
        _onVisualizationTypeChanged: function() {
             this.visualChooserDialog().visualChooserView.setSelectedType(this.model.component.get("visualizationType"));
        },

        _updateDisabledVisualizationTypes: function () {
            this.visualChooserDialog().visualChooserView.setDisabledTypes(this.model.dataSet.query.getDisabledTypesList());
        },

        _showError: function (err) {
            var message = err && err.errorCode && i18n["adhoc.error." + err.errorCode] ?
                format(i18n["adhoc.error." +err.errorCode], err.parameters) : i18n["adhoc.error.unexpected.error"];

            this.$(".jr-jAdhocVizualization").addClass("jr-isHidden");
            this.$visualizationLauncher.addClass("jr-isHidden");

            this.message.model.set({
                text: message,
                visible: true
            });

            this.stateModel.set({loadingOverlay: false});
        },

        _hideError: function () {
            this.$(".jr-jAdhocVizualization").removeClass("jr-isHidden");
            this.$visualizationLauncher.removeClass("jr-isHidden");

            this.message.model.set({visible: false});
        },

        _fetchModels: function (options, model) {
            var self = this,
                dfd = $.Deferred(),
                resolve = _.bind(dfd.resolve, dfd),
                reject = _.bind(dfd.reject, dfd);

            model.metadata().fail(function(err){
                self._showError(err);
                reject.apply(this, arguments);
            }).done(function () {
                var error = self.optionsValidators.validate(options);
                if (error){
                    self.component || self._showError(error);
                    reject(error);
                } else {
                    options.params && model.dataSet.query.parameters.set(options.params);

                    resolve();
                }
            });

            return dfd.promise();
        },

        _manageComponentType: function (type) {
            var newComponent;
            if (this.component) {
                if (this.component.isAcceptable(type)) {
                    this.model.component.set({visualizationType: type});
                } else {
                    newComponent = createComponent.call(this, type);

                    this.component.remove();
                    this.component = newComponent;

                    this.model.component.set({visualizationType: type});
                }
            } else {
                this.component = createComponent.call(this);
                this.model.component.set({visualizationType: type});
            }
        },

        _checkAutoresize: function () {
            var fn = this.stateModel.get("autoresize") ? "on" : "off";

            $(window)[fn]("resize", this.resize);
        },

        ////////////////////////////////////////////
        //                API Methods
        //////////////////////////////////////////// s

        /**
         * Perform main action for bi component
         * Callbacks will be attached to  deferred object.
         *
         * @param {Deferred} dfd - optional. Deferred to be controlled by view
         * @return {Deferred} dfd
         */
        run: function(extDfd) {
            var self = this,
                dfd = extDfd || new $.Deferred();

            dfd.fail(function () {
                self.stateModel.set("loadingOverlay", false);
            });

            this.stateModel.set("loadingOverlay", true);

            this._hideError();
            this._checkAutoresize();

            this._fetchModels(this.options, this.model).done(function(){
                self.render().done(function () {
                    dfd.resolve({
                        metadata: self.instanceData.data.metadata,
                        _dataset_internal_: self.model.dataSet.toDataComponent()._dataset_internal_
                    });
                }).fail(_.bind(dfd.reject, dfd));
            }).fail(_.bind(dfd.reject, dfd));

            return dfd.promise();
        },

        /**
         * Render AdHocView to container, previously specified in property.
         * @return {Deferred} dfd
         */
        render: function(extDfd){
            var self = this,
                type;
            extDfd || (extDfd = new $.Deferred());

            this._initComponentListeners();

            this._updateTitleText();
            this._updateTitleVisibility();

            this.model.metadata().done(function(){
                if (self.options.container) {
                    //fail rendering if bundle loading failed
                    self.model.bundles.bundle().fail(_.bind(extDfd.reject, extDfd));

                    if (self.options.canvas && self.options.canvas.type){
                        self._manageComponentType(self.options.canvas.type);
                    }

                    if (!self.component) {
                        self.component = createComponent.call(self);
                    }

                    self.component.render(self.$canvas).done(_.bind(extDfd.resolve, extDfd)).fail(_.bind(extDfd.reject, extDfd));
                    self._applyProperties();

                } else {
                    if (self.component){
                        self.component.remove();
                        delete self.component;
                    }
                    self.model.dataSet.data().done(_.bind(extDfd.resolve, extDfd)).fail(_.bind(extDfd.reject, extDfd));
                }
            });

            return extDfd.promise();
        },

        /**
         * Cancel all execution, destroy AdHocView representation if any, leave only
         * properties
         */
        destroy: function(dfd) {
            this.remove();

            if (this.model.dataSet.isNew()) {
                dfd.resolve();
            } else {
                this.model.dataSet.destroy({
                    success: _.bind(dfd.resolve, dfd),
                    error: _.bind(dfd.reject, dfd)
                });
            }
        },

        refresh: function (extDfd) {
            var dfd = extDfd || new $.Deferred();

            if(this.component) {
                this._hideError();

               this.component.refresh(dfd);
            } else {
                this.run(dfd);
            }

            return dfd.promise();
        },

        resize: function () {
            this._updateCanvasHeight();

            this.component && this.component.resize();
        },

        remove: function () {
            this.loadingOverlay.remove();
            this.component || this.component.remove();
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
    return Facade;

    function format(result, params) {
        params && _.each(params, function (value, idx) {
            result = result.replace("{" + idx + "}", value);
        });

        return result;
    }

    function createComponent(desiredType){
        var type, component;

        desiredType || (desiredType = this.options.canvas && this.options.canvas.type);

        if (desiredType){
            type = types[desiredType.toLowerCase()] || ChartView;
        } else {
            type = this.model.component.components.reduce(function (memo, component) {
                return memo || (component.componentType && types[component.componentType]);
            }, false);
        }

        component = new type({
            dataModel: this.model,
            options: this.options
        });

        return component;
    }

});
