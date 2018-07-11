/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        i18n = require('bundle!adhoc_messages'),
        browserDetection = require("common/util/browserDetection"),
        DialogWithModelInputValidation = require("common/component/dialog/DialogWithModelInputValidation"),

        topBottomFilterDialogTemplate = require('text!adhoc/template/topBottomFilterDialogTemplate.htm');

    return DialogWithModelInputValidation.extend({

        constructor: function (options) {
            options || (options = {});
            this.options = options;

            var model = this.extendModel(this.options.model);

            DialogWithModelInputValidation.prototype.constructor.call(this, {
                modal: true,
                model: model,
                resizable: false,
                //additionalCssClasses: "topBottomNFilterDialog",
                title: i18n[model.get("type") === "top" ? "ADH_1236_DIALOG_TITLE_TOP" : "ADH_1236_DIALOG_TITLE_BOTTOM"],

                content: _.template(topBottomFilterDialogTemplate, {
                    i18n: i18n,
                    model: _.extend({}, model.attributes)
                }),
                buttons: [
                    {label: i18n["ADH_1236_DIALOG_OK"], action: "ok", primary: true},
                    {label: i18n["ADH_1236_DIALOG_CANCEL"], action: "cancel", primary: false}
                ]
            });

            this.on('button:ok', _.bind(this._onOk, this));
            this.on('button:cancel', _.bind(this._onCancel, this));
        },

        extendModel: function (model) {
            model.validation = _.extend({}, {
                limit: [
                    {
                        required: true,
                        msg: i18n["ADH_1236_DIALOG_ERROR_AMOUNT_REQUIRED"]
                    },
                    {
                        range: [1, 999],
                        msg: i18n["ADH_1236_DIALOG_ERROR_AMOUNT_RANGE"]
                    }
                ]
            });

            return model;
        },

        open: function () {
            this.bindValidation();
            DialogWithModelInputValidation.prototype.open.apply(this, arguments);
        },

        close: function () {
            this.unbindValidation();
            this.clearValidationErrors();
            DialogWithModelInputValidation.prototype.close.apply(this, arguments);
        },

        _onCancel: function () {
            this.close();
            this.remove();
        },

        _onOk: function () {
            if (!this.model.isValid(true)) {
                return;
            }

            this.close();
            this.remove();

            this.options.ok && this.options.ok(this.model.toJSON());
        }
    });

});
