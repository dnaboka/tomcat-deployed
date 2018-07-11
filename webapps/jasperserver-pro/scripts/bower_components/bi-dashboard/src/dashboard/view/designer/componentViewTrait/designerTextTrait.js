/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar TOmchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    /**
     * @mixin designerTextTrait
     * @description Extends textTrait, supresses parametrization in designer mode.
     */
        
    var _ = require("underscore"),
        textTrait = require("../../base/componentViewTrait/textTrait");

    return _.extend({}, textTrait, {
        /**
         * @memberof textTrait
         * @desc renders component
         * @access protected
         * @fires componentRendered
         */

        _renderComponent: function() {
            var text = this.model.get("text");
            this.component.render(text);
            this.trigger("componentRendered", this);
        },

        resize: function(){
            this.component.applyFontSize();
        }
    });
});
