/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko, Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require('backbone'),
        _ = require("underscore"),
        HoverMenu = require('common/component/menu/HoverMenu'),
        i18n = require('bundle!DashboardBundle'),
        Dialog = require("common/component/dialog/Dialog"),
        baseToolbarTemplate = require('text!dashboard/template/toolbarTemplate.htm');

    require("css!dashboard/toolbar.css");

    return Backbone.View.extend({
        el: _.template(baseToolbarTemplate, { i18n: i18n }),

        events: {
            "click #undo" : "runUndo",
            "click #undoAll" : "runUndoAll",
            "click #redo" : "runRedo",
            "click #filterPopup": "toggleFilterPopupDialog",
            "click #back": "goBack"
        },

        initialize: function(){
            this.exportMenu = new HoverMenu([
                {label: "PNG", action: "png"},
                {label: "PDF", action: "pdf"},
                {label: "DOCX", action: "docx"},
                {label: "ODT", action: "odt"},
                {label: "PPTX", action: "pptx"}
            ], this.$("#export"));

            this.listenTo(this.exportMenu, "all", function(name){
               if (name.indexOf("option:") === 0){
                   this.exportMenu.hide();
                   this.exportDashboard(name.substring("option:".length));
               }
            }, this);

            this.filterPopupIsVisible = false;

            this.listenTo(this, "filterButtonStyle:open", this.openFilterPopupDialog);
            this.listenTo(this, "filterButtonStyle:close", this.closeFilterPopupDialog);

            this.setVisibility({
                back: /dashboard\/viewer/.test(window.location.href)
                        && /_ddHyperlink=\d+/.test(window.location.href)
                        && !/noReturn=true/.test(window.location.href)
            });
        },

        remove: function(){
            this.exportMenu.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        setTitle: function(title) {
            this.$('.header .title').text(title);
        },

        toggleFilterPopupDialog: function() {
            this.trigger("button:filterPopup");
            if (this.filterPopupIsVisible) {
                this.closeFilterPopupDialog();
            } else {
                this.openFilterPopupDialog();
            }
        },

        goBack: function () {
            this.trigger("button:back");
        },

        openFilterPopupDialog: function() {
            this.$("#filterPopup").addClass("pressed").addClass("down");
            this.filterPopupIsVisible = true;
        },

        closeFilterPopupDialog: function() {
            this.$("#filterPopup").removeClass("pressed").removeClass("down");
            this.filterPopupIsVisible = false;
        },

        setVisibility: function(buttons){
            var self = this;
            _.each(_.keys(buttons), function(key){
                var button =  self.$("#"+ key),
                    separator = button.parent().prev();
                button[buttons[key] ? "removeClass": "addClass"]("hidden");

                if (separator.hasClass("separator")){
                    separator[buttons[key] ? "show": "hide"]();
                }
            });
        },

        setEnabled: function(buttons){
            var self = this;
            _.each(_.keys(buttons), function(key){
                if (buttons[key]) {
                    self.$("#"+ key).attr("disabled", false);
                } else {
                    self.$("#"+ key).removeClass('over').attr("disabled", true);
                }
            });
        },

        exportDashboard: function(type){
            this.trigger("button:export", type);
        },

        runUndo: function(){
            this.trigger("button:undo");
        },

        runUndoAll: function(){
            this.trigger("button:undoAll");
        },

        runRedo: function(){
            this.trigger("button:redo");
        }
    });
});