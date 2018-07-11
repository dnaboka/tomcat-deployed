/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function(require) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        Dialog = require("components/dialog/Dialog"),
        VisualChooserView = require("./VisualChooserView"),

        i18n = require("bundle!AdHocBundle");

    return Backbone.View.extend({
        events: {
            "change" : "triggerChangeValue"
        },

        initialize: function() {

            this.visualChooserView = new VisualChooserView({
                title: i18n["visualization.chooser.title"]
            });

            this.dialog = new Dialog({
                el: this.visualChooserView.render().el,
                modal: false
            });
        },

        render: function() {
        },

        open: function(position) {
            this.dialog.open(_.extend({topPoint: 0.5, leftPoint: 0.5}, position));
        }
    });
});
