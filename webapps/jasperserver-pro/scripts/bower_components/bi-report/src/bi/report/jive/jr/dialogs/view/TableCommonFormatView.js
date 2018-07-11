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
 * @author: Narcis Marcu
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Epoxy = require('backbone.epoxy'),
        AttachableColorPicker = require("common/component/colorPicker/SimpleAttachableColorPicker"),
        datePickerBindingHandler = require("./dateTimePickerEpoxyBindingHandler");


    return Epoxy.View.extend({
        constructor: function(options) {
            this.i18n = options.i18n;

            Epoxy.View.prototype.constructor.call(this, options);
        },

        bindingHandlers: {
            radioDiv: {
                init: function($element, value, bindings, context) {
                    var modelBinding = $element.data("model-attr");

                    this.$el = $element;
                    this.callback = function(evt) {
                        bindings[modelBinding](this.$el.data("value"));
                    };

                    this.$el.on("click", _.bind(this.callback, this));
                },
                set: function($element, value) {
                    var radioDivs = $element.siblings("div[data-bind*='radioDiv']");
                    if ($element.data("value") === value) {
                        $element.addClass("selected");
                        radioDivs.removeClass("selected");
                    }
                },
                clean: function() {
                    this.$el.off("click", _.bind(this.callback, this));
                }
            },
            checkboxDiv: {
                init: function($element, value, bindings, context) {
                    var modelBinding = $element.data("model-attr");

                    this.$el = $element;
                    this.isTrippleState = !!this.$el.data("tripplestate");
                    this.callback = function(evt) {
                        bindings[modelBinding](this._get(this.$el));
                    };

                    this.$el.on("click", _.bind(this.callback, this));
                },
                set: function($element, value) {
                    if (value === true) {
                        $element.removeClass("unchanged").addClass("selected");
                    } else if (value === false) {
                        $element.removeClass("unchanged").removeClass("selected");
                    } else {
                        $element.removeClass("selected").addClass("unchanged");
                    }
                },
                _get: function($element) {
                    if (this.isTrippleState) {
                        if ($element.is(".unchanged")) {
                            return true;
                        } else if ($element.is(".selected")) {
                            return false;
                        } else {
                            return null;
                        }
                    } else {
                        return $element.is(".selected") ? false : true;
                    }
                },
                clean: function() {
                    this.$el.off("click", _.bind(this.callback, this));
                }
            },
            colorpicker: {
                init: function($element, value, bindings, context) {
                    var showTransparentInput = !!$element.data("showTransparentInput"),
                        showNoneInput = !!$element.data("showNoneInput"),
                        label = $element.data("label"),
                        modelBinding = $element.data("model-attr");

                    this.attachableColorPicker = new AttachableColorPicker($element,
                        {top: 5, left: 5},
                        {label: label, showTransparentInput: showTransparentInput, showNoneInput: showNoneInput});

                    this.callback = function(color) {
                        bindings[modelBinding](this.rgb2hex(color));
                    };

                    this.attachableColorPicker.on("color:selected", _.bind(this.callback, this));
                },
                set: function($element, value) {
                    var bgColor;
                    if (value) {
                        bgColor = value === "transparent" ? value : "#" + value;
                        $element.removeClass("unchanged");
                        $element.find("div.colorpick").css("background-color", bgColor);
                    } else {
                        $element.addClass("unchanged");
                        $element.find("div.colorpick").css("background-color", "transparent");
                    }

                    this.attachableColorPicker.highlightColor(this.hex2rgb(value));
                },
                clean: function() {
                    this.attachableColorPicker.off("color:selected", _.bind(this.callback, this));
                    this.attachableColorPicker.remove();
                },
                rgb2hex: function(rgbVal) {
                    if (rgbVal === "rgba(0, 0, 0, 0)") {
                        return "transparent";
                    } else if (rgbVal && rgbVal.indexOf("rgb(") === 0) {
                        var rgb = rgbVal.substring(4, rgbVal.length - 1).split(","),
                            out = "";
                        _.each(rgb, function(val) {
                            out += ("0" + parseInt(val).toString(16)).slice(-2);
                        });

                        return out;
                    }

                    return rgbVal;
                },
                hex2rgb: function(hexVal) {
                    if (hexVal === "transparent") {
                        return "rgba(0, 0, 0, 0)";
                    } else if (hexVal && hexVal.length == 6) {
                        var r = hexVal.substring(0, 2);
                        var g = hexVal.substring(2, 4);
                        var b = hexVal.substring(4, 6);

                        return "rgb(" + parseInt(r, 16).toString(10) + ", " + parseInt(g, 16).toString(10) + ", " + parseInt(b, 16).toString(10) + ")";
                    }

                    return hexVal;
                }
            },
            dateTimePicker: datePickerBindingHandler
        }
    });
});
