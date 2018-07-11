/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),
        Backbone = require("backbone");

    function attributesToCss(model) {
        return {
            "display": "table-cell",
            "font-weight": (model.get("bold") ? "bold" : "normal"),
            "font-style": (model.get("italic") ? "italic" : "normal"),
            "text-decoration": (model.get("underline") ? "underline" : "normal"),
            "font-family": model.get("font") || "inherit",
            "color": model.get("color"),
            "text-overflow": (model.get("scaleToFit") == 1) ? "ellipsis" : "",
            "background-color": model.get("backgroundColor")
        };
    }

    return Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, "applyFontSize");

            this.$el.css({
                "white-space": "nowrap",
                "overflow": "hidden",
                "line-height": 1
            });

            this.$content = $("<span></span>");
            this.$el.append(this.$content);

            $(window).on("resize", this.applyFontSize);
        },

        remove: function () {
            $(window).off("resize", this.applyFontSize);
        },

        applyFontSize: function (options) {
            var self = this,
                targetScale = this.model.get("scaleToFit"),
                fontSize = this.model.get("size"),
                style = {
                    "text-align":  this.model.get("alignment"),
                    "vertical-align":  this.model.get("verticalAlignment")
                },
                contentStyle = {
                    "padding": 0
                },
                extraPadding = calculateExtraPadding(),
                parentWidth = this.$el.parent().width(),
                parentHeight = this.$el.parent().height(),
                paddingStr, padding, calculatedFontSize;

            function useWidthStrategy() {
                style["text-align"] = "center";
                style["fontSize"] = getFontSizeForWidthStrategy() + "px" ;
                self.$content.css("padding", parentWidth * extraPadding + "px");
            }

            function useHeightStrategy() {
                style["vertical-align"] = "middle";
                style["fontSize"] = getFontSizeForHeightStrategy() + "px";
                self.$content.css("padding", parentHeight * extraPadding+ "px");
            }

            function getFontSizeForHeightStrategy() {
                calculatedFontSize = Math.floor((getFontHeight() / self.$content.height()) * fontSize);

                return calculatedFontSize;
            }

            function getFontSizeForWidthStrategy() {
                calculatedFontSize =  Math.floor((getFontWidth() / self.$content.width()) * fontSize);

                //apply calculated font size to an element
                self.$el.css("fontSize", calculatedFontSize + "px");
                //while text width is bigger then expected decrease font size by one
                while (getFontWidth() < self.$content.width()) {
                    self.$el.css("fontSize", --calculatedFontSize + "px");
                }
                //reset element font size to initial size
                self.$el.css("fontSize", Math.floor(fontSize) + "px");

                return calculatedFontSize;
            }

            function getFontHeight() {
                return (parentHeight - padding * 2) * (1 - extraPadding * 2) ;
            }

            function getFontWidth() {
                return (parentWidth  - padding * 2) * (1 - extraPadding * 2);
            }

            function calculateExtraPadding() {
                var textLength = (self.model.get("text") || "").length;

                //calculate extra padding with depends of text length.
                if (textLength === 1) {
                    return 0.1 / textLength;
                } else if (textLength < 3) {
                    return 0.2 / textLength;
                } else {
                    return 0.3 / textLength;
                }
            }

            if (!options || _.isUndefined(options.padding)) {
                paddingStr = this.$el.css("padding");
                padding = paddingStr && paddingStr.indexOf("px") > 0 ? +paddingStr.replace("px", "") : 0;
            } else {
                padding = +options.padding;
            }

            this.$el.css("fontSize", Math.floor(fontSize) + "px");
            this.$content.css(contentStyle);

            this.$el.width(parentWidth);
            this.$el.height(parentHeight - padding * 2);

            if (targetScale == scaleStrategies.WIDTH) {
                useWidthStrategy();
            } else if (targetScale == scaleStrategies.HEIGHT) {
                useHeightStrategy();
            } else if (targetScale == scaleStrategies.CONTAINER) {
                if (getFontSizeForWidthStrategy() > getFontSizeForHeightStrategy()){
                    useHeightStrategy();
                } else {
                    useWidthStrategy();
                }
            }

            this.$el.css(style);
        },

        /**
         * Toggles special css class to get cursor corresponding style
         */
        toggleHyperlinkCssClass: function () {
            this.$el.toggleClass('hyperlink', this.model.get('exposeOutputsToFilterManager'));
        },

        render: function (text) {
            this.$el.css(attributesToCss(this.model));
            this.$content.text(_.isUndefined(text) ? this.model.get("text") || "" : text);

            _.defer(this.applyFontSize);
            this.toggleHyperlinkCssClass();

            return this;
        }
    });
});