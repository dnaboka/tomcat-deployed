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
 * @author: Taras Bidyuk
 */

define(function(require){

    var Backbone = require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        OptionContainer = require("common/component/base/OptionContainer"),
        HoverMenu = require("common/component/menu/HoverMenu"),
        cascadingMenuTrait = require("common/component/menu/cascadingMenuTrait"),
        headerToolbarTemplate = require("text!./template/headerToolbarTemplate.htm"),
        headerToolbarButtonTemplate = require("text!./template/headerToolbarButtonTemplate.htm"),

        dropdownMenuTemplate = require("text!./template/dropdownMenuTemplate.htm"),
        dropdownOptionTemplate = require("text!./template/dropdownOptionTemplate.htm");

    var CascadingHoverMenu = HoverMenu.extend(cascadingMenuTrait);

    var HeaderToolbarView = Backbone.View.extend({

        events: {
            'mousedown button': "_onMouseTouchDown",
            'touchstart button': "_onMouseTouchDown",
            'mouseup button': "_onMouseTouchUp",
            'touchend button': "_onMouseTouchUp"
        },

        initialize: function(options){
            options = options || {};

            this.parentElement = options.parentElement ? $(options.parentElement) : $("body");

            var buttons = options.buttons || [];

            this.buttons = new OptionContainer({
                contextName: "button",
                mainTemplate: headerToolbarTemplate,
                contentContainer: ".jive_button_bar_options",
                optionTemplate: headerToolbarButtonTemplate,
                options: buttons
            });

            this.resetCurrentButton();

            this.initEvents();

            this.initHoverMenus();

            this.setElement(this.buttons.$el);

            this.rendered = false;

            Backbone.View.prototype.initialize.apply(this, arguments);
        },

        initEvents: function(){
            this.listenTo(this.buttons, "mouseover", this._onMouseOver);
            this.listenTo(this.buttons, "mouseout", this._onMouseOut);
            this.listenTo(this.buttons, "button:select button:sortAsc button:sortDesc button:filter", this._onSelect);
        },

        initHoverMenus: function(){

            this.cascadingMenus = [];

            _.each(this.buttons.options, function(option){
               var hoverMenuOptions = option.model.get("hoverMenuOptions");

                if(hoverMenuOptions){
                    var cascadingMenu = new CascadingHoverMenu(hoverMenuOptions, option.$el, null, {
                        menuContainerTemplate: dropdownMenuTemplate,
                        menuOptionTemplate: dropdownOptionTemplate
                    });
                    this.listenTo(cascadingMenu, "option:select", this._onSelect);
                    this.cascadingMenus.push(cascadingMenu);
                }

            }, this);
        },

        _onSelect: function(buttonView, buttonModel, e){
            this.trigger("select", buttonView, buttonModel, e);
        },

        _onMouseTouchDown: function(e){
            if(this.currentButton){
                var buttonView = this.currentButton;
                !buttonView.$el.hasClass('disabled') && buttonView.$el.addClass('pressed');
            }
            return false;
        },

        _onMouseTouchUp: function(e){
            if(this.currentButton){
                this.currentButton.$el.removeClass('pressed');
            }
            return false;
        },

        _onMouseOver: function(buttonView, buttons, model){
            this.resetCurrentButton(buttonView);

            !buttonView.$el.hasClass('disabled') && buttonView.$el.addClass('over');
        },

        _onMouseOut: function(buttonView, buttons, model){
            this.resetCurrentButton();
            buttonView.$el.removeClass('over pressed');
        },

        resetCurrentButton: function(buttonView){
            this.currentButton = buttonView ? buttonView : null;
        },

        resetButtonsClasses: function(){
            this.$el.find("button").removeClass('over pressed disabled');
        },

        disableButtons: function(){
            this.$el.find("button").addClass("disabled");
        },

        setPosition: function(options){
            this.$el.position(options);

            return this;
        },

        show: function(disable){
            this.resetButtonsClasses();

            !disable && this.disableButtons();

            this.$el.show();

            return this;
        },

        hide: function(){
            this.$el.hide();

            return this;
        },

        render: function(){
            this.parentElement.append(this.$el);

            this.rendered = true;

            return this;
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);

            this.rendered = false;

            this.buttons && this.buttons.remove();
            _.invoke(this.cascadingMenus, "remove");
        }

    });


    return HeaderToolbarView;

});