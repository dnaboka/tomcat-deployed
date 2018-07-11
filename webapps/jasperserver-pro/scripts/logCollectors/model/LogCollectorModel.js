/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/*global define */


/**
 * @author: dgorbenk@tibco.com
 * @version: $Id$
 */

define(function (require) {

	"use strict";

	var
		_ = require("underscore"),
		jrsConfigs = require("jrs.configs"),
		i18n = require("bundle!all"),
		collectorStatusEnum = require("logCollectors/enum/collectorStatusEnum"),
		BaseModel = require("common/model/BaseModel"),
		BackboneValidation = require("backbone.validation"),
		globalConfiguration = require("settings!globalConfiguration"),
		NAME_NOT_SUPPORTED_SYMBOLS = globalConfiguration.resourceIdNotSupportedSymbols.slice(1, globalConfiguration.resourceIdNotSupportedSymbols.length-1);

	var LogCollectorModel = BaseModel.extend({

		urlRoot: jrsConfigs.contextPath + "/rest_v2/diagnostic/collectors/",

		// this is a model which server understands
		defaults: {
			id: null,
			name: "",
			status: "",
			verbosity: "LOW",
			filterBy: {
				userId: "",
				resource: {
					uri: "",
					includeDataSnapshot: false
				}
			}
		},

		validation: {
			name: [
				{
					required: true,
					msg: i18n["logCollectors.form.validation.specifyCollectorName"]
				},
				{
					maxLength: 30,
					msg: i18n["logCollectors.form.validation.too.long.name"]
				},
				{
					doesNotContainSymbols: NAME_NOT_SUPPORTED_SYMBOLS,
					msg: i18n["logCollectors.form.validation.invalid.chars.name"]
				}
			],
			resourceUri: function (value, attr, computedState) {
				if (computedState.includeDataSnapshot === true) {
					if (!value) {
						return i18n['logCollectors.form.validation.specifyResourceUri'];
					}
				}
			}
		},

		constructor: function (attributes, options) {

			BaseModel.prototype.constructor.apply(this, arguments);
		},
		
		initialize: function (attributes, options) {
			this.options = options;
		},

		parse: function (modelFromServer) {

			modelFromServer.userId = modelFromServer.filterBy.userId || "";

			// by default
			modelFromServer.resourceUri = "";
			if (modelFromServer.filterBy.resource) {
				modelFromServer.resourceUri = modelFromServer.filterBy.resource.uri || "";
			}

			// a hack while server doesn't support name
			modelFromServer.name = modelFromServer.name || modelFromServer.id;

			modelFromServer.includeDataSnapshot = false;
			if (modelFromServer.filterBy.resource) {
				modelFromServer.includeDataSnapshot = modelFromServer.filterBy.resource.includeDataSnapshot === true || modelFromServer.filterBy.resource.includeDataSnapshot === "true";
			}

			delete modelFromServer.filterBy;

			return modelFromServer;
		},

		toJSON: function () {
			var model = _.cloneDeep(this.attributes);

			model.filterBy = {
				userId: model.userId,
				resource: {
					uri: model.resourceUri,
					includeDataSnapshot: model.includeDataSnapshot === true ? "true" : "false"
				}
			};

			if (this.isNew()) {
				delete model.id;
				delete model.status;
			}

			delete model.userId;
			delete model.resourceUri;
			delete model.includeDataSnapshot;

			return model;
		},

		sendStopSignal: function() {

			if (!this.isInRunningMode()) {
				return;
			}

            var savedStatus = this.get("status");

			// now, set silently the "stopped" status into the model to send this value to server.
			// silently because we don't want this status be shown on UI.
            // sending "stopped" status is the way how we launch stopping process.
            // Yes, it's bad decision, but this is how the server works.
            // TODO: make server to accept some special API request to stop the log collector instead of modifying collector's model
			this.set({status: collectorStatusEnum.STOPPED}, {silent: true});
            
			// return Deferred object so other side can track the status
			var dfr = this.save();

            // now, get the status back to it's previous state
            this.set({status: savedStatus}, {silent: true});

            return dfr;
		},

		isInRunningMode: function() {
			return this.get("status").toLowerCase() === collectorStatusEnum.RUNNING.toLowerCase();
		},

		isInShuttingDownMode: function() {
			return this.get("status").toLowerCase() === collectorStatusEnum.SHUTTING_DOWN.toLowerCase();
		},

		isInStoppedMode: function() {
			return this.get("status").toLowerCase() === collectorStatusEnum.STOPPED.toLowerCase();
		}
	});

	_.extend(LogCollectorModel.prototype, BackboneValidation.mixin);

	return LogCollectorModel;
});
