/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: valeriy.abornyev
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),

        overlayLayout = require("text!./template/overlayLayout.htm");

    require("css!jasper-ui/spinner.css");
    require("css!jasper-ui/overlay.css");

    return Backbone.View.extend({

        template: _.template(overlayLayout),

        initialize: function (options) {
            this.delay = options.delay;
            this.render();
        },

        render: function () {
            this.$el.append(this.template());

            this.$elSpinner = this.$(".jr-mSpinnerDatatable");
            this.$elOverlay = this.$(".jr-mOverlay");


            return this;
        },

        show: function(delay) {
            var self = this,
                show = function(){
                self.$elSpinner.show();
                self.$elOverlay.show();
            };

            if (this.delay || delay){
                if (!this._timer){
                    this._timer = setTimeout(show, this.delay || delay);
                }
            } else show();
        },

        hide: function() {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }

            this.$elSpinner.hide();
            this.$elOverlay.hide();
        },

        remove: function() {
            this.$elSpinner.remove();
            this.$elOverlay.remove();
            this.stopListening();
            return this;
        }
    });

});
