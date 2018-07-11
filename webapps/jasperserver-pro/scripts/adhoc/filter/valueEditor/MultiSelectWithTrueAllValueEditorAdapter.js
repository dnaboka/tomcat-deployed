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
        MultiSelectValueEditorAdapter = require("adhoc/filter/valueEditor/MultiSelectValueEditorAdapter"),
        MultiSelectWithTrueAll = require("components/multiSelect/view/MultiSelectWithTrueAll"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        filterValueFormatter = require("adhoc/filter/format/filterValueFormatter");

    return MultiSelectValueEditorAdapter.extend({
        createList: function() {
            return new MultiSelectWithTrueAll({
                getData: _.bind(this.model.dataProvider.getData, this.model),
                selectedListOptions: {
                    formatLabel: this.model.isOlap
                        ? new OlapFilterValueFormatter(this.model.get("isFirstLevelInHierarchyAll")).format
                        : filterValueFormatter
                },
                resizable : true
            });
        },

        _setValueToList: function(options) {
            if (this.model.get("isAnyValue")) {
                this.list.setTrueAll(true);
            } else {
                this.list.setValue(this.getValue(), options);
            }
        }
    });
});
