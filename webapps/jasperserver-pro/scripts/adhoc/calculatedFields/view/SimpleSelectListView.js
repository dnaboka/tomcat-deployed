/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

////////////////////////////////////////////////////////////////
// Simple Select List View
////////////////////////////////////////////////////////////////

define(function(require) {
    "use strict";

    require("common/extension/jQueryDoubletapExtension");

    var _ = require("underscore"),
        $ = require('jquery'),
        Backbone = require("backbone"),
        featureDetection = require("common/util/featureDetection"),
        templateContent = require("text!adhoc/calculatedFields/template/SimpleSelectListTemplate.htm");

    return Backbone.View.extend({
        template: _.template(templateContent),

        events : {
            'mousedown' : 'clickHandler'
        },

        initialize: function() {
            featureDetection.supportsTouch ? this.$el.doubletap(_.bind(this.dblClickHandler, this)) :
                (this.events['dblclick'] = 'dblClickHandler')
        },

        render : function(list) {
            this.$el.empty();

            var viewData = {};
            viewData.items = list;

            this.$el.html(this.template(viewData));

            return this;
        },

        clickHandler: function(evt){
            this.triggerEvent(evt, "item:click")
        },

        dblClickHandler: function(evt){
            this.triggerEvent(evt, "item:dblClick")
        },

        triggerEvent: function(evt, customEvt){
            var node = evt.target.match(".pickList li") ? evt.target : $(evt.target).parents(".pickList li")[0];

            if (node) {
                this.clearSelection();
                $(node).addClass("selected");

                this.trigger(customEvt, node.readAttribute("itemId"));
            }
        },

        clearSelection: function() {
            this.$el.find("li.selected").removeClass("selected");
        }

    });
});
