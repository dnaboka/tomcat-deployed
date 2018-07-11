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


/*
 * @author inesterenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        Sizer = require("components/sizer/Sizer"),
        $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        Mustache = require("mustache"),
        i18n = require("bundle!js-sdk/ScalableInputControlsBundle"),
        browserDetection = require("common/util/browserDetection"),
        doCalcOnVisibleNodeClone = require("components/scalableList/util/domAndCssUtil").doCalcOnVisibleNodeClone,
        icHelper = require("../../util/inputControlHelpers"),
        checkboxInputItemTemplate = require("text!../../template/checkboxInputItemTemplate.htm"),
        multiSelectCheckboxTemplate = require("text!../../template/multiSelectCheckboxTemplate.htm");

    var DEFAULT_MIN_ITEMS_COUNT = 3,
        DEFAULT_VISIBLE_ITEMS_COUNT = 5,
        BORDER_OFFSET = 2;

    var BUTTON_TESTS = [
        {
            selector: ".jr-jSelectAll",
            strings: [
                i18n["sic.multiselect.selectAll"],
                i18n["sic.multiselect.all"],
                ""
            ]
        },
        {
            selector: ".jr-jSelectNone",
            strings: [
                i18n["sic.multiselect.deselectAll"],
                i18n["sic.multiselect.none"],
                ""
            ]
        },
        {
            selector: ".jr-jInvert",
            strings: [
                i18n["sic.multiselect.inverse"],
                ""
            ]
        }
    ];

    return BaseInputControlView.extend({
        events: {
            "click .jr-jSelectAll": "onSelectAll",
            "click .jr-jSelectNone": "onSelectNone",
            "click .jr-jInvert": "onInvertSelection"
        },

        template: multiSelectCheckboxTemplate,

        initialize: function() {

            this._debouncedOnResize = _.debounce(_.bind(this.onResize, this), 500);

            BaseInputControlView.prototype.initialize.call(this);
        },

        renderStructure: function() {

            this.setElement($(Mustache.to_html((this.template || ""), _.extend({
                selectAllMsg: i18n["sic.multiselect.selectAll"],
                selectNoneMsg: i18n["sic.multiselect.deselectAll"],
                selectInverseMsg: i18n["sic.multiselect.inverse"]
            }, this.model.toJSON()))));

            this.$checkboxContainer = this.$el.find(".jr-mInput-set");

            this.updateOptionsSelection();
            this.once("attached", this._checkForRealAttachedToDOM, this);

            return this;
        },

        updateOptionsSelection:function () {

            var data = _.map(this.model.state.options.toJSON(), function (val) {
                var result = _.clone(val);
                result.readOnly = this.model.get("readOnly");
                result.uuid = "jr-label-id-" + _.uniqueId(this.model.get("id"));
                return result;
            }, this);

            var list = this.$checkboxContainer.find('ul')[0];

            icHelper.setInnerHtml(list, function(data){
                return Mustache.to_html(checkboxInputItemTemplate, data)
            }, {data:data});

            this._handleHeight();
        },

        _checkForRealAttachedToDOM: function() {
            if (this.$checkboxContainer.find("li").height() > 0) {
                this.attached = true;
                this.$checkboxContainer.height(this._calcHeightByItemsCount(DEFAULT_VISIBLE_ITEMS_COUNT));
                this._initSizer();
                this.setBulkSelectionText();
            } else {
                _.delay(_.bind(this._checkForRealAttachedToDOM, this), 500);
            }
        },

        _initSizer: function() {
            this.sizer = new Sizer({
                container: this.$checkboxContainer
            });
            this.$el.append(this.sizer.$el);
            this._handleHeight();
        },

        _handleHeight: function() {
            var totalItems = this.model.state.options.length,
                currentHeight = this.$checkboxContainer.height(),
                height = currentHeight;

            if (!this.attached || !totalItems) {
                return;
            }


            // calculate min and max for sizer
            var minHeight = this._calcHeightByItemsCount(DEFAULT_MIN_ITEMS_COUNT);
            var maxHeight = this._calcHeightByItemsCount(totalItems) + BORDER_OFFSET;


            // calculate height for multiselect
            if (totalItems <= DEFAULT_VISIBLE_ITEMS_COUNT) {
                // if totalItems smaller than DEFAULT_VISIBLE_ITEMS_COUNT then set full height and equalize min and max (to disable sizer)
                minHeight = maxHeight = height = this._calcHeightByItemsCount(Math.max(DEFAULT_MIN_ITEMS_COUNT, totalItems));
            } else if (currentHeight > maxHeight) {
                // currentHeight bigger than maxHeight, so we need to crop it to maxHeight
                height = this._calcHeightByItemsCount(totalItems);
            }

            this.$checkboxContainer.height(height);
            this.sizer.updateMinMax({
                minHeight: minHeight,
                maxHeight: maxHeight
            });
            if (minHeight === maxHeight) {
                this.sizer.hide();
                this.$checkboxContainer.css("overflow-y", "auto");
            } else {
                this.sizer.show();
                this.$checkboxContainer.css("overflow-y", "scroll");
            }
        },

        _calcHeightByItemsCount: function(count) {
            var itemHeight = this.$checkboxContainer.find("li").outerHeight(),
                offset = Math.round(parseFloat(this.$checkboxContainer.find("ul").css("margin-top")) || 0);

            return count * itemHeight + offset;
        },

        getSelection:function () {
            var boxes = this.$el.find(":checkbox").filter(":checked");

            return _.map(boxes, function (box) {
                return $(box).val();
            });
        },

        bindCustomEventListeners:function () {
            var that = this;

            if (!this.model.get("readOnly")) {
                this.$el.on('change', 'input', _.bind(function (evt) {
                    var selection = this.getSelection();
                    // for better performance in IE7
                    setTimeout(function () {
                        that.model.changeState(selection);
                    });
                }, this));

            }

            this.model.state.options.on("reset", this.updateOptionsSelection, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);

            $(window).on("resize", this._debouncedOnResize);
        },
        onSelectAll: function() {
            if (this.model.get("readOnly")) {
                return;
            }
            var items = this.$checkboxContainer.find('input');
            _.each(items,  function(item){
                item.checked = true;
            });
            items.change(); // trigger the cascading request
        },
        onSelectNone: function() {
            if (this.model.get("readOnly")) {
                return;
            }
            var items = this.$checkboxContainer.find('input');
            _.each(items,  function(items){
                items.checked = false;
            });
            items.change(); // trigger the cascading request
        },
        onInvertSelection: function() {
            if (this.model.get("readOnly")) {
                return;
            }
            var items = this.$checkboxContainer.find('input');
            _.each(items,  function(items){
                items.checked = !items.checked;
            });
            items.change(); // trigger the cascading request
        },

        setBulkSelectionText: function() {
            if (!this.$el.is(":visible")) {
                //We can not measure bulk buttons width
                //so no text will be changed
                return;
            }

            var componentWidth = this.$el.outerWidth();

            if (componentWidth === this._componentWidth) {
                //no need to check text since size was not changed since last check
                return;
            } else {
                this._componentWidth = componentWidth;
            }

            var $bulkButtonsBar = this.$el.find(".jr-mInput-buttonContainer"),
                bulkButtonsBarWidth = $bulkButtonsBar.outerWidth();

            doCalcOnVisibleNodeClone({
                el: $bulkButtonsBar,
                css: {
                    "left" : (0 - (bulkButtonsBarWidth * 2)) + "px",
                    "width" : bulkButtonsBarWidth + "px"
                },
                classes: "jr " + (browserDetection.isIPad() ? "ipad" : ""), //add additional classes to parent container of cloned node
                alwaysClone: true,
                callback: function($clone) {
                    _.each(BUTTON_TESTS, function(buttonTest) {
                        var widthOk = false;

                        _.each(buttonTest.strings, function(buttonString) {
                            if (widthOk) {
                                return;
                            }

                            var $button = $clone.find(buttonTest.selector),
                                $buttonText = $button.find(".jr-mItemselector-button-label span")
                                    .text(buttonString),
                                btnRight = $button[0].getBoundingClientRect().right,
                                txtRight = $buttonText[0].getBoundingClientRect().right;

                            if (btnRight - txtRight >= 3 || buttonString === "") {
                                widthOk = true;
                                $bulkButtonsBar.find(buttonTest.selector + " .jr-mItemselector-button-label span")
                                    .text(buttonString);
                            }
                        });
                    });
                }
            });
        },

        onResize: function() {
            this.setBulkSelectionText();
        },
        remove: function() {
            this.$el.off('change', 'input');
            this.$el.off('click','a');
            this.multiSelect && this.multiSelect.remove();
            this.sizer && this.sizer.remove();
            this.model.state.options.off("reset", this.updateOptionsSelection, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }

    });
});

