/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        InputControlCollection = require("bi/control/collection/InputControlCollection"),
        InputControlCollectionView = require("bi/control/view/InputControlCollectionView"),
        ParametersCache = require("../../../collection/ReportsParametersCollection").instance,
        InputControlPropertiesModel = require("bi/control/model/InputControlPropertiesModel"),
        inputControlWrapperTemplate = require("text!dashboard/template/inputControlWrapperTemplate.htm"),
        dashboardSettings = require("dashboard/dashboardSettings");

    function extractValuesFromRawState(state) {
        return !state.options ? state.value :
            _.reduce(state.options, function(memo, option){
                option.selected && memo.push(option.value);
                return memo;
            }, []);
    }

    function updateRawState(state, value) {
        if (_.isUndefined(state.options)) {
            state.value = value;
        } else {
            value = _.isArray(value) ? value : [value];

            _.each(state.options, function(option) {
                option.selected = _.contains(value, option.value);
            });
        }
    }

    function areAllChangedParametersDirect(changed, direct){
        return !_.find(changed, function(cnd){
             return _.indexOf(direct, cnd) === -1;
        });
    }

    return {
        template: _.template(inputControlWrapperTemplate),

        _onViewInitialize: function () {
            this.$el.attr(dashboardSettings.COMPONENT_ID_ATTRIBUTE, this.model.get("id"));
            
            this.paramsModel = this.model.paramsModel;
            this.paramsModel.set(this.model.get("params"), {silent: true});

            _.bindAll("notify");

            this.listenTo(this.model, "change:value", function() {
                if (!this._skipUISync){
                    var value = this.model.get("value"),
                        control = this.inputControlCollection.at(0);

                    control.changeState(control.state.isValue && !_.isUndefined(value) ? value[0] : value);
                }
            }, this);

            this.listenTo(this.model, "signal", function (payload) {
                if (_.isUndefined(payload.value)){
                    // components file content is updated before this, so its required to update it again.
                    // "changedControlProperties" event will be triggered
                    this.paramsModel.unset(payload.name, {trigger:true});
                } else {
                    // the value should be unset to make sure that the event will be triggered anyway
                    // handles case, when value is the same, for instance "~NOTHING~", but since it was updated it still requires cascade action
                    this.paramsModel.unset(payload.name, {silent: true});
                    this.paramsModel.set(payload.name, payload.value)
                }
            });

            this.listenTo(this.paramsModel, "change", function(a, b){
                this.model.isCascadeEnabled && this._onInputParametersChange(a, b);
            });
        },

        _initComponent: function() {
            this.inputControlPropertiesModel = new InputControlPropertiesModel({
                resource: this.model.getOwnerUri(),
                server: dashboardSettings.CONTEXT_PATH
            });

            this.inputControlCollection = new InputControlCollection([], {
                stateModel: this.inputControlPropertiesModel
            });

            this.component = new InputControlCollectionView({
                collection: this.inputControlCollection,
                stateModel: this.inputControlPropertiesModel
            });

            this.component.setContainer(this.$el);

            this.listenTo(this.inputControlCollection, "changeState change:state", this.notify);

            // Workaround for IC service to work correctly in case if some controls were not added
            var initialParseState = this.inputControlCollection._parseState, name = this.model.getOwnerParameterName();
            this.inputControlCollection._parseState = function (state) {
                state.id === name && initialParseState.call(this, state);
            }
        },

        _onInputParametersChange: function (model, options) {
            this.model.set("params", this.paramsModel.attributes);
            if (options && options.trigger){
                this.model.collection.trigger("changedControlProperties", this.model);
            }

            var changedParameters = _.keys(model.changed),
                directParameters = this.getDirectParameters(),
                self = this;

            if (areAllChangedParametersDirect(changedParameters, directParameters)) {
                // Workaround for IC service to work correctly in case if some controls were not added
                var thisIdWithMissing = _.difference([this.model.getOwnerParameterName()].concat(this.model.get("masterDependencies")), _.keys(this.paramsModel.attributes));

                this.model.getParent() && this.model.getParent().trigger("beforeChildUpdate", this);

                this.inputControlCollection.updateState({
                    params: this.paramsModel.attributes
                }, thisIdWithMissing).done(function(){
                    self.model.applyDeferredValue();
                }).always(function(){
                    self.model.getParent() && self.model.getParent().trigger("afterChildUpdate", self);
                });
            }
        },

        _resizeComponent: function() {
            if (this.inputControlCollection.length > 0) {
                var controlId = this.inputControlCollection.at(0).id,
                    controlView = this.component.controlViews[controlId] || {};

                controlView.resize && controlView.resize();
            }
        },

        _renderComponent: function () {
            this.reset();
        },

        _removeComponent: function() {
            this.component.remove();
        },

        reset: function(){
            var collection = this.inputControlCollection,
                self = this,
                inputControlComponentModel = this.model;

            ParametersCache
                .getInputControlAsParameter(this.model.getOwnerUri(), this.model.getOwnerParameterName(), {full: this.model.get("fullCollectionRequired")})
                .done(function (control) {
                    var previousControl = collection.findWhere({id: control.id}),
                        isModelSet = collection.models && collection.models.length > 0,
                        isCurrentControlTypeSame = previousControl && control.type === previousControl.get("type");

                    if (isModelSet && isCurrentControlTypeSame) {
                        var model = collection.models[0];

                        if (!(model.state.isValue = !control.state.options) && model.state.options.models &&
                            model.state.options.models.length !== control.state.options.length) {

                            model.state.set("options", control.state.options);
                        }

                        var extractedValuesFromState = extractValuesFromRawState(control.state);
                        model.changeState(extractedValuesFromState);

                    } else {
                        var preparedControl = _.extend({}, control, {
                            label: inputControlComponentModel.get("label") || control.label,
                            slaveDependencies: []
                        });

                        if (self.model.has("value")) {
                            updateRawState(preparedControl.state, self.model.get("value"));
                        }

                        collection.reset([preparedControl]);
                    }
                    self.ready.resolve();
                }).fail(function(){
                    self.ready.resolve();
                })
        },

        getDirectParameters: function(){
            var result = [].concat(this.model.get("masterDependencies")),
                ownersUri = this.model.getOwnerUri(),
                ownersControls = this.model.collection.filter(function(component){
                    return component.getOwnerUri && !_.isUndefined(ownersUri) && component.getOwnerUri() === ownersUri;
                });

            _.each(this.model.get("masterDependencies"), function (id) {
                var parentControl = _.find(ownersControls, function (control) {
                    return control.getOwnerParameterName() === id;
                });

                if (parentControl){
                    result = _.difference(result, parentControl.get("masterDependencies"));
                }
            });

            return result;
        },

        notify: function(){
            this._skipUISync = true;
            this.model.acceptControlState(this.inputControlCollection.models[0].state);
            this._skipUISync = false;
        },

        /**
         * @description Adds overlay for input control element.
         * @memberof inputControlTrait
         */
        addOverlay: function() {
            if (!this.$overlay) {
                this.$overlay = $("<div></div>").addClass("overlay");
                this.$el.prepend(this.$overlay);
            }
        }
    }
});
