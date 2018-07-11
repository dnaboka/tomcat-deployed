/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    var Dialog = require("common/component/dialog/Dialog"),
        _ = require("underscore"),
        i18n = require("bundle!CommonBundle"),
        template = require("text!dashboard/template/overlayDialogTemplate.htm"),
        dashboardSettings = require("dashboard/dashboardSettings");

    return Dialog.extend({
        defaultTemplate: template,

        constructor: function(options) {
            _.defaults(options, {
                contentContainer: ".body > .message",
                title: i18n["dialog.overlay.title"],
                modal : true
            });

            Dialog.call(this, options);
        },

        open: function() {
            var self = this,
                args = arguments;

            this.dimmer.css({opacity: 0}).show();

            this._timeout = setTimeout(function() {
                self.dimmer.css({opacity: 0.6});
                Dialog.prototype.open.apply(self, args);
            }, dashboardSettings.DASHBOARD_OVERLAY_TIMEOUT);
        },

        close: function() {
            clearTimeout(this._timeout);
            Dialog.prototype.close.call(this);
            this.dimmer.css({opacity: 0.6}).hide();
        }
    });
});