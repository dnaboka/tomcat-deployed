/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var CollectionView = require("./CollectionView"),
        dashboardWiringStandardIds = require("../../../enum/dashboardWiringStandardIds"),
        dashboardComponentTypes = require("../../../enum/dashboardComponentTypes");

    return CollectionView.extend({
        initCollectionEventHandlers: function() {
            this.listenTo(this.collection, "add remove change:id change:parameter", this.render);
        },

        addSubview: function(model) {
            // handle hidden ICs
            if (model.get("parameter") === dashboardWiringStandardIds.APPLY_SLOT) {
                return;
            }

            if (!model.component || (model.component.isParametrized())) {
                return CollectionView.prototype.addSubview.call(this, model);
            }
        }
    });
});