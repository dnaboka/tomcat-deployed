/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require){
    "use strict";

    var Backbone = require("backbone"),
        dashboardMessageTemplate = require("text!../../template/dashboardMessageTemplate.htm");

    return Backbone.View.extend({
        el: dashboardMessageTemplate,

        show: function(message){
            this.$el.removeClass("hidden").show().find(".message").html(message);
        },

        hide: function(){
            this.$el.addClass("hidden").hide();
        }
    });
});