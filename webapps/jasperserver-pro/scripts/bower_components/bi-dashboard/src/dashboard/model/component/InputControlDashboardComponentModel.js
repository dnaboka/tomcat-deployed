/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var DashboardComponentModel = require("./DashboardComponentModel"),
        ValueDashboardComponentModel = require("./ValueDashboardComponentModel"),
        ParametersCache = require("../../collection/ReportsParametersCollection").instance,
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        $ = require("jquery"),
        _ = require("underscore");

    function convertICDataToWiringInfo(model, parameters){
        var res = {
            signals: [ model.getOwnerParameterName() ],
            slots: {}
        };

        _.each(parameters, function(parameter){
            res.slots[parameter] = function(name){
                return function(value, sender){
                    model.trigger("signal", {
                        name: name,
                        value: value
                    }, sender);
                }
            }(parameter);
        });

        return res;
    }

    return ValueDashboardComponentModel.extend({
        componentName: i18n['dashboard.component.input.control.component.name'],

        defaults: _.extend({}, DashboardComponentModel.prototype.defaults, {
           label: undefined
        }),

        validation: _.extend({}, DashboardComponentModel.prototype.validation, {
            label: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.filter.label.required")
                }
            ]
        }),
        
        initializeSpecific: function(attrs, options){
            this.componentInitializedDfd = new $.Deferred(); 
        }, 

        isVisible: function(){
            return this.resource.resource.get("visible");
        },

        getOwnerUri: function(){
            var owner = this.collection.findWhere({resource: this.get("ownerResourceId")});

            return owner
                ? owner.resource.resource.get("uri")
                : undefined;
        },

        getOwnerParameterName: function(){
            return this.get("ownerResourceParameterName");
        },

        notify: function(){
            this.trigger(this.getOwnerParameterName(), this.get("value"));
        },

        toDashboardComponentObject: function() {
            var data = DashboardComponentModel.prototype.toDashboardComponentObject.apply(this, arguments);

            data.resource = null;

            return data;
        },

        toJSON: function(){
            return _.omit(this.attributes, "value");
        },

        acceptControlState: function(state){
            // the value should be unset to make sure that the event will be triggered anyway
            // handles case, when the control accepts new value, same as previous
            this.unset("value", {silent: true});
            this.set("value", extractValuesFromStateModel(state));
            this.get("parentId") && this.collection.get(this.get("parentId")).notify();
        },
        prepareForAcquire: function(values){
            var self = this;
            if (this.has("masterDependencies") && this.get("masterDependencies").length){
                var parents = this.collection.filter(function(comp){
                    return comp.get("ownerResourceId") === self.get("ownerResourceId") && _.contains(self.get("masterDependencies"), comp.getOwnerParameterName());
                });

                _.each(parents, function(parent){
                    if (!_.isUndefined(values[parent.id])){
                        self.paramsModel.unset(parent.id, {silent: true});
                    }
                    parent.prepareForAcquire(values);
                })
            }
        },

        acquireValue: function (values, opts) {
            var res;

            if (this.has("masterDependencies") && this.get("masterDependencies").length && deferredUpdateRequired(this, values)) {
                this._deferredExternalValue = values[this.id];
                res = this._isValueApplying = $.Deferred();
            } else {
                if (_.isUndefined(values[this.id])){
                    this.unset("value", opts);
                } else {
                    this.unset("value", {silent:true});
                    this.set("value", values[this.id], opts);
                }

                if (this._isValueApplying){
                    res = this._isValueApplying;

                    this._isValueApplying = undefined;
                    this._deferredExternalValue = undefined;

                    res.resolve();
                }

                res = new $.Deferred().resolve()
            }

            return res.promise();
        },

        acceptWiringVisitor: function(wiring){
            var self = this;
            wiring.register(this, convertICDataToWiringInfo(this, this.get("masterDependencies")));

            ParametersCache.getInputControlAsParameter(this.getOwnerUri(), this.getOwnerParameterName(), {full: this.get("fullCollectionRequired")})
                .done(function (control) {
                    self.set("value", extractValuesFromRawState(control.state), {silent: true});
                    self.notify();
                    self.componentInitializedDfd.resolve();
                })
                .fail(function(){
                    self.componentInitializedDfd.resolve();
                });
        },

        popParametersState: function(n){
            this.paramsModel.on("change", setDefer, this);
            ValueDashboardComponentModel.prototype.popParametersState.call(this, n);
            this.paramsModel.off("change", setDefer, this);
            this._defer = false;
        },

        resetParametersState: function(n){
            this.paramsModel.on("change", setDefer, this);
            ValueDashboardComponentModel.prototype.resetParametersState.call(this, n);
            this.paramsModel.off("change", setDefer, this);
            this._defer = false;
        },

        _deferValue: function(){
            return this._defer;
        }
    });

    function setDefer(){
        this._defer = true;
    }

    function deferredUpdateRequired(control, values){
        var parents = control.collection.filter(function(comp){
            return comp.get("ownerResourceId") === control.get("ownerResourceId") && _.contains(control.get("masterDependencies"), comp.getOwnerParameterName());
        });

        return _.reduce(parents, function(memo, parent){
            return memo || _.has(values, parent.getOwnerParameterName()) || deferredUpdateRequired(parent, values);
        }, false);
    }

    function extractValuesFromStateModel(state) {
        return state.isValue
            ? (_.isArray(state.get("value")) ? state.get("value") : [state.get("value")])
            :  state.options.reduce(function(memo, option){
                    option.get("selected") && memo.push(option.get("value"));
                    return memo;
                }, []);
    }

    function extractValuesFromRawState(state) {
        return !state.options ? _.isArray(state.value) ? state.value : [state.value] :
            _.reduce(state.options, function(memo, option){
                option.selected && memo.push(option.value);
                return memo;
            }, []);
    }
});