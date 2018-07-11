/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        domUtil = require("common/util/domUtil"),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        i18n = require("bundle!DashboardBundle");

    return Backbone.View.extend({
        template: _.template(""),

        el: function() {
            return this.template({ i18n: i18n });
        },

        initialize: function(options) {
            this.ready = new $.Deferred();

            this.dashboardProperties = options.dashboardProperties;
            this.dashboardId = options.dashboardId;

            this.listenTo(this.model, "change", this._onPropertiesChange);
            this.listenTo(this.model, "change:interactive", function() {
                this.model.get("interactive") ? this.removeOverlay() : this.addOverlay();
            });

            _.bindAll(this, "_onWindowResize");

            $(window).on("resize", this._onWindowResize);

            this._onViewInitialize && this._onViewInitialize();

            this._initComponent && this._initComponent();
        },

        render: function() {
            this._onViewRender && this._onViewRender();

            this._renderComponent && this._renderComponent();

            return this;
        },

        resize: function() {
            this._onViewResize && this._onViewResize();

            this._resizeComponent && this._resizeComponent();
        },

        remove: function(options) {
            this.removeOverlay();

            this._errorDialog && this._errorDialog.remove();

            $(window).off("resize", this._onWindowResize);

            this._removeComponent && this._removeComponent(options);

            this._onViewRemove && this._onViewRemove();

            Backbone.View.prototype.remove.apply(this, arguments);
        },

        addOverlay: function() {},

        removeOverlay: function() {
            this.$overlay && this.$overlay.remove();
            this.$overlay = null;
        },

        showErrorDialog: function(msg) {
            var offset = domUtil.getElementOffset(this.$el[0]),
                width = this.$el.width(),
                height = this.$el.height();

            if (!this._errorDialog) {
                this._errorDialog = new AlertDialog({ modal: false });
            }

            this._errorDialog.setMessage(msg.toString());

            this._errorDialog.open({
                top: height/3 + offset.top,
                left: width/3 + offset.left
            });
        },

        _onPropertiesChange: function() {
            this._onComponentPropertiesChange && this._onComponentPropertiesChange();
        },

        _onWindowResize: function(e) {
            //hack which prevent jquery ui resize event from bubbling to window.
            //See http://bugs.jquery.com/ticket/9841
            if (!e.target.tagName) {
                this.resizeTimer && clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(_.bind(this.resize, this), 300);
            }
        }
    });
});