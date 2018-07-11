/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* jshint undef: false*/

JRS.ViewQueryDialog = (function($) {
    var Dialog = function(options) {
        this.template = $(options.id);
        this.selectionContainer = options.selectionContainer;
        this.updateContent(options.content);
    };

    Dialog.fn = Dialog.prototype;

    Dialog.fn.close = function() {
        disableSelectionWithoutCursorStyle(this.selectionContainer);
        this.unregisterEvents();
        dialogs.popup.hide(this.template.get(0));
    };

    Dialog.fn.show = function() {
        enableSelection(this.selectionContainer);
        dialogs.popup.show(this.template.get(0));
        this.registerEvents();
    };

    Dialog.fn.updateContent = function(content) {
        $('.content .body textarea', this.template).text(content || '');
    };

    Dialog.fn._eventsAreRegistered = false;
    Dialog.fn.registerEvents = function() {
        if (this._eventsAreRegistered === true) {
            return;
        }
        $('.button', this.template).on('click', $.proxy(this.close, this));
        this._eventsAreRegistered = true;
    };
    Dialog.fn.unregisterEvents = function() {
        if (this._eventsAreRegistered === false) {
            return;
        }
        $('.button', this.template).off('click');
        this._eventsAreRegistered = false;
    };
    return Dialog;
})(jQuery);

JRS.SaveAsDialog = (function(jQuery, dynamicTree) {
    return function(inputOptions) {
        var defaultOptions = {
            templateMatcher: "#saveAs",
            insertAfterMatcher: "#frame",
            cloneTemplate: false,
            elementId: null,
            okButtonMatcher: ".saveButton",
            cancelButtonMatcher: ".cancelButton",
            inputMatchers: {
                name: ".resourceName",
                description: ".resourceDescription"
            },
            foldersTreeMatcher: "#saveDataViewFoldersTree",
            reportFoldersTreeMatcher: "#saveReportFoldersTree",
            organizationId: "",
            publicFolderUri: "/public",
            grabKeydownEvents: true,
            validator: function(placeToSave) { return true;}, //default validator
            saveHandler: function(placeToSave) { //default save handler
                var deferred = jQuery.Deferred(); //use this to delay dialog close until server confirms successful save
                deferred.resolve();
                return deferred;
            }
        };
        var opt = jQuery.extend({}, defaultOptions, inputOptions);
        var thisSaveAsDialog = this;
        var dialogElement = getDialogElement(opt);
        this.dialogElement = dialogElement;
        var inputElements = findInputElements(dialogElement, opt);
        this.inputElements = inputElements;
        var placeToSave = {folder: null, isFolderWritable: false, reportFolder: null, isReportFolderWritable: false};
        var saveAsTree = null;
        var reportSaveAsTree = null;
        var foldersTree = dialogElement.find(opt.foldersTreeMatcher);
        var reportFoldersTree = dialogElement.find(opt.reportFoldersTreeMatcher);
        this.foldersTree = foldersTree;
        this.reportFoldersTree = reportFoldersTree;

        function getDialogElement(options) {
            var dialogElement = jQuery(options.templateMatcher);
            if(opt.cloneTemplate) {
                dialogElement = dialogElement.clone();
            }
            if(opt.cloneTemplate && opt.elementId) {
                dialogElement.attr("id", options.elementId);
            }
            jQuery(opt.insertAfterMatcher).append(dialogElement);
            dialogElement.on("keydown", function(event) {
                if(opt.grabKeydownEvents) {
                    event.stopPropagation();
                }
                if(event.keyCode == Event.KEY_ESC) {
                    thisSaveAsDialog.close();
                }
            });
            return dialogElement
        }

        function findInputElements(dialogElement, opt) {
            var ret = {};
            for(var inputName in opt.inputMatchers) {
                if(!opt.inputMatchers.hasOwnProperty(inputName)) {
                    continue;
                }
                ret[inputName] = dialogElement.find(opt.inputMatchers[inputName]);
            }
            return ret;
        }

        function updatePlaceToSave(place) {
            var selNode;
            for(var inputName in inputElements) {
                if(!inputElements.hasOwnProperty(inputName)) {
                    continue;
                }
                place[inputName] = inputElements[inputName].val();
            }

            if (saveAsTree) {
                selNode = saveAsTree.getSelectedNode();
                if(selNode) {
                    place.folder = selNode.param.uri;
                    place.isFolderWritable = selNode.param.extra ? selNode.param.extra.isWritable : true
                } else {
                    place.folder = null;
                }
            }

            if (reportSaveAsTree) {
                selNode = reportSaveAsTree.getSelectedNode();
                if(selNode) {
                    place.reportFolder = selNode.param.uri;
                    place.isReportFolderWritable = selNode.param.extra ? selNode.param.extra.isWritable : true
                } else {
                    place.reportFolder = null;
                }
            }
        }

        function okButtonHandler(event) {
            event.stopPropagation();
            updatePlaceToSave(placeToSave);
            opt.prepareState && opt.prepareState(placeToSave);
            if(!opt.validator(placeToSave)) {
                return;
            }
            opt.saveHandler(placeToSave).then(function() {
                thisSaveAsDialog.close();
            });
        }

        function cancelButtonHandler(event) {
            event.stopPropagation();
            thisSaveAsDialog.close();
        }

        function getSaveAsTree(treeElement) {
            var foldersTreeId = treeElement.attr("id");
            var saveAsTree = dynamicTree.createRepositoryTree(foldersTreeId, {
                providerId: 'adhocRepositoryTreeFoldersProvider',
                rootUri: '/',
                organizationId: opt.organizationId,
                publicFolderUri: opt.publicFolderUri,
                urlGetNode: 'flow.html?_flowId=adhocTreeFlow&method=getNode',
                urlGetChildren: 'flow.html?_flowId=adhocTreeFlow&method=getChildren',
                treeErrorHandlerFn: function() {}
            });
//            saveAsTree.nodeTextId = foldersTreeId + "NodeText"

            var superModifyRootObject = saveAsTree.modifyRootObject;
            saveAsTree.modifyRootObject = function(rootObj, isChildrenCallback, parentNode, skipSuper){
                var children = isChildrenCallback ? rootObj : rootObj.children;
                for (var i = 0, l = children.length; i<l; i++){
                    if (!children[i].extra.isWritable) {
                        children[i].cssClass = "readonly";
                    }
                    children[i].children && saveAsTree.modifyRootObject(children[i], false, children[i], true);
                }

                if (isChildrenCallback){
                    rootObj = children;
                } else {
                    rootObj.children = children;
                }

                if (!skipSuper){
                    return superModifyRootObject.call(this, rootObj, isChildrenCallback, parentNode);
                }
            };

            return saveAsTree;
        }


        this.open = function(initialPlaceToSave) {
            placeToSave = initialPlaceToSave;

            dialogs.popup.show(dialogElement.get(0));

            for(var inputName in inputElements) {
                if(!inputElements.hasOwnProperty(inputName)) {
                    continue;
                }
                var input = inputElements[inputName];
                var value = placeToSave[inputName];
                if (input[0] && input[0].tagName.toUpperCase() === 'SELECT' && _.isArray(value)) {
                    input.empty();
                    var o;
                    _.each(value, function(v) {
                        o = new Option(v.label, v.id);
                        o.id = v.id;
                        input.append(o);
                    });
                } else {
                    input.val(placeToSave[inputName]);
                }
            }

            dialogElement.find(opt.okButtonMatcher).click(okButtonHandler);
            dialogElement.find(opt.cancelButtonMatcher).click(cancelButtonHandler);

            var deferred = jQuery.Deferred();
            var treeLoaderCounter = (placeToSave.folder && placeToSave.reportFolder) ? 0 : 1; // max two tree supported on dialog

            if (placeToSave.folder) {
                saveAsTree = getSaveAsTree(foldersTree);
                saveAsTree.showTreePrefetchNodes(placeToSave.folder, function() {
                    treeLoaderCounter ++;
                    placeToSave.folder && saveAsTree.openAndSelectNode(placeToSave.folder);
                    treeLoaderCounter === 2 && deferred.resolve();
                });
            }

            if (placeToSave.reportFolder && reportFoldersTree.length > 0) {
                reportSaveAsTree = getSaveAsTree(reportFoldersTree);
                reportSaveAsTree.showTreePrefetchNodes(placeToSave.reportFolder, function() {
                    treeLoaderCounter ++;
                    reportSaveAsTree.openAndSelectNode(placeToSave.reportFolder);
                    treeLoaderCounter === 2 && deferred.resolve();
                });
            }

            return deferred;
        };

        this.close = function() {
            dialogElement.find(opt.okButtonMatcher).unbind("click", okButtonHandler);
            dialogElement.find(opt.cancelButtonMatcher).unbind("click", cancelButtonHandler);
            dialogs.popup.hide(dialogElement.get(0));
        }
    }
})(jQuery, dynamicTree);

JRS.RepositorySelectionDialog = (function(jQuery, dynamicTree) {
    var defaultOptions = {
        idsPrefix: "repSelDialog_" ,
        templateMatcher: "#repositorySelectionDialog",
        insertAfterMatcher: "#frame",
        okButtonMatcher: ".okButton",
        cancelButtonMatcher: ".cancelButton",
        repositoryTreeMatcher: "ul.repositoryTree",
        organizationId: "",
        publicFolderUri: "/public",
        treeFlowId: "treeFlow",
        treeProviderId: "repositoryExplorerTreeFoldersProvider",
        uriOnCancel: null,
        selectionValidationMessage: "Item not selected",
        acceptOnlyLeaf: true,
        okHandler: function(selectedUri) { //default ok handler
            var deferred = jQuery.Deferred(); //use this to delay dialog close until server confirms successful save
            deferred.resolve();
            return deferred;
        }
    };

    return function(inputOptions) {
        var opt = jQuery.extend({}, defaultOptions, inputOptions);
        var thisDialog = this;

        function getDialogElement(options) {
            var dialogElement = jQuery(options.templateMatcher).clone();
            if(opt.elementId) {
                dialogElement.attr("id", options.elementId);
            }
            jQuery(opt.insertAfterMatcher).append(dialogElement);
            return dialogElement
        }

        this._createRepositoryTree = function() {
            var treeId = opt.idsPrefix+"repTree";
            this.$repositoryTree.attr("id", treeId);
            var tree = dynamicTree.createRepositoryTree(treeId, {
                providerId: opt.treeProviderId,
                rootUri: '/',
                organizationId: opt.organizationId,
                publicFolderUri: opt.publicFolderUri,
                urlGetNode: "flow.html?_flowId="+opt.treeFlowId+"&method=getNode",
                urlGetChildren: "flow.html?_flowId="+opt.treeFlowId+"&method=getChildren",
                treeErrorHandlerFn: function() {}
            });

            return tree;
        };

        function okButtonHandler(event) {
            event.stopPropagation();

            var selNode = thisDialog._repositoryTree.getSelectedNode();

            if(!selNode || opt.acceptOnlyLeaf && selNode.isParent()){
                alert(opt.selectionValidationMessage);
                return;
            }

            var okDeferred = opt.okHandler(selNode.param.uri);
            if(okDeferred) {
                okDeferred.then(function() {
                    thisDialog.close();
                });
            } else {
                thisDialog.close();
            }
        }

        function cancelButtonHandler(event) {
            event.stopPropagation();
            thisDialog.close();
            if(opt.uriOnCancel) {
                document.location=opt.uriOnCancel;
            }
        }

        this.init = function() {
            this.$dialogElement = getDialogElement(opt);
            this.$repositoryTree = this.$dialogElement.find(opt.repositoryTreeMatcher);
            this.$dialogElement.find(opt.okButtonMatcher).click(okButtonHandler);
            this.$dialogElement.find(opt.cancelButtonMatcher).click(cancelButtonHandler);
        };

        this.open = function() {
            dialogs.popup.show(this.$dialogElement.get(0), true);
            this._repositoryTree = this._createRepositoryTree();

            function processTreeNodeIcon(node) {//TODO most code copypasted from adhoc.start.js. Think of reusing
                if(node.isParent()){
                    for(var i = 0; i < node.childs.length; i++){
                        processTreeNodeIcon(node.childs[i]);
                    }
                }else{
                    if (node.param.type === 'com.jaspersoft.ji.adhoc.AdhocDataView') {
                        node.param.cssClass = "adhocDataView";
                        node.refreshStyle();
                    }
                }
            }

            var deferred = jQuery.Deferred();
            this._repositoryTree.observe("children:loaded", function(event){
                var nodes = event.memo.nodes;
                nodes.each(function(node){
                    //iterate all nodes and assign css class
                    processTreeNodeIcon(node);
                });
            });

            this._repositoryTree.showTreePrefetchNodes("/", function() {
                thisDialog._repositoryTree.openAndSelectNode("/");
                deferred.resolve();
            });
            this._repositoryTree.observe("leaf:dblclick", okButtonHandler);
            return deferred;
        };

        this.close = function() {
            dialogs.popup.hide(this.$dialogElement.get(0));
        };

        this.init(); //TODO lazily call init when user opens the dialog for the first time

    }
})(jQuery, dynamicTree);

JRS.GeneratorPropertiesDialog = (function($, jrsConf) {
    var defaultOptions = {
        id: "reportGeneratorProperties",
        treeId: "advLocationTree",
        treeFlowId: "adhocTreeFlow",
        treeProviderId: "adhocDataViewsTreeDataProvider",
        organizationId: jrsConf.organizationId,
        publicFolderUri: jrsConf.publicFolderUri,
        advUri: undefined,
        reportGenerators: null,
        messages: {}
    };

    var Dialog = function(options) {
        this.opts = jQuery.extend({}, defaultOptions, options);
        this.template = $("#" + this.opts.id);
        this.customGenerators = jrsConf.commonReportGeneratorsMetadata || [];

        if(_.isUndefined(this.opts.advUri)) {
            $("#advTreePanel").removeClass(layoutModule.HIDDEN_CLASS);
            $("#reportGeneratorProperties").addClass(Dialog.WITH_TREE_CLASS);
            this._tree = createRepositoryTree(this.opts);
        } else {
            $("#reportGeneratorProperties").removeClass(Dialog.WITH_TREE_CLASS)
        }
        this._generatorSelect = new JRS.generatorSelect({
            id: 'commonGeneratorSelect',
            parent: this.template.get(0),
            reportGenerators: this.customGenerators
        });
    };

    Dialog.WITH_TREE_CLASS = "withTree";
    Dialog.NO_GENERATORS_CLASS = layoutModule.NO_GENERATORS_CLASS;
    Dialog.fn = Dialog.prototype;

    Dialog.fn.show = function() {
        enableSelection(this.selectionContainer);
        if (this.customGenerators.length === 0) {
            this.template.addClass(Dialog.NO_GENERATORS_CLASS);
        }

        dialogs.popup.show(this.template.get(0), true);
        this.registerEvents();

        var lastValue = store();
        if (lastValue) {
            if (lastValue.template) {
                this._generatorSelect.val(lastValue.template, 'TEMPLATE')
            } else if (lastValue.generator) {
                this._generatorSelect.val(lastValue.generator, 'GENERATOR')
            }
        }

        var uri = lastValue && lastValue.sourceURI ? lastValue.sourceURI : "/";
        var tree = this._tree;
        tree && tree.showTreePrefetchNodes(uri, function() {
            lastValue && tree.openAndSelectNode(uri);
        });
    };

    var store = Dialog.fn.store = function(value) {
        var myStorage = window.localStorage;
        if(myStorage) {
            if(value) {
                myStorage.setItem('reportGenerator', JSON.stringify(value));
            } else {
                var res = myStorage.getItem('reportGenerator');
                return res ? JSON.parse(res) : null;
            }
        } else {
            return null;
        }
    };

    var ok = Dialog.fn.ok = function() {
        var value = this.getValue();

        if (_.isUndefined(value.sourceURI)) {
            alert(this.getMessage("advNotSelected"));
        } else if(_.isEmpty(value.template) && this._generatorSelect.state === 'TEMPLATE') {
            alert(this.getMessage("templateNotSelected"));
        } else {
            store(value);
            this.opts.okHandler && this.opts.okHandler(value);
            this.close();
        }
    };

    var close = Dialog.fn.close = function() {
        this.unregisterEvents();
        disableSelectionWithoutCursorStyle(this.selectionContainer);
        dialogs.popup.hide(this.template.get(0));
        return this;

    };

    Dialog.fn.getMessage = function(key) {
        return this.opts.messages[key];
    };

    Dialog.fn.getValue = function() {
        var advUri = this.opts.advUri;

        if(_.isUndefined(advUri)) {
            var node = this._tree.getSelectedNode();
            var isFile = node && (node.param.type == "com.jaspersoft.ji.adhoc.AdhocDataView");
            if (isFile) {
                advUri = node.param.uri;
            }
        }

        var data = {sourceURI: advUri};

        if (this._generatorSelect.state === 'TEMPLATE') {
            data.template = this._generatorSelect.val();
        }
        if (this._generatorSelect.state === 'GENERATOR') {
            data.generator = this._generatorSelect.val();
        }

        return data;
    };
    // We are going to use same dom, so make we need make sure unregister is called on close
    Dialog.fn._eventsAreRegistered = false;
    Dialog.fn.registerEvents = function() {
        if (this._eventsAreRegistered === true) {
            return;
        }
        $('#reportGeneratorPropertiesBtnOk', this.template).on('click', $.proxy(ok, this));
        $('#reportGeneratorPropertiesBtnCancel', this.template).on('click', $.proxy(close, this));
        this._eventsAreRegistered = true;
    };

    Dialog.fn.unregisterEvents = function() {
        if (this._eventsAreRegistered === false) {
            return;
        }
        $('#reportGeneratorPropertiesBtnOk', this.template).off('click');
        $('#reportGeneratorPropertiesBtnCancel', this.template).off('click');
        this._eventsAreRegistered = false;
    };

    function createRepositoryTree(opt) {
        var tree = dynamicTree.createRepositoryTree(opt.treeId, {
            providerId: opt.treeProviderId,
            rootUri: '/',
            organizationId: opt.organizationId,
            publicFolderUri: opt.publicFolderUri,
            urlGetNode: "flow.html?_flowId="+opt.treeFlowId+"&method=getNode",
            urlGetChildren: "flow.html?_flowId="+opt.treeFlowId+"&method=getChildren",
            treeErrorHandlerFn: function() {}
        });

        return tree;
    }

    return Dialog;
})(jQuery, __jrsConfigs__);

JRS.generatorSelect = (function($, _, jrsConf) {
    var defaults = {
        id: "generatorSelect",
        defaultRadioIdPrefix: "DefaultTemplateRadio",
        customTemplateRadioIdPrefix: "CustomTemplateRadio",
        customGeneratorRadioIdPrefix: "CustomGeneratorRadio",
        reportGenerators: [{'id': 'custom', label: 'Custom'}],
        treeId: "templateLocationTree",
        treeFlowId: "adhocTreeFlow",
        treeProviderId: "templateTreeDataProvider",
        organizationId: jrsConf.organizationId,
        publicFolderUri: jrsConf.publicFolderUri
    };

    var switchType = 'radio';

    var Control = function(options) {
        this.StateContract = {};

        this.options = jQuery.extend({}, defaults, options);
        this.template = getTemplate(this);
        this.state = 'DEFAULT';

        // internally we maintain three arrays for radios, inputs and states (abstraction over available options)
        // we elemnts in the array
        registerRadiosAndCorrespondingInputs(this);
        registerStates(this);
        registerGeneratorOptions(this, this.options.reportGenerators);
        registerEvents(this);

        this.refresh();
    };

    Control.fn = Control.prototype;

    /**
     * Describes all possible states of control
     * index property corresponds to the known radio
     *
     * This object used as prototype for StateContract (trough deep cloning)
     *
     * @type {{DEFAULT: {index: number}, TEMPLATE: {index: number}, GENERATOR: {index: number}}}
     */
    Control.StateContractPrototype = {
        DEFAULT: {index: 0},
        TEMPLATE: {index: 1},
        GENERATOR: {index: 2}
    };


    /**
     * Returns current value of the control if value parameter is omitted.
     *
     * @param newValue should match contract defined in Control.State
     * @param state should match to one of defined in Control.StateContractPrototype
     *
     * inst.val("custom-id")
     * inst.val("/path/to/template", 'GENERATOR')
     *
     * inst.val() // --> "/path/to/template"
     */
    Control.fn.val = function(value, newState) {
        var stateContract = this.StateContract[this.state];

        if (_.isString(value)) {

            if (_.isString(newState) && _.has(this.StateContract, newState)) {
                stateContract = this.StateContract[newState];
            }


            selectRadio(this._radios[stateContract.index]);
            updateInput(this._inputs[stateContract.index], value);

            this.refresh();
        } else {
            return inputValue(this._inputs[stateContract.index]);
        }
    };

    /**
     * updates internal state of the control according the DOM changes
     * for each radio there should be corresponding input in the _inputs list and state in _states list
     */
    Control.fn.refresh = function() {
        for(var i = 0; i < this._radios.length; i++) {
            if (this._radios[i].checked) {
                enableInput(this._inputs[i]);

                this.state = this._states[i];
            } else {
                disableInput(this._inputs[i]);
            }
        }
    };

    Control.fn.hide = function() {
        this.template.addClass('hidden');
    };

    Control.fn.show = function() {
        this.template.removeClass('hidden');
    };

    function getTemplate(instance) {
        return $("#" + instance.options.id);
    }

    // look for all radios and corresponding inputs related to this controls
    function registerRadiosAndCorrespondingInputs(instance) {
        instance._radios = $("#" + instance.options.id + " input[type=" + switchType + "]").get();

        var countOfRadios = instance._radios.length;

        instance._inputs = new Array(countOfRadios);
        for (var i = 0; i < countOfRadios; i++) {
            var radioId = instance._radios[i].id;
            var inputId = radioId.replace(capitalize(switchType), "");
            var input = $('#' + inputId);
            input.length > 0 && (instance._inputs[i] = input[0]);
        }
    }

    // creates an State hash for this control
    // and array of corresponding control states for each found radio
    function registerStates(instance) {
        instance.StateContract = {};
        instance._states = new Array(instance._radios.length);

        var index = 0;
        for (var state in Control.StateContractPrototype) {
            var instanceState = _.clone(Control.StateContractPrototype[state], true);
            instanceState.index = index;

            instance.StateContract[state] = instanceState;
            instance._states[index] = state;

            index ++;
        }
    }

    function registerGeneratorOptions(instance, values) {
        var generatorContract = instance.StateContract['GENERATOR'];
        var select = $(instance._inputs[generatorContract.index]);

        if (values && values.length > 0) {
            select.parents("li").removeClass("hidden");
            _.each(values, function(value) {
                select.append($("<option />").val(value.id).text(value.label));
            });
        } else {
            select.parents("li").addClass("hidden")
        }
    }

    function registerEvents(instance) {
        instance.template.on('click', function(evt) {
            if (isRadio(evt.target)) {
                instance.refresh();

            } else if (isButton(evt.target)) {
                browseHandler(instance);
            }
        });
    }

    function isRadio(element) {
        return element.type
            ? element.type === 'radio' // if element is radio input
            : (element.control && element.control.type == 'radio'); // if element is label of radio
    }

    function isButton(element) {
        return (element.type && element.type == 'button') ||
            (element.tagName === 'SPAN' && element.parentNode.type == 'button');
    }

    function isSelectOption(element) {
        return (element.tagName === 'OPTION');
    }

    function selectRadio(element) {
        $(element).attr('checked', 'checked');
    }

    function disableInput(element) {
        element = $(element);
        var parent = element.parent();

        element.attr('disabled', 'disabled');
        parent.find("button").attr('disabled', 'disabled')
    }

    function enableInput(element) {
        element = $(element);
        var parent = element.parent();

        element.attr('disabled', null);
        parent.find("button").attr('disabled', null)
    }

    function updateInput(element, value) {
        $(element).val(value);
    }

    function inputValue(element) {
        return $(element).val();
    }

    function browseHandler(instance) {
        var generatorContract = instance.StateContract[instance.state];
        var input = instance._inputs[generatorContract.index];

        if (!instance._dialog) {
            instance._dialog = new JRS.TemplateDialog({
                id: instance.options.id + "TemplateDialog",
                parent: instance.options.parent,
                okHandler: function(uri) {
                    updateInput(input, uri);
                }
            });
        }

        instance._dialog && instance._dialog.show(inputValue(input));
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return Control;
})(jQuery, window._, __jrsConfigs__);

JRS.TemplateDialog = (function($, jrsConf) {
    var defaultOptions = function () { return {
        treeId: "TemplateTree",
        treeFlowId: "adhocTreeFlow",
        treeProviderId: "templateTreeDataProvider",
        organizationId: jrsConf.organizationId,
        publicFolderUri: jrsConf.publicFolderUri,
        defaultTemplateUri: jrsConf.defaultTemplateUri
    }};

    var Dialog = function(options) {
        this.opts = jQuery.extend({}, defaultOptions(), options);
        this.opts.treeId = this.opts.id + "Tree";
        this.template = $('#' + this.opts.id);

        this._tree = createRepositoryTree(this.opts);
    };

    Dialog.fn = Dialog.prototype;

    Dialog.fn.show = function(uri) {
        dialogs.childPopup.show(this.template.get(0), true, this.opts.parent);
        this.registerEvents();
        var defaultUri = this.opts.defaultTemplateUri || "/";
        var tree = this._tree;
        tree.showTreePrefetchNodes(uri || defaultUri, function() {
            tree.openAndSelectNode(uri || defaultUri);
        });
    };

    var ok = Dialog.fn.ok = function() {
        var node = this._tree.getSelectedNode();
        var isFile = node && (node.param.type === "com.jaspersoft.jasperserver.api.metadata.common.domain.FileResource");
        if (isFile) {
            this.opts.okHandler && this.opts.okHandler(node.param.uri);
            this.close();
        }
    };

    var close = Dialog.fn.close = function() {
        disableSelectionWithoutCursorStyle(this.selectionContainer);
        this.unregisterEvents();
        dialogs.childPopup.hide(this.template.get(0));
        return this;
    };

    Dialog.fn._eventsAreRegistered = false;
    Dialog.fn.registerEvents = function() {
        if (this._eventsAreRegistered === true) {
            return;
        }
        $('#' + this.opts.id + 'OkTemplate', this.template).on('click', $.proxy(ok, this));
        $('#' + this.opts.id + 'CloseTemplate', this.template).on('click', $.proxy(close, this));
        this._eventsAreRegistered = true;
    };

    Dialog.fn.unregisterEvents = function() {
        if (this._eventsAreRegistered === false) {
            return;
        }
        $('#' + this.opts.id + 'OkTemplate', this.template).off('click');
        $('#' + this.opts.id + 'CloseTemplate', this.template).off('click');
        this._eventsAreRegistered = false;
    };

    function createRepositoryTree(opt) {
        var tree = dynamicTree.createRepositoryTree(opt.treeId, {
            providerId: opt.treeProviderId,
            rootUri: '/',
            organizationId: opt.organizationId,
            publicFolderUri: opt.publicFolderUri,
            urlGetNode: "flow.html?_flowId="+opt.treeFlowId+"&method=getNode",
            urlGetChildren: "flow.html?_flowId="+opt.treeFlowId+"&method=getChildren",
            treeErrorHandlerFn: function() {}
        });

        return tree;
    }

    return Dialog;
})(jQuery, __jrsConfigs__);
