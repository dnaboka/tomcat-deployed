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

    var $ = require("jquery"),
        Backbone = require("backbone"),
        columnResizeMarkerTemplate = require("text!./template/columnResizeMarkerTemplate.htm");

    require("jquery-ui/jquery.ui.draggable");

    return Backbone.View.extend({

        el: columnResizeMarkerTemplate,

        constructor: function(options) {
            options = options || {};

            this.$parentElement = options.parentElement ? $(options.parentElement) : $("body");

            Backbone.View.apply(this, arguments);
        },

        initialize: function() {
            var self = this;

            Backbone.View.prototype.initialize.apply(this, arguments);

            this.$el.draggable({
                axis: "x",
                start: function(evt, ui) {
                    self.trigger("marker:dragStart", evt, ui);
                },
                drag: function(evt, ui){
                    self.trigger("marker:drag", evt, ui);
                },
                stop:function(evt, ui) {
                    self.trigger("marker:dragStop", evt, ui);
                }
            });

            this.render();
        },

        render: function() {
            this.$parentElement.append(this.$el);
        },

        css: function(options){
            this.$el.css(options);
            return this;
        },

        setPosition: function(options){
            this.$el.position(options);
            return this;
        },

        show: function(){
            this.$el.show();

            return this;
        },

        hide: function(){
            this.$el.hide();

            return this;
        }

    });

});
