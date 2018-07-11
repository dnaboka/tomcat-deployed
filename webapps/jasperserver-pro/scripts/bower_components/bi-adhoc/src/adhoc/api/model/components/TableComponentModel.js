/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Pavel Savushchik
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        BaseComponentModel = require("./BaseComponentModel");

    return BaseComponentModel.extend({

        defaults: {
            fixedGrandTotal: false,
            fixedGroupTotal: false,
            fixedHeader: false,
            showDetails: true,
            showTotals: false
        },

        initialize: function(attributes, options) {
            _.bindAll(this, "ensureArtificialColumn");

            this.on("change:showDetails", this.ensureArtificialColumn);
            this.on("change:showTotals", this.ensureArtificialColumn);
        },

        getColumns: function(){
            return this.components.filter(function(component){
                return component.componentType === "column";
            });
        },

        getGroups: function(){
            return this.components.filter(function(component){
                return component.componentType === "group";
            });
        },

        ensureArtificialColumn: function () {
            if (this.components) {
                if (!this._artificialColumn){
                    this._artificialColumn = this.adHocModel.componentsFactory.create({
                        componentType: "column"
                    });
                }

                if (this.get("showDetails") && this.get("showTotals")){
                    if (this.components.models[0].get("reference") !== this._artificialColumn.get("reference")) {
                        this.components.unshift(this._artificialColumn);
                    }
                } else {
                    if (this.components.models[0].get("reference") === this._artificialColumn.get("reference")) {
                        this.components.shift();
                    }
                }
            }
        }
    });
});