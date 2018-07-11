/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!DashboardBundle"),
        log = require("logger").register(module),
        dashletTemplate = require("text!../../../template/dashletTemplate.htm"),
        dashboardWiringStandardIds = require("../../../enum/dashboardWiringStandardIds"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes"),
        OptionContainer = require("common/component/base/OptionContainer"),
        dashletToolbarButtonTemplate = require("text!../../../template/dashletToolbarButtonTemplate.htm"),
        dashletToolbarTemplate = require('text!../../../template/dashletToolbarTemplate.htm');

    /**
     * @description Mixin that adds methods to ComponentView.
     * @mixin dashletTrait
     */


    /**
     * Common data signal handler. Catches a signal and stores its payload in paramsModel
     * @memberof dashletTrait
     * @private
     */
    function signalHandler(payload){
        if (payload.name === dashboardWiringStandardIds.APPLY_SLOT) {
            this.updateTitle();
        } else if (_.indexOf(_.values(dashboardWiringStandardIds), payload.name) < 0) {
            if (_.isUndefined(payload.value)) {
                this.paramsModel.unset(payload.name);
            } else {
                this.paramsModel.set(payload.name, payload.value);
            }
        }
    }

    return {
        template: _.template(dashletTemplate),

        /**
         * Initializes properties and events.
         * @memberof dashletTrait
         * @private
         */
        _onViewInitialize: function () {
            var type = this.model.get("type");

            this.$dashlet = this.$("> .dashletContent");
            this.$content = this.$("> .dashletContent > .content");

            this.on("componentRendered", _.bind(this._toggleDashletToolbarButtons, this));
            this.on("componentRendered", function() { this.ready.resolve(); }, this);

            this.paramsModel = this.model.paramsModel;
            this.listenTo(this.model, "signal", signalHandler);
            if (this.model.lastPayload) {
                for (var key in this.model.lastPayload){
                    signalHandler.call(this, {name: key, value: this.model.lastPayload[key]}, this.model.lastSender[key]);
                }
            }

            if (type === dashboardComponentTypes.FREE_TEXT ||
                type === dashboardComponentTypes.IMAGE) {
                this.listenTo(this.model, 'change:showDashletBorders', this._setDashletVisualAppearance);
                this.listenTo(this.model, 'change:borderColor', this._setDashletVisualAppearance);
            }
        },

        /**
         * Resizes component, sets it's visual appearance and initialize toolbar if necessary.
         * @memberof dashletTrait
         * @private
         */
        _onViewRender: function () {
            this._setDashletVisualAppearance();

            if (this.model.isVisualization()) {
                this._initToolbar();

                this._setDashletToolbarVisualAppearance();
            }

            if (this.component && this.component.isFloating && this.component.isFloating()) {
                return;
            }

            _.defer(_.bind(this.resize, this));
        },

        /**
         *
         * @memberof dashletTrait
         * @private
         */
        _onViewResize: function () {
            if (this.component && this.component.isFloating && this.component.isFloating()) {
                return;
            }
            this.resizeContentContainer();
        },

        resizeContentContainer: function() {
            this.$content.height(this.$dashlet.height() - 2 * this.dashboardProperties.get("dashletPadding") - (this.toolbar && this.toolbar.$el.is(":visible")
                ? this.toolbar.$el.outerHeight(true) : 0) - (this.paginationView && this.paginationView.$el.is(":visible") ? this.paginationView.$el.outerHeight(true) : 0)
                - ((this.component && this.component.$footer) && this.component.$footer.is(":visible") ? (!this.component.$footer.hasClass("fixed") ? this.component.$footer.outerHeight(true) : 0): 0));
        },

        /**
         * Updates dashlet title
         * @memberof dashletTrait
         * @public
         */
        updateTitle: function() {
            this.toolbar && this.toolbar.$(".innerLabel > p").text(this.model.getParametrizationResult("name", this.paramsModel.attributes, {tolerateMissing: true}));
        },

        refresh: function () {
            return $.Deferred().resolve();
        },

        cancel: function () {
            return $.Deferred().resolve();
        },

        /**
         * Initializes toolbar.
         * @memberof dashletTrait
         * @private
         */
        _initToolbar: function () {
            this.toolbar && this.toolbar.remove();

            this.toolbar = new OptionContainer({
                options: [
                    {
                        cssClass: "maximizeDashletButton",
                        action: "maximize",
                        title: i18n["dashlet.toolbar.button.maximize"],
                        text: "",
                        disabled: true,
                        hidden: false
                    },
                    {
                        cssClass: "text cancelDashletButton",
                        action: "cancel",
                        title: i18n["dashlet.toolbar.button.cancel"],
                        text: i18n["dashlet.toolbar.button.cancel"],
                        hidden: true
                    },
                    {
                        cssClass: "refreshDashletButton",
                        action: "refresh",
                        title: i18n["dashlet.toolbar.button.refresh"],
                        text: "",
                        disabled: true,
                        hidden: false
                    },
                    {
                        cssClass: "exportDashletButton",
                        action: "export",
                        title: i18n["dashlet.toolbar.button.export"],
                        text: "",
                        disabled: true,
                        hidden: false
                    }
                ],
                contextName: "button",
                contentContainer: ".buttons",
                mainTemplate: dashletToolbarTemplate,
                optionTemplate: dashletToolbarButtonTemplate
            });

            this.updateTitle();

            this.listenTo(this.toolbar, "button:refresh", this._onRefreshClick);
            this.listenTo(this.toolbar, "button:maximize", this._onMaximizeClick);
            this.listenTo(this.toolbar, "button:cancel", this._onCancelClick);

            this.listenTo(this.model, "change:name", this.updateTitle);

            this.$dashlet.prepend(this.toolbar.$el);
        },

        /**
         * Sets dashlet's toolbar visual appearance.
         * @memberof dashletTrait
         * @private
         */
        _setDashletToolbarVisualAppearance: function (changedAttrs) {
            if (this.toolbar) {
                this.toolbar[this.model.get("showTitleBar") ? "show" : "hide"]();
                this.toolbar.getOptionView("refresh")[this.model.get("showRefreshButton") ? "show" : "hide"]();
                this.toolbar.getOptionView("maximize")[this.model.get("showMaximizeButton") ? "show" : "hide"]();
                this.toolbar.getOptionView("export")[this.model.get("showExportButton") ? "show" : "hide"]();

                if (changedAttrs && ("showTitleBar" in changedAttrs)) {
                    this.resize();
                }
            }
        },

        /**
         * Sets dashlet visual appearance.
         * @memberof dashletTrait
         * @private
         */
        _setDashletVisualAppearance: function () {
            this._setColors();
            this._setBorders();
        },

        _setBorders: function () {
            var type = this.model.get('type'),
                showDashletBorders;

            switch (type) {
                case dashboardComponentTypes.FREE_TEXT:
                case dashboardComponentTypes.IMAGE:
                    showDashletBorders = this.model.get("showDashletBorders");
                    if (showDashletBorders) {
                        this.$dashlet.css("border", "1px solid " + this.model.get("borderColor"));
                    }
                    break;
                default:
                    showDashletBorders = this.dashboardProperties.get("showDashletBorders");
            }

            if (!showDashletBorders) {
                this.$dashlet.css("border-width", "0");
            } else {
                this.$dashlet.css("border-width", "1px");
            }

            var margin = this.dashboardProperties.get("dashletMargin");

            if (!showDashletBorders) {
                try {
                    var borderWidth = parseInt(this.$dashlet.css("border-width"), 10);
                    margin -= isNaN(borderWidth) ? 0 : borderWidth;
                } catch (ex) {
                }
            }

            this.$el.css("padding", margin + "px");
            this.$content.css("padding", this.dashboardProperties.get("dashletPadding") + "px");
        },

        _setColors: function () {
            var type = this.model.get('type'),
                self = this,
                canvasColor = this.dashboardProperties.get('canvasColor'),
                titleBarColor = this.dashboardProperties.get('titleBarColor'),
                titleTextColor = this.dashboardProperties.get('titleTextColor');

            setTimeout(function () {
                switch (type) {
                    case dashboardComponentTypes.REPORT:
                    case dashboardComponentTypes.ADHOC_VIEW:
                    case dashboardComponentTypes.WEB_PAGE_VIEW:
                    case dashboardComponentTypes.CHART:
                    case dashboardComponentTypes.TABLE:
                    case dashboardComponentTypes.IMAGE:
                    case dashboardComponentTypes.CROSSTAB:
                        self.$dashlet.find('.dashletToolbar').css('background-color', titleBarColor);
                        self.$dashlet.find('.dashletToolbar p').css('color', titleTextColor);
                        break;
                }
            }, 0);
        },

        /**
         * Event handler.
         * @listens "button:maximize"
         * @memberof dashletTrait
         * @fires "maximise"
         * @private
         */
        _onMaximizeClick: function () {
            if (this.model.isVisualization()) {
                this.model.set("maximized", !this.model.get("maximized"));
            }
        },

        /**
         * Enables toolbar buttons.
         * @memberof dashletTrait
         * @private
         */
        _toggleDashletToolbarButtons: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").enable();
                this.toolbar.getOptionView("maximize").enable();
                this.toolbar.getOptionView("export").enable();
            }
        },

        /**
         * Refreshes dashlet.
         * @memberof dashletTrait
         * @param {object} ev - jQuery event.
         * @private
         */
        _onRefreshClick: function (ev) {
            this._hideRefreshButton();

            this.refresh().always(_.bind(this._showRefreshButton, this));
        },

        /**
         * Cancel dashlet refreshing.
         * @memberof dashletTrait
         * @private
         */
        _onCancelClick: function () {
            var self = this;
            this.cancel().done(function () {
                log.debug("canceled dashlet refresh");
                self._showRefreshButton();
            });
        },

        /**
         * Enables "refresh" button and hides "cancel" button.
         * @memberof dashletTrait
         * @private
         */
        _enableRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").enable();
                this.toolbar.getOptionView("cancel").hide();
            }
        },

        /**
         * Disables "refresh" button and shows "cancel" button.
         * @memberof dashletTrait
         * @private
         */
        _disableRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").disable();
                this.toolbar.getOptionView("cancel").show();
            }
        },

        /**
         * Hides "refresh" button and shows "cancel" button.
         * @memberof dashletTrait
         * @private
         */
        _hideRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").hide();
                this.toolbar.getOptionView("cancel").show();
            }
        },

        /**
         * Shows "refresh" button and hides "cancel" button.
         * @memberof dashletTrait
         * @private
         */
        _showRefreshButton: function () {
            if (this.toolbar) {
                this.toolbar.getOptionView("refresh").show();
                this.toolbar.getOptionView("cancel").hide();
            }
        },

        _errorMessageFactory: function(messageObj) {
            return i18n["dashboard.dashlet.error." + messageObj.errorCode];
        },

        _onPropertiesChange: function() {
            var changedAttrs = this.model.changedAttributes();

            if(changedAttrs && ("showTitleBar" in changedAttrs ||
                "showRefreshButton" in changedAttrs ||
                "showExportButton" in changedAttrs ||
                "showMaximizeButton" in changedAttrs)) {
                this._setDashletToolbarVisualAppearance(changedAttrs);
            }

            this._onComponentPropertiesChange && this._onComponentPropertiesChange(changedAttrs);
        },

        /**
         * Shows error message.
         * @memberof dashletTrait
         * @private
         */
        showMessage: function (messageObj) {
            if (messageObj && messageObj.errorCode){
                var message = this._errorMessageFactory(messageObj);

                if (message) {
                    this.$(".nothingToDisplay").removeClass("hidden").show().find(".message").text(message);
                } else {
                    log.warn("Unhandled message: " + messageObj.toString());
                }
            }
        },

        /**
         * Hides error message.
         * @memberof dashletTrait
         * @private
         */
        hideMessage: function() {
            this.$(".nothingToDisplay").addClass("hidden").hide();
        },

        /**
         * Removes toolbar.
         * @memberof dashletTrait
         * @private
         */
        _onViewRemove: function () {
            this.toolbar && this.toolbar.remove();
        },

        addOverlay: function() {
            if(!this.$overlay){
                this.$overlay = $("<div></div>").addClass("overlay");

                this.$dashlet.prepend(this.$overlay);

                // Firefox issue - mousedown on scrollbar fires DOM event, which is not desired for us
                this.$content.on("mousedown", function(ev){
                    ev.stopPropagation();
                });
            }
        }
    };
});