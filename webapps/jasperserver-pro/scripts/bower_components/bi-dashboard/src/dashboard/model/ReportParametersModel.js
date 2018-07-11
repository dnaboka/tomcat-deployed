/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        dashboardSettings = require("../dashboardSettings"),
        $ = require("jquery"),
        _ = require("underscore");

    function mergeControls(initial, loaded){
        var res;
        if (initial){
            res = initial;
            res.push.apply(res, _.filter(loaded, function(loaded){
                return !_.findWhere(initial, {id: loaded.id});
            }));
        } else {
            res = loaded;
        }

        return res;
    }

    return Backbone.Model.extend({

        idAttribute: "reportUri",

        defaults: {
            all: false
        },

        initialize: function(options, parameters){
            var self = this;
            this.stateDfds = {};

            if (parameters) {
                // pre-create deferreds to avoid additional calls in any case
                parameters.knownIds && _.each(parameters.knownIds, function (id) {
                    self.stateDfds[id] = new $.Deferred();
                });

                if (parameters.full){
                    this.allControlsDfd = new $.Deferred();
                    this.fetch({
                        full: true,
                        data: parameters.data && _.without(_.values(parameters.data), undefined).length ? parameters.data : undefined
                    }).fail(_.bind(this.allControlsDfd.reject, this.allControlsDfd));
                } else {
                    if (parameters.knownIds && parameters.knownIds.length){
                        this.fetch({
                            preload: parameters.knownIds,
                            data: parameters.data && _.without(_.values(parameters.data), undefined).length ? parameters.data : undefined
                        }).fail(function(){
                            var args = arguments;
                            _.each(parameters.knownIds, function (id) {
                                self.stateDfds[id].reject.apply(self.stateDfds[id], args);
                            });
                        });
                    }
                }

            }

            this.on("change:all", function(){
                self.allControlsDfd.resolve(self.get("inputControl"));
            });

            this.on("change:parameters", function(){
                self.allParametersDfd.resolve(self.get("parameters"), self.get("outputParameters"));
            });
        },

        url: function(){
            return dashboardSettings.CONTEXT_PATH + "/rest_v2/reports" + encodeURI(this.get("reportUri")) + "/inputControls";
        },

        parse: function (data) {
            var self = this;
            if (data){
                if (data.inputControl) {
                    var all = true;
                    _.each(data.inputControl, function (control) {
                        if (control.uri.substr(0, 5) === "repo:") {
                            control.uri = control.uri.substr(5);
                        }

                        if (control.state) {
                            self.stateDfds[control.id] || (self.stateDfds[control.id] = new $.Deferred());
                            self.stateDfds[control.id].resolve(control);
                            all = false;
                        }
                    });

                    data = {
                        inputControl: mergeControls(this.get("inputControl"), data.inputControl),
                        parameters: this.get("parameters"),
                        outputParameters: this.get("outputParameters"),
                        all: all || this.get("full") || this.get("all")
                    };
                } else {
                    data = {
                        inputControl: this.get("inputControl"),
                        parameters: data.parameters,
                        outputParameters: data.outputParameters,
                        all: this.get("all")
                    };
                }
            } else {
                data = {
                    inputControl: [],
                    parameters:  this.get("parameters"),
                    outputParameters: this.get("outputParameters"),
                    all: true
                };
            }
            return data;
        },

        sync: function(method, model, options){
            if (method == 'read'){
                if (options.full) {
                    model.set("full", true, {silent: true});
                } else if (options.preload) {
                    options.url = this.url() + "/" + options.preload.join(";");
                }

                if (options.data){
                    if (_.isObject(options.data)){
                        options.data = JSON.stringify(options.data);
                    }

                    options.type = "POST";
                    options.processData = false;
                    options.headers = {"Content-Type": "application/json"};
                }
            }

            return Backbone.Model.prototype.sync.call(this, method, model, options);
        },

        getReportControls: function(options){
            if (!this.allControlsDfd || (options && options.force)){
                this.allControlsDfd = new $.Deferred();
                this.stateDfds = {};
                this.unset("inputControl", {silent:true});
                this.set("all", false, {silent:true});
                this.fetch({
                    url: this.url() + "?exclude=state"
                }).fail(_.bind(this.allControlsDfd.reject, this.allControlsDfd));
            }
            return this.allControlsDfd.promise();
        },

        getReportParameters: function(options){
            if (!this.allParametersDfd || (options && options.force)){
                this.allParametersDfd = new $.Deferred();
                this.unset("parameters", {silent:true});
                this.unset("outputParameters", {silent:true});
                this.fetch({
                    url: dashboardSettings.CONTEXT_PATH + "/rest_v2/discovery" + encodeURI(this.get("reportUri"))
                }).fail(_.bind(this.allParametersDfd.reject, this.allParametersDfd));
            }
            return this.allParametersDfd.promise();
        },

        getInputControlAsParameter: function (controlName, options) {
            var res = this.stateDfds[controlName];

            if (!res || (options && options.force)){
                res = this.stateDfds[controlName] = new $.Deferred();
                this.fetch({preload: [controlName], data: options && options.params, full: options && options.full})
                    .fail(_.bind(this.stateDfds[controlName].reject, this.stateDfds[controlName]));
            }

            return res.promise();
        }

    });

});
