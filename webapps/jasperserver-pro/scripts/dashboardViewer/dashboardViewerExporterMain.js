/*
 * Copyright (C) 2005 - 2015 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    require(["jquery", "!domReady", "css!overrides_custom.css?kick"], function($){
       $(document.body).addClass("rendered");
    });
});