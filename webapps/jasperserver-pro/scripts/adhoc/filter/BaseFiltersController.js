/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/**
 * Filter Panel View Controller responsible for handling all operations on set of filters, like:
 * display, add, remove, reorder and batch operations
 *
 * @type {*}
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        $ = require("jquery"),
        actionModel = require("actionModel.modelGenerator"),
        FilterCollection = require("adhoc/filter/FilterCollection"),
        jaspersoft = require("namespace"),
        _ = require("underscore"),
        layoutModule = require("core.layout"),
        featureDetection = require("common/util/featureDetection"),
        filterDataTypes = require("adhoc/filter/enum/filterDataTypes"),
        filterEditorFactory = require("adhoc/filter/factory/filterEditorFactory"),
        i18n = require("bundle!AdHocFiltersBundle");

    require("jquery.ui.mouse.touch");
    require("jquery-ui/jquery.ui.sortable");
    require("components.dialog");

    var ConfirmDialog = jaspersoft.components.ConfirmDialog;

    return Backbone.View.extend({
        collectionConstructor: FilterCollection,

        events : (function() {
            var events = {
                "click .button.action.primary" : "applyFilters",
                "click .button.minimize": "markPanelStateAsManuallyChanged"
            };

            if (featureDetection.supportsTouch) {
                events["click #filterPanelMutton"] = "showFiltersMenu";
            } else {
                events["mouseover #filterPanelMutton"] = "showFiltersMenu";
            }

            return events;
        })(),

        initialize : function(options) {
            this.onApply = options.onApply;
            this.onStateUpdate = options.onStateUpdate;
            this.onFilterRemove = options.onFilterRemove;
            this.resetFilterPanelState = options.resetFilterPanelState;
            this.service = options.service;
            this.clientKey = options.clientKey;

            this.collection = options.collection || new FilterCollection([], { service: this.service, isOlap: this.isOlap });

            this._filtersChanged = false;

            this.confirmDialog = new ConfirmDialog();

            _.bindAll(this, "addFilter", "addSliceFilter", "updateFilter", "toggleFilter", "minimizeAllFilters", "maximizeAllFilters", "deleteAllFilters", "onMove");

            this.filtersMenuActionModel = this.createFiltersMenuActionModel();

            this.once("reset:panel", this.resetFilterPanelState);
            this.on("reset:panel", this.render);
            this.on("change:filters", this.toggleApplyButtonState);
            this.on("invalid:filters", this.showFilterServerError);

            this.listenTo(this.collection, "reset", this.recreateFilterEditors);
            this.listenTo(this.collection, "add", this.addFilterEditor);
            this.listenTo(this.collection, "remove", this.removeFilterEditor); // only for UI sync with state
            this.listenTo(this.collection, "destroy", this.deleteFilter); // performs remove request
            this.listenTo(this.collection, "destroyConfirm", this.removeConfirm);
            this.listenTo(this.collection, "move", this.onMove);
            this.listenTo(this.collection, "toggle", this.toggleFilter);
            this.listenTo(this.collection, "operationChange", this.updateFilter);
            this.listenTo(this.collection, "validated", this.toggleApplyButtonState);
            this.listenTo(this.collection, "change:value change:isAnyValue add remove operationChange", _.partial(this.setFiltersChanged, true));

            this.sizerEl = this.$(".sizer:eq(0)")[0];
        },

        markPanelStateAsManuallyChanged: function() {
            layoutModule.manuallyChangePanelState("filters", this.clientKey, true);
        },

        unmarkPanelStateAsManuallyChanged: function() {
            layoutModule.manuallyChangePanelState("filters", this.clientKey, false);
        },

        // currently this event handler is bound outside BaseFiltersController, in designer.init.js file
        onPanelResize: function() {
            this.filterEditors && _.invoke(this.filterEditors, "resizeTitle");
        },

        hasNotAppliedFilters: function() {
            return this._filtersChanged;
        },

        setFiltersChanged : function(isChanged) {
            this._filtersChanged = isChanged;
            this.trigger("change:filters");
        },

        render : function() {
            this.$("#filter-container ul.filters").empty();

            var frag = document.createDocumentFragment();

            _.each(this.filterEditors, function(editor) {
                frag.appendChild(editor.el);
            });

            this.$("#filter-container ul.filters").html(frag);

            this.initSortable();

            this.resizeFilterEditorTitles();

            return this;
        },

        initSortable : function() {
            this.$el.sortable({
                delay: 200,
                handle: ".header",
                items: "#filter-container li.filter",
                axis: "y",
                start: function(event, ui) {
                    ui.item.data('oldIndex', ui.item.index());
                },
                stop: _.bind(function(event, ui) {
                    var oldIndex = ui.item.data('oldIndex');
                    var newIndex = ui.item.index();
                    oldIndex != newIndex && this.moveFilter(this.collection.at(oldIndex), oldIndex, newIndex);
                }, this)
            });
        },

        createFiltersMenuActionModel : function() {
            var menuModel = {};

            menuModel[this.cid] = [
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_1220_DYNAMIC_FILTER_MINIMIZE_ALL,
                    action : this.minimizeAllFilters
                }),
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_1221_DYNAMIC_FILTER_MAXIMIZE_ALL,
                    action : this.maximizeAllFilters
                }),
                actionModel.createMenuElement("separator"),
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_1219_DYNAMIC_FILTER_REMOVE_ALL,
                    action : this.deleteAllFilters
                })
            ];
            return menuModel;
        },

        removeFilterEditor: function(filterModel) {
            var filterEditor = this._getFilterEditorByModel(filterModel);
            filterEditor && this.stopListening(filterEditor, "uiChange:filters", this.onFilterEditorUIChanged);
            filterEditor && filterEditor.remove();
            this.$el.sortable("refresh");
        },

        addFilterEditor: function(model, collection, options) {
            layoutModule.maximize(this.el, true);
            this.unmarkPanelStateAsManuallyChanged();

            var editor = this.createEditor(model);

            if (!_.isArray(this.filterEditors)) {
                this.filterEditors = [];
            }

            this.filterEditors.push(editor);

            this.$("#filter-container ul.filters").append(editor.$el);

            _.defer(_.bind(editor.resizeTitle, editor));

            this.$el.sortable("refresh");
        },

        resizeFilterEditorTitles: function() {
            _.invoke(this.filterEditors || [], "resizeTitle");
        },

        onFilterEditorUIChanged: function(filterEditor) {
            // resize titles of all filter editors with some timeout. 100ms is just an empiric timeout.
            // we need to do this because changing some filters may change height of the whole filter panel,
            // which leads to appearance of vertical scroll-bar, that impacts on width of the filter panel
            setTimeout(_.bind(this.resizeFilterEditorTitles, this), 100);

            // if something changed on UI for last of the filter editors, we need to scroll down to it.
            // such situation happens when we change operator for example.
            // we should not do this after initial load of value editors in order to prevent scrolling to the bottom
            // on page load
            if (filterEditor.valueEditorUIChanged && filterEditor.el === _.last(this.$(".leaf.filter"))) {
                setTimeout(_.bind(function() {
                    this.$("> .content > .body").scrollTop(_.reduce(this.$(".leaf.filter"), function(memo, el){ return memo + $(el).height(); }, 0));
                }, this), 50);
            }

            filterEditor.valueEditorUIChanged = true;
        },

        showFiltersMenu : function(event) {
            actionModel.showDynamicMenu(this.cid, event.originalEvent, "menu vertical dropDown fitable", null, this.filtersMenuActionModel);
            // do not propagate event further, as global event handler in buttonManager adds additional classes to button
            event.stopPropagation();
        },

        recreateFilterEditors : function() {
            this.cleanUpEditors();

            this.filterEditors = this.collection.map(function(filter) {
                return this.createEditor(filter);
            }, this);

            this.trigger("reset:panel");
        },

        cleanUpEditors : function() {
            var self = this;

            _.each(this.filterEditors, function(editor) {
                self.stopListening(editor, "uiChange:filters", self.onFilterEditorUIChanged);
            });

            _.invoke(this.filterEditors || [], "remove");
        },

        createEditor : function(model) {
            var editorConstructor = filterEditorFactory(model.isReadOnly() ? filterDataTypes.READ_ONLY : model.get("filterDataType"), this.isOlap);
            var editor = editorConstructor(model);
            this.listenTo(editor, "uiChange:filters", this.onFilterEditorUIChanged);
            return  editor;
        },

        showFilterServerError : function(model, message) {
            this.$("#filterMessage span").html(message);
        },

        onMove : function(filterModel, options) {
            var currentEditor = this._getFilterEditorByModel(filterModel),
                index = currentEditor.$el.index(),
                dir = options.direction;

            if (dir < 0 && index === 0 ||
                dir > 0 && index === this.collection.length - 1) {
                return;
            }

            if (dir === -1) {
                currentEditor.$el.insertBefore(this.$("#filter-container li.filter:eq(" + (index+dir) + ")"));
            } else {
                currentEditor.$el.insertAfter(this.$("#filter-container li.filter:eq(" + (index+dir) + ")"));
            }

            this.$el.sortable("refreshPositions");

            this.moveFilter(filterModel, index, index + dir);
        },

        removeConfirm : function(filterModel) {
            this.confirmDialog.show({
                ok : _.bind(function() {
                    var editor = this._getFilterEditorByModel(filterModel);
                    editor.removeFilter({force : true});
                },this),
                messages : i18n.ADH_1230_DYNAMIC_FILTER_ADVANCED_CONFIRM_REMOVE
            });
        },

        _getFilterEditorByModel: function(filterModel) {
            return _.find(this.filterEditors, function(filterEditor) { return filterModel.cid === filterEditor.model.cid; });
        },

        hasFilterForField : function(fieldName) {
            return !_.isEmpty(this.collection.where({name : fieldName}));
        },

        toggleApplyButtonState: function() {
            if (this._filtersChanged && this.collection.every(function(model) { return model.get("filterDataType") === filterDataTypes.READ_ONLY ? true : model.isValid(); })) {
                    this.enableApplyButton();
                } else {
                    this.disableApplyButton();
                }
        },

        disableApplyButton: function() {
            this.$("#applyFilter > button.action").attr("disabled", "disabled").removeClass("over");
        },

        enableApplyButton: function() {
            this.$("#applyFilter > button.action").removeAttr("disabled");
        },

        setFilters : function(response, options) {
            this.setFiltersChanged(response.isFiltersDraft);
            var setAction = (options && options.reset ? "reset" : "set");
            this.collection[setAction](response.existingFilters);
        },

        // TODO: REMOVE! This method is unused, because now we load filters state along with whole Designer state
        getFilters : function() {
            return this.service.get().done(_.bind(function(response) {
                this.setFilters(response, {reset : true});
            }, this));
        },

        addFilter : function(fields) {
            // Bug#39457: Since we have different Model for Field in tree and field added into View we should handle this
            var fieldName = !_.isEmpty(fields) && fields[0].fieldName ? "fieldName" : "name";
            return this.service.add(_.pluck(fields, fieldName)).done(_.bind(function(response) {
                this.collection.set(response.existingFilters);
                this.onStateUpdate(response);
            }, this));
        },

        addSliceFilter : function(includeOrExclude, fields) {
            var pathes = _(fields).filter(function(f) {return f.isSummary !== "true";}).
                map(function(f) { return f.path; }).
                uniq();

            return this.service.addSlice(fields[0].axis, includeOrExclude === "true", pathes).done(_.bind(function(response) {
                this.onApply(response);
                layoutModule.maximize(this.el, true);
                this.setFilters(response, {reset : true});
                this.unmarkPanelStateAsManuallyChanged();
            }, this));
        },

        updateFilter : function(filterModel) {
            if (filterModel.isValid(true)) {
                return filterModel.saveValue().done(_.bind(function(response) {
                    var filterState = _.findWhere(response.existingFilters, { id : filterModel.id });
                    filterState && filterModel.set(filterState, {silent: true});
                    this.onStateUpdate(response);
                }, this));
            }
        },

        _deleteFilterDoneCallback: function(filter, response) {
            this.collection.set(response.existingFilters);
            this.onStateUpdate(response);
            this.onFilterRemove([filter]);
        },

        deleteFilter : function(filterModel) {
            return this.service.remove(filterModel.id).done(_.bind(this._deleteFilterDoneCallback, this, filterModel.toJSON()));
        },

        _deleteAllFiltersDoneCallback: function(filters, response) {
            this.collection.reset(response.existingFilters);
            this.onStateUpdate(response);
            this.onFilterRemove(filters);
            // treat remove all filters action as change
            this.setFiltersChanged(true);
        },

        deleteAllFilters : function() {
            return this.service.removeAll().done(_.bind(this._deleteAllFiltersDoneCallback, this, this.collection.toJSON()));
        },

        moveFilter : function(filter, from, to) {
            return this.service.reorder(from, to).done(_.bind(function(response) {
                this.collection.set(response.existingFilters);
                this.onStateUpdate(response);
            }, this));
        },

        toggleFilter : function(filter) {
            return this.service.toggleVisibility(filter.get("id"));
        },

        minimizeAllFilters : function() {
            this.collection.invoke("set", "filterPodMinimized", true);
            return this.service.minimizeAll();
        },

        maximizeAllFilters : function() {
            this.collection.invoke("set", "filterPodMinimized", false);
            return this.service.maximizeAll();
        },

        applyFilters : function() {
            // todo: refactor the error clean-up
            this.$("#filterMessage span").empty();
            this.setFiltersChanged(false);
            return this.service
                .applyFiltersAndExpression(this.collection.toExpression(), "")
                .done(_.bind(function(response) {
                    this.setFilters(response);
                    this.onApply(response);
                }, this))
                .fail(_.bind(function(response) {
                    var errors = JSON.parse(response.responseText);

                    if (errors.editFilterError) {
                        this.collection.trigger('invalid:filters', this.collection,  errors.editFilterError);
                    }
                }, this));
        }
    });
});
