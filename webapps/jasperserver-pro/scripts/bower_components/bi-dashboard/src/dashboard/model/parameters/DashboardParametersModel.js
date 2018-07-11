/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone");

    return Backbone.Model.extend({

        initialize: function () {
            this._states = [];
            this._current = -1;
            this.on("change", function(){
                this._changed = true;
            }, this);
        },

        clear: function(apts){
            if (this._default){
                Backbone.Model.prototype.clear.call(this, {silent: true});
                this.set(this._default, apts);
            } else {
                Backbone.Model.prototype.clear.call(this, apts);
            }

            this._current = -1;
        },

        pushState: function(){
            if (this._current < this._states.length - 1){
                this._states = this._states.slice(0, this._current + 1);
            }
            this._states.push(this._changed ? _.cloneDeep(this.attributes) : (this._states[this._states.length - 1] || this._default));
            this._current = this._states.length - 1;

            this._changed = false;
        },

        popState: function (n) {
            if (this.canPopState(n)){
                this._current += n;

                if (this._current === -1) {
                    this.clear();
                } else {
                    this.set(this._states[this._current]);
                }
            }
        },

        setDefault: function(def){
            if (_.keys(def || this.attributes).length){
                this._default = _.cloneDeep(def || this.attributes);
            }
        },

        canPopState: function(n){
            return  this._current + n >= -1 && this._current + n < this._states.length;
        }
    });
});
