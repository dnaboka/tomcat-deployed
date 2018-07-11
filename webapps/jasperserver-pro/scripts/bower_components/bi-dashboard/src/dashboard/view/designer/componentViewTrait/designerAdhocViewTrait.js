/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        reportDashletViewTrait = require("./../../base/componentViewTrait/reportTrait"),
        ParametersCache = require("../../../collection/ReportsParametersCollection").instance,

        _initComponent =  reportDashletViewTrait._initComponent;

    function paramsChanged(existing, loaded){
        var serverParams = _.filter(existing, function(param){
            return !param.parametrizeProperty;
        }),
            existingIds = _.pluck(serverParams, "id"),
            loadedIds = _.pluck(loaded, "id"),
            removed = _.difference(existingIds, loadedIds),
            added = _.difference(loadedIds, existingIds);

        return removed.length || added.length;
    }

    return _.extend({}, reportDashletViewTrait, {
        _initComponent: function () {
            var self = this;
            ParametersCache.getReportParameters(this.model.resource.resource.get("uri")).done(function (parameters, outputParameters) {
                if (paramsChanged(self.model.get("parameters"), parameters) || paramsChanged(self.model.get("outputParameters"), outputParameters)){
                    self.model.set({
                        parameters: parameters,
                        outputParameters: outputParameters
                    })
                } else {
                    var params = self.model.get("outputParameters"),
                        i;

                    if (params) {
                        for (i = 0; i < outputParameters.length; i++) {
                            (_.findWhere(params, {id: outputParameters[i].id})).label = outputParameters[i].label;
                        }
                    }

                    params = self.model.get("parameters");
                    if (params) {
                        for (i = 0; i < parameters.length; i++) {
                            (_.findWhere(params, {id: parameters[i].id})).label = parameters[i].label;
                        }
                    }
                }
            });
            return _initComponent.apply(this, arguments);
        }
    });
});
