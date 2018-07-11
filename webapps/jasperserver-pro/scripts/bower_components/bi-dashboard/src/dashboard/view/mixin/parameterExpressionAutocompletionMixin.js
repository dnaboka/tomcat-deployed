/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

 /**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        ParameterMenu = require("../designer/ParameterMenu"),

        PARAMETRIZED_INPUT_ATTRIBUTE = "data-jrs-parameterized-input",
        PARAMETRIZED_INPUT_SELECTOR = "input["+ PARAMETRIZED_INPUT_ATTRIBUTE + "]";

    return {
        applyParameterExpressionAutocompletionMixin: function () {
            var self = this,
                hanlder = function(){
                    ParameterMenu.onInput.apply(self, arguments);
                }

            this.$(PARAMETRIZED_INPUT_SELECTOR).on("input", hanlder);
            this.on("close",ParameterMenu.close);

            var oRemove = this.remove;

            this.remove = function(){
                this.$(PARAMETRIZED_INPUT_SELECTOR).off("input", hanlder);
                this.off("close", ParameterMenu.close);

                return oRemove.apply(this, arguments);
            }
        }
    }
});
