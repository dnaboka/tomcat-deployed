/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        featureDetection = require("common/util/featureDetection"),
        actionModel = require("actionModel.modelGenerator"),
        Backbone = require("backbone"),
        filterOperators = require("adhoc/filter/enum/filterOperators"),
        filterOperatorLabelFactory = require("adhoc/filter/factory/filterOperatorLabelFactory"),
        valueEditorFactory = require("adhoc/filter/factory/valueEditorFactory"),
        possibleOperatorsFactory = require("adhoc/filter/factory/possibleOperatorsFactory"),
        i18n = require("bundle!AdHocFiltersBundle"),
        filterEditorTemplate = require("text!adhoc/filter/editor/template/filterEditorTemplate.htm");

    return Backbone.View.extend({
        template: _.template(filterEditorTemplate),

        isOlap: false,

        el : function() {
            var viewData = this.model.toJSON();
            viewData.i18n = i18n;

            return this.template(viewData);
        },

        events : (function() {
            var events = {
                "click .header .operator" : "showOperatorMenu",
                "click .header .button.disclosure" : "onToggleFilter"
            };

            if (featureDetection.supportsTouch) {
                events["click .header .mutton"] = "showFilterMenu";
            } else {
                events["mouseover .header .mutton"] = "showFilterMenu";
            }

            return events;
        })(),

        operators : {},

        initialize : function() {
            var self = this;

            this.valueEditorUIChanged = false;

            _.bindAll(this, "removeFilter", "upFilter", "downFilter", "drawToggleFilter");

            this.operationsMenuActionModel = this.createOperationsMenuActionModel();
            this.filterMenuActionModel = this.createFilterMenuActionModel();

            this.listenTo(this.model, "operationChange", this.render);
            this.listenTo(this.model, "ready", this.render);
            this.listenTo(this.model, "change:filterPodMinimized", this.drawToggleFilter);
            this.listenTo(this.model, "change:filterLetter", this.redrawFilterTitle);
            this.listenTo(this.model, "change:label", this.redrawFilterTitle);

            this.model.loadAdditionalServerData(true).done(function() { self.model.trigger("ready", self.model); });
        },

        redrawFilterTitle: function() {
            this.$(".filterName span").text(this.model.get("filterLetter") + "." + this.model.get("label"));
            this.$(".filterName span").attr("title", this.model.get("filterLetter") + "." + this.model.get("label"));
        },

        resizeTitle: function() {
            var widthWithoutFilterName = this.$(".header .button.disclosure").width()
                + this.$(".header .button.operator div").width() + this.$(".header .button.operator .icon").width()
                + this.$(".header .button.mutton").width() + 15; // 10 is for some padding

            var totalWidth = this.$(".header .title").width();
            var $filterNameEl = this.$(".header .filterName");
            $filterNameEl.css({
                overflow: "visible",
                width: "auto"
            });

            var filterNameWidth = $filterNameEl.find("span").width() + this.$(".header .button.disclosure").width() + 15;
            $filterNameEl.css("overflow", "hidden");
            $filterNameEl.width(Math.min(totalWidth - widthWithoutFilterName, filterNameWidth));
        },

        render : function() {
            var operatorName = this.model.get("operatorName"),
                factory = this.getValueEditorFactory();

            this.renderOperator();

            // we don't need to re-create value editor in case if it stays the same
            // so we will try to "update" value editor if it supports such ability
            if (!this.valueEditor || this.valueEditor.constructor != factory.constructor) {
                if (this.valueEditor) {
                    this.stopListening(this.valueEditor, "rendered", this.uiChanged);
                    this.valueEditor.remove();
                } else {
                    // for some very strange reason in IE10 .body container is not displayed
                    // after we added filter by dragging it to the filters panel.
                    // so here we firstly minimize the whole filter and then maximize it with timeout of 1 ms.
                    this.$(".filter.panel").addClass("minimized");

                    _.defer(_.bind(this.drawToggleFilter, this));
                }

                this.valueEditor = this.createValueEditor();
            }
            this.valueEditor.updateData();

            return this;
        },

        uiChanged: function() {
            // notify all watchers that something in UI of filter editor was changed
            this.trigger("uiChange:filters", this);
        },

        createValueEditor: function() {
            var factory = this.getValueEditorFactory(),
                valueEditor = factory.createInstance(this.model);

            // Not all types of value editors have finally rendered HTML just after creation.
            // For example, SingleSelect and MultiSelect components have final HTML markup only after additional
            // data is fetched from server. That's why we have a custom "rendered" event.
            this.listenTo(valueEditor, "rendered", this.uiChanged);

            this.$(".body").html(valueEditor.$el);

            return valueEditor;
        },

        renderOperator : function() {
            this.$(".operator div").text(filterOperatorLabelFactory(this.model.get("operatorName"), this.model.get("filterDataType")));
            this.resizeTitle();
        },

        showOperatorMenu : function(event) {
            actionModel.showDynamicMenu("filterOperation_" + this.cid, event.originalEvent, "menu vertical dropDown fitable", null, this.operationsMenuActionModel);
        },

        showFilterMenu : function(event) {
            actionModel.showDynamicMenu(this.cid, event.originalEvent, "menu vertical dropDown fitable", null, this.filterMenuActionModel);
            // do not propagate event further, as global event handler in buttonManager adds additional classes to button
            event.stopPropagation();
        },

        onToggleFilter : function() {
            this.model.set("filterPodMinimized", !this.model.get("filterPodMinimized"));
            this.model.trigger("toggle", this.model);
        },

        drawToggleFilter : function() {
            this.$(".filter.panel")[this.model.get("filterPodMinimized") ? "addClass" : "removeClass"]("minimized");
        },

        removeFilter : function(options) {
            var force = options && options.force;
            if (this.model.get("used") && !force) {
                this.model.trigger('destroyConfirm', this.model, this.model.collection);
            } else {
                this.model.trigger('destroy', this.model, this.model.collection);
            }
        },

        upFilter : function() {
            this.model.trigger("move", this.model, { direction : -1 });
        },

        downFilter : function() {
            this.model.trigger("move", this.model, { direction : 1 });
        },

        getValueEditorFactory: function() {
            var factory = valueEditorFactory(this.model.get("filterDataType"), this.model.get("operatorName"), this.isOlap);

            if (!factory) {
                throw "Value editor for filter data type '" + this.model.get("filterDataType") + "' and operator '"
                    + this.model.get("operatorName") + "' does not exist";
            }

            return factory;
        },

        createOperationsMenuActionModel : function() {
            var that = this;
            var menuModel = {};

            menuModel["filterOperation_" + this.cid] =
                _.map(possibleOperatorsFactory(this.model.get("filterDataType"), this.isOlap), function (op) {
                    return actionModel.createMenuElement("optionAction", {
                        text: filterOperatorLabelFactory(op, that.model.get("filterDataType")),
                        action: function (operator) {
                            that.model.set("operatorName", operator);
                        },
                        actionArgs: [op],
                        isSelectedTest : function(op) {
                            return that.model.get("operatorName") === op;
                        },
                        isSelectedTestArgs : [op]
                    });
                });

            return menuModel;
        },

        createFilterMenuActionModel : function() {
            var menuModel = {};

            menuModel[this.cid] = [
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_1217_DYNAMIC_FILTER_REMOVE_FILTER,
                    action : this.removeFilter
                }),
                actionModel.createMenuElement("separator"),
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_084_MOVE_UP,
                    action : this.upFilter
                }),
                actionModel.createMenuElement("simpleAction", {
                    text : i18n.ADH_085_MOVE_DOWN,
                    action : this.downFilter
                })
            ];
            return menuModel;
        },

        remove : function() {
            this.valueEditor && this.valueEditor.remove();
            Backbone.View.prototype.remove.call(this);
            return this;
        }
    });
});