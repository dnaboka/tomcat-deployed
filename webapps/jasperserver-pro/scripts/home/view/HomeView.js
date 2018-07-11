/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:  Kostiantyn Tsaregradskyi, Igor.Nesterenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        //Views
        ExpandableBlock = require("home/view/ExpandableBlockView"),
        PopularLinkView = require("home/view/PopularLinkView"),
        ListView = require("home/view/ListView"),
        WorkflowView = require("home/view/WorkflowView"),
        ResourceView = require("home/view/ResourceView"),
        ResourceBlockListView = ListView.extend({ tagName: "ul", className:"resourceBlock-list", itemPlural:"items", tabindex:"0"}),
        ResourceBlockTableView = ListView.extend({ tagName: "table", className:"resourceBlock-table", itemPlural:"items", tabindex:"0"}),
        //Templates
        homeTemplate = require("text!home/template/homeTemplate.htm"),
        //i18n
        i18n = require("bundle!HomeBundle");

    return Backbone.View.extend({

        initialize: function() {

                var popularLinksView = new ResourceBlockListView({
                        collection: this.model.getContentReferences(),
                        itemPlural : i18n["popular.resources"],
                        listElementView: PopularLinkView
                    }),
                    recentItemsView = new ResourceBlockTableView({
                        collection: this.model.getResources(),
                        itemPlural : i18n["recently.viewed.items"],
                        listElementView: ResourceView,
                        msgNothingToDisplay: i18n["recently.viewed.nothing.display"],
                        nothingPrefix: '<tr colspan="2"><td>',
                        nothingSuffix: '</td></tr>'
                    });

                this.popularLinksBlock = new ExpandableBlock({
                    title : i18n["popular.resources"],
                    stateKey: "homePagePopularLinksExpandableList",
                    $block: popularLinksView.$el

                });

                this.recentItemsBlock = new ExpandableBlock({
                    title : i18n["recently.viewed.items"],
                    stateKey: "homePageRecentlyViewedResourcesExpandableList",
                    $block: recentItemsView.$el
                });

                this.workflowsView = new ListView({
                    collection: this.model.getWorkflows(),
                    listElementView: WorkflowView,
                    className :  "workflowsBlock",
                    template: "",
                    tagName: "ul"
                });

            this.model.on("change", this.render, this);
        },

        render: function () {

            this.$el.append($(_.template(homeTemplate, this.model.toJSON())));

            this.$(".homeMain").append(this.workflowsView.$el);
            this.$(".homeSidebar-title").after(this.recentItemsBlock.render().$el);
            this.$(".homeSidebar").append(this.popularLinksBlock.render().$el);

            return this;
        }
    });
});
