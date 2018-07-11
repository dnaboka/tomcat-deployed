/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global  Sortable, Draggable, Draggables, layoutModule, isSupportsTouch, localContext */

define(function(require) {
    var jQuery = require("jquery"),
        _ = require("underscore"),
        classUtil = require("common/util/classUtil"),
        xssUtil = require("common/util/xssUtil"),
        isIE = require("common/util/browserDetection").isIE,

        i18n = require("bundle!adhoc_messages"),
        dialogs = require("components.dialogs"),
        Backbone = require("backbone"),
        aggregateFieldLabelFactory = require("adhoc/designer/aggregateFieldLabelFactory"),
        VisualizationType = require("adhoc/designer/VisualizationType"),

        // templates
        tableTemplate = require("text!adhoc/template/tableLayoutManagerTemplate.htm"),
        crosstabTemplate = require("text!adhoc/template/crosstabLayoutManagerTemplate.htm");

    require("prototype");

    var unescape = xssUtil.unescape;
    var modeExtensionMap = null;
    var onContextMenuGlobal;

    var LayoutManager = classUtil.extend( {
        axes : {},
        template : null,

        /*
         * Initialize Layout Manager with axes metadata and current state.
         * @param state Array of axes each containing axis data itself
         *              with proper axis meta-information:
         *              <p>
         *              <code>[
         *                  {
         *                      data : {},
         *                      name : "column",
         *                      element : $("axis DOM Element"),
         *                      isDependent : true,
         *                      ...
         *                      other options
         *                  },
         *                  ...,
         *                  {}
         *              ]</code>
         * @param properties Additional Layout Manager options, like: default measure group id, layout manager mode, OLAP mode, etc
         */
        constructor : function(properties) {
            this.initProperties(properties.common);
            if (!this.initialized) {
                return;
            }
            this.initModeSpecificBehavior(this.mode);
            this.initAxes(properties.axes);
            this.initEventListeners();
        },

        initProperties : function(props) {
            if (!props) {
                return;
            }
            this.measuresGroupId = props.measuresGroupId;
            this.isOlapMode = !!props.isOlapMode;
            this.mode = props.mode;
            this.element = jQuery("#" + props.id);
            this.initialized = !!this.element[0];
        },

        initModeSpecificBehavior : function(mode) {
            _.extend(this, modeExtensionMap[mode]);
            this.AxisModel = mode == VisualizationType.table ? TableAxis : CrosstabAxis;
        },

        initAxes : function(axes) {
            _.each(axes, function(axis) {
                // Clone given axis and add derived props
                var a = _.clone(axis);
                a.element = jQuery("#" + a.elementId);
                // add modified axis to map
                this.axes[a.elementId] = a;
                this.setAxisModel(a, new this.AxisModel([], {parse: true}));
            }, this);
        },

        //////////////////////////
        // Rendering
        //////////////////////////
        getTemplate : function() {
            if (this.template === null) {
                var templateText = this.mode == VisualizationType.table ? tableTemplate : crosstabTemplate;
                this.template = _.template(templateText, null, {variable : "data"});
            }
            return this.template;
        },

        render : function(state, isReRender) {
            if (!this.initialized) {
                return;
            }
            _.each(this.axes, function(axis) {
                if (!isReRender) {
                    this.setAxisModel(axis, new this.AxisModel(state[axis.name], {parse: true}));
                }
                jQuery(axis.element).html((this.getTemplate())(axis.model.toPresentation()));
                this.createSortable(axis.element[0]);
                this.createMeasuresSortable(axis.element[0]);
            }, this);
            // Reinitialize Drag observer used for moving items between axes
            Draggables.removeObserver(this.element[0]);
            Draggables.addObserver(new LayoutManagerDragObserver(this.element[0], this.onMove));
        },

        setAxisModel : function(axis, newModel) {
            axis.model = newModel;
        },

        ///////////////////////////
        // Event Handling
        ///////////////////////////
        initEventListeners : function() {
            // Bind all event handlers to current object.
            _.bindAll(this, "onContextMenu", "onRemove", "onAdd", "onMove", "onMeasureReorder");

            // TODO: jQuery!
            // We should stop observing onContextMenu old handler
            document.stopObserving(layoutModule.ELEMENT_CONTEXTMENU, onContextMenuGlobal || jQuery.noop);
            document.observe(layoutModule.ELEMENT_CONTEXTMENU, this.onContextMenu);
            onContextMenuGlobal = this.onContextMenu;

            var clickEvent = isSupportsTouch()?"touchend":"mouseup";
            jQuery(this.element).undelegate("span.remove", clickEvent);
            jQuery(this.element).delegate("span.remove", clickEvent, this.onRemove);
        },

        onContextMenu : function(event) {
            var that = this,
                levelEl = jQuery(event.memo.node).closest("li.button"),
            // TODO: unify table and crosstab classnames
                isMeasure = levelEl.hasClass("meazure") || levelEl.hasClass("member"),
                dimensionEl = levelEl.closest(isMeasure ? "li.measure" : "li.dimension");

            if (!levelEl) return;

            var axisId = jQuery(levelEl).closest("ul.sortable").attr("id"),
                axis = this.axes[axisId];

            if (!axis) return;

            Event.stop(event);

            var queryFieldName = unescape(levelEl.attr(this.nameAttr));
            var queryFieldModel = axis.model.findQueryField({name: queryFieldName});
            this.element.trigger("lm:contextMenu", _.extend(event.memo, {
                extra : {
                    axis : axis.name,
                    axisId : axisId,
                    name : queryFieldName,
                    fieldName : queryFieldModel.get("fieldName"),
                    dimensionId : unescape(levelEl.attr("data-dimension")),
                    level : unescape(levelEl.attr("data-level")),
                    index : levelEl.index(),
                    groupIndex : dimensionEl.index(),
                    isMeasure : isMeasure,
                    allLevels : levelEl.siblings().addBack().map(function() {
                        return unescape(jQuery(this).attr(that.nameAttr));
                    }).get()
                }
            }));
        },

        onRemove : function(e) {
            var item = jQuery(e.target).closest("li");
            if (isElementDragging(item)) { // do not perform item remove while drag in progress
                return;
            }
            var pos = item.index(),
                axis = this.axes[item.closest("ul.sortable").attr("id")],
                dim = unescape(item.attr("data-dimension"));
            this.element.trigger("lm:removeItem", {axis : axis.name, index : pos,
                item : {level : unescape(item.attr("data-level")), dimensionId : dim, isMeasure : this.measuresGroupId === dim}});
        },

        onAdd : function(draggable) {
            var node = draggable.node;
            if (!node) return;

            var pos = jQuery(draggable).index(),
                nodes = draggable.nodes || [node],
                axis = this.axes[jQuery(draggable).closest("ul").attr("id")],
                validator = this[axis.name].validateAdd,
                levels,
                errors = [];

            levels = this.filter(nodes, axis);
            // Validate item add to appropriate axis
            if (validator && !validator.call(this, levels, pos, axis.name, errors)) {
                !_.isEmpty(errors) && dialogs.systemConfirm.show(errors.join("</br>"), 5000);
                this.render(this.axes, true);
                return;
            }
            this.add(levels, pos, axis.name);
        },

        add : function(nodes, pos, axisName) {
            var node;
            if (_.isEmpty(nodes)) {
                return;
            } else if (nodes.length === 1) {
                node = nodes[0];
                var extra = node.param.extra || node.param; // Make this code compatible with Set adding
                this.element.trigger("lm:addItem", {
                    axis : axisName,
                    dimensionId : extra.dimensionId,
                    level : extra.id,
                    index : pos,
                    hierarchyName : extra.hierarchyName,
                    isMeasure: extra.isMeasure
                });
            } else {
                this.element.trigger("lm:addItems", {axis : axisName, levels : _.pluck(nodes, "param" ), index : pos});
            }
        },

        onMove : function(draggable, isReorder, sourceId, destId, from, to) {
            var dragEl = jQuery(draggable.element),
                source = this.axes[sourceId],
                dest = this.axes[destId],
                validator = this[dest.name].validateMove,
                errors = [];

            // Prevent unnecessary actions if nothing changed
            if (isReorder && from === to) {
                return;
            }

            if (!isReorder && validator && !validator.call(this, source, dest, dragEl, errors)) {
                !_.isEmpty(errors) && dialogs.systemConfirm.show(errors.join("</br>"), 5000);
                this.render(this.axes, true);
                return;
            }

            this.element.trigger("lm:" + (isReorder ? "moveItem" : "switchItem"),
                {axis : dest.name, item : unescape(dragEl.attr(this.moveAttr)), from : from, to : to});
        },

        onMeasureReorder : function(list, draggable) {
            var measureEl = jQuery(draggable.element);
            this.element.trigger("lm:measureReorder", {measure : unescape(measureEl.attr("data-level")), to: measureEl.index()});
        },

        /////////////////////////////
        // Drag'n'Drop
        /////////////////////////////
        createSortable : function(element) {
            Sortable.create(element, {
                delay: (isIE() ? 200 : 0),
                constraint: false,
                overlap: "horizontal",
                containment: _(this.axes).keys(),
                dropOnEmpty: true,
                accept: ["measure", "dimension", "meazure", "dimenzion"],
                onDrop : this.onAdd
            });
            // Anyway, remove newly create observers for axis.
            Draggables.removeObserver(element);
        },

        createMeasuresSortable : function(element) {
            var measureGroup = jQuery("li.measure > ul.members", element);
            if (measureGroup.length === 0) return;

            // Remove Sortable if measures group is empty
            if (measureGroup.find("li.member").length === 0) {
                Sortable.destroy(measureGroup[0]);
                return;
            }
            Sortable.create(measureGroup[0], {
                delay: (isIE() ? 200 : 0),
                constraint: false,
                overlap: "horizontal",
                onUpdate: this.onMeasureReorder
            });
        }
    });

    /////////////////////////
    // Helper Functions
    /////////////////////////

    /**
     * Compile template with overridden template options
     * We are using Mustache-like syntax {{ }}
     * @param templateId
     };

     /**
     * Retrieves all leaf nodes
     * @param nodes
     */
    function getNodeLeaves(nodes) {
        return _.inject(nodes, function (levels, node) {
            return levels.concat(toLeavesArray(node));
        }, []);
    }

    /**
     * Recursively traverse tree and retrieve all leaves.
     * @param node initial parent node.
     * @param arr array where to put found leaves.
     */
    function toLeavesArray(node, arr) {
        var array = arr || [];
        if (!node.childs || node.childs.length === 0) {
            array.push(node);
            return  array;
        }
        for (var i = 0; i < node.childs.length; i++) {
            toLeavesArray(node.childs[i], array);
        }
        return array;
    }

    function isElementDragging(element) {
        return Draggable._dragging[element.jquery ? element[0] : element];
    }

    var LayoutManagerDragObserver = classUtil.extend({
        constructor: function(element, observer) {
            // TODO jQuery!
            this.element = $(element);
            this.observer = observer;
            this.axes = ["olap_rows", "olap_columns"];
        },

        onStart: function(eventName, draggable) {
            this.axis = this.getAxis(draggable);
            this.from = jQuery(draggable.element).index();
            if(isIE()) {
                this.changedElement = draggable.element;
                if (this.changedElement) {
                    this.changedElement.setStyle({ display: "inline-block" });
                    this.changedElement.hasClassName("measure") && this.changedElement.setStyle({ padding: "0px" });
                }
            }
        },

        onEnd: function(eventName, draggable) {
            // If move started not from axis, but from tree, for example
            if (!this.axis) return;

            var destinationAxis = this.getAxis(draggable);
            // Return, if drop place is not an axis.
            if (!destinationAxis || this.axes.indexOf(destinationAxis.id) === -1) return;

            Sortable.unmark();
            var isReorder = this.axis.id === destinationAxis.id,
                to = jQuery(draggable.element).index();

            this.observer(draggable, isReorder, this.axis.id, destinationAxis.id, this.from, to);
            if (isIE() && this.changedElement) {
                this.changedElement.style.removeAttribute("display");
                this.changedElement.style.removeAttribute("padding");
            }
        },

        getAxis : function(draggable) {
            return draggable.element.up("ul");
        }
    });

    modeExtensionMap = {
        table : {
            nameAttr : "data-name",
            moveAttr : "data-name",
            // Filter out all values that already available in Layout Manager
            filter : function(nodes, axis) {
                nodes = getNodeLeaves(nodes);

                // Don't filter out duplicated items in column axis
                if (axis.name === "column") return nodes;

                return _.reject(nodes, function(n) {
                    var extra = n.param.extra;
                    return extra.name !== "_spacer" && axis.model.findWhere({fieldName : extra.fieldName});
                });
            },
            group : {
                validateAdd : function(nodes, pos, axisName, errorMessages) {
                    if (nodes.length === 0) {
                        errorMessages && errorMessages.push(i18n["ADH_1001_ERROR_ALREADY_IN_USE"]);
                        return false;
                    }
                    if (_.any(nodes, function(node) {return node.param.extra.isMeasure || node.param.extra.id === "_spacer";})) {
                        errorMessages && errorMessages.push(i18n["ADH_1001_ERROR_ADD_TO_GROUPS"]);
                        return false;
                    }
                    return true;
                },
                validateMove : function(source, dest, level, errorMessages) {
                    if (level.hasClass("meazure")) {
                        errorMessages && errorMessages.push(i18n["ADH_1001_ERROR_ADD_TO_GROUPS"]);
                        return false;
                    }
                    var fieldName = unescape(level.attr("data-fieldName"));
                    if (dest.model.findWhere({fieldName: fieldName})) {
                        errorMessages && errorMessages.push(i18n["ADH_1001_ERROR_ALREADY_IN_GROUP"]);
                        return false;
                    }
                    return true;
                }
            },
            column : {
                validateAdd : function(nodes, pos, axisName, errorMessages) {
                    if (nodes.length === 0) {
                        errorMessages && errorMessages.push(i18n["ADH_1001_ERROR_ALREADY_IN_USE"]);
                        return false;
                    }
                    return true;
                }
            }
        },
        crosstab : {
            nameAttr : "data-level",
            moveAttr : "data-dimension",
            filter : function(nodes) {
                // We doesn't support multiselect for OLAP, so pick first selected node
                nodes = getNodeLeaves(this.isOlapMode ? nodes.slice(0, 1) : nodes);
                var isNonOlapMeasure = !this.isOlapMode && _.any(nodes, function(n) {return n.param.extra && n.param.extra.isMeasure;});
                // Don't filter out duplicated measures in non-OLAP mode
                if (isNonOlapMeasure) return nodes;

                return _.reject(nodes, function(n) {
                    var extra = n.param.extra;
                    var fieldSearchCriteria = {dimensionName : extra.dimensionId};
                    fieldSearchCriteria[this.isOlapMode ? "name" : "fieldName"] = extra.id;
                    return !this.isDate(extra) && extra.name !== "_spacer" &&
                        _.any(this.axes, function(axis) {
                            return axis.model.findQueryField(fieldSearchCriteria);
                        });
                }, this);
            },
            isDate : function(level) {
                return level.type === "Timestamp" || level.type === "Date" || level.type === "Time";
            },
            row : {
                validateMove : function(source, dest, level, errorMessages) {
                    // Do not allow move items from columns if it will become empty after it.
                    return !(dest.isDependent && source.model.length == 1);
                },
                validateAdd : function(nodes, pos, axisName, errorMessages) {
                    if (_.isEmpty(nodes)) {
                        errorMessages && errorMessages.push(i18n["ADH_1215_FIELD_IN_USE"]);
                        return false;
                    }
                    var that = this, extra = nodes[0].param.extra,
                        columnDimensions = this.axes["olap_columns"].model;

                    return !_.isEmpty(nodes)
                        && !(this.axes["olap_rows"].isDependent &&
                            (columnDimensions.isEmpty() || extra.hierarchyName && columnDimensions.length === 1 && columnDimensions.at(0).name === extra.dimensionId))

                        && !localContext.showAddHierarchyConfirm(extra.hierarchyName, extra.dimensionId, function() {
                            that.add(nodes, pos, axisName);
                        });
                }
            },
            column : {
                validateAdd : function(nodes, pos, axisName, errorMessages) {
                    if (_.isEmpty(nodes)) {
                        errorMessages && errorMessages.push(i18n["ADH_1215_FIELD_IN_USE"]);
                        return false;
                    }
                    var that = this, extra = nodes[0].param.extra;

                    return !localContext.showAddHierarchyConfirm(extra.hierarchyName, extra.dimensionId, function() {
                        that.add(nodes, pos, axisName);
                    });
                }
            }
        }
    };

    // Model Helpers
    /**
     * Convert Backbone collection to presentation
     *
     * @param collection
     * @returns {*} array of presentation models
     */
    function collectionToPresentation(collection) {
        return collection.map(function(model) {
            return model.toPresentation();
        });
    }

    var Field = Backbone.Model.extend({
        parse: function(level) {
            var isMeasure = level.measure || !!level.isSpacer,
                currentName = level.currentDisplayName !== "_null" ? level.currentDisplayName : null;
            return {
                name: level.name,
                fieldName: level.fieldName,
                label : level.isSpacer ? i18n["ADH_120_SPACER"] : (currentName || level.name),
                isSpacer : !!level.isSpacer,
                isMeasure : isMeasure
            }
        },

        toPresentation: function() {
            var presentation = this.toJSON();

            presentation.cid = _.uniqueId("field_");
            presentation.itemClass = presentation.isMeasure ? "meazure" : "dimenzion";

            return presentation;
        }
    });

    var Level = Backbone.Model.extend({

        parse: function(field, options) {
            return {
                // Name is used for interaction with external subsystems
                name : field.name,
                fieldName: field.fieldName,
                label : field.display ? field.display : field.name,
                isMeasure : false,
                dimensionName: options.collection.name
            };
        },

        toPresentation: function() {
            var presentation = this.toJSON();
            presentation.cid = _.uniqueId("level_");
            presentation.levelClass = "level";
            return presentation;
        }
    });

    var Measure = Backbone.Model.extend({

        parse: function(field, options) {
            return {
                // Name is used for interaction with external subsystems
                name : field.name,
                fieldName: field.fieldName,
                label : aggregateFieldLabelFactory.getLabel(field),
                isMeasure : true,
                dimensionName: options.collection.name
            };
        },

        toPresentation: function() {
            var presentation = this.toJSON();
            presentation.cid = _.uniqueId("measure_");
            presentation.levelClass = "member";
            return presentation;
        }
    });

    var Dimension = Backbone.Collection.extend({
        model : function(attrs, options) {
            options = _.defaults(options, {parse: true});
            if (options.collection.isMeasure) {
                return new Measure(attrs, options);
            } else {
                return new Level(attrs, options);
            }
        },

        toPresentation: function() {
            var levels = collectionToPresentation(this);
            return {
                levels: levels,
                name: this.name,
                liClass: this.isMeasure ? "measure" : "dimension",
                ulClass: this.isMeasure ? "members" : "levels",
                measureHandle: this.isMeasure ? "handle" : ""
            }
        },

        parse: function(jsonDimension) {
            var levels = [];

            this.name = jsonDimension.name;

            // Collect all levels from group.
            for (var levelIndex = 0; levelIndex < jsonDimension.levels.length; levelIndex++) {
                var jsonLevel = jsonDimension.levels[levelIndex];

                // Skip level if it's invisible or is a second or next recursive level
                if (!jsonLevel.visible || jsonLevel.recursiveLevelNumber > 0) continue;

                if (!_.isEmpty(jsonLevel.members)) {
                    // Update group with measure specific properties
                    this.isMeasure = true;
                    for (var memberIndex = 0; memberIndex < jsonLevel.members.length; memberIndex++) {
                        var jsonMember = jsonLevel.members[memberIndex];

                        // Skip All Spacers
                        if (jsonMember.isSpacer === true) continue;

                        levels.push(jsonMember);
                    }
                } else {
                    levels.push(jsonLevel);
                }
            }
            return levels;
        }

    });

    var TableAxis = Backbone.Collection.extend({
        model: Field,
        toPresentation: function() {
            return collectionToPresentation(this);
        },

        findQueryField: function(criteria) {
            return this.findWhere(criteria);
        }
    });

    var CrosstabAxis = Backbone.Collection.extend({
        model: Dimension,

        toPresentation: function() {
            return collectionToPresentation(this);
        },

        findQueryField: function(criteria) {
            var field = null;
            this.any(function(d) {
                return (field = d.findWhere(criteria));
            });
            return field;
        }
    });
    return LayoutManager;
});
