/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Zakhar Tomchenko
 * @version: $Id: $
 */

define(function (require) {
    "use strict";

    return {
        level: function () {
            var self = this,
                idFilter = function (level) {
                    return self.get("reference") === level.get("id");
                },
                hierarchicalNameFilter = function (level) {
                    return self.get("reference") === level.get("hierarchicalName");
                };

            return this.adHocModel.dataSet.query.cols.axis.find(idFilter) ||
                this.adHocModel.dataSet.query.rows.axis.find(idFilter) ||
                this.adHocModel.dataSet.query.cols.axis.find(hierarchicalNameFilter) ||
                this.adHocModel.dataSet.query.rows.axis.find(hierarchicalNameFilter);
        },

        label: function (showSummaryFunction) {
            return this.has("label") ? this.get("label") : this.level().label(showSummaryFunction);
        }
    };
});