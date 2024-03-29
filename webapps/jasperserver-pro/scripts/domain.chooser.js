/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* jshint undef: false*/

////////////////////////////////////
// Common domain data chooser logic
////////////////////////////////////
var REPORT_TYPE_PARAM = "reportType";
var REPORT_TYPE_URL_PARAM_PATTERN = new RegExp("[\\?&]" + REPORT_TYPE_PARAM + "=([^&#]*)");

domain.chooser = {
    // Common elements ids.
    FLOW_ID: 'adhocFlow',
    FIELDS: 'dataChooserFields',
    DISPLAY: 'dataChooserDisplay',
    SAVE_AS_TOPIC : 'dataChooserSaveAsTopic',
    PRE_FILTERS : 'dataChooserPreFilters',

    // Submit form identifier variable. Could be changed.
    submitFormId : 'stepDisplayForm',

    currentPage: null,
    flowExecutionKey: null,
    unsavedChangesPresent: false,

    initialize: function(params) {

        var reportTypeParamValues = REPORT_TYPE_URL_PARAM_PATTERN.exec(location.search);
        this.reportType = reportTypeParamValues == null ? "" : decodeURIComponent(reportTypeParamValues[1].replace(/\+/g, " "));

        if (!localContext.rsInitOptions) return;

        var options = localContext.rsInitOptions;
        this.currentPage = $(document.body).identify();
        this.flowExecutionKey = options.flowExecutionKey;
        this.unsavedChangesPresent = options.unsavedChangesPresent;

        var module = this.pageInitFactory[this.currentPage]();

        options = _.extend({}, options, params);

        this.initModule(module, options);
        domain.registerClickHandlers([this.getFlowControlsClickEventHandler()]);
    },

    initModule: function(module, options) {
        if (!module) {
            return;
        }

        module.fillForm && (dc.fillForm = module.fillForm.bind(module));
        module.getFlowControlsClickEventHandler && (dc.getFlowControlsClickEventHandler = module.getFlowControlsClickEventHandler.bind(module));
        module.init.bind(module)(options);
    },

    fillForm: function() {
        //Nothing to do
    },

    getFlowControlsClickEventHandler: function() {
        return dc.flowControlsClickEventHandler.bind(dc);
    },

    flowControlsClickEventHandler: function(element) {
        var eventHandled = false;
        this.flowControlsEventMap.each(function(pair) {
            if (domain.elementClicked(element, pair.key)) {
                eventHandled = true;

                if (pair.value.returnOnPage && this.currentPage === pair.value.returnOnPage) {
                    throw $break;
                }

                if (pair.value.confirmLeave && !this.confirmAndLeave()) {
                    throw $break;
                }

                delete pair.value.returnOnPage;
                pair.value.flowId = this.FLOW_ID;
                pair.value.flowExecutionKey = this.flowExecutionKey;
                pair.value.reportType = this.reportType;

                if (!__jrsConfigs__.initAdditionalUIComponents) {
                    pair.value.decorate = "no";
                }

                if (pair.value.eventId === "cancelRedirect") {
                    jQuery(document).trigger("adhocDesigner:cancel");
                }

                domain.submitForm(this.submitFormId, pair.value, this.fillForm);

                throw $break;
            }
        }.bind(this));

        return eventHandled;
    }
    
};

//Alias for domain.chooser
var dc = domain.chooser;

dc.confirmAndLeave = function(){
    if (dc.unsavedChangesPresent) {
        return confirm(domain.getMessage('exitMessage'));
    }

    return true;
};

dc.setUnsavedChangesPresent = function(present) {
    dc.unsavedChangesPresent = !!present;
},

dc.isUnsavedChangesPresent = function() {
    return dc.unsavedChangesPresent;
},

//////////////////////////
// Factories
//////////////////////////

dc.pageInitFactory = {
    'dataChooserFields': function() {
        return dc_fields;
    },

    'dataChooserPreFilters':function() {
        return dc_filters;
    },

    'dataChooserDisplay': function() {
        return dc_display;
    },

    'dataChooserSaveAsTopic': function() {
        return dc_saveAs;
    }
};

dc.flowControlsEventMap = $H({
    //'#sourceTab': {flowId: 'adhocFlow'},

    '#fieldsTab': {returnOnPage: domain.chooser.FIELDS, eventId: 'fields'},

    '#filtersTab': {returnOnPage: domain.chooser.PRE_FILTERS, eventId: 'preFilters'},

    '#displayTab': {returnOnPage: domain.chooser.DISPLAY, eventId: 'display'},

    '#saveTopicTab': {returnOnPage: domain.chooser.SAVE_AS_TOPIC, eventId: 'saveAsTopic'},

    '#goToDesigner':  {eventId: 'done', reportType: dc.reportType},

    '#cancel':  {eventId: 'cancelRedirect', confirmLeave: true}
});

