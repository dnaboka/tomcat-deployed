/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author amalieie
 * @version: $Id$
 */

////////////////////////////////////////////////////////////////
// Advanced Property Model
////////////////////////////////////////////////////////////////

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        $ = require('jquery'),
        i18n = require("bundle!adhoc_messages"),
        Backbone = require('backbone'),
        BackboneValidation = require('backbone.validation');

    var AdvancedPropertyModel = Backbone.Model.extend({
        idAttribute: "name",
        defaults: {
            name: "",
            value: null
        },
        validation: {
            name: function (value) {
                if (!$.trim(value)) {
                    return i18n['ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_REQUIRED_FIELD'];
                }
            },
            value: function (value) {
                if (!$.trim(value)) {
                    return i18n['ADH_1214_ICHARTS_CHART_FORMAT_DIALOG_REQUIRED_FIELD'];
                }
            }
        }
    });

    _.extend(AdvancedPropertyModel.prototype, BackboneValidation.mixin);

    return AdvancedPropertyModel;

});