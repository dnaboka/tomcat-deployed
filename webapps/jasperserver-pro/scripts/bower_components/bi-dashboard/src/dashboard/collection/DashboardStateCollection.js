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
 * Dashboard state collection
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        DashboardStateModel = require("../model/DashboardStateModel");

    return Backbone.Collection.extend({
        initialize: function(models, options) {
            this.dashboardModel = options.model;
        },

        init: function() {
            this.currentState = undefined;
            this.reset([]);
            this.saveState();
        },

        saveState: function() {
            var currentStateIndex = this.indexOf(this.currentState);

            if (currentStateIndex + 1 < this.length) {
                var statesToRemove = this.slice(currentStateIndex + 1);
                this.remove(statesToRemove);
            }

            this.currentState = this.add(new DashboardStateModel({ state: this.dashboardModel.toJSON(true) }, { dashboardModel: this.dashboardModel }));

            this.trigger("change:currentState", this.currentState, this);
        },

        setPreviousState: function() {
            if (this.currentState) {
                var currentStateIndex = this.indexOf(this.currentState);

                if (currentStateIndex > 0) {
                    this.currentState = this.at(currentStateIndex-1);
                    this.currentState.applyState();
                    this.trigger("change:currentState", this.currentState, this);
                }
            }
        },

        setFirstState: function() {
            if (this.length > 0 && this.currentState !== this.first()) {
                this.currentState = this.first();
                this.currentState.applyState();
                this.trigger("change:currentState", this.currentState, this);
            }
        },

        setNextState: function() {
            if (this.currentState) {
                var currentStateIndex = this.indexOf(this.currentState);

                if (currentStateIndex + 1 < this.length) {
                    this.currentState = this.at(currentStateIndex+1);
                    this.currentState.applyState();
                    this.trigger("change:currentState", this.currentState, this);
                }
            }
        },

        setLastState: function() {
            if (this.length > 0 && this.currentState !== this.last()) {
                this.currentState = this.last();
                this.currentState.applyState();
                this.trigger("change:currentState", this.currentState, this);
            }
        },

        hasPreviousState: function() {
            return this.currentState !== this.first();
        },

        hasNextState: function() {
            return this.currentState !== this.last();
        }
    });
});
