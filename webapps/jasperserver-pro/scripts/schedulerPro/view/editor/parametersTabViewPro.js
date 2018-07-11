/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: parametersTabView.js 9664 2015-11-23 14:56:31Z dgorbenk $
 */

/* global ControlsBase, JRS, OptionsDialog */

define(function(require){

    "use strict";

    require('controls.options');
    require('controls.controller');

    // dependencies
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
		resourceType = require('schedulerPro/enum/scheduledResourceTypeEnum'),
        parametersTabCe = require('scheduler/view/editor/parametersTabView'),

		DashboardModel = require("dashboard/model/DashboardModel"),
		dashboardSettings = require("dashboard/dashboardSettings"),
		dashboardComponentViewFactory = require("dashboard/factory/dashboardComponentViewFactory"),

		DashboardControlsController = require('schedulerPro/model/dashboardControlsControllerAdapter'),

		parametersTabTemplate = require("text!scheduler/template/editor/parametersTabTemplate.htm");

    // return backbone view
    return parametersTabCe.extend({

		events: {
			"click [name=saveCurrentValuesButton]": "saveCurrentValuesClick"
		},

        // initialize view
        initialize: function(options) {
			var result = parametersTabCe.prototype.initialize.apply(this, arguments);

	        this.listenTo(this.model, "change:source", this.sourceChangeReportOptions);

			return result;
        },

	    remove: function() {
            if (this.reportOptionsDialog) {
                this.reportOptionsDialog.remove();
            }

		    return Backbone.View.prototype.remove.apply(this, arguments);
	    },

	    render: function() {
			var result = parametersTabCe.prototype.render.apply(this, arguments);

		    if (this.model.resourceType !== resourceType.DASHBOARD) {

			    // create report options instance
			    this.reportOptions = new JRS.Controls.ReportOptions();

			    // handle selection change
			    $(document).on('viewmodel:selection:changed', _.bind(this.viewModelSelectionChange, this));

			    // construct save values dialog
			    // TODO: use a new dialog or create one
			    this.reportOptionsDialog = new OptionsDialog({
				    'button#saveAsBtnSave': _.bind(this.saveAsDialogButtonSaveClick, this),
				    'button#saveAsBtnCancel': _.bind(this.saveAsDialogButtonCancelClick, this)
			    });
		    }

			return result;
	    },

	    saveCurrentValuesClick: function() {
		    this.reportOptionsDialog.show();
	    },

	    saveAsDialogButtonSaveClick: function() {
		    var self = this,
		        optionName = this.reportOptionsDialog.input.getValue(),
			    selectedData = this.model.controlsController.getViewModel().get('selection'),
			    overwrite = optionName === this.reportOptionsDialog.optionNameToOverwrite;

		    $.when(this.reportOptions.add(this.reportOptions.optionsUrl || this.reportOptions.url, optionName, selectedData, overwrite)).
			    done(function () {
				    self.reportOptionsDialog.hideWarning();
				    var container = self.reportOptions.getElem().parent();
				    if (container.length === 0) {
					    container = self.$el.find('.saveCurrentValuesContainer');
					    container.prepend(self.reportOptions.getElem());
				    }
				    self.reportOptionsDialog.hide();
				    delete self.reportOptionsDialog.optionNameToOverwrite;
			    }).fail(function(err){
				    try {
					    var response = $.parseJSON(err.responseText);
					    if (response.errorCode === "report.options.dialog.confirm.message"){
						    !overwrite && (self.reportOptionsDialog.optionNameToOverwrite = optionName);
					    }
					    self.reportOptionsDialog.showWarning(response.message);
				    } catch (e) {
					    // In this scenario security error is handled earlier, in errorHandler, so we can ignore exception here.
					    // Comment this because it will not work in IE, but can be uncommented for debug purpose.
					    // console.error("Can't parse server response: %s", "controls.core", err.responseText);
				    }
			    });
	    },

	    saveAsDialogButtonCancelClick: function() {
		    this.reportOptionsDialog.hide();
	    },

		sourceChange: function(model, value){
			if (this.model.resourceType == resourceType.DASHBOARD){
				this.$(".saveCurrentValuesContainer").hide();

				var fetch = !this.dashboardModel || this.dashboardModel.get("uri") !== value.reportUnitURI,
					jobModel = this.model;

				if (!this.dashboardModel) {
					dashboardSettings.CONTEXT_PATH = ".."
					var $canvasBody = this.$("#inputControlsContainer"),
						self = this;

					this.dashboardModel = new DashboardModel({uri: value.reportUnitURI}, {contextPath: dashboardSettings.CONTEXT_PATH});

					this.dashboardModel.on("propertiesAvailable", function(propertiesModel){
						if (propertiesModel.get("useFixedSize")){
							self.model.fixedSize = true;
							self.model.update("source", {referenceWidth: propertiesModel.get("fixedWidth"), referenceHeight:  propertiesModel.get("fixedHeight")});
						} else {
							var source = self.model.get("source");
							self.model.update("source", {referenceWidth: source.referenceWidth || dashboardSettings.DEFAULT_REFERENCE_WIDTH, referenceHeight:   source.referenceHeight || dashboardSettings.DEFAULT_REFERENCE_HEIGHT});
						}
					});

					this.dashboardModel.foundations.on("addComponent", function (componentModel, foundationModel) {
						if (foundationModel === self.dashboardModel.currentFoundation && componentModel.get("type") == "inputControl") {
							self.dashboardModel.hasControls = true;

							(function(name, id){
								componentModel.on(name, function(value){
									var source = jobModel.get("source");
									source.parameters.parameterValues[id] = value;
									jobModel.set("source", source);
								});

								self.model.get("source").parameters.parameterValues[name] && componentModel.set("value", self.model.get("source").parameters.parameterValues[name]);
							})(componentModel.getOwnerParameterName(), componentModel.id);


							var componentView = dashboardComponentViewFactory({
								model: componentModel,
								dashboardProperties: self.dashboardModel.currentFoundation.components.getDashboardPropertiesComponent(),
								dashboardId: value.reportUnitURI
							});

							self.model.controlsController.controls.push(componentView);

							$canvasBody.append(componentView.render().$el);
						}
					});

					this.model.controlsController = new DashboardControlsController(this.model);
				}

				fetch && this.dashboardModel.fetch().done(function () {
					self.trigger(self.dashboardModel.hasControls ? "IC_Displayed" : "failedToGet_IC");
				}).fail(function () {
					self.trigger("failedToGet_IC");
				});
			} else {
				parametersTabCe.prototype.sourceChange.apply(this, arguments);
			}
		},

	    sourceChangeReportOptions: function(model, value) {

		    var self = this,
		        url = value && value.reportUnitURI;

		    // if url changed, fetch new data
		    if (this.reportOptions && url !== this.reportOptions.url) {

			    // fetch new data
			    this.reportOptions.optionsUrl = undefined;

			    this.model.resource('reportOptions',  this.model.get('source').reportUnitURI, function(err, data){
				    if (err) { return; }
				    self.reportOptions.optionsUrl = data.reportUri;
				    $.when(self.reportOptions.fetch(data.reportUri || url, '')).done(function() {
					    self.$el.find(".saveCurrentValuesContainer").prepend(self.reportOptions.getElem());
					    $(document).trigger('viewmodel:selection:changed');
				    });
			    });

			    var folderUri = this.model.get('repositoryDestination').folderURI;
			    this.model.checkPermissionOnFolder(folderUri, function(err, permission) {
				    var saveButtonEnabled = false;
				    if (!err) {
					    saveButtonEnabled = (permission === 1 || permission === 30);
				    }
				    self.$el.find("[name=saveCurrentValuesButton]").attr('disabled', saveButtonEnabled ? null: "disabled");
			    });

			    // save new url
			    this.reportOptions.url = url;
		    }
        },

	    viewModelSelectionChange: function(){
		    // update options
		    var option = this.reportOptions.find({uri: this.reportOptions.url });
		    this.reportOptions.set({selection:option}, true);
	    }
    });
});