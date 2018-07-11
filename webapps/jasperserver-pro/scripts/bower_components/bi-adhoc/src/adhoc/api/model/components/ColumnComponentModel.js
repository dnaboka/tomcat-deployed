/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Pavel Savushchik
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        BaseComponentModel = require("./BaseComponentModel"),

        ARTIFICIAL = "_artificial",
        SPACER_REG = /^_spacer/;

    return BaseComponentModel.extend({
         defaults: {
             "reference": ARTIFICIAL,
             "detailFieldReference": ARTIFICIAL,
             "aggregatedFieldReferences": [
                 "_artificial"
             ],
             "width": 125,
             "horizontalAlign": "Left",
             "showSummary": false
         },

        initialize: function (attributes, options) {
            if (this.get("label") === null){
                this.set({label: this.get("detailFieldReference")}, {silent: true});
            }

            if (!this.has("label") && (this.get("reference") === ARTIFICIAL || SPACER_REG.test(this.get("reference")))){
                this.set({label: ""}, {silent: true});
            }
        },

        hasSummary: function(){
            return this.attributes.showSummary;
        }
    });
});