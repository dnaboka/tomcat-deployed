/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

define(function(require) {

    var adhocDesigner = require("adhoc/designer"),
        LayoutManager = require("adhoc/layout.manager"),
        _ = require("underscore"),
        underscoreString = require("underscore.string"),
        dialogDefinitions = require("dialog.definitions");

    function setDefaultWidthIfMissing(panelId, width) {
        var restoredWidth = parseInt(layoutModule.getPanelWidth(panelId), 10);
        if (!restoredWidth) {
            layoutModule.storePanelWidth(panelId, width);
        }
    }

    adhocDesigner.layoutManagerProperties = {
        table : function() {
            return {
                axes : [
                    { name : 'column', elementId : 'olap_columns'},
                    { name : 'group', elementId : 'olap_rows'}
                ],
                common : {
                    mode : 'table',
                    id : adhocDesigner.DISPLAY_MANAGER_ID
                }
            }
        },
        crosstab : function(isOlap) {
            return {
                axes : [
                    { name : 'column', elementId : 'olap_columns'},
                    { name : 'row', elementId : 'olap_rows', isDependent: !!isOlap}
                ],
                common : {
                    mode : 'crosstab',
                    id : adhocDesigner.DISPLAY_MANAGER_ID,
                    measuresGroupId : 'Measures',
                    isOlapMode : !!isOlap
                }
            };
        },
        olap_crosstab : function() {
            return adhocDesigner.layoutManagerProperties.crosstab(true);
        },
        ichart: function(isOlap) {
            return {
                axes : [
                    { name : 'column', elementId : 'olap_columns'},
                    { name : 'row', elementId : 'olap_rows', isDependent: !!isOlap}
                ],
                common : {
                    mode : 'crosstab',
                    id : adhocDesigner.DISPLAY_MANAGER_ID,
                    measuresGroupId : 'Measures',
                    isOlapMode : !!isOlap
                }
            };
        },
        olap_ichart : function() {
            return adhocDesigner.layoutManagerProperties.crosstab(true);
        },
        // TODO remove this obsolete type
        chart : function() {
            return {
                axes : [
                    { name : 'measures', elementId : 'olap_columns'},
                    { name : 'group', elementId : 'olap_rows'}
                ],
                common : {
                    mode : 'chart',
                    id : adhocDesigner.DISPLAY_MANAGER_ID
                }
            };
        }
    };
    adhocDesigner.initTitle = function() {
        var title = window.isEmbeddedDesigner ? embeddedName : saveLabel;
        if (!_.isBlank(title)) {
            adhocDesigner.ui.header_title.text(title);
        }
    };

    adhocDesigner.initLayoutManager = function(mode){
        var props = adhocDesigner.layoutManagerProperties[mode]();
        adhocDesigner.ui.display_manager = new LayoutManager(props);
        adhocDesigner.observeDisplayManagerEvents();
    };

    adhocDesigner.initDialogs = function(){
        isDesignView && adhocReentrance.initialize();
        adhocSort.initialize();
        adhocDesigner.initViewQueryDialog();
        adhocDesigner.initSaveConfirmationDialog();
        adhocDesigner.initDeleteCalculatedFieldConfirmationDialog();
        adhocDesigner.addConfirmDialog = new jaspersoft.components.ConfirmDialog({
            messages : [
                adhocDesigner.messages["ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_1"],
                adhocDesigner.messages["ADH_1216_DIMENSION_HIERARCHY_ADD_WARNING_2"]
            ]
        });

    };

    adhocDesigner.initSaveConfirmationDialog = function() {
        var confirmDialog = jQuery("#standardConfirm").clone();
        confirmDialog.attr('id', adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.DIALOG_ID);
        confirmDialog.find('.body').text(adhocDesigner.messages.ADH_1236_SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION);
        confirmDialog.find('.button.action.up').attr('id', adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID);
        confirmDialog.find('.button.action.primary.up').attr('id', adhocDesigner.SAVE_WITHOUT_FILTERS_APPLY_CONFIRMATION_DIALOG.OK_BUTTON_ID);
        confirmDialog.find('.button.action.primary.up .wrap').text(adhocDesigner.messages.ADH_1237_IGNORE);
        confirmDialog.appendTo(jQuery("#frame .content:eq(0)"));
    };

    adhocDesigner.initDeleteCalculatedFieldConfirmationDialog = function() {
        var confirmDialog = jQuery("#standardConfirm").clone();
        confirmDialog.attr('id', adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.DIALOG_ID);
        confirmDialog.find('.body').text(adhocDesigner.messages.ADH_436_CALCULATED_FIELD_REMOVE_CONFIRM);
        confirmDialog.find('.button.action.up').attr('id', adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.CANCEL_BUTTON_ID);
        confirmDialog.find('.button.action.primary.up').attr('id', adhocDesigner.DELETE_CALCULATED_FIELD_CONFIRMATION_DIALOG.OK_BUTTON_ID);
        confirmDialog.appendTo(jQuery("#frame .content:eq(0)"));
    };
    
    adhocDesigner.initViewQueryDialog = function() {
        adhocDesigner.viewQueryDialog = new JRS.ViewQueryDialog({id: "#queryViewer", content: "", selectionContainer: $('designer')});
    };

    adhocDesigner.initFieldsPanel = function(onInit){
        if (!isDesignView) {
            return;
        }
        var it = adhocDesigner;
        if(onInit) {
            Event.observe($('topicMutton'), 'mouseover', function(evt) {
                actionModel.showDynamicMenu("topicMenu", evt, null, null, localContext.state.actionmodel);
    
                $("menu").clonePosition($('topicMutton'), {"setWidth" : false, "setHeight": false, "offsetTop" : 5});
    
                Event.stop(evt);
    
                Event.observe($('menu'), 'mouseleave', function() {
                    this.showButtonMenuMouseOut($('menu'));
                }.bind(this));
            }.bind(adhocDesigner));
    
            if (!adhocDesigner.isOlapMode()) {
                Event.observe($('availableFieldsMutton'), 'mouseover', function(evt) {
                    actionModel.showDynamicMenu("availableFieldsMenu", evt, null, null, localContext.state.actionmodel);
    
                    $("menu").clonePosition($('availableFieldsMutton'), {"setWidth" : false, "setHeight": false, "offsetTop" : 5});
    
                    Event.stop(evt);
    
                    Event.observe($('menu'), 'mouseleave', function() {
                        this.showButtonMenuMouseOut($('menu'));
                    }.bind(this));
                }.bind(adhocDesigner));
    
                Event.observe($('availableMeasuresMutton'), 'mouseover', function(evt) {
                    actionModel.showDynamicMenu("availableMeasuresMenu", evt, null, null, localContext.state.actionmodel);
    
                    $("menu").clonePosition($('availableMeasuresMutton'), {"setWidth" : false, "setHeight": false, "offsetTop" : 5});
    
                    Event.stop(evt);
    
                    Event.observe($('menu'), 'mouseleave', function() {
                        this.showButtonMenuMouseOut($('menu'));
                    }.bind(this));
                }.bind(adhocDesigner));
            }
        }

        var k;
        var trees = {
            dimensions: {
                name: 'dimensionsTree',
                className: 'dimension',
                domId: it.DIMENSIONS_TREE_DOM_ID,
                providerId: it.DIMENSIONS_TREE_PROVIDER_ID
            },
            measures: {
                name: 'measuresTree',
                className: 'measure',
                domId: it.MEASURES_TREE_DOM_ID,
                providerId: it.MEASURES_TREE_PROVIDER_ID
            }
        };

        for (k in trees) {
            var tree = $(trees[k].domId);
            if (tree) {
                var children = tree.childElements();
                children.each(function(object) {
                    object.remove();
                });
            }
            it[trees[k].name] = it.getAvailableFieldsTree(trees[k].domId, trees[k].providerId);
            /*
             * Tree customizations
             */
            var nodeUri = window.localStorage ? localStorage.getItem(it._cookieName) : undefined;
            it._availableTreeLastOpened = nodeUri && nodeUri.length > 0 ? nodeUri : "/";
            it[trees[k].name].DEFAULT_TREE_CLASS_NAME = "responsive fields";
            it[trees[k].name].multiSelectEnabled = !adhocDesigner.isOlapMode();
            it[trees[k].name].dragClasses = trees[k].className;
            it[trees[k].name].setDragStartState = function(tree) {
                return function(node, draggable, event) {
                    adhocDesigner.setDragStartState(tree, node, draggable, event);
                    selectionCategory.area = designerBase.AVAILABLE_FIELDS_AREA;
                    localContext.canAddFilter && localContext.canAddFilter(node) && draggable.element.addClassName("supportsFilter");
                }
            }(it[trees[k].name]);


            if (isIPad()) {
                tree = document.getElementById(trees[k].domId);
                new TouchController(tree, tree.parentNode, {scrollbars: true});
            }

            //Create search component for this tree
            (function(name) {
                require(["./DynamicTreeSearch"], function(DynamicTreeSearch) {
                    var search = new DynamicTreeSearch({
                        tree: it[name],
                        depth: adhocDesigner._AVAILABLE_TREE_DEPTH,
                        keyword: ""
                    });

                    jQuery(".j-" + name + "-search").append(search.el);

                    it[name + "Search"] = search;
                });
            })(trees[k].name);
        }
        it.observeTreeEvents(it['dimensionsTree'],it['measuresTree']);
        it.observeTreeEvents(it['measuresTree'],it['dimensionsTree']);
    };

    adhocDesigner.FILTERS_PANEL_DEFAULT_WIDTH = 300;
    adhocDesigner.FILTERS_PANEL_MIN_WIDTH = 250;

    adhocDesigner.initPanelsState = function() {
        if (!layoutModule.panelStateWasManuallyChanged("filters", clientKey)) {
            // sync markup and storage states if they differ
            // such situation happens when we switch from one Ad Hoc View to another
            if (layoutModule.getPanelMinimizedState('filters') === 'false' && jQuery("#filters").hasClass("minimized")) {
                layoutModule.storePanelMinimizedState('filters', true);
            }
        }

        setDefaultWidthIfMissing("filters", adhocDesigner.FILTERS_PANEL_MIN_WIDTH);
        var mainPanelID = adhocDesigner.CANVAS_PANEL_ID;
        if($('fields')) {
            layoutModule.resizeOnClient('fields', mainPanelID, 'filters');
        } else {
            layoutModule.resizeOnClient('filters', mainPanelID);
        }

        if (!layoutModule.panelStateWasManuallyChanged("filters", clientKey)) {
            // in initial markup of our page filters panel is already minimized
            // in that case layoutModule.resizeOnClient method wrote incorrect value to cookie (17).
            // that caused various UI issues and default size (250) was used when panel was maximized.
            // here we override this behavior by writing correct default width to cookies
            if (layoutModule.getPanelMinimizedState('filters') === 'true' && parseInt(layoutModule.getPanelWidth('filters'), 10) < adhocDesigner.FILTERS_PANEL_MIN_WIDTH) {
                layoutModule.storePanelWidth('filters', adhocDesigner.FILTERS_PANEL_DEFAULT_WIDTH);
            }
        }
    };

    adhocDesigner.initFiltersPanel = function(){
        var $filters = $("filters"),
            filtersControllerConstructor = adhocDesigner.isOlapMode() ? OlapFiltersController : FiltersController,
            filterService = new FilterService({
                clientKey : clientKey,
                mode : adhocDesigner.getMode
            });

        enableSelection($filters);

        adhocDesigner.filtersController = new filtersControllerConstructor({
            el : $filters,
            service : filterService,
            clientKey: clientKey,
            onApply : function(state) { localContext.standardOpCallback(state); },
            onStateUpdate : function(state) {
                localContext.state.update ? localContext.state.update(state) : localContext.update(state);

                if (isDesignView) {  //save and undo buttons are disabled in report display view
                    adhocDesigner.enableCanUndoRedo();
                }

                //fieldsInUse not used in OLAP mode yet.
                !adhocDesigner.isOlapMode() && adhocDesigner.updateFieldsInUse(_.pluck(state.existingFilters, "name"));
            },
            onFilterRemove: function(filters) {
                adhocDesigner.removeFromFieldsInUse(_.pluck(filters, "name"));
            },
            resetFilterPanelState: adhocDesigner.resetFilterPanelState
        });

        // bind this event here, because we don't want FiltersController classes to be dependent on Prototype
        // this should be refactored with refactoring of designer
        document.observe("dragger:sizer", function(e) {
            var element = e.memo.element;

            if (element == adhocDesigner.filtersController.sizerEl) {
                adhocDesigner.filtersController.onPanelResize();
            }
        });
    };

    adhocDesigner.initDroppables = function(){
        var drops = {
            'filters':{
                accept: ['draggable', 'wrap'],
                hoverclass: 'dropTarget',
                onDrop: function(draggable){
                    var errorMessages = [];
                    if (!adhocDesigner.canShowFilterOption(errorMessages)) {
                        dialogs.systemConfirm.show(errorMessages.join(' '), 5000);
                    } else {
                        var fields = adhocDesigner.getListOfSelectedFields();
                        adhocDesigner.filtersController.addFilter(fields);
                    }
                }
            },
            'mainTableContainer': {
                accept: ['measure', 'dimension'],
                hoverclass: 'dropTarget',
                onDrop: function(){
                    switch(localContext.getMode()) {
                        case 'table':
                            AdHocTable.addFieldAsColumn(true);
                            break;
                        case 'chart':
                            AdHocChart.addFieldAsMeasure(true);
                    }
                    if(localContext.getMode().indexOf('ichart') >= 0) {
                        var nodes = [];
                        var selectedNodes = adhocDesigner.getSelectedTreeNodes();
                        jQuery.each(selectedNodes,function(i,node){
                            nodes.push(node.param);
                        });
                        var pos = jQuery('#olap_columns').children().length;
                        AIC.lmHandlersMap.addItems(nodes,pos,'column');
                    }
                }
            },
            'canvasTableFrame':{
                accept: ['draggable', 'wrap'],
                hoverclass: 'dropTarget',
                onDrop: function(){
                    (localContext.getMode() == 'table') && AdHocTable.addFieldAsColumn(true);
                }
            }
        };

        for (var myId in drops) {
            Droppables.remove(myId);
            if(document.getElementById(myId)) {
                Droppables.add(myId, drops[myId]);
            }
        }
    };

    ////////////////////////////////////////////////
    //Helpers
    ////////////////////////////////////////////////
    adhocDesigner.getAvailableFieldsTree = function(id, providerId){
        function AvailableTreeNode(options) {
            dynamicTree.TreeNode.call(this, options);

            this.Types = {
                Folder : new dynamicTree.TreeNode.Type('ItemGroupType')
            };

            this.nodeHeaderTemplateDomId = "list_responsive_collapsible_folders_adhocAvailableTrees:folders";
        }

        AvailableTreeNode.prototype = deepClone(dynamicTree.TreeNode.prototype);

        AvailableTreeNode.addMethod('refreshStyle', function(element) {
            element = element || this._getElement();
            if(element) {
                var field = adhocDesigner.findFieldByName(this.param.id);
                if (field && field.isCustomField) {
                    this.name = this.param.label = field.defaultDisplayName.replace(/\\'/g, "'").escapeHTML();
                    var classNames = ['calculatedField'];
                    if (adhocDesigner.isInUse(this.param.id))
                    {
                        classNames.push('dependency');
                    }
                    if (adhocDesigner.isInError(this.param.id))
                    {
                        classNames.push('inError');
                        var errorIcon = element.getElementsByClassName("icon error");
                        if (errorIcon.length == 1) {
                            errorIcon = errorIcon[0];
                        }
                        errorIcon.classList.remove('hidden');
                    } else {
                        var errorIcon = element.getElementsByClassName("icon error");
                        if (errorIcon.length == 1) {
                            errorIcon = errorIcon[0];
                        }
                        errorIcon.classList.add("hidden");
                    }
                    this.param.cssClass = classNames.join(" ");
                }
                dynamicTree.TreeNode.prototype.refreshStyle.call(this, element);
            }
        });

        return new dynamicTree.TreeSupport(id, {
            providerId: providerId,
            rootUri: '/',
            showRoot: false,
            resetStatesOnShow: false,
            nodeClass: AvailableTreeNode,
            templateDomId: "list_responsive_collapsible_folders_adhocAvailableTrees",
            dragPattern: isIPad() ? undefined : '.draggable',
            treeErrorHandlerFn: doNothing,
            selectOnMousedown: !isIPad(),
            regionID: id ? id : designerBase.AVAILABLE_FIELDS_AREA
        });
    };

    return adhocDesigner;
});
