/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Grant Bacon
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        imageTrait = require("../../base/componentViewTrait/imageTrait");

    return _.extend({}, imageTrait, {

        _renderComponent: function() {
            var uri = this.model.get("uri");
            this.component.render(uri);
            this.trigger("componentRendered", this);
        }
    });
    

});
