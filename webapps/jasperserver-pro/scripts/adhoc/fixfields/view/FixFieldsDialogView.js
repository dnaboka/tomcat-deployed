/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * author: Grant Bacon
 * @version: $Id: FixFieldsDialogView.js $
 */

/* global flowExecutionKey */

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        jQuery = require("jquery"),
        Dialog = require("common/component/dialog/Dialog"),
        ScalableList = require("components/scalableList/view/ScalableList"),
        i18n = require('bundle!adhoc_messages'),
        fixFieldsDialogTemplate = require("text!adhoc/fixfields/template/fixFieldsDialogTemplate.htm"),
        missingFieldItemsTemplate = require("text!adhoc/fixfields/template/missingFieldItemsTemplate.htm");

    var IS_EMBEDDED_DESIGNER_PARAM_NAME = "embeddedDesigner";

        return Dialog.extend({

            defaultTemplate: fixFieldsDialogTemplate,

            constructor: function (options) {
                options || (options = {});

                _.defaults(options, {
                    title: i18n["adhoc.inuse.dialog.title"],
                    modal: true,
                    resizable: true,
                    buttons: [
                        { label: i18n["adhoc.inuse.remove.items.button.label"], action: "apply", primary: true },
                        { label: i18n["ADH_010_BUTTON_CANCEL"], action: "cancel", primary: false }
                    ]
                });

                this.isEmbeddedDesigner = this._getParameterByName(IS_EMBEDDED_DESIGNER_PARAM_NAME);

                Dialog.call(this, options);

                var self = this;

                this.on('button:apply', _.bind(this._onOKClick, self));
                this.on('button:cancel', _.bind(this._onCancelClick, self));

                this.fieldList = new ScalableList({
                    getData: this._missingFieldDataProvider,
                    itemsTemplate: missingFieldItemsTemplate,
                    el: this.$el.find(".jr-mListbox-list")
                });
            },

            el: function() {
                return this.template({
                    title: this.title,
                    additionalCssClasses: this.additionalCssClasses,
                    fields: this.missingFields,
                    bodyInstructions: i18n["adhoc.inuse.body.instructions"]
                });
            },

            _missingFieldDataProvider: function(options) {
                /* There is an element in the JSP with ID 'missingFieldBuffer' which
                 * during preprocessing is populated with field names and a <br>
                 * element, the following code finds it, and splits it into an
                 * array of strings to be handled by the UI.
                 */
                var missingFieldElement = document.getElementById("missingFieldBuffer"),
                    missingFieldList = _.filter(
                            _.map(missingFieldElement.innerHTML.split("<br>"), function(item) {
                                    return {fieldName: _.trim(item)};
                                }),
                            function(field) {
                                return field.fieldName !== "";
                            });

                _.defaults(options, {
                    limit: missingFieldElement.length,
                    offset: 0
                });

                var deferred = new jQuery.Deferred(),
                    limit = Math.min(missingFieldList.length, options.limit),
                    resultData = [];

                if (options.offset < missingFieldList.length) {
                    resultData = missingFieldList.slice(options.offset, options.offset + limit);
                }

                deferred.resolve({
                    data: resultData,
                    total: missingFieldList.length
                });

                return deferred.promise();
            },

            _getParameterByName: function (name) {
                var urlParamPattern = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    paramValues = urlParamPattern.exec(location.search);
                return paramValues == null ? "" : decodeURIComponent(paramValues[1].replace(/\+/g, " "));
            },

            _onOKClick: function() {
            var toDecorate = this._getParameterByName("decorate");
                document.location = 'flow.html?_flowId=adhocFlow' +
                    '&_flowExecutionKey=' + flowExecutionKey +
                    '&embeddedDesigner=' + window.isEmbeddedDesigner +
                    '&decorate=' + toDecorate +
                    '&_eventId=' +'fixAndInit';
            },

            _onCancelClick: function() {
                this.close();
                if (window.isEmbeddedDesigner && document.referrer.indexOf("login.html") === -1) {
                    jQuery(document).trigger("adhocDesigner:cancel");
                } else {
                    this.close();
                    window.history.back();
                }
            }

        });

});
