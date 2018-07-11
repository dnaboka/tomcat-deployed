/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Grant Bacon
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        settings = require("dashboard/dashboardSettings");


    function attributesToCss(model) {
        var scaleStrategy = model.get("scaleToFit");

        return {
            height: (scaleStrategy === "height" || scaleStrategy === "container") ? "100%" : undefined,
            width: (scaleStrategy === "width" || scaleStrategy === "container") ? "100%" : undefined
        };
    }

    function containerAttributesToCss(model) {
        var scaleStrategy = model.get("scaleToFit");

        return {
            "overflow-x": (scaleStrategy === "width" || scaleStrategy === "container") ? "hidden" : undefined,
            "overflow-y": (scaleStrategy === "height" || scaleStrategy === "container") ? "hidden" : undefined
        };
    }


    return Backbone.View.extend({
        REST_RESOURCE_URI: "/rest_v2/resources",

        initialize: function() {

        },

        /**
         * Toggles special css class to get cursor corresponding style
         */
        toggleHyperlinkCssClass: function () {
            this.$el.toggleClass('hyperlink', this.model.get('exposeOutputsToFilterManager'));
        },

        buildViewElement: function(uri) {
            var imgElement = $("<img/>"),
                repoUrl = "";

            if (uri.substr(0, 6) === "repo:/") {
                repoUrl = settings.CONTEXT_PATH + this.REST_RESOURCE_URI + uri.substr(uri.indexOf("/"));
            } else {
                repoUrl = uri;
            }

            // By suffixing the date, we will avoid requesting a cached image
            // which is necessary for refreshing dynamic content from a link when using Refresh button in toolbar
            return imgElement.attr("src", repoUrl + "?" + Date.now());
        },

        render: function(uri) {
            var viewElement;

            uri = (_.isUndefined(uri)) ? this.model.get("url") : uri;

            if (uri === "" || _.isUndefined(uri)) {
                return this;
            } else {
                viewElement = this.buildViewElement(uri);
            }

            this.$el.html(viewElement.css(attributesToCss(this.model))).css(containerAttributesToCss(this.model));
            this.toggleHyperlinkCssClass();

            return this;
        }
    });
});
