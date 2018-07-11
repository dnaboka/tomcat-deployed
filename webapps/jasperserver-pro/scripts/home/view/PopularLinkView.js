/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: ${Id}
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        template = require("text!home/template/popularLinkTemplate.htm");

    return Backbone.View.extend({

        template: template,

        render: function () {
            var data = this.model.toJSON();
            this.setElement(_.template(this.template, data));
            return this;
        }
    });
});