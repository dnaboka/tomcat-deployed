/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Grant Bacon
 * @version: $Id:
 */

define(function(require, exports, module) {
    var _ = require("underscore"),
        $ = require("jquery"),
        floatingDashletDialogTemplate = require("text!../../template/floatingDashletDialogTemplate.htm"),
        i18n = require("bundle!CommonBundle"),
        Dialog = require("common/component/dialog/Dialog");

    return Dialog.extend({
        defaultTemplate: floatingDashletDialogTemplate,

        events: {
            "click .closeIcon": "_onCloseIcon"
        },

        constructor: function(options) {
            _.bindAll(this, "_onCloseIcon", "_raiseDropDowns");

            _.defaults(options, {
                contentContainer: ".content > .dashletContainer",
                title: i18n["dialog.overlay.title"],
                modal: false
            });

            if (options.foundation) {
                this.foundation = options.foundation;
            }

            Dialog.call(this, options);

            var self =  this;

            // Dropdowns of single selects should have hidhest z-index in order to be visible.
            this.on("dialog:visible", this._raiseDropDowns);

            this.on("close", function(){
                $(".sSelect-dropDown").css("zIndex", null);
            });
        },

        _raiseDropDowns: function() {
            var dropDowns = $(".sSelect-dropDown"),
                dialogZIndex = this.$el.css("zIndex");

            if (dialogZIndex == "auto") {
                dialogZIndex = 1005;
            }

            dropDowns.css("zIndex", 2 + parseInt(dialogZIndex));
        },

        remove: function(){
            this.off("dialog:visible");
            this.off("close");

            Dialog.prototype.remove.apply(this, arguments);
        },

        updateTitle: function(title) {
            var titleElement = this.$el.find(".content > .header > .title");

            titleElement.length && titleElement.text(title);
        },

        _onCloseIcon: function() {
            this.foundation.trigger("close:filterDialog");
        }
    });

});
