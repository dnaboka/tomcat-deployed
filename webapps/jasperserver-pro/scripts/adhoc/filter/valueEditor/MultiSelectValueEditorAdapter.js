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
        ListValueEditorAdapter = require("adhoc/filter/valueEditor/ListValueEditorAdapter"),
        MultiSelect = require("components/multiSelect/view/MultiSelect"),
        resizableMultiSelectTrait = require("components/multiSelect/mixin/resizableMultiSelectTrait"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        filterValueFormatter = require("adhoc/filter/format/filterValueFormatter"),
        featureDetection = require("common/util/featureDetection");

    return ListValueEditorAdapter.extend({
        createList: function() {
            return new MultiSelect({
                getData: _.bind(this.model.dataProvider.getData, this.model),
                selectedListOptions: {
                    formatLabel: this.model.isOlap
                        ? new OlapFilterValueFormatter(this.model.get("isFirstLevelInHierarchyAll")).format
                        : filterValueFormatter
                },
                resizable : true
            });
        },

        render : function() {
            ListValueEditorAdapter.prototype.render.apply(this, arguments);

            this._moveSizer();

            return this;
        },

        _moveSizer : function () {

            var $sizer = this.list.$el.find(".jr-mSizer");
            //according to Filter specifics, sizer should be after alert message
            if ($sizer.length){
                $sizer.detach().insertAfter(this.$(".warning"));
            }
        }
    });
});
