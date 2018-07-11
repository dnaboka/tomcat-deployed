/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var DashboardComponentModel = require("./DashboardComponentModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        i18n = require("bundle!DashboardBundle"),
        _ = require("underscore");

    return DashboardComponentModel.extend({
        componentName: i18n['dashboard.component.value.component.name'],

        defaults: _.extend({}, DashboardComponentModel.prototype.defaults, {
           type: dashboardComponentTypes.VALUE,
           value: undefined
        }),

        initialize: function(attrs, options) {
            DashboardComponentModel.prototype.initialize.apply(this, arguments);

            this._values = [];
            this._current = -1;

            this.on("change:value", function(){
                if (!this._ignoreValueChange){
                    this._changed = true;
                    this.notify();
                }
            }, this);

            this.initializeSpecific(attrs, options);
        },

        initializeSpecific: function(attrs, options){
            this.on("change:name", function(){
                this.set("label", this.get("name"), {silent:true});
            }, this);

            this.set("label", this.get("name"), {silent:true})
        },

        isVisible: function(){
            return false;
        },

        isValueProducer: function(){
            return true;
        },

        notify: function(){
            this.trigger(this.get("id"), this.get("value"));
        },

        acceptWiringVisitor: function(wiring){
            wiring.register(this, {
                signals: [ this.get("id") ],
                slots: {}
            });

            this.notify();
        },

        applyDeferredValue: function(){
            if (this.isValueDeferred()){
                this._current = this._deferredValue.index;
                this.set("value", this._deferredValue.value);
                this._deferredValue = undefined;
                this._ignoreValueChange = false;

                this.trigger("parametersState:deferredValueApplied", this);
            }

            if (this._isValueApplying){
                var val = {};
                val[this.id] = this._deferredExternalValue;
                this.acquireValue(val);
            }
        },

        prepareForAcquire: function(){},

        acquireValue: function(){},

        canPopValue: function(n){
            return  this._current + n >= -1 && this._current + n < this._values.length;
        },

        isValueDeferred: function(){
            return !_.isUndefined(this._deferredValue);
        },

        pushParametersState: function () {
            DashboardComponentModel.prototype.pushParametersState.call(this);

            if (this._current < this._values.length - 1){
                this._values = this._values.slice(0, this._current + 1);
            }

            this._values.push(this._changed ? _.cloneDeep(this.get("value")) : (this._values[this._values.length - 1] || this._default));
            this._current = this._values.length - 1;

            this._changed = false;
        },

        popParametersState: function (n) {
            DashboardComponentModel.prototype.popParametersState.call(this, n);

            if (this.canPopValue(n)) {
                if (this._current + n === -1) {
                    resetValue.call(this);
                } else {
                    this._ignoreValueChange = true;
                    if (this._deferValue()) {
                        this._deferredValue = {
                            value: this._values[this._current + n],
                            index: this._current + n
                        }
                    } else {
                        this._current += n;
                        this.set("value", this._values[this._current]);
                        this._ignoreValueChange = false;
                    }
                }
            }
        },

        resetParametersState: function (opt) {
            DashboardComponentModel.prototype.resetParametersState.call(this);
            resetValue.call(this, opt);
        },

        setCurrentParametersStateAsDefault: function (def) {
            DashboardComponentModel.prototype.setCurrentParametersStateAsDefault.call(this, def);
            this._default = _.cloneDeep(def || this.get("value"));
        },

        _deferValue: function(){
            return false;
        }
    });

    function resetValue(opt){
        this._ignoreValueChange = true;

        if (this._deferValue()) {
            this._deferredValue = {
                value: this._default,
                index: -1
            }
        } else {
            this._current = -1;

            this.set("value", this._default, opt);
            this._ignoreValueChange = false;
        }
    }
});