/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
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
 * @author: Igor Nesterenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    require("jquery.ui.mouse.touch");

    var Backbone =  require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        log =  require("logger").register("Report");

    require("csslink!bi/report/jive/jr/theme/jive.css");

    function JiveComponentCollectionView(options) {
        options || (options = {});
        this.stateModel = options.stateModel;
        this.collection = options.collection;
        this.chartTypeDialogStates = options.chartTypeDialogStates;

        this.listenTo(this.collection, "reset", this.initSubviews, this);
    }

    JiveComponentCollectionView.prototype = {
        initSubviews: function() {
            var self = this,
                viewModules = [],
                viewModels = [];

            _.invoke(this.subviews || [], "remove");
            this.subviews =  [];

            if (this.subviewsReadyDfd){
                var old = this.subviewsReadyDfd;

                this.subviewsReadyDfd = new $.Deferred()
                    .done(function () {
                        old.resolve();
                    }).fail(function () {
                        old.reject();
                    });
            } else {
                this.subviewsReadyDfd = new $.Deferred();
            }

            this.collection.forEach(function(component) {
                // these modules could be paths in the components JSON or requirejs module mappings inside require.config.js
                component.get("type") === "chart" && viewModules.push("bi/chart/jr/jive/highcharts/view/ChartJiveComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "fusionMap" && viewModules.push("./FusionComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "fusionChart" && viewModules.push("./FusionComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "fusionWidget" && viewModules.push("./FusionComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "googlemap" && viewModules.push("./GooglemapComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "tibco-maps" && viewModules.push("./TibcomapComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "CVComponent" && viewModules.push("./CustomJiveComponentView") && viewModels.push(component.get("id"));

                component.get("type") === "table" && viewModules.push("./TableJiveComponentView") && viewModels.push(component.get("id"));
                component.get("type") === "crosstab" && viewModules.push("./CrosstabJiveComponentView") && viewModels.push(component.get("id"));
            });

            require(viewModules, function() {
                var args = _.toArray(arguments);

                _.each(args, function(ViewModule, index) {
                    self.subviews.push(new ViewModule({
                        model: self.collection.get(viewModels[index]),
                        report: self.collection.report,
                        stateModel: self.stateModel,
                        chartTypeDialogStates: self.chartTypeDialogStates
                    }));
                });

                log.debug("Create JIVE views ", self.subviews);
                self.subviewsReadyDfd.resolve();

            }, this.subviewsReadyDfd.reject);
        },

        render: function($el) {
            var self = this,
                dfd = new $.Deferred();

            self.subviewsReadyDfd.then(function () {
                var subViewsRenderDeferreds = _.invoke(self.subviews, "render", $el);
                $.when.apply($, subViewsRenderDeferreds).then(dfd.resolve, dfd.reject);
            }, dfd.reject);

            return dfd;
        },

        sizableSubviews: function(){
            return _.filter(this.subviews, function(jiveComponent){
                return jiveComponent.setSize;
            });
        },

        scalableSubviews: function(){
            return _.filter(this.subviews, function(jiveComponent){
                return jiveComponent.scale;
            });
        },

        getSizableSubviews: function(){
            var self = this,
                dfd = new $.Deferred();

            this.subviewsReadyDfd.then(function() {
                dfd.resolve(_.filter(self.subviews, function(jiveComponent){
                    return jiveComponent.setSize;
                }));
            });

            return dfd;
        },

        getScalableSubviews: function() {
            var self = this,
                dfd = new $.Deferred();

            this.subviewsReadyDfd.then(function() {
                dfd.resolve(_.filter(self.subviews, function(jiveComponent){
                    return jiveComponent.scale;
                }));
            });

            return dfd;
        },

        remove: function() {
            _.invoke(this.subviews || [], "remove");

            this.stopListening(this.collection, "reset", this.initSubviews, this);
        }
    };

    _.extend(JiveComponentCollectionView.prototype, Backbone.Events);

    return JiveComponentCollectionView;

});

