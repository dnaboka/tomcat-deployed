/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function(require) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        TabView = require("./view/TabView"),
        BodyView = require("./view/BodyView"),
        template = require("text!./template/visualChooserTemplate.htm");


    return Backbone.View.extend({

        template: _.template(template),

        el: function () {
            return this.template({options: this.options});
        },

        constructor: function(options) {
            this.options = _.defaults(options || {}, this.defaults);
            Backbone.View.apply(this, arguments);
        },

        initialize: function() {
            _.bindAll(this, "_onGroupSelectionChange", "_onTypeChange");

            this.tabView = new TabView();
            this.bodyView = new BodyView();

            this.listenTo(this.tabView, "change:groupSelected", this._onGroupSelectionChange);
            this.listenTo(this.bodyView, "change:visualizationType", this._onTypeChange);
        },

        render: function() {
            this.$(".jr-mVisualchooser-panel").html(this.tabView.render().$el);
            this.$(".jr-mVisualchooser-body").html(this.bodyView.render().$el);

            return this;
        },

        remove: function(){
            this.tabView.remove();
            this.bodyView.remove();

            Backbone.View.prototype.remove.call(this);
        },

        setSelectedType: function(type) {
            this.bodyView.setSelectedType(type);
        },

        setDisabledTypes: function(types) {
            this.bodyView.setDisabledTypes(types);
        },

        _onGroupSelectionChange: function(groupType) {
            this.bodyView.trigger("change:groupSelected", groupType);
        },

        _onTypeChange: function(chartType) {
            this.trigger("change:visualizationType", chartType);
        }
    });
});
