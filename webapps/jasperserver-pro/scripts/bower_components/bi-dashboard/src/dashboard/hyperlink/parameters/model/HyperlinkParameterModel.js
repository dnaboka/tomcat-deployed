/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author amalieie
 * @version: $Id: HyperlinkParameterModel.js 3513 2015-10-18 20:42:23Z amalieie $
 */

////////////////////////////////////////////////////////////////
// Hyperlink Parameter Model
////////////////////////////////////////////////////////////////

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        $ = require('jquery'),
        i18n = require("bundle!DashboardBundle"),
        Backbone = require('backbone'),
        BackboneValidation = require('backbone.validation');

    var HyperlinkParameterModel = Backbone.Model.extend({
        idAttribute: "name",
        defaults: {
            name: "",
            value: ""
        },
        validation: {
            name: function (value) {
                if (!$.trim(value)) {
                    return i18n['dashboard.component.dialog.properties.hyperlinks.required.field'];
                }
            },
            value: function (value) {
                if (!$.trim(value)) {
                    return i18n['dashboard.component.dialog.properties.hyperlinks.required.field'];
                }
            }
        }
    });

    _.extend(HyperlinkParameterModel.prototype, BackboneValidation.mixin);

    return HyperlinkParameterModel;

});