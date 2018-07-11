/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author bkolesnikov
 * @version: $Id$
 */

////////////////////////////////////////////////////////////////
// Formatting Dialog Model
////////////////////////////////////////////////////////////////

define("adhoc/intelligentChart/formattingDialog/model/FormattingDialogModel", function (require) {

    "use strict";

    var _ = require('underscore'),
        Backbone = require('backbone'),
        BackboneValidation = require("backbone.validation");

    var FormattingDialogModel = Backbone.Model.extend({

        validation: {
            xAxisStep: {
                xRegExpPattern: /^[0-9]+$/,
                min: 1,
                msg: 'Please enter correct values'
            },
            yAxisStep: {
                xRegExpPattern: /^[0-9]+$/,
                min: 1,
                msg: 'Please enter correct values'
            },
            xAxisRotation: {
                xRegExpPattern: /^[-0-9]+$/,
                range: [-90, 90],
                msg: 'Please enter correct values'
            },
            yAxisRotation: {
                xRegExpPattern: /^[-0-9]+$/,
                range: [-90, 90],
                msg: 'Please enter correct values'
            },
            legend: {
                oneOf: ['bottom', 'left', 'right', 'top', 'none'],
                msg: 'Please enter correct values'
            }
            /*labelOffset: {
             pattern: 'number',
             min: 0,
             msg: 'Please enter correct values'
             },
            thousandSeparator: {
                oneOf: [',', '.', 'None'],
                msg: 'Please enter correct values'
            },
            decimalPoint: {
                oneOf: [',', '.', 'None'],
                msg: 'Please enter correct values'
            },
            rotation: {
                pattern: 'number',
                range: [-90, 90],
                msg: 'Please enter correct values'
            },
            alignment: {
                oneOf: ['bottom', 'left', 'right', 'top'],
                msg: 'Please enter correct values'
            },
            donnutInnerSize: {
                pattern: 'number',
                range: [0, 100],
                msg: 'Please enter correct values'
            },
            gaugesMinValue: {
                pattern: 'number',
                msg: 'Please enter correct values'
            },
            gaugesMaxValue: {
                pattern: 'number',
                msg: 'Please enter correct values'
            },
            color1Stop: {
                pattern: 'number',
                range: [0, 1],
                msg: 'Please enter correct values'
            },
            color2Stop: {
                pattern: 'number',
                range: [0, 1],
                msg: 'Please enter correct values'
            },
            color3Stop: {
                pattern: 'number',
                range: [0, 1],
                msg: 'Please enter correct values'
            }*/
        },
        formattingOptions: [
            "xAxisStep",
            "yAxisStep",
            "xAxisRotation",
            "yAxisRotation",

            "legend",
            "legendBorder",
            "showDataPoints",
            "showScatterLine",
            "showSingleMeasuresLabels",
            "showMeasureOnValueAxis",
            "autoScaleFonts"

            //"showXAxisLabels",
            //"showYAxisLabels",
            //"labelOffset",
            //"rotateAllLevels",
            //"thousandSeparator",
            //"decimalPoint",
            //"invertedAxis",
            //"showLabels",
            //"rotation",
            //"alignment",
            //"donnutInnerSize",
            //"gaugesMinValue",
            //"gaugesMaxValue",
            //"color1Stop",
            //"color2Stop",
            //"color3Stop",
        ],
        parse: function(options) {
            var res = {};
            _.each(this.formattingOptions, function(name) {
                res[name] = options[name];
            });
            return res;
        },

        initialize: function (attributes, options) {
            this._savedAttributes = attributes;
            this.callUpdateState = options.updateState;

            this.on("invalid", function (model, error) {
                //console.log(error);
            });

            this.on("change", function (model, error) {
                this.modelChanged = true;
            });
        },

        applyModel: function() {
            if(this.modelChanged){
                this.callUpdateState(this.attributes);
                this._savedAttributes = this.attributes;
                this.modelChanged = false;
            }
        }

    });

    // Add validation to model (https://github.com/thedersen/backbone.validation#validation-mix-in)
    _.extend(FormattingDialogModel.prototype, BackboneValidation.mixin);

    return FormattingDialogModel;

});