/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author amalieie
 * @version: $Id: HyperlinkParametersCollection.js 3541 2015-11-03 09:24:44Z amalieie $
 */

////////////////////////////////////////////////////////////////
// Hyperlink Parameters Collection
////////////////////////////////////////////////////////////////

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        HyperlinkParameterModel = require('../model/HyperlinkParameterModel'),
        Backbone = require('backbone');

    var HyperlinkParametersCollection = Backbone.Collection.extend({
        model: HyperlinkParameterModel,
        validationMessages: {
            DUPLICATE_MODEL_ADD: "DUPLICATE_MODEL_ADD",
            DUPLICATE_MODEL_EDIT:  "DUPLICATE_MODEL_EDIT"
        },

        add: function(models, options) {
            if (this._validateSingleModelAddition(models, options)) {
                return Backbone.Collection.prototype.add.apply(this, arguments);
            }
        },

        _validateSingleModelAddition: function(models, options) {
            var isValid = true;

            if (!_.isArray(models)) {

                var existsInCollection = this.find(function(m) {
                        return m === models;
                    }),
                    duplicates = this.filter(function(m) {
                        return m.id === models.id;
                    });

                if (!existsInCollection && duplicates.length > 0 && (!options || !options.silent)) {
                    isValid = false;
                    this.trigger("validation:invalid", this, models,
                        {message: this.validationMessages.DUPLICATE_MODEL_ADD});
                } else if (existsInCollection && duplicates.length > 1 && (!options || !options.silent)) {
                    isValid = false;
                    this.trigger("validation:invalid", this, models,
                        {message: this.validationMessages.DUPLICATE_MODEL_EDIT});
                }

                if (isValid && (!options || !options.silent)) {
                    this.trigger("validation:valid", this, models);
                }
            }

            return isValid;
        }
    });

    return HyperlinkParametersCollection;

});