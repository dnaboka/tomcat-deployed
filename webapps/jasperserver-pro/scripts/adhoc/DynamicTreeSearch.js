/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * Search component for legacy tree see dynamicTree
 * @version: $Id$
 */

/* global dynamicTree */

define(function(require) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        template = require('text!common/component/tree/template/searchPluginTemplate.htm');

    return Backbone.View.extend({
        template: _.template(template),

        el: function() {
            return this.template();
        },

        events: {
            "click .button.search": "onClickOnSearchButton",
            "click .button.searchClear": "onClearSearch",
            "keydown input[type=text]": "onKeyPress"
        },

        initialize: function(options) {
            _.bindAll(this, "onTreeLoaded", "_walkThroughTree", "_saveTreeStateAction", "_restoreSavedTreeStateAction");

            this.tree = options.tree;
            this.depth = options.depth;
            this.treeState = {};

            this.model = new Backbone.Model();

            this.initObservers();

            if (options.keyword) {
                this.setKeyword(options.keyword);
            }
        },

        initObservers: function() {
            this.listenTo(this.model, "change:keyword", this.onChangeKeyword);
        },

        _walkThroughTree: function(node, action) {
            var i,
                length = node.childs.length;

            for (i = 0; i < length; i++) {
                this._walkThroughTree(node.childs[i], action);
            }

            action(node);
        },

        _saveTreeStateAction: function(node) {
            var state = this.tree.stateObject[node.id];
            if (state) {
                this.treeState[node.param.id] = this.tree.stateObject[node.id];
            }

            //all tree nodes are stored in a global state
            //in order to avoid memory leak - remove nodes which will not be used anymore from this
            //global object
            //can not use delete operator because of IE in which this may cause random errors
            dynamicTree.nodes[node.id] = undefined;
        },

        _restoreSavedTreeStateAction: function(node) {
            var state = this.treeState[node.param.id];
            if (state) {
                this.tree.stateObject[node.id] = state;
            }
        },

        /* event handlers */
        onChangeKeyword: function() {
            var keyword = this.getKeyword(),
                previousKeyword = this.model.previous("keyword");


            if (!previousKeyword) {
                //if no search was done before - save state of opened nodes
                this._walkThroughTree(this.tree.rootNode, this._saveTreeStateAction);
            }

            this.tree.additionalParams.query = keyword;
            this.tree.showTree(this.depth, this.onTreeLoaded);

            if (keyword) {
                this.$el.find(".button.searchClear").addClass("up");
            } else {
                this.$el.find(".button.searchClear").removeClass("up");
            }

            this.trigger("change:keyword", keyword);
        },

        onClickOnSearchButton: function() {
            this.model.set("keyword", this.$el.find("input[type=text]").val());
        },

        onClearSearch: function() {
            this.setKeyword("");
        },

        onKeyPress: function(evt) {
            if (evt.which === 13) {
                this.onClickOnSearchButton();
            }
        },

        onTreeLoaded: function() {
            if (!this.getKeyword()) {
                //if search key was removed - restore previous state of opened nodes
                this.tree.resetStates();
                this._walkThroughTree(this.tree.rootNode, this._restoreSavedTreeStateAction);
                this.treeState = {};
            }

            this.tree.renderTree();
        },

        /* API */

        setKeyword: function(keyword) {
            this.$el.find("input[type=text]").val(keyword);
            this.model.set("keyword", keyword);
        },

        getKeyword: function() {
            return this.model.get("keyword");
        }
    });
});