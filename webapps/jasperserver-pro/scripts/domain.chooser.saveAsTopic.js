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
// Data Chooser Save as Topic
////////////////////////////////////

dc.saveAsTopic = {
    // Server messages constants
    RESOURCE_DOESNT_EXISTS_RESPONSE : 'resource doesnt exist',
    RESOURCE_ALREADY_EXISTS_RESPONSE : 'resource already exists',
    RESOURCE_OF_OTHER_TYPE_EXISTS_RESPONSE : 'resource of other type already exists',
    ID_TOPIC_NAME : 'topicName',
    ID_TOPIC_LOCATION : 'topicLocation',
    ID_TOPIC_DESCRIPTION : 'topicDesc',
    ID_DATA_LIFETIME : 'dataStrategy_dataLifetimeMinutes',
    ID_STAGED : 'dataStrategy_staged',
    ID_MAX_ROWS : 'dataStrategy_maxRows',
    ID_HIDDEN_TOPIC_NAME : 'slTopicLabel',
    ID_HIDDEN_TOPIC_LOCATION : 'slTopicLocation',
    ID_HIDDEN_TOPIC_DESCRIPTION : 'slTopicDesc',
    ID_SAVE_AS_TOPIC_CONFIRM : 'standardConfirm',
    SAVE_TOPIC_BUTTONS: ['#goToDesigner'],
    ID_ENABLE_STAGING: '#dataStrategy_staged',
    ID_STAGING_QUERY_TIMEOUT: '#dataStrategy_dataLifetimeMinutes',
    ID_SAVE_AS_TOPIC_INPUTS: '#saveAsTopicInputs',
    EDIT_MODE: "editMode",
    CREATE_MODE: "createMode",
    ID_MIN_MAX_STAGING_QUERY_TIMEOUT_CHANGED: "#minMaxTimeNote",
    CLASS_LIFETIME_INFO: ".lifeTimeInfo",

    idToAttrMap: {
        dataStrategy_dataLifetimeMinutes: "stagingQueryTimeOut",
        topicDesc: "description",
        topicName: "name",
        topicLocation: "location"
    },

    defaultStagingTimeout: {
        min: 10,
        max: 10080
    },

    minutesIn: {
        day: 1440,
        hour: 60
    },

    fillForm: function() {
        $('slTopicLabel').writeAttribute('value', this.saveAsTopicModel.get("name"));
        $('slTopicLocation').writeAttribute('value', this.saveAsTopicModel.get("location"));
        $('slTopicDesc').writeAttribute('value', this.saveAsTopicModel.get("description"));
        if(this.params.stagingEnabled === "true"){
            $('slDataStrategy_staged').writeAttribute('value', this.saveAsTopicModel.get("stagingEnabled").toString());
            $('slDataStrategy_dataLifetimeMinutes').writeAttribute('value', this.saveAsTopicModel.get("stagingQueryTimeOut"));
        }
    },

    getFlowControlsClickEventHandler: function() {
        return this._flowControlsClickEventHandlerWrapper.bind(this);
    },

    init : function(params) {
        var self = this;

        // Server params
        this.params = params;
        this.organizationId = params.organizationId;
        this.storedTopicLocationPath = params.folderURI;
        this.ORGANIZATIONS_FOLDER_URI = params.organizationsFolderUri;
        this.ORGANIZATION_MATCHER = "^#{org}(/[^/]+#{org})*$".
                interpolate({org: dc.saveAsTopic.ORGANIZATIONS_FOLDER_URI});

        // validation values
        var maxTopicDescriptionLength = params.maxTopicDescription;
        var maxTopicNameLength = params.maxTopicName;

        this.minStagingQueryTimeOut = params.minStagingTopicMinutes || this.defaultStagingTimeout.min;
        this.maxStagingQueryTimeOut = params.maxStagingTopicMinutes || this.defaultStagingTimeout.max;

        this.topicStagingEnabled = JSON.parse(params.topicStagingEnabled === "" ? false : params.topicStagingEnabled);

        // staging related jquery elements
        this.enableStaging = jQuery(this.ID_ENABLE_STAGING);
        this.stagingQueryTimeOut = jQuery(this.ID_STAGING_QUERY_TIMEOUT);
        this.minMaxQueryTimeoutNote = jQuery(this.ID_MIN_MAX_STAGING_QUERY_TIMEOUT_CHANGED);
        this.lifeTimeInfo = jQuery(this.CLASS_LIFETIME_INFO);

        this.goToDesignerButton = jQuery('#goToDesigner');

        this.saveAsTopicInputs = jQuery(this.ID_SAVE_AS_TOPIC_INPUTS);

        // Topic saving input fields
        this.name = jQuery('#' + this.ID_TOPIC_NAME);

        this.description = jQuery('#' + this.ID_TOPIC_DESCRIPTION);

        this.topicLocation = $(this.ID_TOPIC_LOCATION);

        // Page specific buttons
        this.saveTopicBtn = null;

        // Dialogs
        this.saveAsTopicConfirm = $(this.ID_SAVE_AS_TOPIC_CONFIRM);

        // Click handlers registration.
        this._clickHandlersHash = this._clickHandlersFactory();
        domain.registerClickHandlers([
            this._flowControlsClickEventHandlerWrapper.bind(this),
            this._clickHandler.bind(this)]);

        // staging related initializations
        this.setUpStagingQueryTimeOutValue(this.params.topicStagingQueryCacheTimeout || this.minStagingQueryTimeOut);

        this.initDataLifetimeInputs();

        this.initSaveAsTopicModel({
            name: self.params.topicName || "",
            description: self.params.topicDescription || "",
            location: self.params.folderURI,
            stagingQueryTimeOut: self.stagingQueryTimeOutValue,
            stagingEnabled: self.topicStagingEnabled
        }, {
            customValidationValues: {
                maxNameLength: maxTopicNameLength,
                maxDescLength: maxTopicDescriptionLength,
                minStagingQueryTimeOut: self.minStagingQueryTimeOut,
                maxStagingQueryTimeOut: self.maxStagingQueryTimeOut,
                i18n: {
                    maxStagingQueryTimeOut: self.stagingQueryTimeOutDDHHMM.max,
                    minStagingQueryTimeOut: self.stagingQueryTimeOutDDHHMM.min
                }
            }
        });

        this.initEvents();
    },

    initEvents: function(){
        var self = this;

        this.enableStaging.change(function(){
            self.toggleStaging();
        });

        this.saveAsTopicModel.bind('attr:invalid', function(model, attrObj, error, options) {
            var el = jQuery(options.el);
            var silent = _.isUndefined(options.silent) ? false : options.silent;

            if(error && !silent){
                if(el.is("input") || el.is("textarea")){
                    el.parent().addClass('error');
                    el.siblings(".message.warning").text(error);
                }else{
                    el.addClass('error');
                    el.find(".message.warning").text(error);
                }
            }
        });

        this.saveAsTopicModel.bind('attr:valid', function(model, attrObj, error, options) {
            var el = jQuery(options.el);

            if(el.is("input") || el.is("textarea")){
                el.parent().removeClass('error');
                el.siblings(".message.warning").text('');
            }else{
                el.removeClass('error');
                el.find(".message.warning").text('');
            }

        });

        this.saveAsTopicInputs.on('keyup', 'input, textarea', function(e){
            var fieldName = self.idToAttrMap[this.id];
            var input = this;
            if(fieldName){
                self.saveAsTopicModel.set(fieldName, input.value);
                self.saveAsTopicModel.validateAttr(fieldName, input.value, {el: input, silent: true});
            }
        });
    },

    setUpStagingQueryTimeOutValue: function(currentValue){
        this.stagingQueryTimeOutValue = currentValue;

        if(currentValue > this.maxStagingQueryTimeOut){
            this.stagingQueryTimeOutValue = this.maxStagingQueryTimeOut;
            this.minMaxQueryTimeoutNote.find('span').text(domain._messages['page.saveAsTopic.dataLifetime.max.was.changed']);
            this.minMaxQueryTimeoutNote.show();
        }
        if(currentValue < this.minStagingQueryTimeOut){
            this.stagingQueryTimeOutValue = this.minStagingQueryTimeOut;
            this.minMaxQueryTimeoutNote.find('span').text(domain._messages['page.saveAsTopic.dataLifetime.min.was.changed']);
            this.minMaxQueryTimeoutNote.show();
        }

    },

    initSaveAsTopicModel: function(attrs, options){
        this.saveAsTopicModel = new this.params.model(attrs, options);
    },

    initDataLifetimeInputs: function(){
        var self = this;

        this.stagingQueryTimeOutDDHHMM = {
            max: this.convertToDDHHMM(self.maxStagingQueryTimeOut).stringFormat,
            min: this.convertToDDHHMM(self.minStagingQueryTimeOut).stringFormat
        };

        this.daysInput = this.stagingQueryTimeOut.find("input.days");
        this.hoursInput = this.stagingQueryTimeOut.find("input.hours");
        this.minutesInput = this.stagingQueryTimeOut.find("input.minutes");

        this.setDataLifetimeInfo();

        this.setDataLifetimeInputsValues(this.convertToDDHHMM(this.stagingQueryTimeOutValue).values);

        this.stagingQueryTimeOut.on('keydown', 'input', function(e){
            var charCode = (e.which) ? e.which : event.keyCode;
            if (charCode != 46 && charCode > 31 && ((charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)) && !(e.ctrlKey || e.shiftKey) &&
                (charCode != 37 && charCode != 39)){
                e.preventDefault();
            }
        });

        this.stagingQueryTimeOut.on('keyup', 'input', function(e){
            self.validateDataLifetimeInputs(this);
            var value = self.convertToMinutes(self.daysInput.val() || 0, self.hoursInput.val() || 0, self.minutesInput.val() || 0);
            self.saveAsTopicModel.set("stagingQueryTimeOut", value);
            self.saveAsTopicModel.validateAttr("stagingQueryTimeOut", value, {el: self.stagingQueryTimeOut, silent: true});
        });
    },

    setDataLifetimeInputsValues: function(timeObj){
        this.daysInput.val(timeObj.days.value);
        this.hoursInput.val(timeObj.hours.value);
        this.minutesInput.val(timeObj.minutes.value);
    },

    setDataLifetimeInfo: function(){
        this.lifeTimeInfo.find(".minimumLifetime").text(domain._messages["page.saveAsTopic.dataLifetime.minimum"].
            replace("{0}", this.stagingQueryTimeOutDDHHMM.min));
        this.lifeTimeInfo.find(".maximumLifetime").text(domain._messages["page.saveAsTopic.dataLifetime.maximum"].
            replace("{0}", this.stagingQueryTimeOutDDHHMM.max));
    },

    validateDataLifetimeInputs: function(el){
        var max = parseInt(el.getAttribute("max")) >= 0 ? parseInt(el.getAttribute("max")) : "";

        var value = parseInt(el.value, 10) || 0;
        el.value != value && (el.value = value);

        if (value > max) el.value = max;
    },

    convertToMinutes: function(days, hours, minutes){
        return days * this.minutesIn.day + hours * this.minutesIn.hour + minutes * 1
    },

    convertToDDHHMM: function(value){
        var originalValue = value;

        var days = Math.floor(value/this.minutesIn.day);
        value %= this.minutesIn.day;
        var hours = Math.floor(value/this.minutesIn.hour);
        value %= this.minutesIn.hour;
        var minutes = value;

        var constructString = function(obj){
            return obj.value ?  obj.value + " " + obj.units + " " : ""
        };

        var obj = {
            days: {
                value: days || "",
                units: days !== 1 ? domain._messages['page.saveAsTopic.dataLifetime.units.days'] : domain._messages['page.saveAsTopic.dataLifetime.units.day']
            },
            hours: {
                value: hours || "",
                units: hours !== 1 ? domain._messages['page.saveAsTopic.dataLifetime.units.hours'] : domain._messages['page.saveAsTopic.dataLifetime.units.hour']
            },
            minutes: {
                value: minutes || "",
                units: minutes !== 1 ? domain._messages['page.saveAsTopic.dataLifetime.units.minutes'] : domain._messages['page.saveAsTopic.dataLifetime.units.minute']
            },
            originalValue: originalValue
        };

        var timeObj = {
            stringFormat: jQuery.trim(constructString(obj.days) + constructString(obj.hours) + constructString(obj.minutes)),
            values: obj
        };

        return timeObj;
    },

    toggleStaging: function(){
        if(this.enableStaging.prop('checked')){
            this.saveAsTopicModel.set("stagingEnabled", true);
            this.stagingQueryTimeOut.find("input").removeAttr("disabled");
        }else{
            this.saveAsTopicModel.set("stagingEnabled", false);
            this.stagingQueryTimeOut.find("input").attr("disabled", "disabled");
            this.saveAsTopicModel.set('stagingQueryTimeOut', this.minStagingQueryTimeOut);
            this.saveAsTopicModel.validateAttr('stagingQueryTimeOut', this.minStagingQueryTimeOut, {el: this.stagingQueryTimeOut});
            this.saveAsTopicModel.validateAttr("name", this.saveAsTopicModel.get("name"), {el: this.name});
        }
    },

    _changeEventIdForSaveButtons: function() {
        this.SAVE_TOPIC_BUTTONS.each(function(buttonId) {
            dc.flowControlsEventMap.get(buttonId).eventId = 'save';
        });
    },

    _isDataValid : function() {
        var self = this;

        // Validate each attr to show error messages
        _.each(this.saveAsTopicModel.attributes, function(attrValue, attrName){
            self.saveAsTopicModel.validateAttr(attrName, attrValue, {el: self[attrName]});
        });

        return this.saveAsTopicModel.isValid(true);
    },

    _flowControlsClickEventHandlerWrapper : function(element) {
        var eventHandled = false;

        //TODO move out to common place
        function checkValidation(validation, elements) {
            if(!validation) {
                return true;
            }
            var valid = true;
            _.each(validation, function(message, elementKey) {
                if(message) {
                    valid = false;
                    ValidationModule.showError(elements[elementKey], message);
                } else {
                    ValidationModule.hideError(elements[elementKey]);
                }
            });
            return valid;
        }

        this.SAVE_TOPIC_BUTTONS.each(function(button) {
            if (domain.elementClicked(element, button)) {
                eventHandled = true;

                this.saveTopicBtn = $$(button).first();
                if (!dc.saveAsTopic._isDataValid()) {
                    throw $break;
                }

                var params = this._formToParams();
                if (!params[this.ID_HIDDEN_TOPIC_NAME]) {
                    dc.flowControlsClickEventHandler(element);
                    throw $break;
                }
                this.checkIfTopicExists(params, function(response) {
                    ValidationModule.hideError($(this.ID_TOPIC_NAME));

                    if (!response) {
                        throw("malformed server response");
                    }

                    if(!checkValidation(response.validation, {"topicLocation": this.topicLocation})) {
                        return;
                    }

                    if (!response.topicExists || response.topicExists == "no") {
                        this.saveTopic();
                    } else if (response.topicExists == "nameBusy") {
                        ValidationModule.showError($(this.ID_TOPIC_NAME), domain._messages['resource_of_other_type_exists']);
                    } else if (response.topicExists == "yes") {
                        this.showConfirmDialog().then(function() {
                            this.saveTopic();
                        }.bind(this));
                    }

                }.bind(this));

                throw $break;
            }
        }, this);

        return eventHandled || dc.flowControlsClickEventHandler(element);
    },

    _clickHandler : function(element) {
        domain.basicClickHandler(element, this._clickHandlersHash);
    },

    _clickHandlersFactory : function() {
        return $H({
//            '#saveAsTopicOverwriteButtonId' : function() {
//                this.saveTopic();
//                dialogs.popup.hide(this.saveAsTopicConfirm);
//            }.bind(this),
//            '#saveAsTopicOverwriteCancelButtonId' : function() {
//                dialogs.popup.hide(this.saveAsTopicConfirm);
//            }.bind(this),
            '#browser_button' : function() {
                var browser = this.repositoryBrowser;
                if (!browser.isInitialized) {
                    browser.init(this.params, this.saveAsTopicModel);
                    dialogs.popup.show(browser.browseRepositoryDialog);
                } else {
                    dialogs.popup.show(browser.browseRepositoryDialog);
                    browser.saveAsTree.selectFolder($('topicLocation').getValue());
                }
                return true;
            }.bind(this)
        });
    },

    checkIfTopicExists : function(params, callback) {
        domain.sendAjaxRequest({
                flowExecutionKey : dc.flowExecutionKey,
                eventId : 'checkIfExists'
            },
            params, callback);
    },

    saveTopic : function() {
        this._changeEventIdForSaveButtons();
        dc.flowControlsClickEventHandler(this.saveTopicBtn);
    },

    showConfirmDialog : function() {
//        dialogs.popup.show(this.saveAsTopicConfirm);
        return dialogs.popupConfirm.show(this.saveAsTopicConfirm, null,
            {okButtonSelector: "#saveAsTopicOverwriteButtonId", cancelButtonSelector: "#saveAsTopicOverwriteCancelButtonId"});
    },

    _formToParams : function() {
        var params = {};
        params[this.ID_HIDDEN_TOPIC_NAME] = $F(this.ID_TOPIC_NAME) || this.params.topicName;
        params[this.ID_HIDDEN_TOPIC_LOCATION] = $F(this.ID_TOPIC_LOCATION) || this.params.topicLocation;
        params[this.ID_HIDDEN_TOPIC_DESCRIPTION] = $F(this.ID_TOPIC_DESCRIPTION) || this.params.topicDescription;
        // check for presence of new staging fields first
        if ($(this.ID_DATA_LIFETIME) !== undefined &&
            $(this.ID_DATA_LIFETIME) != null) {
            params[this.ID_DATA_LIFETIME] = this.saveAsTopicModel.get("stagingQueryTimeOut");
            params[this.ID_STAGED] = $(this.ID_STAGED).checked;
        }
        return params;
    }
};

var dc_saveAs = dc.saveAsTopic;

dc_saveAs.repositoryBrowser = {
    isInitialized : false,

    init : function(params, saveAsTopicModel) {
        this.browseRepositoryDialog = $('selectFromRepository');
        this.selectFromRepoButton = $('selectFromRepoBtnSelect');
        this.saveAsTree = this.createRepositoryTree(params);

        this.saveAsTopicModel = saveAsTopicModel;

        // Click handlers registration.
        this._clickHandlersHash = this._createClickHandlersFactory();
        domain.registerClickHandlers([function(element){
            domain.basicClickHandler(element, this._clickHandlersHash);
        }.bind(this)]);

        this.isInitialized = true;
    },

    createRepositoryTree : function(options) {
        var _TREE_ID = 'addFileTreeRepoLocation';
        var _PROVIDER_ID = 'repositoryTreeFoldersProvider';
        var _uri = options.folderURI ? options.folderURI : '/';

        // Setup folders tree
        var _tree = new dynamicTree.createRepositoryTree(_TREE_ID, {
            providerId: _PROVIDER_ID,
            organizationId: options.organizationId,
            publicFolderUri: options.publicFolderUri
        });

        _tree.getTreeId = function() {
            return _TREE_ID;
        };

        _tree.selectFolder = function(folderUri) {
            _tree.openAndSelectNode(folderUri);
        };

        _tree.getSelectedFolderUri = function() {
            var selectedNode = _tree.getSelectedNode();
            return selectedNode && selectedNode.param.uri;
        };

        _tree.observe('server:error', function() {
            window.console && console.log("Server internal error occurred on repo tree loading.");
        });

        _tree.observe('childredPrefetched:loaded', function() {
            _tree.openAndSelectNode(_uri);
        });

        _tree.observe('tree:loaded', function() {
            _tree.openAndSelectNode(_uri);
        });

        _tree.observe('node:selected', function(event) {
            this._refreshSelectButtonState(event.memo.node);
        }.bind(this));

        _tree.showTreePrefetchNodes(_uri);

        return _tree;
    },

    _refreshSelectButtonState : function(folder) {
        if (!folder) return;

        var isOrganizations = !!folder.param.uri.match(dc.saveAsTopic.ORGANIZATION_MATCHER);
        if (folder.param.extra.isWritable && !isOrganizations) {
            buttonManager.enable(this.selectFromRepoButton);
        } else {
            buttonManager.disable(this.selectFromRepoButton);
        }
    },

    _createClickHandlersFactory : function() {
        return $H({
            '#selectFromRepoBtnCancel': function() {
                dialogs.popup.hide(this.browseRepositoryDialog);
            }.bind(this),
            '#selectFromRepoBtnSelect' : function() {
                var location = this.saveAsTree.getSelectedFolderUri();
                this.saveAsTopicModel.set("location", location);
                $('topicLocation').value = location;
                dialogs.popup.hide(this.browseRepositoryDialog);
            }.bind(this)
        });
    }
};

////////////////////////////////////////////////
// Initialization entry point
///////////////////////////////////////////////
if (typeof require === "undefined") {
    document.observe('dom:loaded', dc.initialize.bind(dc));
}
