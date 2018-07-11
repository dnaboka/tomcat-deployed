/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: dgorbenk@tibco.com
 * @version: $Id$
 */

/*global define */

define(function (require) {

	"use strict";

	var
		$ = require("jquery"),
		i18n = require('bundle!all'),
        jrsConfigs = require("jrs.configs"),
		Marionette = require("backbone.marionette"),
		LoadingDialog = require("common/component/dialog/LoadingDialog"),
		CreateLogCollectorView = require("logCollectors/view/CreateLogCollectorView"),
		LogCollectorCollectionView = require("logCollectors/collectionView/LogCollectorCollectionView");

	return Marionette.Application.extend({

		initialize: function (options) {
			this.options = options;

			this.$el = $(this.options.container);

			this.addRegions({
				LogCollectorRegion: Marionette.Region.extend({
					el: this.$el
				})
			});

			this.loadingDialog = new LoadingDialog({
				content: i18n["dialog.overlay.loading"]
			});

			// create a view for creating new collectors
			this.createLogCollectorView = new CreateLogCollectorView(null, this.options);
			this.listenTo(this.createLogCollectorView, "logCollectorHasBeenCreated", this.logCollectorHasBeenCreated);
			this.listenTo(this.createLogCollectorView, "cancelButtonClick", this.creatingFormCancelButtonClick);

			// create a collection view of current log collectors
			this.logCollectorCollectionView = new LogCollectorCollectionView([], this.options);
			this.listenTo(this.logCollectorCollectionView, "createNewCollectorClick", this.createNewCollectorClick);

			// by default, show list of log collectors
			this.logCollectorCollectionView.render();
			this.LogCollectorRegion.show(this.logCollectorCollectionView, { preventDestroy: true });

			// load the log collectors
			this.logCollectorCollectionView.refreshListOfCollectors();
		},

		createNewCollectorClick: function() {

			// Render it each time to reset a form into initial state.
			this.createLogCollectorView.prepareNewModel();
			this.createLogCollectorView.render();

			this.LogCollectorRegion.show(this.createLogCollectorView, { preventDestroy: true });
			
			// dirty hack because of our javascript hovering library which does not track case when
			// mouse went from button
			this.logCollectorCollectionView.removeOverClassOnButtons();
		},

		logCollectorHasBeenCreated: function(createdModel) {

			this.logCollectorCollectionView.appendNewlyCreatedLogCollector(createdModel);

			// after appending this new job we need to refresh the list of collectors.
			// Because of internet slow speed it may be take some time while we don't want user to be able to
			// interact with interface

			this.openLoadingDialog();

			var self = this;
			this.logCollectorCollectionView.refreshListOfCollectors().done(function(){
				self.closeLoadingDialog();
			});
			this.LogCollectorRegion.show(this.logCollectorCollectionView, { preventDestroy: true });
		},

		creatingFormCancelButtonClick: function() {
			this.LogCollectorRegion.show(this.logCollectorCollectionView, { preventDestroy: true });
		},

        setTitle: function(title) {
            $(jrsConfigs.logCollectors.initParams.container + " div.content .title").text(title);
        },

		openLoadingDialog: function(throttle) {
			if (this.loadingDialogIsOpened === true) {
				return;
			}

			throttle = throttle || 250;

			var self = this;
			this.loadingDialogTimerHandler = setTimeout(function(){
				self.loadingDialogIsOpened = true;
				self.loadingDialog.open();
			}, throttle);
		},

		closeLoadingDialog: function() {

			if (this.loadingDialogTimerHandler) {
				clearTimeout(this.loadingDialogTimerHandler);
				this.loadingDialogTimerHandler = false;
			}

			if (this.loadingDialogIsOpened === false) {
				return;
			}

			this.loadingDialog.close();
			this.loadingDialogIsOpened = false;
		}
	});
});
