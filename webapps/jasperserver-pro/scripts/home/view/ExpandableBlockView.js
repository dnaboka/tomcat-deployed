/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:  Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {

    "use strict";

    var ListView = require("home/view/ListView"),
        cookie = require("home/util/cookie"),
        _ = require("underscore"),
        defaultTemplate = require("text!home/template/expandableBlockTemplate.htm"),
        defaultListView = require("home/view/ListView"),
        i18n = require("bundle!accessibility_messages"),
        ListStates = {
            COLLAPSED: "0",
            EXPANDED: "1"
        };

    return ListView.extend({

        template: defaultTemplate,

        events : {
            "click .resourceBlock-header" : "toggleList"
        },

        listStateCookieName: function() {
            return this.stateKey + "State";
        },

        toggleList: function() {

            var expandButton = this.$(".buttonIconToggle"),
                blockElem = this.$block;

            if (blockElem.is(":visible")) {
                expandButton.removeClass("isOpen");
                expandButton.addClass("isClosed");
                blockElem.hide();
                cookie.set(this.listStateCookieName(), ListStates.COLLAPSED);
            } else {
                expandButton.removeClass("isClosed");
                expandButton.addClass("isOpen");
                blockElem.show();
                cookie.set(this.listStateCookieName(), ListStates.EXPANDED);
            }
            this.renderAria();
        },

        initialize: function(options) {

            this.$block = options.$block;

            this.title = options.title;

            this.expandedAtStart = options.expandedAtStart;

            this.stateKey = options.stateKey;
        },

        dataToRender : function(){
            var isExpanded = true,
                isExpandedAtStart  = !_.isUndefined(this.expandedAtStart)
                    && this.expandedAtStart,
                listState;

            if (!isExpandedAtStart) {
                listState = cookie.get(this.listStateCookieName());
                isExpanded = listState !== ListStates.COLLAPSED;
            }

            return {isExpanded : isExpanded, title : this.title };
        },

        render: function () {

            var data = this.dataToRender();

            this.setElement(_.template(this.template, data));

            if (this.$block){

                this.$el.append(this.$block);

                if (data.isExpanded){
                    this.$block.show();
                }else{
                    this.$block.hide();
                }
            }
            this.renderAria();
            return this;
        },

        // Render accessible labels for screen readers
        renderAria: function() {
          var expandButton = this.$(".buttonIconToggle"),
              data = this.dataToRender(),
              ariaLabel=this.title+" "+i18n["expander.aria.label.suffix"]+", ";
          if (data.isExpanded){
            ariaLabel+=i18n["expander.aria.state.expanded"];
          } else {
            ariaLabel+=i18n["expander.aria.state.collapsed"];
          }
          expandButton.attr("aria-busy", "true");
          expandButton.attr("aria-label", ariaLabel);
          expandButton.attr("role", "alert");
          expandButton.attr("aria-live", "assertive");
          expandButton.attr("aria-busy", "false");
          expandButton.removeAttr("aria-busy");
          return this;
        }
    });
});