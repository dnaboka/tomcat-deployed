/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var BooleanSelectEditor = require("adhoc/filter/valueEditor/BooleanSelectEditor"),
        _ = require("underscore"),
        filterOperators = require("adhoc/filter/enum/filterOperators");

    return BooleanSelectEditor.extend({
        isMultiple: true,

        serializeModel: function() {
            var viewModel = this.getDefaultViewModel(),
                // True All is supported only for IN operator
                trueAll = this.model.get("isAnyValue") && this.model.get("operatorName") === filterOperators.IN,
                selected = {
                    "true": trueAll,
                    "false": trueAll
                };

            if (!trueAll) {
                var modelValue = this.getValue();

                _.each(modelValue, function(value) {
                    selected[value] = true;
                });
            }

            _.each(viewModel.options, function(option) {
                option.selected = selected[option.value] || false;
            });

            return viewModel;
        },

        setValue : function(selected) {
            if (this.model.get("operatorName") === filterOperators.IN) {
                this.model.attributes.isAnyValue = (selected && selected.length === 2);
                if (this.model.get("isAnyValue")) {
                    selected = [];
                }
            }

            BooleanSelectEditor.prototype.setValue.call(this, selected || []);
        }
    });
});
