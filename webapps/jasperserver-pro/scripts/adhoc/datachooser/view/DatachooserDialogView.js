/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * author: Bobys Kolesnykov
 * @version: $Id$
 */

/* global flowExecutionKey */

define(function (require) {

    "use strict";

    var _ = require('underscore'),
        jQuery = require("jquery"),

        Dialog = require("common/component/dialog/Dialog"),
        AlertDialog = require("common/component/dialog/AlertDialog"),
        Panel = require('common/component/panel/Panel'),
        Tree = require('common/component/tree/Tree'),
        TreeDataLayer = require('common/component/tree/TreeDataLayer'),

        tabbedPanelTrait = require('common/component/panel/trait/tabbedPanelTrait'),

        TooltipTreePlugin = require('common/component/tree/plugin/TooltipPlugin'),
        SearchTreePlugin = require('common/component/tree/plugin/SearchPlugin'),
        InfiniteScrollPlugin = require('common/component/tree/plugin/InfiniteScrollPlugin'),
        NoSearchResultsMessagePlugin = require('common/component/tree/plugin/NoSearchResultsMessagePlugin'),

        contextPath = require("jrs.configs").contextPath,
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes"),
        i18n = require('bundle!adhoc_messages'),
        commonMessagesBundle = require("bundle!CommonBundle"),
        browserDetection = require("common/util/browserDetection"),

        datachooserDialogTemplate = require("text!adhoc/datachooser/template/datachooserDialogTemplate.htm"),
        dataChooserTreeLeafTemplate = require("text!adhoc/datachooser/template/dataChooserTreeLeafTemplate.htm"),
        sidebarTreeLeafTooltipTemplate = require("text!adhoc/datachooser/template/tooltip/sidebarTreeLeafTooltipTemplate.htm"),
        tabsOptionsTemplate = require("text!adhoc/datachooser/template/datachooserTabTemplate.htm");

    var ADHOC_REPORT_TYPE_PARAM_NAME = "reportType";
    var LIST_ITEM_HEIGHT = 22;
    var DECORATE_PARAM_NAME = "decorate";
    var IS_EMBEDDED_DESIGNER_PARAM_NAME = "embeddedDesigner";

    var LIST_TAB = "list";

    var TREE_BUFFER_SIZE = 5000;

    var RECURSIVE = "&recursive=true";
    var NOT_RECURSIVE = "&recursive=false";

    var BASE_URI = contextPath + "/rest_v2/api/resources?{{= id != '@fakeRoot' ? 'folderUri=' + id : ''}}";

    var COMMON_TYPES = "&type=" + repositoryResourceTypes.DOMAIN_TOPIC +
        "&type=" + repositoryResourceTypes.TOPIC +
        "&type=" + repositoryResourceTypes.SEMANTIC_LAYER_DATA_SOURCE;

    var OLAP_TYPES = "&type=" + repositoryResourceTypes.SECURE_MONDRIAN_CONNECTION +
        "&type=" + repositoryResourceTypes.MONDRIAN_CONNECTION +
        "&type=" + repositoryResourceTypes.XMLA_CONNECTION;

    var URI_SUFFIX = "&offset={{= offset }}&limit={{= limit }}&forceTotalCount=true&forceFullPage=true";

    var TREE_VIEW_RESOURCES_BASE_URI = BASE_URI + NOT_RECURSIVE +
        "&containerType=" + repositoryResourceTypes.FOLDER;

    var LIST_VIEW_RESOURCES_URI = BASE_URI + RECURSIVE + URI_SUFFIX;

    var OLAP_CONNECTIONS_TYPES = [repositoryResourceTypes.MONDRIAN_CONNECTION,
        repositoryResourceTypes.SECURE_MONDRIAN_CONNECTION, repositoryResourceTypes.XMLA_CONNECTION];

    return Dialog.extend({

        events: {
            "resize": "onResizeHeight"
        },
        onResizeHeight: function() {
            this.$contentContainer.height(this.$el.height() - this._resizableContainerShiftHeight);

            this.listTreeView.rootLevel.list.$el.height(this.$el.height() - this._resizableContainerShiftHeight - 6);
            this.hierarhicalTreeView.rootLevel.list.$el.css("height", "100%");
        },

        constructor: function (options) {
            options || (options = {});

            this._dfdRenderSerachFormTo = jQuery.Deferred();

            var reportType = this._getParameterByName(ADHOC_REPORT_TYPE_PARAM_NAME);
            reportType = reportType || "crosstab";
            this.reportType = reportType === "chart" ? "ichart" : reportType;

            this.decorate = this._getParameterByName(DECORATE_PARAM_NAME) || "yes";
            this.isEmbeddedDesigner = this._getParameterByName(IS_EMBEDDED_DESIGNER_PARAM_NAME);

            var treeViewResourcesUri = TREE_VIEW_RESOURCES_BASE_URI + COMMON_TYPES;

            if(this.reportType === "table"){
                treeViewResourcesUri += URI_SUFFIX;
            } else {
                treeViewResourcesUri += OLAP_TYPES + URI_SUFFIX;
            }

            var tooltipOptions = {
                attachTo: this.$el,
                i18n: i18n,
                contentTemplate: sidebarTreeLeafTooltipTemplate
            };

            var ResourcesTree = Tree
                .use(TooltipTreePlugin, tooltipOptions)
                .use(InfiniteScrollPlugin)
                .create();

            var resourceTypes = _.union([ repositoryResourceTypes.TOPIC, repositoryResourceTypes.DOMAIN_TOPIC,
                repositoryResourceTypes.SEMANTIC_LAYER_DATA_SOURCE ], OLAP_CONNECTIONS_TYPES);

            var ResourcesTreeWithSearch = Tree
                .use(TooltipTreePlugin, tooltipOptions)
                .use(NoSearchResultsMessagePlugin)
                .use(SearchTreePlugin, {
                    additionalParams: {
                        type: this.reportType === "table" ? _.first(resourceTypes, 3) : resourceTypes
                    },
                    dfdRenderTo: this._dfdRenderSerachFormTo
                })
                .create();

            var processors = {
                treeNodeProcessor: {
                    processItem: function (item) {
                        item._node = _.contains(_.union([repositoryResourceTypes.FOLDER], OLAP_CONNECTIONS_TYPES), item.value.resourceType);
                        return item;
                    }
                },
                i18nItemProcessor: {
                    processItem: function (item) {
                        item.i18n = commonMessagesBundle;
                        return item;
                    }
                },
                filterPublicFolderProcessor: {
                    processItem: function (item) {
                        if (item.value.uri !== '/public') {
                            return item;
                        }
                    }
                },
                filterTempFolderProcessor: {
                    processItem: function (item) {
                        if (!item.value.uri.match(/\/temp\//) && !item.value.uri.match(/\/temp$/)) {
                            return item;
                        }
                    }
                },
                filterEmptyFoldersProcessor: {
                    processItem: function (item) {
                        if (!(item.value.resourceType === 'folder' && item.value._links.content === '')) {
                            return item;
                        }
                    }
                },
                cssClassItemProcessor: {
                    processItem: cssClassItemProcessor
                }
            };

            var olapDataLayer = new TreeDataLayer({
                requestType: "POST",
                dataUriTemplate: contextPath + "/rest_v2/connections",
                processors: [
                    processors.i18nItemProcessor,
                    processors.cssClassItemProcessor
                ],
                levelDataId: "uri",
                getDataArray: function (data, status, xhr) {
                    return data && data[repositoryResourceTypes.RESOURCE_LOOKUP] ? data[repositoryResourceTypes.RESOURCE_LOOKUP] : [];
                }
            });

            var customizedGetDataLayerFunc = function (level) {
                var isOlapResource = _.contains(OLAP_CONNECTIONS_TYPES, level.resource.resourceType);

                if (!isOlapResource) {
                    return this.customDataLayers && this.customDataLayers[level.id] ?
                        this.customDataLayers[level.id] : this.defaultDataLayer;
                } else {
                    var olapDataLayer = _.clone(this.customDataLayers["olapDataLayer"]);
                    _.extend(olapDataLayer, {
                        accept: "application/repository." + level.resource.resourceType + ".metadata+json",
                        contentType: "application/repository." + level.resource.resourceType + "+json",
                        data: JSON.stringify(level.resource)
                    });
                    return olapDataLayer;
                }
            };

            this.hierarhicalTreeView = ResourcesTree.instance({
                itemsTemplate: dataChooserTreeLeafTemplate,
                listItemHeight: LIST_ITEM_HEIGHT,
                selection: { allowed: true, multiple: false },
                rootless: true,
                collapsed: true,
                lazyLoad: true,
                bufferSize: TREE_BUFFER_SIZE,
                additionalCssClasses: "folders",
                dataUriTemplate: treeViewResourcesUri,
                levelDataId: "uri",

                customDataLayers: {
                    //workaround for correct viewing of '/public' folder label
                    "/": _.extend(new TreeDataLayer({
                        dataUriTemplate: contextPath + "/flow.html?_flowId=searchFlow&method=getNode&provider=repositoryExplorerTreeFoldersProvider&uri=/&depth=1",
                        processors: _.chain(processors).omit("filterPublicFolderProcessor").values().value(),
                        getDataArray: function (data) {
                            data = JSON.parse(jQuery(data).text());
                            var publicFolder = _.find(data.children, function(item) {
                                return item.uri === '/public';
                            }),
                                res = [{ id: "@fakeRoot", label: data.label, uri: "/", resourceType: 'folder', _links: {content: "@fakeContentLink"} }];

                            if (publicFolder){
                                res.push({ id: "/public", label: publicFolder.label, uri: "/public", resourceType: 'folder', _links: {content: "@fakeContentLink"} });
                            }

                            return res;
                        }
                    }), {
                        accept: 'text/html',
                        dataType: 'text'
                    }),
                    "olapDataLayer": olapDataLayer
                },
                processors: _.values(processors),

                getDataArray: function (data, status, xhr) {
                    return data && data[repositoryResourceTypes.RESOURCE_LOOKUP] ? data[repositoryResourceTypes.RESOURCE_LOOKUP] : [];
                },
                getDataSize: function (data, status, xhr) {
                    return +xhr.getResponseHeader("Total-Count");
                },
                getDataLayer: customizedGetDataLayerFunc
            });

            this.listTreeView = ResourcesTreeWithSearch.instance({
                rootLevelHeight: _.bind(this.getContentHeight, this),
                itemsTemplate: dataChooserTreeLeafTemplate,
                listItemHeight: LIST_ITEM_HEIGHT,
                selection: {allowed: true, multiple: false },
                rootless: true,
                collapsed: true,
                lazyLoad: true,
                dataUriTemplate: LIST_VIEW_RESOURCES_URI,
                levelDataId: "uri",
                cache: {
                    searchKey: "searchString",
                    pageSize: 100
                },
                processors: [
                    {
                        processItem: function (item) {
                            item._node = _.contains(OLAP_CONNECTIONS_TYPES, item.value.resourceType);
                            return item;
                        }
                    },
                    processors.i18nItemProcessor,
                    processors.cssClassItemProcessor,
                    processors.filterTempFolderProcessor
                ],

                customDataLayers: {
                    "olapDataLayer": olapDataLayer
                },

                getDataLayer: customizedGetDataLayerFunc,

                getDataArray: function (data, status, xhr) {
                    return data && data[repositoryResourceTypes.RESOURCE_LOOKUP] ? data[repositoryResourceTypes.RESOURCE_LOOKUP] : [];
                },
                getDataSize: function (data, status, xhr) {
                    return +xhr.getResponseHeader("Total-Count");
                }
            });

            Dialog.prototype.constructor.call(this, {
                template: datachooserDialogTemplate,
                modal: true,
                resizable: true,
                additionalCssClasses: "sourceDialogNew",
                title: i18n["ADH_108_DATA_CHOOSER_DIALOG_TITLE"],
                traits: [ tabbedPanelTrait ],
                tabHeaderContainerSelector: ".tabHeaderContainer",
                tabContainerClass: "tabContainer control groupBox treeBox",
                optionTemplate: tabsOptionsTemplate,
                toggleClass: "down",
                tabs: [
                    {
                        label: i18n["ADH_108_DATA_CHOOSER_FOLDERS_TAB"],
                        action: "tree",
                        content: this.hierarhicalTreeView,
                        exposeAction: true,
                        additionalCssClasses: "action square small",
                        i18n: i18n
                    },
                    {
                        label: i18n["ADH_108_DATA_CHOOSER_LIST_TAB"],
                        action: "list",
                        content: this.listTreeView,
                        exposeAction: true,
                        additionalCssClasses: "action square small",
                        i18n: i18n
                    }
                ],
                buttons: [
                    { label: i18n["ADH_016_BUTTON_OK"], action: "apply", primary: true },
                    { label: i18n["ADH_010_BUTTON_CANCEL"], action: "cancel", primary: false }
                ]
            });

            this.disableButton("apply");

            this.on('button:apply', _.bind(this._onSelectDataDialogOkButtonClick, this));
            this.on('button:cancel', _.bind(this._onSelectDataDialogCancelButtonClick, this));
        },

        initialize: function (options) {

            var selectionListener = function (selection) {

                var okButton = _.find(this.buttons.options, function(option) {
                    return option.model.attributes.action === "apply";
                }).$el;

                var itemSelected = selection && _.isArray(selection) && selection[0];
                var resourceUri = itemSelected ? selection[0].uri : undefined;
                var resourceType = itemSelected ? selection[0].resourceType : undefined;

                if(!(itemSelected || resourceUri || resourceType)) {
                    this.disableButton("apply");
                    this.$('.itemDescription').empty();
                    return;
                }

                resourceType !== repositoryResourceTypes.FOLDER
                    ? this.$(".itemDescription").text(itemSelected.description || "")
                    : this.$('.itemDescription').empty();

                resourceType === repositoryResourceTypes.SEMANTIC_LAYER_DATA_SOURCE
                    ? okButton.find(".wrap").text(i18n["ADH_108_DATA_CHOOSER_DOMAIN_LABEL"])
                    : okButton.find(".wrap").text(i18n["ADH_016_BUTTON_OK"]);

                if (_.contains(_.union([repositoryResourceTypes.FOLDER], OLAP_CONNECTIONS_TYPES), resourceType)) {
                    delete this.resourceData;
                    this.disableButton("apply");
                    return;
                }

                this.resourceData = {};

                if (resourceType === repositoryResourceTypes.OLAP_CUBE) {
                    this.resourceData.resourceUri = resourceUri.substring(0, resourceUri.lastIndexOf("/"));
                    this.resourceData.cube = resourceUri.substring(resourceUri.lastIndexOf("/") + 1);
                    this.resourceData.reportType = "olap_" + this.reportType;
                } else {
                    this.resourceData.resourceUri = resourceUri;
                    this.resourceData.reportType = this.reportType;
                }

                this.resourceData.event = this._getAdHocFlowEvent(resourceType);
                this.resourceData.flowExecutionKey = flowExecutionKey;

                this.enableButton("apply");
            };

            this.errorDialog = new AlertDialog();

            this.listenTo(this.hierarhicalTreeView, "selection:change", selectionListener);
            this.listenTo(this.listTreeView, "selection:change", selectionListener);
            this.listenTo(this.hierarhicalTreeView, "levelRenderError", _.bind(this._onLevelRenderError, this.errorDialog));
            this.listenTo(this.listTreeView, "levelRenderError", _.bind(this._onLevelRenderError, this.errorDialog));
            this.listenTo(this.hierarhicalTreeView, "item:dblclick", this._onSelectDataDialogOkButtonClick);
            this.listenTo(this.listTreeView, "item:dblclick", this._onSelectDataDialogOkButtonClick);
            this.listenTo(this.listTreeView.rootLevel, "ready", this.onResizeHeight, this);
            this.listenTo(this.hierarhicalTreeView.rootLevel, "ready", this.onResizeHeight, this);

            this.listenTo(this.listTreeView.searchForm, "search", this._onSearch);
            this.listenTo(this.listTreeView.searchForm, "clear", this._resetItemSelection);
            this.on("tab:tree tab:list", this._resetItemSelection, this);

            Dialog.prototype.initialize.apply(this, arguments);
        },

        getContentHeight: function() {
            return this.$el.height() - this._resizableContainerShiftHeight;
        },

        render: function () {
            Dialog.prototype.render.apply(this, arguments);

            // connect search form to dialog header
            this._dfdRenderSerachFormTo.resolve(this.$tabHeaderContainer);

            this.openTab(LIST_TAB);

            return this;
        },

        open: function () {
            var self = this;
            self._resizableContainerShiftHeight = 6;

            Dialog.prototype.open.apply(this, arguments);

            var setTabContainerStyles = _.bind(function () {
                this.$contentContainer.find(".tabContainer").css({
                    "height": "inherit",
                    "overflow-y": "auto"
                });
            }, this);

            /*
                IE8, IE9 compatibility workaround
             */
            if(browserDetection.isIE8() || browserDetection.isIE9()) {
                setTimeout(setTabContainerStyles, 1);
            } else {
                setTabContainerStyles();
            }

            this.$el
                .children()
                .not(".subcontainer")
                .not(".ui-resizable-e")
                .not(".ui-resizable-se")
                .each(function() {
                    self._resizableContainerShiftHeight += self.$(this).outerHeight(true);
            });
            this.$contentContainer.height(this.$el.height() - this._resizableContainerShiftHeight);
        },

        close: function () {
            if (this.hierarhicalTreeView) {
                this.hierarhicalTreeView.collapse("@fakeRoot", {silent: true});
                this.hierarhicalTreeView.collapse("/public", {silent: true});
                this.hierarhicalTreeView.resetSelection();
            }

            Dialog.prototype.close.apply(this, arguments);
        },

        _onSearch: function() {
            this.openTab(LIST_TAB);
            this.disableButton("apply");
        },
        _resetItemSelection: function() {
            this.hierarhicalTreeView.resetSelection();
            this.listTreeView.resetSelection();
            this.$('.itemDescription').empty();
        },

        _getAdHocFlowEvent: function (resourceType) {
            var adHocFlowEvent = "";
            if (resourceType == repositoryResourceTypes.REPORT_UNIT || resourceType == repositoryResourceTypes.DOMAIN_TOPIC) {
                adHocFlowEvent = "startAdHocWithTopic";
            } else if (resourceType == repositoryResourceTypes.SEMANTIC_LAYER_DATA_SOURCE) {
                adHocFlowEvent = "startQueryBuilder";
            } else if (resourceType === repositoryResourceTypes.OLAP_CUBE) {
                adHocFlowEvent = "startAdhocForOlap";
            }

            return adHocFlowEvent;
        },

        _onSelectDataDialogOkButtonClick: function () {
            if (this.resourceData) {
                document.location = 'flow.html?_flowId=adhocFlow&realm=' + encodeURIComponent(encodeURIComponent(this.resourceData.resourceUri)) +
                    '&_flowExecutionKey=' + this.resourceData.flowExecutionKey +
                    '&reportType=' + this.resourceData.reportType +
                    '&embeddedDesigner=' + this.isEmbeddedDesigner +
                    '&decorate=' + this.decorate +
                    '&_eventId=' + this.resourceData.event + (this.resourceData.cube ? "&cube=" + this.resourceData.cube : "");
            }
        },

        _onLevelRenderError: function(responseStatus, error, level){
            error = JSON.parse(error);
            var errMsg = error.message;
            if (error.parameters)
                errMsg = error.parameters[0].substring(error.parameters[0].indexOf(": ") + 2, error.parameters[0].indexOf("\n"));
            this.setMessage(errMsg);
            this.open();
            level.$el.removeClass(level.loadingClass).addClass(level.openClass);
        },

        _onSelectDataDialogCancelButtonClick: function () {
            this.close();

            if (this.isEmbeddedDesigner && document.referrer.indexOf("login.html") === -1) {
                jQuery(document).trigger("adhocDesigner:cancel");
            }
        },

        _getParameterByName: function (name) {
            var urlParamPattern = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                paramValues = urlParamPattern.exec(location.search);
            return paramValues == null ? "" : decodeURIComponent(paramValues[1].replace(/\+/g, " "));
        }
    });

    function cssClassItemProcessor(item) {

        switch (item.value.resourceType) {
            case repositoryResourceTypes.REPORT_UNIT:
                item.cssClass = "topic";
                break;

            case repositoryResourceTypes.DOMAIN_TOPIC:
                item.cssClass = "domain topic";
                break;

            case repositoryResourceTypes.SEMANTIC_LAYER_DATA_SOURCE:
                item.cssClass = "domain";
                break;

            case repositoryResourceTypes.OLAP_CUBE:
                item.cssClass = "olap";
                break;

            default:
                break;
        }

        return item;
    }

});