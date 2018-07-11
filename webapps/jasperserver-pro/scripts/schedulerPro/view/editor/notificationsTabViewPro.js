/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id: $
 */

define(function(require){

	"use strict";

	var $ = require("jquery"),
		i18n = require('bundle!all'),
		_ = require("underscore"),
		notificationsTabTemplate = require("text!scheduler/template/editor/notificationsTabTemplate.htm"),
		notificationsTabView = require('scheduler/view/editor/notificationsTabView');

	return notificationsTabView.extend({

		render: function(){
			if (this.options.isDashboard){
				i18n['report.scheduling.job.edit.includereportasrepositorylinksinemailbody'] = i18n['dashboard.scheduling.job.edit.includereportasrepositorylinksinemailbody']
				i18n['report.scheduling.job.edit.includereportfilesasattachments'] = i18n['dashboard.scheduling.job.edit.includereportfilesasattachments']
				i18n['report.scheduling.job.edit.includereportfiesaszip'] = i18n['dashboard.scheduling.job.edit.includereportfiesaszip']
				i18n['report.scheduling.job.edit.includereport'] = i18n['dashboard.scheduling.job.edit.includereport']

				this.setElement($(_.template(notificationsTabTemplate, {i18n: i18n})));

				$(this.$("#jrsSchedule_includeHtmlReport").parents(".leaf")[0]).hide();
				$(this.$("#jrsSchedule_dont_send_empty_report").parents(".leaf")[0]).hide();
			} else {
				return notificationsTabView.prototype.render.apply(this, arguments);
			}
		}

	});
});
