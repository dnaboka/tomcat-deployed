/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        Backbone = require("backbone"),
        i18n = require("bundle!CommonBundle"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        filterGroupButtonsTemplate = require("text!../../template/filterGroupButtonsTemplate.htm"),
        domReady = require("domReady");

    var ATTRIBUTES = {
            APPLY: "applyButton",
            RESET: "resetButton",
            FILTERS_PER_ROW: "filtersPerRow",
            BUTTONS_POSITION: "buttonsPosition",
            FLOATING: "floating"
        },
        FILTER_ROW_CLASS = "filterRow",
        FILTER_ROW_FLUID = "fluid",
        BUTTONS_FIXED = "fixed",
        BUTTONS_POSITION_RIGHT = "right",
        ONE_BUTTON_CLASS = "oneButton";

    /**
     * @class FilterGroupView
     * @classdesc FilterGroupView component.
     */
    return Backbone.View.extend(
        /** @lends FilterGroupView.prototype */
        {
            /**
             * @description Initializes event handlers for model events.
             */
            initialize: function() {
                _.bindAll(this, "_onWindowResize");

                this.listenTo(this.model, "change", this._onPropertiesChange);
                $(window).on("resize", this._onWindowResize);
            },

            /**
             * @description Renders filter group buttons and subscribes on events.
             */
            render: function() {
                this.$footer = this.$el.parent().append(_.template(filterGroupButtonsTemplate, { i18n: i18n })).find(".filterGroupButtons");

                this.$applyButton = this.$footer.find("[data-target='" + ATTRIBUTES.APPLY + "']");
                this.$resetButton = this.$footer.find("[data-target='" + ATTRIBUTES.RESET + "']");

                this.$applyButton.on("click", _.bind(this.model.notify, this.model, true));
                this.$resetButton.on("click", _.bind(this._onResetClick, this));

                this._setButtonsVisibility();
            },

            /**
             * @description Removes buttons and unsubscribes from events.
             * @returns {*}
             */
            remove: function() {
                this.$applyButton && this.$applyButton.off("click");
                this.$resetButton && this.$resetButton.off("click");

                $(window).off("resize", this._onWindowResize);

                return Backbone.View.prototype.remove.apply(this, arguments);
            },

            /**
             * @description Changes ICs width to put necessary amount of them in one row.
             */
            resizeInputControlsWidth: function(filtersPerRow) {
                if(this.$el.width() !== 0) {
                    var diff = this.$el.width() / this.$el.outerWidth() * 100,
                        percentageWidth = Math.floor(diff / (filtersPerRow || this.model.get(ATTRIBUTES.FILTERS_PER_ROW))) + "%";

                    this.$el.find(".inputControlWrapper").css({width: percentageWidth});
                }

            },

            /**
             * @description Wrap input controls into div.
             */
            wrapInputControls: function() {
                var filtersPerRow = this.model.get(ATTRIBUTES.FILTERS_PER_ROW),
                    $inputControls = this.$el.find(".inputControlWrapper"),
                    inputControlsCount = $inputControls.length;

                this.removeEmptyRows();

                this.unwrapInputControls($inputControls);

                for (var i = 0; i < inputControlsCount; i += filtersPerRow) {
                    var $row = $("<div/>", {"class": FILTER_ROW_CLASS }),
                        $inputControlsInRow = $inputControls.filter(function(index) {
                            return index >= i && index < i + filtersPerRow;
                        });

                    $inputControlsInRow.wrapAll($row);
                }
            },

            /**
             * @description Refresh input controls wrapping and buttons position.
             */
            refresh: function() {
                this.wrapInputControls();
                this.refreshFilterGroupLayout(this.model.get(ATTRIBUTES.BUTTONS_POSITION));
            },

            /**
             * @description Unwrap input controls.
             * @param $inputControls[jQuery Object] - collection of input controls.
             */
            unwrapInputControls: function($inputControls) {
                $inputControls = $inputControls || this.$el.find(".inputControlWrapper");

                _.each($inputControls, function(inputControl) {
                    $(inputControl).parent().hasClass(FILTER_ROW_CLASS) && $(inputControl).unwrap();
                });
            },

            /**
             * @description Removes empty div(.filterGroup).
             */
            removeEmptyRows: function() {
                var $rows = this.$el.find("." + FILTER_ROW_CLASS);

                _.each($rows, function(row) {
                    !$(row).children().length && $(row).remove();
                });
            },

            /**
             * @description Changes buttons position.
             * @param position
             */
            refreshFilterGroupLayout: function(position) {
                var $filterGroups = this.$el.find("." + FILTER_ROW_CLASS),
                    parentHeight = this.$el.parent().height(),
                    elPadding = this.$el.css("padding"),
                    self = this;

                if (position === BUTTONS_POSITION_RIGHT && (this.model.get("resetButton") || this.model.get("applyButton"))) {
                    $filterGroups.addClass(FILTER_ROW_FLUID);
                    this.$footer.addClass(BUTTONS_FIXED);
                    this.$el.css({
                        float: "left",
                        height: (this.isFloating()) ? "auto" : (parentHeight - elPadding * 2) + "px"
                    });

                    if (this.model.get(ATTRIBUTES.APPLY) && this.model.get(ATTRIBUTES.RESET)) {
                        this.$footer.removeClass(ONE_BUTTON_CLASS);
                        $filterGroups.removeClass(ONE_BUTTON_CLASS);
                    } else {
                        this.$footer.addClass(ONE_BUTTON_CLASS);
                        $filterGroups.addClass(ONE_BUTTON_CLASS);
                    }

                } else {
                    $filterGroups.length && $filterGroups.removeClass(FILTER_ROW_FLUID).removeClass(ONE_BUTTON_CLASS);
                    this.$footer && this.$footer.removeClass(ONE_BUTTON_CLASS).removeClass(BUTTONS_FIXED);
                    this.$el.css({
                        float: "none",
                        height: (this.isFloating()) ? "auto" : this.$footer.is(":visible") ? (parentHeight - this.$footer.outerHeight(true)) + "px" : parentHeight
                    });
                }

                if (this.isFloating()) {
                    _.defer(_.bind(this.setFloatingStyle, self));
                }
            },

            /**
             * @description Enables buttons.
             */
            enableButtons: function() {
                this.$applyButton && this.$applyButton.removeAttr("disabled");
                this.$resetButton && this.$resetButton.removeAttr("disabled");
            },

            /**
             * @description Disables buttons.
             */
            disableButtons: function() {
                this.$applyButton && this.$applyButton.attr("disabled", "disabled");
                this.$resetButton && this.$resetButton.attr("disabled", "disabled");
            },

            isFloating: function() {
                return this.model.get("floating");
            },

            setFloatingStyle: function() {
                var dashletContainer = this.$el.parents("[" + dashboardSettings.COMPONENT_ID_ATTRIBUTE + "='" + this.model.id + "']");

                dashletContainer.css({
                    height: "auto",
                    width: "auto",
                    position: ""
                });

                dashletContainer.find(".dashletContent > .content").css({
                    height: "100%",
                    width: "100%"
                });

                if (dashletContainer.hasClass("ui-resizable")) {
                    dashletContainer.resizable("destroy");
                }
            },

            /**
             * @description Resets view.
             * @listens "click"
             * @private
             */
            _onResetClick: function() {
                this.model.isMute = true;

                var id = this.model.id;
                _.each(this.componentViews, function(view) {
                    var parent = view.model.getParent();
                    parent && parent.id === id && view.reset();
                });

                this.model.isMute = false;

                this.model.notify(true);
            },

            _onWindowResize: function(e) {
                if (this.isFloating()) {
                    var dashletContainer = this.$el.parents("[" + dashboardSettings.COMPONENT_ID_ATTRIBUTE + "='" + this.model.id + "']");
                    dashletContainer.css({maxHeight: $(".dashboardContainer").height()});
                }
            },

            /**
             * @description Changes view according to properties selected in propeties dialog.
             * @listens model "change"
             * @private
             */
            _onPropertiesChange: function() {
                var changedAttrs = this.model.changedAttributes();

                if (changedAttrs) {
                    if (ATTRIBUTES.APPLY in changedAttrs || ATTRIBUTES.RESET in changedAttrs) {
                        this._setButtonsVisibility();
                        this.refreshFilterGroupLayout(this.model.get(ATTRIBUTES.BUTTONS_POSITION));
                    }

                    if (ATTRIBUTES.FILTERS_PER_ROW in changedAttrs) {
                        this.resizeInputControlsWidth();
                        this.refresh();
                    }

                    if (ATTRIBUTES.BUTTONS_POSITION in changedAttrs) {
                        this.refreshFilterGroupLayout(changedAttrs[ATTRIBUTES.BUTTONS_POSITION]);
                    }

                    if (ATTRIBUTES.FLOATING in changedAttrs) {
                        if (changedAttrs[ATTRIBUTES.FLOATING]) {
                            this.resizeInputControlsWidth(1);
                            this.refresh();
                            this.refreshFilterGroupLayout("bottom");
                            this.setFloatingStyle();
                        } else {
                            this.resizeInputControlsWidth();
                            this.refresh();
                        }
                    }
                }
            },

            /**
             * @description Sets visibility of both buttons.
             * @private
             */
            _setButtonsVisibility: function() {
                _.each(ATTRIBUTES, function(buttonName) {
                    this["$" + buttonName] && this._setButtonVisibility(buttonName);
                }, this);

                (this.model.get(ATTRIBUTES.APPLY) || this.model.get(ATTRIBUTES.RESET)) ? this.$footer.show() : this.$footer.hide();
            },

            /**
             * @description Sets visibility of one button.
             * @param {string} buttonName - name of button.
             * @private
             */
            _setButtonVisibility: function(buttonName) {
                var $button = this["$" + buttonName];

                this.model.get(buttonName) ? $button.show() : $button.hide();
            }
        });
});