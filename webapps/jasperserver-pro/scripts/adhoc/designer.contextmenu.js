/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

/*
 * used to show dynamic menu based on context
 * @param event
 * @param updateContextActionModel optional method which
 *  will be called to have ability to change context action model
 */

define(function(require) {

    var adhocDesigner = require("adhoc/designer"),
        designerLabelActions = require("adhoc/designer.label.actions"),
        designerFieldActions = require("adhoc/designer.field.actions"),
        designerTreeActions = require("adhoc/designer.tree.actions"),
        designerReportActions = require("adhoc/designer.report.actions"),
        designerAjax = require("adhoc/designer.ajax"),
        designerHelpers= require("adhoc/designer.helpers"),
        designerInit = require("adhoc/designer.init"),
        designerObservers = require("adhoc/designer.observers"),
        designerSelection = require("adhoc/designer.selection"),
        designwerObsolete = require("adhoc/designer.obsolete");

    adhocDesigner.showDynamicMenu = function(event, contextLevel, coordinates, updateContextActionModel){
        //in case we are dealing with multi-select get last item
        var position = selObjects.length;
        if (position > 0) {
            var selected = selObjects[position - 1];
            if(selected && selected.menuLevel) selected.menuLevel = contextLevel;
        }
        actionModel.showDynamicMenu(contextLevel, event, null, coordinates, localContext.state.actionmodel, updateContextActionModel);
    };

    adhocDesigner.contextMenuHandler = function(event) {
        var matched = null;
        var node = event.memo.node;
        var evt = event.memo.targetEvent;

        localContext.contextMenuHandler && localContext.contextMenuHandler(evt);
    };

    return adhocDesigner;
});