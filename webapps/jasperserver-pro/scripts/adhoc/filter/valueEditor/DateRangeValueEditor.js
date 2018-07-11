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

    var _ = require("underscore"),
        $ = require("jquery"),
        dateTrait = require("adhoc/filter/valueEditor/dateTrait"),
        InputRangeValueEditor = require("adhoc/filter/valueEditor/InputRangeValueEditor");

    var InputRangeValueEditorProto = InputRangeValueEditor.prototype;

    return InputRangeValueEditor.extend(_.extend({}, dateTrait, {
        /**
         * Reset true all flag if date was changed
         *
         * @param ev
         */
        onChange: function(ev) {
            this.model.set("isAnyValue", false, {silent: true});
            InputRangeValueEditorProto.onChange.call(this, ev);
        },

        registerEvents : function() {
            InputRangeValueEditorProto.registerEvents.call(this);
            this.$el.on("change", "input[type=checkbox]", _.bind(function(ev) {
                var isAnyValue = $(ev.target).prop("checked");
                this.model.set("isAnyValue", isAnyValue);
                if (isAnyValue) {
                    this.model._setDefaultValue();
                    this.render();
                }
            }, this));
        }

    }));
});