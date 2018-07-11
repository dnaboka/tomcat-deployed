/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko, Zakhar Tomchenko
 * @version: $Id$
 */

/* global jasper */

;(function(root, jasper) {
    var version = "0.0.1a",
        visualizeData = {
            bis: {},
            auths: [],
            facts: {},
            config: {}
        };

    //we shouldn't expect on underscore here

    function extend(obj){
        var each =  Array.prototype.forEach,
            slice = Array.prototype.slice;
        each.call(slice.call(arguments, 1), function(source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    }

    function isEqual(obj1, obj2){
        var equal = false;
        if(obj1 !== obj2){
            if (Object.keys(obj1).length === Object.keys(obj2).length){
                for(var key in obj1){
                    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)){
                        equal = obj1[key] === obj2[key];
                        if (!equal) {
                            break;
                        }
                    }
                }
            }
        }
        return equal;
    }

    visualizeData.auths.find = function(server, auth) {

        var result = false,
            auths = visualizeData.auths;

        for (var i =0; i < auths.length; i++){
            var currentAuthWithUrl = extend({url: server}, auth);

            if (isEqual(auths[i], currentAuthWithUrl)){
                result = true;
                break;
            }
        }

        return result;
    };

    var visualize = function (param, param2, param3, param4) {
        var properties, bi, callback, errback, always,
            dependencies = ["BiComponentFactory", "auth/Authentication", "jquery", "css", "config/dateAndTimeSettings"];

        if (typeof param == 'function') {
            properties = visualizeData.config;
            callback = param;
            errback = param2;
            always = param3;
        } else {
            properties = extend({}, visualizeData.config, param);
            callback = param2;
            errback = param3;
            always = param4;
        }

        bi = visualizeData.bis[properties.server];
        if (!bi) {
            bi = jasper({
                url : properties.server,
                scripts: properties.scripts,
                logEnabled: properties.logEnabled,
                logLevel: properties.logLevel
            });
            visualizeData.bis[properties.server] = bi;
        }

        var cssDependencies = [
            "jasper-ui/jasper-ui",
            "jquery-ui/jquery-ui",
            //dashboard dependencies
            "dashboard/canvas",
            "panel",
            "webPageView",
            "pagination",
            "menu",
            "simpleColorPicker",
            "notifications"
        ];

        bi(dependencies, function(BiComponentFactory, Authentication, $, cssPlugin) {

            var auth = visualizeData.auths.find(properties.server, properties.auth),
                factory = visualizeData.facts[properties.server];

            if (!properties.auth) {
                properties.auth = {
                    loginFn: function() {
                        return $.Deferred().resolve();
                    }
                };
            }

            if (!auth) {
                auth = new Authentication($.extend({url: properties.server}, properties.auth));
                visualizeData.auths.push(auth);
            }

            if (!factory) {
                factory = new BiComponentFactory({
                    server: properties.server,
                    _showInputControls: properties._showInputControls
                });
                visualizeData.facts[properties.server] = factory;
            }

            auth._result || (auth._result = auth.run());

            auth._result
                .fail(errback)
                .always(function(result) {
                    if (auth._result.state() === "resolved") {

                        // load css only after succeed authentication
                        if (properties.theme){
                            cssDependencies.forEach(function(cssId) {
                                //run css loading manually
                                cssPlugin.manualLoad(cssId, properties.theme);
                            });
                        }

                        var v = createV(factory, auth);
                        callback && callback(v);
                        always && always(null, v);

                    } else {
                        always && always(result);
                    }
                });

        });
    };

    visualize.version = version;
    visualize.config = function(config) {
        extend(visualizeData.config, config);
    };

    function createV(factory, auth){
        var v = function (param) {
            if (typeof param == 'string' || Object.prototype.toString.call(param) === "[object String]") {
                // v("#container").report({...});
                return {
                    report: (function(selector) {
                        return function(options) {
                            factory.report(extend({container: selector}, options));
                        }
                    })(param),
                    dashboard: (function(selector) {
                        return function(options) {
                            factory.dashboard(extend({container: selector}, options));
                        }
                    })(param),
                    adhocView: (function(selector) {
                        return function(options) {
                            factory.adhocView(extend({container: selector}, options));
                        }
                    })(param)
                }
            }
        };
        v.logout = auth.logout;
        v.login = auth.login;
        extend(v, factory);
        return v;
    }

    // noConflict functionality
    var _visualize = root.visualize;

    visualize.noConflict = function () {
        if (root.visualize === visualize) {
            root.visualize = _visualize;
        }

        return visualize;
    };

    // Add visualize to global scope
    root.visualize = visualize;

})(this, jasper);






