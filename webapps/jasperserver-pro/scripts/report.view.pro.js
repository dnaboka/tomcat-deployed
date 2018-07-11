/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global Report, alert, dialogs, confirm, console, isValidJsonResponse,
    baseErrorHandler, AjaxRequester, ajaxTargettedUpdate, appendPostData,
    buttonManager, jasperreports, dynamicTree
*/

function SaveAsDialog(inputOptions, saveHandler) {
    //TODO reuse dialog from dialog.definitions.js
    var defaultOptions = {
        templateMatcher: "#saveAs",
        insertAfterMatcher: "#frame",
        cloneTemplate: false,
        elementId: null,
        okButtonMatcher: "#saveAsBtnSave",
        cancelButtonMatcher: "#saveAsBtnCancel",
        nameInputMatcher: "#saveAsInputName",
        descriptionInputMatcher: "#saveAsInputDescription",
        foldersTreeId: "saveAsFoldersTree"

    }
    var opt = jQuery.extend({}, defaultOptions, inputOptions);
    var thisSaveAsDialog = this;
    var dialogElement = null;
    var placeToSave = {folder: null, name: null, description: null};
    var saveAsTree = null;

    function getDialogElement(options) {
        var dialogElement = jQuery(options.templateMatcher);
        if(opt.cloneTemplate) {
            dialogElement = this.dialogElement.clone();
        }
        if(opt.elementId) {
            dialogElement.attr("id", options.elementId);
        }
        jQuery(opt.insertAfterMatcher).append(dialogElement);
        return dialogElement
    }

    function updatePlaceToSave(place) {
        place.name = dialogElement.find(opt.nameInputMatcher).val();
        place.description = dialogElement.find(opt.descriptionInputMatcher).val();
        var selNode = saveAsTree.getSelectedNode();
        if(selNode)
            place.folder = selNode.param.uri;
        else
            place.folder = null;
    }

    function validate(placeToSave) {
        if(!placeToSave.name) {
            alert(Report.getMessage("jasper.report.view.save.missing.name"));
            return false;
        }
        if(!placeToSave.folder) {
            alert(Report.getMessage("jasper.report.view.save.missing.folder"));
            return false;
        }
        return true;
    }

    function okButtonHandler(event) {
        updatePlaceToSave(placeToSave);
        if(!validate(placeToSave)) {
            return;
        }
        saveHandler(placeToSave).then(function() {
            event.stopPropagation();
            thisSaveAsDialog.close();
        });
    }

    function cancelButtonHandler(event) {
        event.stopPropagation();
        thisSaveAsDialog.close();
    }

    function getSaveAsTree() {
        var saveAsTree = dynamicTree.createRepositoryTree(opt.foldersTreeId, {
            providerId: 'adhocRepositoryTreeFoldersProvider',
            rootUri: '/',
            organizationId: Report.organizationId,
            publicFolderUri: Report.publicFolderUri,
            urlGetNode: 'flow.html?_flowId=adhocTreeFlow&method=getNode',
            urlGetChildren: 'flow.html?_flowId=adhocTreeFlow&method=getChildren',
            treeErrorHandlerFn: function() {}
        });

        var superModifyRootObject = saveAsTree.modifyRootObject;
        var setReadOnly = saveAsTree.modifyRootObject = function(rootObj, isChildrenCallback, parentNode, skipSuper){
            var children = isChildrenCallback ? rootObj : rootObj.children;
            for (var i = 0, l = children.length; i<l; i++){
                if (!children[i].extra.isWritable) {
                    children[i].cssClass = "readonly";
                }
                children[i].children && setReadOnly(children[i], false, children[i], true);
            }

            if (isChildrenCallback){
                rootObj = children;
            } else {
                rootObj.children = children;
            }

            if (!skipSuper){
                return superModifyRootObject.call(this, rootObj, isChildrenCallback, parentNode);
            }
        }

        return saveAsTree;
    }

    this.open = function(placeToSave) {
        if(!placeToSave.folder) {
            placeToSave.folder = "/";
        }

        dialogElement = getDialogElement(opt);
        dialogs.popup.show(dialogElement.get(0));
        dialogElement.find(opt.nameInputMatcher).val(placeToSave.name);
        dialogElement.find(opt.descriptionInputMatcher).val(placeToSave.description);
        dialogElement.find(opt.nameInputMatcher).focus();
        dialogElement.find(opt.okButtonMatcher).click(okButtonHandler);
        dialogElement.find(opt.cancelButtonMatcher).click(cancelButtonHandler);

        saveAsTree = getSaveAsTree();

        saveAsTree.observe("node:selected", function (event) {
            try {
                dialogElement.find(opt.okButtonMatcher)[0].disabled = !event.memo.node.param.extra.isWritable;
            }
            catch (e) {
                dialogElement.find(opt.okButtonMatcher)[0].disabled = true;
                console && console.log("report.view.pro[this.open] - " + e);
            }
        });

        saveAsTree.showTreePrefetchNodes(placeToSave.folder, function() {
            saveAsTree.openAndSelectNode(placeToSave.folder);
        });
    }

    this.close = function() {
        dialogElement.find(opt.okButtonMatcher).unbind("click", okButtonHandler);
        dialogElement.find(opt.cancelButtonMatcher).unbind("click", cancelButtonHandler);
        dialogs.popup.hide(dialogElement.get(0));
    }
}

Report.jsonErrorHandler = function(ajaxAgent) {
    if (!isValidJsonResponse(ajaxAgent)) {
        var handled = baseErrorHandler(ajaxAgent);
        if (!handled) {
            // this shouldn't normally happen
            alert("Unexpected response");
        }
        return true;
    }
    return false;
}

Report.save = function() {
    if(Report.isUriTmp(Report.reportUnitURI)) {
        return Report.saveAs();
    }

	var params = {
		_flowExecutionKey: Report.reportExecutionKey(),
		_eventId: 'saveReport'
	};
    if (Report.newIcOrder){
        params.inputControlOrder = Report.newIcOrder;
    }
	
	var url = 'flow.html?' + Object.toQueryString(params);
	
	var self = this;
	var options = {
		mode: AjaxRequester.prototype.EVAL_JSON,
		errorHandler: Report.jsonErrorHandler,
		callback: function(jsonResponse) {
			if (jsonResponse.flowExecutionKey) {
				Report.flowExecutionKeyOutput = jsonResponse.flowExecutionKey;
			}

            if (jsonResponse.response && jsonResponse.response.status == 'success') {
                dialogs.systemConfirm.show(Report.getMessage(jsonResponse.response.msg), 5000);
            } else if (jsonResponse.response && jsonResponse.response.status == 'failure') {
                if (Report.newIcOrder) {
                    dialogs.systemConfirm.show(Report.getMessage(jsonResponse.response.msg), 5000);
                } else if (jsonResponse.response.msg == 'cluster.exception.session.attribute.missing.popup') {
                    dialogs.clusterErrorPopup.show(jsonResponse.response.msg);
                } else {
                    dialogs.errorPopup.show(Report.getMessage(jsonResponse.response.msg));
                }
            }
            Report.savedState = jasperreports.reportviewertoolbar.currentState();
            Report.snapshotSaveStatus = null;
            Report.newIcOrder = false;
		}
	};

	ajaxTargettedUpdate(url, options);
}

Report.doSaveAs = function(location, overwrite) {
	var params = {
		_flowExecutionKey: Report.reportExecutionKey(),
		_eventId: 'saveReportAs',
		folder: location.folder,
		name: location.name,
		description: location.description,
		overwrite: overwrite
	};

    if (Report.newIcOrder){
        params.inputControlOrder = Report.newIcOrder;
    }
	
	var self = this;
	var options = {
		mode: AjaxRequester.prototype.EVAL_JSON,
		postData: appendPostData("", params),
		errorHandler: Report.jsonErrorHandler,
		callback: function(jsonResponse) {
			var status = jsonResponse.response.status;
			switch(status) {
			case "success":
				if (jsonResponse.flowExecutionKey) {
					Report.flowExecutionKeyOutput = jsonResponse.flowExecutionKey;
				}

				var previousLabel = Report.reportLabel;
				Report.reportUnitURI = jsonResponse.response.copyURI;
				Report.reportLabel = location.name;
				Report.reportDescription = location.description;
				
				document.title = Report.replaceSingleOccurrence(document.title, previousLabel, Report.reportLabel);
				jQuery('#reportViewFrame .title').each(function(i, element) {
					var jElement = jQuery(element);
					var origHtml = jElement.html();
					var replacedHtml = Report.replaceSingleOccurrence(origHtml, previousLabel, Report.reportLabel);
					if (replacedHtml != origHtml) {
						jElement.text(replacedHtml);
					}
				});
				
				buttonManager.disable('undo');
				buttonManager.disable('redo');
				buttonManager.disable('undoAll');

				dialogs.systemConfirm.show(Report.getMessage(jsonResponse.response.msg), 5000);
				
	            Report.savedState = jasperreports.reportviewertoolbar.currentState();
	            Report.snapshotSaveStatus = null;
                if (Report.newIcOrder){
                    Report.newIcOrder = false;
                }
				break;
            case "failure":
                if (jsonResponse.response.msg == 'cluster.exception.session.attribute.missing.popup') {
                    dialogs.clusterErrorPopup.show(jsonResponse.response.msg);
                } else {
                    dialogs.errorPopup.show(Report.getMessage(jsonResponse.response.msg));
                }
                break;
			case "confirmOverwrite":
				if (confirm(Report.getMessage(jsonResponse.response.msg))) {
					Report.doSaveAs(location, true);
				}
				break;
			}
		}
	};
	
	var url = 'flow.html';
	ajaxTargettedUpdate(url, options);
};

Report.replaceSingleOccurrence = function(text, value, replacement) {
	var firstIdx = text.indexOf(value);
	// only replace if the value occurs a single time
	if (firstIdx < 0 || text.indexOf(value, firstIdx + 1) >= 0) {
		return text;
	}
	return text.replace(value, replacement);
};

/**
 * Split uri into folder and file parts
 *
  * @param uri
 */
Report.uriToParts = function(uri) {
    var ret = {name: null, folder: null};
    var lastSlash = uri.lastIndexOf("/");
    if(lastSlash < 0) {
        ret.name = uri;
    } else if(lastSlash == 1) {
        ret.folder = "/";
        ret.name = uri.substring(1);
    } else {
        ret.folder = uri.substring(0, lastSlash);
        ret.name = uri.substring(lastSlash+1);
    }
    return ret;
};

Report.uriToFolder = function(uri) {
    var folder;
    var lastSlash = uri.lastIndexOf("/");
    if(lastSlash < 0) {
        folder = null;
    } else if(lastSlash == 1) {
        folder = "/";
    } else {
        folder = uri.substring(0, lastSlash);
    }
    return folder;
};

Report.isUriTmp = function(uri) {
    var ret = uri.indexOf(Report.tempFolderUri) === 0;
    return ret;
};

Report.saveAs = function() {
    if(Report.saveAsDialog === undefined) {
        Report.saveAsDialog = new SaveAsDialog({/* use default options*/}, function(location) {
        	Report.doSaveAs(location, false);
        	
            //TODO update container title: .reportViewFrame .content .header .title
            var deferred = jQuery.Deferred(); //use this to delay dialog close until server confirms successful save
            deferred.resolve();
            return deferred;
        });
    }

    var uri = Report.reportUnitURI;
    if (Report.isUriTmp(uri) && Report.allRequestParameters && Report.allRequestParameters.advUri && Report.allRequestParameters.advUri[0]) {
        uri = Report.allRequestParameters.advUri[0];
    }

    var location = {
    	name: Report.reportLabel,
    	folder: Report.uriToFolder(uri),
    	description: Report.reportDescription
    };
    Report.saveAsDialog.open(location);
};

Report.refreshSave = function() {
	var success = (Report.lastPageIndex != null);
	success 
		? buttonManager.enable($('fileOptions'))
		: buttonManager.disable($('fileOptions'));
		
	if (success && Report.snapshotSaveStatus == 'NEW' && !Report.snapshotSaved) {
		// automatically saving the snapshot
		Report.snapshotSaveStatus = null;
		Report.snapshotSaved = true;
		
		window.setTimeout(Report.autoSaveSnapshot, 200);
	}
}

Report.confirmExit = function() {
	if (Report.reportRunning) {
		return confirm(Report.getMessage("jasper.report.view.in.progress.confirm.leave"));
	}
	
	if ((Report.savedState && Report.savedState != jasperreports.reportviewertoolbar.currentState())
			|| (Report.lastPageIndex != null && Report.snapshotSaveStatus == 'UPDATED')) {
		return confirm(Report.getMessage("jasper.report.view.confirmLeave"));
	}
	
	return true;
}

Report.reportRefreshedOrig = Report.reportRefreshed;

Report.reportRefreshed = function() {
	Report.reportRefreshedOrig();
	
	if (!Report.savedState) {
		Report.savedState = jasperreports.reportviewertoolbar.currentState();
	}
}

Report.autoSaveSnapshot = function() {
	var params = {
		_flowExecutionKey: Report.reportExecutionKey(),
		_eventId: 'saveReportDataSnapshot'
	};
	
	var url = 'flow.html?' + Object.toQueryString(params);
	
	var self = this;
	var options = {
		mode: AjaxRequester.prototype.EVAL_JSON,
		silent: true,//silent
		// automatic save, do not show any errors
		errorHandler: function(ajaxAgent) {
			return !isValidJsonResponse(ajaxAgent);
		},
		callback: function(jsonResponse) {
			if (jsonResponse.flowExecutionKey) {
				Report.flowExecutionKeyOutput = jsonResponse.flowExecutionKey;
			}
		}
	};

	ajaxTargettedUpdate(url, options);
}
