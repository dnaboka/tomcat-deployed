/*
 * Copyright (C) 2005 - 2015 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Report = require("bi/report/Report"),
        Dashboard = require("bi/dashboard/Dashboard"),
        ResourcesSearch = require("bi/repository/ResourcesSearch"),
        InputControls = require("bi/control/InputControls"),
        AdHocView = require("bi/adhoc/AdHocView"),
        biComponentUtil = require("common/bi/component/util/biComponentUtil"),
        dashboardSettings = require("dashboard/dashboardSettings");

    function BiComponentsFactory(properties){
        var instanceData = biComponentUtil.cloneDeep(properties);

        this.report = createBiComponentFunction(instanceData, Report);
        this.dashboard = createBiComponentFunction(instanceData, Dashboard);
        this.adhocView  = createBiComponentFunction(instanceData, AdHocView);
        this.inputControls  = createBiComponentFunction(instanceData, InputControls);
        this.resourcesSearch  = createBiComponentFunction(instanceData, ResourcesSearch);

        _.extend(this.report, Report);
        _.extend(this.dashboard, Dashboard);
        _.extend(this.adhocView, AdHocView);
        _.extend(this.inputControls, InputControls);
        _.extend(this.resourcesSearch, ResourcesSearch);
    }

    function createBiComponentFunction(instanceData, constructor) {
        return function(settings){
            var originalComponentInstance = new constructor(),
                properties = _.extend({runImmediately: true}, instanceData, settings),
                events = properties.events;

            delete properties.events;

            originalComponentInstance.properties(biComponentUtil.bindContextToArgument(originalComponentInstance, clean(properties)));

            if(events){
                originalComponentInstance.events(biComponentUtil.bindContextToArgument(originalComponentInstance, events));
            }

            // proxy original component instance here
            var res = _.reduce(originalComponentInstance, function(memo, element, key){
                var value = element;

                if(_.isFunction(value)){
                    // it's a function. Let's proxy it
                    value = function() {
                        // prepare arguments. If there is some functions, then bind originalComponentInstance as context to them
                        var argumentsArray = biComponentUtil.bindContextToArgument(originalComponentInstance, Array.prototype.slice.call(arguments, 0));

                        // apply the original function with prepared arguments
                        var result = element.apply(this, argumentsArray);

                        // bind context to function execution result (mainly for case if result is a Deferred)
                        return biComponentUtil.bindContextToArgument(originalComponentInstance, result);
                    };
                }
                memo[key] = value;

                return memo;
            }, {});

            dashboardSettings.VISUALIZE_MODE = properties._showInputControls ? false : true;

            properties.runImmediately && res.run(properties.success, properties.error, properties.always);

            return res;
        }
    }

    function clean(properties){
        var props = _.clone(properties);

        delete props.success;
        delete props.error;
        delete props.always;
        delete props.runImmediately;
        delete props._showInputControls;

        return props;
    }

    return BiComponentsFactory;
});

