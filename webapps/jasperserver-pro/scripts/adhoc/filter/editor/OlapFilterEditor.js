/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var FilterEditor = require("adhoc/filter/editor/FilterEditor"),
        _ = require("underscore"),
        olapFilterEditorTemplate = require("text!adhoc/filter/editor/template/olapFilterEditorTemplate.htm");

    return FilterEditor.extend({
        template: _.template(olapFilterEditorTemplate),

        isOlap: true,

        initialize: function() {
            FilterEditor.prototype.initialize.apply(this, arguments);

            // letters are not used in OLAP, so redrawing makes no sense
            this.stopListening(this.model, "change:filterLetter", this.redrawFilterTitle);
        }
    });
});
