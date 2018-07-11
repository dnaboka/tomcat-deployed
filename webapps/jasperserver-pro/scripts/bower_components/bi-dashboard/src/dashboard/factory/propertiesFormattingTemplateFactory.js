/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    /**
     * @constructor
     * @alias factory:propertiesFormattingTemplateFactory
     * @param {object} model - component model
     * @classdesc returns properties template factory. Allows to get properties template by model type.
     * @returns {string} template
     */

    var i18n = require('bundle!DashboardBundle'),
        scaleToFitControlTemplate = require("text!dashboard/template/properties/controls/scaleToFitControlTemplate.htm"),
        bordersControlTemplate = require("text!dashboard/template/properties/controls/bordersControlTemplate.htm"),
        textFormattingControlTemplate = require("text!dashboard/template/properties/controls/text/textFormattingControlTemplate.htm"),

        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var templateByType = {};

    templateByType[dashboardComponentTypes.FREE_TEXT] = [
        wrapWithTitle(i18n['dashboard.dialog.properties.title.formatting.text'], [
            scaleToFitControlTemplate,
            textFormattingControlTemplate
        ]),
        wrapWithTitle(i18n['dashboard.dialog.properties.title.formatting.dashlet'], [
            bordersControlTemplate
        ])
    ].join("\n");


    /**
     * @description wraps template into div
     * @access private
     * @memberof factory:propertiesTemplateFactory
     */
    function wrapTemplate(template){
        return '<div>' + template + '</div>';
    }

    /**
     * Returns wrapped with content with provided title
     * @param {Array} content
     * @param {String} title
     * @returns {string}
     */
    function wrapWithTitle(title, content) {
        return [
            '<div class="section">',
            '   <span class="title">' + title + '</span>',
            '   <div class="group">',
            '       ' + content.join("\n"),
            '   </div>',
            '</div>'
        ].join('');
    }

    return function(model) {
        var type;
        var template = (type = model.get("type")) in templateByType
                ? templateByType[type]
                : '';

        return wrapTemplate(template);
    };
});