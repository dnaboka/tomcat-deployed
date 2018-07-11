/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: outputTabView.js 9604 2015-10-29 17:03:48Z tbidyuk $
 */

/* global outputRepository */

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        i18n = require('bundle!all'),
        config = require('jrs.configs'),
        dashboardSettings = require('dashboard/dashboardSettings'),
        referenceSizeTemplate = require("text!schedulerPro/template/editor/dashboardSizeTemplate.htm"),
        outputTabView = require('scheduler/view/editor/outputTabView');

    function disableReferenceSizeInputsForFixeSizeDashboard(value){
        if (this.model.fixedSize){
            this.$("[name=outputSizeWidth]").prop("disabled", true);
            this.$("[name=outputSizeHeight]").prop("disabled", true);
        }
        return value;
    }

    function toInteger(val){
        return +val;
    }

    return outputTabView.extend({

        binding: outputTabView.prototype.binding.concat([

            {attr: 'source/referenceWidth', control: 'outputSizeWidth',
                getter: toInteger,
                setter: disableReferenceSizeInputsForFixeSizeDashboard
            },
            {attr: 'source/referenceHeight', control: 'outputSizeHeight',
                getter: toInteger,
                setter: disableReferenceSizeInputsForFixeSizeDashboard
            }
        ]),

        initialize: function (options) {
            this.options = options || {};

            if (this.options.isDashboard) {
                this.availableFormats = config.availableDashboardJobOutputFormats || [];
            }

            return outputTabView.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            this._renderTemplate();

            if (this.options.isDashboard){
                this.$("#outputFormat").addClass("dashboard").after(_.template(referenceSizeTemplate, {i18n: i18n}));
            }

            this._initializeBinding();
        }
    });

});