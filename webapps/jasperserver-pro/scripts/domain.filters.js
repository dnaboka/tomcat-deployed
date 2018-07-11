/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

////////////////////////////////////////////////
//  Domain Filtering Common Logic
////////////////////////////////////////////////

/* jshint undef: false */

var DateAndTimePicker;

require([
    "components/dateAndTime/DateAndTimePicker"
], function (DateAndTimePickerModule) {
    DateAndTimePicker = DateAndTimePickerModule;
});


// Mapping between data types and editor types.
domain.typesMap = {
    'Integer':'number',
    'Decimal':'number',
    'BigDecimal':'number',
    'Time':'date',
    'Date':'date',
    'Timestamp':'date',
    'String':'string',
    'Boolean':'boolean'
};

domain.javaNumericTypesValidation = {
    'java.lang.Double':{min:-Infinity, max:Infinity},
    'java.math.BigDecimal':{min:-Infinity, max:Infinity},
    'java.lang.Long':{'min':'-9223372036854775808', 'max':'9223372036854775807'},
    'java.lang.Integer':{'min':'-2147483648', 'max':'2147483647'},
    'java.lang.Short':{'min':'-32768', 'max':'32767'},
    'java.lang.Byte':{'min':'-128', 'max':'127'}
};

domain.getNumberBounds = function (javaType) {
    return domain.javaNumericTypesValidation[javaType];
};

domain.filter = {
    CALENDAR_DATE_FORMAT:"M dd yy",
    CALENDAR_TIMESTAMP_FORMAT:"M dd yy",
    CALENDAR_TIME_FORMAT:"HH:mm:ss",

    init:function (initParams) {
        this.TIMEZONE_OFFSET = initParams.timeOffset;
        // Default DATE format values.
        this.FILTER_DATE_FORMAT = initParams.dateFormat || 'MMM dd yyyy';
        this.FILTER_TIMESTAMP_FORMAT = initParams.dateTimeFormat || 'MMM dd yyyy HH:mm:ss';
        this.FILTER_TIME_FORMAT = initParams.timeFormat || 'HH:mm:ss';

        this.CALENDAR_DATE_FORMAT = initParams.calendarDateFormat || "M dd yy";
        this.CALENDAR_TIMESTAMP_FORMAT = initParams.calendarDateTimeFormat || "M dd yy";
        this.CALENDAR_TIME_FORMAT = initParams.calendarTimeFormat || "HH:mm:ss";

        // Number symbols
        this.DECIMAL_SEPARATOR = initParams.decimalSeparator || '.';
        this.GROUPING_SEPARATOR = initParams.groupingSeparator || ',';

        this.numberFormat = domain.NumberFormat(this.DECIMAL_SEPARATOR, this.GROUPING_SEPARATOR);

        // re-Initialize global Calendar constants.
        MONTH_NAMES = Calendar._SMN;
        DAY_NAMES = Calendar._SDN;

        this.ATTRIBUTES_PATTERN = new RegExp("\\s*attribute\\s*\\(\\s*'[^\\/'\\s][^\\/']*'(?:\\s*,\\s*'[^\\/'\\s][^\\/']*')*\\s*\\)\\s*");
        this.ATTRIBUTE_VALUE_PATTERN = new RegExp("'(.*)'");

        // Initializes Java to Data type mapping
        domain.javaToDataTypeMap = initParams.javaToDataTypeMap;
    },

    toNumber:function (value) {
        return this.numberFormat.toNumber(value);
    },

    normalizeNumberEntry:function (value) {
        return this.numberFormat.normalizeNumberEntry(value);
    },

    toString:function (object) {
        var type = typeof object;

        switch (type) {
            case 'undefined':
            case 'function':
            case 'unknown':
                return "{''}";
            case 'boolean':
            case 'number':
            case 'string':
                return '{' + object.toString() + '}';
        }
        if (object === null) return "{''}";

        if (Object.isArray(object)) {
            return '{' + this.arrayToString(object) + '}';
        }
    },

    arrayToString:function (array) {
        return array.collect(function (element) {
            return isNotNullORUndefined(element) && element !== '' ? element : "''";
        }).join(', ');
    }
};

/**
 * FilerItem object constructor.
 * FilterItem can be initialized with json object(when restore state from session)
 * or tree node (when adding new field).
 * @param {Object} params Has <code>node</code> or <code>json</code> properties for initialization.
 */
domain.FilterItem = function (params) {
    if (!params || !(params['node'] || params['json'])) {
        throw("Trying to create FilterItem with empty input");
    }
    this.fieldId = null;
    this.id = null;
    this.name = null;
    this.type = null;
    this.value = null;
    this.comparison = "";
    this.locked = null;
    this.dataType = null;
    this.javaType = null;
    this.index = 1;
    if (params.node) {
        this._initNode(params.node);
    } else {
        this._initJson(params.json);
    }
};

_.extend(domain.FilterItem.prototype, {
    _initNode : function (node) {
        if (!node || !node.param || !node.param.extra) {
            return;
        }
        var extra = node.param.extra;
        this.setFieldId(node.param.id);
        this.name = node.name;
        this.value = [];
        this.locked = false;

        this.javaType = extra['JavaType'];
        // TODO: Someday we need to implement one approach for mapping server to client types. This is workaround.
        if (domain.javaToDataTypeMap && this.javaType) {
            extra['dataType'] = domain.javaToDataTypeMap[this.javaType];
        }
        this.dataType = extra['dataType'];
        this.type = domain.typesMap[this.dataType];
    },

    _initJson : function (json) {
        if (!json) {
            return;
        }
        this.init = true;
        this.setFieldId(json['fieldId']);
        this.name = json['fieldName'];
        this.type = json['ruleTypeId'] || json['ruleType'];
        this.setValues(json['value'] || json['values']);
        this.locked = !json['isParameter'];
        this.comparison = json['comparisonId'] || json['comparison'];
        this.dataType = json['dataType'];
        this.javaType = json['javaType'] || json['JavaType'];
    },

    setFieldId : function (value) {
        this.fieldId = value;
        this.id = this.normalizeIdentifier(value);
    },

    setValues : function (values) {
        if (this.type === 'field') {
            this.field2Id = values[0];
            var node = _.find(dynamicTree.nodes, function (value) {
                return value.param.id === values[0];
            });
            this.name2 = node && node.name
        } else if (this.type === 'string' && values[0] === null) {
            values = [domain.getMessage('filter_null_value')];
        }
        this.value = values;
    },

    getValues : function () {
        return this.type === 'field' ? [this.field2Id] : this.value;
    },

    normalizeIdentifier : function (id) {
        return id && id.length > 0 ? id.gsub(/[.]/, '_').gsub(/[\W]/, '') : id;
    },

    updateIndex : function (index) {
        this.index = index;
        this.id += '_' + index;
        if (!this.init) {
            this.name += '_' + index;
        }
    },

    toJSON: function () {
        return {
            'fieldId':this.fieldId,
            'fieldName':this.name,
            'ruleTypeId':this.type,
            'value':this.getValues(),
            'isParameter':!this.locked,
            'comparisonId':this.comparison,
            'dataType':this.dataType,
            'javaType':this.javaType
        };
    },

    initFieldFilterItem : function (filterItem) {
        this.type = 'field';
        this.field2Id = filterItem.fieldId;
        this.name2 = filterItem.name;
        this.value = [this.name2];
    }
});

domain.FilterList =  function (object) {
    this._valueList = [];
    this._keyPositionMapping = {};
    if (!object) return;

    if (typeof(object) === 'object') {
        for (var key in object) {
            this.set(key, object[key]);
        }
    }

};

_.extend(domain.FilterList.prototype, {

    reIndex : function(i, inc) {
        var pos;
        for (var k in this._keyPositionMapping) {
            pos = this._keyPositionMapping[k];
            if (pos > i) this._keyPositionMapping[k] = pos + inc;
        }
    },

    unset : function(key) {
        this._valueList.splice(this._keyPositionMapping[key], 1);
        this.reIndex(this._keyPositionMapping[key], -1);
        delete this._keyPositionMapping[key];
    },

    set : function(key, value, position) {
        if (this._keyPositionMapping[key] >= 0) {
            this._valueList.splice(this._keyPositionMapping[key], 1, value);
        } else {
            position = (position >= 0) ? position : this._valueList.length;
            this._valueList.splice(position, 0, value);
            if (position < this._valueList.length - 1) {
                this.reIndex(position - 1, 1);
            }
            this._keyPositionMapping[key] = position;
        }
    },

    get : function(key) {
        return this._valueList[this._keyPositionMapping[key]];
    },

    size : function() {
        return this._valueList.length;
    },

    values : function() {
        return this._valueList.clone();
    },

    collect : function(iterator) {
        return _.collect.call(_, this._valueList, iterator);
    }
});

/**
 *    Abstract Filter Editor "class". Use domain.FilterEditor.prototype.create()
 * factory method to create appropriate editor instance depending on filter value type.
 *
 * @param filterValue
 */
domain.FilterEditor = function (filterValue, flowExecutionKey) {
    this.filterValue = filterValue;
    if (flowExecutionKey) {
        this.flowExecutionKey = flowExecutionKey;
    }
    this.init();
};

_.extend(domain.FilterEditor.prototype, {
    EDITOR_TEMPLATE : 'editorTemplate',

    create : function (filterValue, flowExecutionKey) {
        if (!filterValue || !filterValue.type) {
            return null;
        }
        var editor = null;
        switch (filterValue.type) {
            case 'string' :
                editor = new domain.StringFilterEditor(filterValue, flowExecutionKey);
                break;
            case 'number' :
                editor = new domain.NumberFilterEditor(filterValue);
                break;
            case 'date' :
            case 'time' :
                editor = new domain.DateFilterEditor(filterValue);
                break;
            case 'boolean' :
                editor = new domain.BooleanFilterEditor(filterValue);
                break;
            case 'field' :
                editor = new domain.FieldFilterEditor(filterValue);
                break;
            default:
                throw("Unsupported editor type: [#{editorType}]"
                    .interpolate({editorType:filterValue.type}));
        }
        return editor;
    },

    /**
     * Filter Editor initialization.
     */
    init : function () {
        this.valueEditorsCache = {};
        this.valueEditorsFactory = this.createValueEditorsFactory();
        this.initTemplate();
        this.initComparisons(this.getFirstComparison());
        this.initEventHandlers();
    },

    createValueEditorsFactory : function () {
        return {};
    },

    /**
     * Abstract method. Put here action that must be performed later, after editor has been drawn.
     */
    afterDraw : function () {
        this.fillinTemplate();
    },

    beforeRemove : function () {
        this.removeEventHandlers();
    },

    initTemplate : function () {
        this.editorTemplate = this._cloneTemplate(this.EDITOR_TEMPLATE);
        this.fieldNameElement = this.editorTemplate.select('.fieldName').first();
    },

    /**
     * Refreshes editor fields according to model state.
     */
    fillinTemplate : function () {
        this.fieldNameElement.update(xssUtil.escape(this.getOriginalValue().name));
        this.updateFilterValueEditor();
    },

    initComparisons : function (comparisonId) {
        this._comparisons = this.createComparisons();
        this.comparisonId = comparisonId;

        this.comparisonsSelect = this.editorTemplate.select("#fieldAndOperation select")[0];
        this._comparisons.each(function (cmp, i) {
            var attributes = {
                id:cmp,
                title:domain.getMessage(cmp)
            };
            if (cmp === comparisonId) {
                attributes.selected = 'selected';
                this.selectedIndex = i;
            }
            var option = new Element('option', attributes).insert(domain.getMessage(cmp));
            this.comparisonsSelect.insert(option);
        }.bind(this));
    },

    getFirstComparison : function () {
        return this.getOriginalValue().comparison || 'equals';
    },

    initEventHandlers : function () {
        this.comparisonsSelect.observe('change', this.comparisonSelectedHandler.bindAsEventListener(this));
        this.getTemplate().observe('submit', function (event) {
            Event.stop(event);
        })
    },

    removeEventHandlers : function () {
        Event.stopObserving(this.comparisonsSelect);
        Event.stopObserving(this.getTemplate());
    },

    comparisonSelectedHandler : function (event) {
        this.comparisonId = domain.getSelectedOptionId(event.element());
        this.updateFilterValueEditor();
    },

    updateFilterValueEditor : function () {
        this.valueEditor = this.createValueEditor(this.comparisonId);
        var template = this.valueEditor.getTemplate();
        this.editorTemplate.select('#values')[0].replace(template);
        this.valueEditor.afterDraw();
    },

    createValueEditor : function (comparisonId) {
        if (!comparisonId) {
            return null;
        }
        var className = this.getFactoryKey(comparisonId);
        var editor = this.valueEditorsCache[className];
        if (!editor) {
            try {
                editor = this.valueEditorsFactory[className](
                    this.getOriginalValue.bind(this), comparisonId, this.flowExecutionKey);

                this.valueEditorsCache[className] = editor;
            } catch (e) {
                throw("Editor for #{name} is undefined".interpolate({name:className}));
            }
        }
        return editor;
    },

    /**
     * Refreshes tree item state according to editor state.
     * NOTE: <b>this</b> links to current tree item instance.
     *
     * @param element
     */
    processTemplate : function (element) {

        var fieldName = element.select(".fieldName")[0];
        var operation = element.select(".operation")[0];
        var value = element.select(".value")[0];
        var lockState = element.select(".lock")[0];

        var filterEditor = this.getValue();
        var filterValue = filterEditor.getOriginalValue();

        fieldName.update(xssUtil.escape(filterValue.name));
        operation.update(xssUtil.escape(domain.getMessage(filterValue.comparison)));
        value.update(xssUtil.escape(filterEditor.getFormattedValue()));
        filterEditor.lockStatusElement && lockState.update(!!filterValue.locked ?
            xssUtil.escape(domain.getMessage('domain.filter.locked')) :
            xssUtil.escape(domain.getMessage('domain.filter.unlocked')));

        var formId = "f" + filterValue.id + "_filter";
        if (!($$('#' + formId)[0])) {
            var template = filterEditor.getTemplate();
            template.removeClassName('hidden');
            element.appendChild(template);
            template.writeAttribute('id', formId);
        }
        return element;
    },

    getTemplate : function () {
        return this.editorTemplate;
    },

    getOriginalValue : function () {
        return this.filterValue;
    },

    getFormattedValue : function () {
        return domain.filter.toString(this.getOriginalValue().value);
    },

    resetToCurrentEditor : function () {
        this.comparisonId = this.getOriginalValue().comparison;
        this.comparisonsSelect.selectedIndex = this.selectedIndex;
    },

    /**
     * Use this method to apply last changes in editor.
     */
    applyEditorValue : function () {
        this.filterValue = this.getValue();
        this.selectedIndex = this.comparisonsSelect.selectedIndex;
    },

    /**
     * Cancels recent editor's changes.
     */
    cancel : function () {
        this.resetToCurrentEditor();
        disableSelectionWithoutCursorStyle($(document.body))
        if (this.valueEditor) this.valueEditor.cancel();
    },

    getValue : function () {
        var newFilterValue = deepClone(this.getOriginalValue());
        newFilterValue.value = this._toArray(this.valueEditor.getValue());
        newFilterValue.comparison = this.comparisonId;
        return newFilterValue;
    },

    validate : function () {
        return this.valueEditor.validate();
    },

    _cloneTemplate : function (tmpl) {
        return Element.clone(tmpl, true) || null;
    },

    _toArray : function (value) {
        return Object.isArray(value) ? value : [value];
    },

    handleClick : function (element) {
        this.valueEditor && domain.FilterValueEditor.handleClick.call(this.valueEditor, element);
    }
});

/**
 * Implementation of String Filter Editor.
 */
domain.StringFilterEditor = function (filterValue, flowExecutionKey) {
    domain.FilterEditor.call(this, filterValue, flowExecutionKey);
};
domain.StringFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);

domain.StringFilterEditor.addMethod('createComparisons', function () {
    return ['isOneOf', 'isNotOneOf',
        'equals', 'doesNotEqual',
        'contains', 'doesNotContain',
        'startsWith', 'doesNotStartWith',
        'endsWith', 'doesNotEndWith'
    ];
});

domain.StringFilterEditor.addMethod('getFactoryKey', function (comparisonId) {
    switch (comparisonId) {
        case 'isOneOf' :
        case 'isNotOneOf' :
            return "MultipleValuesEditor";
        case 'equals' :
        case 'doesNotEqual' :
            return "ComboSelectEditor";
        case 'contains':
        case 'doesNotContain':
        case 'startsWith':
        case 'doesNotStartWith':
        case 'endsWith' :
        case 'doesNotEndWith' :
            return "StringValueEditor";
        default :
            throw("Undefined Value type : #{valueType}"
                .interpolate({valueType:comparisonId}));
    }
});

domain.StringFilterEditor.addMethod('createValueEditorsFactory', function () {
    return {
        'MultipleValuesEditor':function (originalValue, comparisonId, flowKey) {
            return new domain.MultipleValuesEditor(originalValue, comparisonId, flowKey);
        },
        'ComboSelectEditor':function (originalValue, comparisonId, flowKey) {
            return new domain.ComboSelectEditor(originalValue, comparisonId, flowKey);
        },
        'StringValueEditor':function (originalValue, comparisonId, flowKey) {
            return new domain.StringValueEditor(originalValue, comparisonId, flowKey);
        }
    };
});

/**
 * Implementation of Number Filter Editor.
 */
domain.NumberFilterEditor = function (filterValue) {
    domain.FilterEditor.call(this, filterValue);
};
domain.NumberFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);

domain.NumberFilterEditor.addMethod('createComparisons', function () {
    return [
        'equals', 'isNotEqualTo',
        'isGreaterThan', 'lessThan',
        'isGreaterThanOrEqualTo',
        'isLessThanOrEqualTo',
        'isBetween', 'isNotBetween'
    ];
});

domain.NumberFilterEditor.addMethod('createValueEditor', function (comparisonId) {
    if (!comparisonId) {
        return null;
    }
    var valueEditor = null;
    switch (comparisonId) {
        case 'equals':
        case 'isNotEqualTo':
        case 'isGreaterThan':
        case 'lessThan':
        case 'isGreaterThanOrEqualTo':
        case 'isLessThanOrEqualTo' :
            valueEditor = new domain.NumberValueEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        case 'isBetween':
        case 'isNotBetween':
            valueEditor = new domain.NumberRangeEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        default :
            throw("Undefined Value type : #{valueType}"
                .interpolate({valueType:comparisonId}));
    }
    return valueEditor;
});

domain.NumberFilterEditor.addMethod('getFormattedValue', function () {
    var filter = this.getOriginalValue();
    switch (filter.comparison) {
        case 'isBetween' :
        case 'isNotBetween' :
            return '{' + filter.value.join(' and ') + '}';
        default :
            return filter.value[0];
    }
});

domain.NumberFilterEditor.addMethod('updateFilterValueEditor', function () {
    domain.FilterEditor.prototype.updateFilterValueEditor.call(this);
    this.registerBlurHandlers();
});
domain.NumberFilterEditor.addMethod('registerBlurHandlers', function () {
    var inputs = this.valueEditor.getValueElement();
    !Object.isArray(inputs) && (inputs = [inputs]);
    inputs.invoke('observe', 'blur', function (event) {
        var text = this.getValue();
        var normalizedText = domain.filter.normalizeNumberEntry(text);
        if (text != normalizedText) {
            this.setValue(normalizedText)
        }
    });

});


/**
 * Implementation of Boolean value Filter Editor.
 */
domain.BooleanFilterEditor = function (filterValue) {
    domain.FilterEditor.call(this, filterValue);
};
domain.BooleanFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);

domain.BooleanFilterEditor.addMethod('createComparisons', function () {
    return ['equals', 'isNotEqualTo'];
});

domain.BooleanFilterEditor.addMethod('createValueEditor', function (comparisonId) {
    if (!comparisonId) {
        return null;
    }
    var valueEditor = null;
    switch (comparisonId) {
        case 'equals':
        case 'isNotEqualTo':
            valueEditor = new domain.BooleanSelectEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        default :
            throw("Undefined Value type : #{valueType}"
                .interpolate({valueType:comparisonId}));
    }
    return valueEditor;
});

/**
 * Implementation of Date Filter Editor.
 */
domain.DateFilterEditor = function (filterValue, flowExecutionKey) {

    domain.FilterEditor.call(this, filterValue, flowExecutionKey);

};
domain.DateFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);
domain.DateFilterEditor.addMethod('createComparisons', function () {
    return [
        'equals', 'isNotEqualTo',
        'isAfter', 'isBefore',
        'isOnOrAfter', 'isOnOrBefore',
        'isBetween', 'isNotBetween'
    ];
});

domain.DateFilterEditor.addMethod('createValueEditor', function (comparisonId) {
    if (!comparisonId) {
        return null;
    }
    var valueEditor = null;
    switch (comparisonId) {
        case 'equals':
        case 'isNotEqualTo':
        case 'isAfter':
        case 'isBefore':
        case 'isOnOrAfter':
        case 'isOnOrBefore' :
            valueEditor = new domain.DateValueEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        case 'isBetween':
        case 'isNotBetween':
            valueEditor = new domain.DateRangeEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        default :
            throw("Undefined Value type : #{valueType}"
                .interpolate({valueType:comparisonId}));
    }
    return valueEditor;
});

domain.DateFilterEditor.addMethod('getFormattedValue', function () {
    var filter = this.getOriginalValue();
    switch (filter.comparison) {
        case 'isBetween' :
        case 'isNotBetween' :
            return '{' + filter.value.join(' and ') + '}';
        default :
            return domain.FilterEditor.prototype.getFormattedValue.call(this);
    }
});

/**
 * Implementation of Time Filter Editor.
 */
domain.TimeFilterEditor = function (filterValue, flowExecutionKey) {

    domain.FilterEditor.call(this, filterValue, flowExecutionKey);

};
domain.TimeFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);
domain.TimeFilterEditor.addMethod('createComparisons', function () {
    return [
        'equals', 'isNotEqualTo',
        'isAfter', 'isBefore',
        'isOnOrAfter', 'isOnOrBefore',
        'isBetween', 'isNotBetween'
    ];
});

domain.TimeFilterEditor.addMethod('createValueEditor', function (comparisonId) {
    if (!comparisonId) {
        return null;
    }
    var valueEditor = null;
    switch (comparisonId) {
        case 'equals':
        case 'isNotEqualTo':
        case 'isAfter':
        case 'isBefore':
        case 'isOnOrAfter':
        case 'isOnOrBefore' :
            valueEditor = new domain.StringValueEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        case 'isBetween':
        case 'isNotBetween':
            valueEditor = new domain.TimeRangeEditor(this.getOriginalValue.bind(this), comparisonId);
            break;
        default :
            throw("Undefined Value type : #{valueType}"
                .interpolate({valueType:comparisonId}));
    }
    return valueEditor;
});

domain.DateFilterEditor.addMethod('getFormattedValue', function () {
    var filter = this.getOriginalValue();
    switch (filter.comparison) {
        case 'isBetween' :
        case 'isNotBetween' :
            return '{' + filter.value.join(' and ') + '}';
        default :
            return domain.FilterEditor.prototype.getFormattedValue.call(this);
    }
});

/**
 * Implementation of Field Filter Editor.
 */
domain.FieldFilterEditor = function (filterValue, flowExecutionKey) {
    this.newFilterValue = deepClone(filterValue);
    domain.FilterEditor.call(this, filterValue, flowExecutionKey);
};
domain.FieldFilterEditor.prototype = deepClone(domain.FilterEditor.prototype);

domain.FieldFilterEditor.addMethod('createComparisons', function () {
    switch (domain.typesMap[this.getOriginalValue().dataType]) {
        case 'string' :
            return [
                'equals', 'contains',
                'startsWith',
                'endsWith',
                'doesNotEqual',
                'doesNotContain'
            ];
        case 'number' :
            return [
                'equals', 'isNotEqualTo',
                'isGreaterThan', 'lessThan',
                'isGreaterThanOrEqualTo',
                'isLessThanOrEqualTo'
            ];
        case 'date' :
            return [
                'equals', 'isNotEqualTo',
                'isAfter', 'isBefore',
                'isOnOrAfter', 'isOnOrBefore'
            ];
        case 'boolean' :
            return ['equals', 'isNotEqualTo'];
        default:
            throw("Unsupported editor type: [#{editorType}]"
                .interpolate({editorType:filterValue.type}));

    }
});

domain.FieldFilterEditor.addMethod('initTemplate', function () {
    this.editorTemplate = this._cloneTemplate(this.EDITOR_TEMPLATE);
    // Remove lock checkbox for field filter.
    var lock = this.editorTemplate.down(".checkBox.lock");
    lock && lock.remove();

    var fieldEditorTmpl = this._cloneTemplate('fieldEditor');
    fieldEditorTmpl.writeAttribute('id', 'fieldAndOperation');
    fieldEditorTmpl.removeClassName('hidden');
    this.editorTemplate.select('#fieldAndOperation').first().replace(fieldEditorTmpl);
    this.fieldNameElement = this.editorTemplate.select('.fieldName').first();
    this.fieldValueElement = this.editorTemplate.select('.fieldName')[1];
});

domain.FieldFilterEditor.addMethod('handleClick', function (element) {
    if (matchAny(element, ['button#swap'], true)) {
        this.swapClickHandler();
    }
});

/**
 * Refreshes editor fields according to model state.
 */
domain.FieldFilterEditor.addMethod('fillinTemplate', function () {
    var filter = this.newFilterValue;
    this.fieldNameElement.update(xssUtil.escape(filter.name));
    this.fieldValueElement.update(xssUtil.escape(filter.name2));
});

domain.FieldFilterEditor.addMethod('getValue', function () {
    this.newFilterValue.comparison = this.comparisonId;
    this.newFilterValue.locked = true;
    return this.newFilterValue;
});

/**
 * Cancels recent editor's changes.
 */
domain.FieldFilterEditor.addMethod('cancel', function () {
    this.resetToCurrentEditor();
    this.newFilterValue = deepClone(this.getOriginalValue());
});

domain.FieldFilterEditor.addMethod('getFormattedValue', function () {
    return '{' + String(this.getOriginalValue().name2) + '}';
});

/** There is no necessity to validate this type of filter. */
domain.FieldFilterEditor.addMethod('validate', function () {
    return true;
});

domain.FieldFilterEditor.addMethod('swapClickHandler', function () {
    var filter = this.newFilterValue;
    var name = filter.name;
    var fieldId = filter.fieldId;
    filter.name = filter.name2;
    filter.fieldId = filter.field2Id;
    filter.name2 = name;
    filter.field2Id = fieldId;
    filter.value = [filter.name];
    this.fillinTemplate();
    return true;
});

domain.FieldFilterEditor.addMethod('comparisonSelectedHandler', function (event) {
    this.comparisonId = domain.getSelectedOptionId(event.element());
});

//////////////////////////////
//  Filter Value Editor
//////////////////////////////
domain.FilterValueEditor = function (filterValueAccessor, comparisonId) {
    this.getOriginalValue = filterValueAccessor;
    this.currentComparisonId = comparisonId;
    this.init();
};

domain.FilterValueEditor.addMethod('init', function () {
    this.initTemplate();
    this.afterTemplateInitialization();
    this.initValidators();
    this.initEventHandlers();
    this.clickHandlersHash = this.createHandlersHash();
});

domain.FilterValueEditor.addMethod('initTemplate', function () {
    this.template = this.createTemplate();
    this.initValueElements();
});

domain.FilterValueEditor.addMethod('createTemplate', function () {
    var template = Element.clone(this.valueEditorId, true);
    template.writeAttribute('id', 'values');
    template.removeClassName('hidden');
    return template;
});

domain.FilterValueEditor.addMethod('afterTemplateInitialization', function () {
    // Default no-op.
});

domain.FilterValueEditor.addMethod('fillinTemplate', function () {
    if (this.currentComparisonId === this.getOriginalValue().comparison) {
        this.setValue(this.getOriginalValue().value);
    }
    this.setTitle(this.currentComparisonId);
});

domain.FilterValueEditor.addMethod('setTitle', function (comparisonId) {
    var inputs = this.getValueElement();
    !Object.isArray(inputs) && (inputs = [inputs]);
    inputs && inputs.each(function (input) {
        (input.up('label') || input).writeAttribute('title', this.getTitleMessage(comparisonId));
    }.bind(this));
});

domain.FilterValueEditor.addMethod('getTitleMessage', function () {
    return domain.getMessage('filter_default_title');
});

domain.FilterValueEditor.addMethod('initValidators', function () {
    this.validators = this.createCommonValidators()
        .concat(this.createValidators());
});

domain.FilterValueEditor.addMethod('createCommonValidators', function () {
    return [
        {
            validator:function () {
                return domain.valueNotEmptyValidator(this.getValue(),
                    domain.getMessage('value_should_be_not_empty'));
            }.bind(this),
            element:this.getValueElement()
        }
    ];
});

domain.FilterValueEditor.addMethod('createValidators', function () {
    return []
});

domain.FilterValueEditor.addMethod('validate', function () {
    this.removeMalicious();
    return ValidationModule.validate(this.validators);
});

domain.FilterValueEditor.addMethod('removeMalicious', function () {
    this.setValue(this.stripValue(this.getValue()));
});

/**
 * Common click handler. This is singleton method.
 */
domain.FilterValueEditor.handleClick = function (element) {
    var handler = _.find(this.clickHandlersHash, function (handler, selector) {
        return element.match(selector);
    });
    handler && handler.call(this, element);
};

domain.FilterValueEditor.addMethod('createHandlersHash', function () {
    return {};
});

/**
 * Put here actions that must be performed later, after value editor has been drawn.
 */
domain.FilterValueEditor.addMethod('afterDraw', function () {
    this.fillinTemplate();
});

/** Abstract method. */
domain.FilterValueEditor.addMethod('initValueElements', function () {
});
domain.FilterValueEditor.addMethod('initEventHandlers', function () {
});
domain.FilterValueEditor.addMethod('cancel', function () {
});

domain.FilterValueEditor.addMethod('getTemplate', function () {
    return this.template;
});

domain.FilterValueEditor.addMethod('setValue', function (newValue) {
    this.getValueElement().setValue(String(newValue[0]));
});

domain.FilterValueEditor.addMethod('getValue', function () {
    return this.getValueElement().getValue();
});

domain.FilterValueEditor.addMethod('stripValue', function (value) {
    var filter = function (v) {
        return (v) ? v.strip().stripScripts() : "";
    };
    return Object.isArray(value) ? value.collect(filter) : [filter(value)];
});

domain.FilterValueEditor.addMethod('isTimestampField', function () {
    return this.getOriginalValue().dataType === 'Timestamp';
});
domain.FilterValueEditor.addMethod('isTimeField', function () {
    return this.getOriginalValue().dataType === 'Time';
});

domain.FilterValueEditor.addMethod('_getControlName', function () {
    if (this.isTimestampField()) {
        return "datetimepicker";
    } else if (this.isTimeField()) {
        return "timepicker";
    } else {
        return "datepicker";
    }
});

/** Abstract method. */
domain.FilterValueEditor.addMethod('getValueElement', function () { /** Empty implementation. */
});

///////////////////////////////
// Picker tied to Server side
///////////////////////////////
/**
 * Abstract class for editors that retrieves dictionary values from server;
 *
 * @param filterValueAccessor
 */
domain.SingleDictionaryEditor = function (filterValueAccessor, comparisonId, flowExecutionKey) {
    this.searchParams = {
        'limitType':'contains',
        'itemId':filterValueAccessor().fieldId,
        'searchWord':''
    };

    this.flowExecutionKey = flowExecutionKey;
    domain.FilterValueEditor.apply(this, arguments);
};
domain.SingleDictionaryEditor.prototype = deepClone(domain.FilterValueEditor.prototype);

domain.SingleDictionaryEditor.addMethod('afterTemplateInitialization', function () {
    this.retrieveAvailableDictionaryValues(this.searchParams);
});

domain.SingleDictionaryEditor.addMethod('initValueElements', function () {
    // Search elements init
    this.searchInputElement = this.getTemplate().select('.searchLockup input')[0];
    this.searchButtonElement = this.getTemplate().select('.searchLockup > .search.button')[0];
    this.searchClearElement = this.getTemplate().select('.searchLockup .button.searchClear')[0];
});

domain.SingleDictionaryEditor.addMethod('initEventHandlers', function () {
    this.searchInputElement.observe('keyup', this.handleKeyup.bind(this));
});

domain.SingleDictionaryEditor.addMethod('handleKeyup', function (e) {
    switch (e.keyCode) {
        case Event.KEY_TAB:
        case Event.KEY_ESC:
        case Event.KEY_LEFT:
        case Event.KEY_UP:
        case Event.KEY_RIGHT:
        case Event.KEY_DOWN:
        case Event.KEY_DELETE:
        case Event.KEY_HOME:
        case Event.KEY_END:
        case Event.KEY_PAGEUP:
        case Event.KEY_PAGEDOWN:
        case Event.KEY_INSERT:
            return true;
        case Event.KEY_RETURN:
            this.doSearch();
            break;
        default:
            this.onCharacterPressed(e);
    }
    return true;
});

domain.SingleDictionaryEditor.addMethod('createHandlersHash', function () {
    return {
        ".button.search" : function () {
            this.doSearch();
        },
        ".button.searchClear" : function () {
            this.onClearButtonClicked();
            this.doSearch(this.onClearButtonClicked.bind(this));
        }
    };
});

domain.SingleDictionaryEditor.addMethod('onCharacterPressed', function () {
    this.updateSearchClearButtonState();
});

domain.SingleDictionaryEditor.addMethod('updateSearchClearButtonState', function () {
    if (this.searchInputElement.getValue().blank()) {
        this.searchClearElement.removeClassName(layoutModule.UP_CLASS);
    } else {
        this.searchClearElement.addClassName(layoutModule.UP_CLASS);
    }
});

domain.SingleDictionaryEditor.addMethod('doSearch', function (callback) {
    ValidationModule.hideError(this.getAvailableValueElement());
    this.searchParams['itemId'] = this.getOriginalValue().fieldId;
    this.searchParams['searchWord'] = this.searchInputElement.getValue();
    this.retrieveAvailableDictionaryValues(this.searchParams, callback);
});

domain.SingleDictionaryEditor.addMethod('onClearButtonClicked', function () {
    this.setSearchValue('');
});

domain.SingleDictionaryEditor.addMethod('retrieveAvailableDictionaryValues', function (searchParams, callback) {
    domain.sendAjaxRequest({
        flowExecutionKey:this.flowExecutionKey,
        eventId:'availableValues'
    }, searchParams, this.handleAvailableValuesRetrieved.bindAsEventListener(this, callback));
});

domain.SingleDictionaryEditor.addMethod('handleAvailableValuesRetrieved', function (response, callback) {
    if (!response || typeof response !== 'object') {
        if (response === 'INFO:TOO_MANY_ROWS') {
            ValidationModule.showError(this.getAvailableValueElement(), domain.getMessage('domain.filter.too_many_records'));
            this.getAvailableValueElement().update('');
            return;
        } else {
            response = [];
        }
    }
    try {
        // Abstract method.
        this.updateDictionaryValuesSelect(response);
        Object.isFunction(callback) && callback();
    } catch (e) {
        throw("Available values response handling error : #{error}"
            .interpolate({error:e}));
    }
});

domain.SingleDictionaryEditor.addMethod('initValidators', function () {
    this.validators = this.createValidators();
});

domain.SingleDictionaryEditor.addMethod('setSearchValue', function (value) {
    this.searchInputElement.setValue(value);
    this.updateSearchClearButtonState();
});

domain.SingleDictionaryEditor.addMethod('afterValueSet', function () {
    this.updateSearchClearButtonState();
});

///////////////////////////
// Multiple Values Picker
///////////////////////////

domain.MultipleValuesEditor = function (filterValueAccessor, comparionsId, flowExecutionKey) {
    domain.SingleDictionaryEditor.apply(this, arguments);
};
domain.MultipleValuesEditor.prototype = deepClone(domain.SingleDictionaryEditor.prototype);
domain.MultipleValuesEditor.addVar('valueEditorId', 'multipleValues');

domain.MultipleValuesEditor.addMethod('initValueElements', function () {
    domain.SingleDictionaryEditor.prototype.initValueElements.apply(this, arguments);
    this.availableValuesElement = this.getTemplate().select('select.availableValues')[0];
    this.selectedValuesElement = this.getTemplate().select('select.selectedValues')[0];
});

domain.MultipleValuesEditor.addMethod('initEventHandlers', function () {
    domain.SingleDictionaryEditor.prototype.initEventHandlers.apply(this, arguments);

    var eventName = isIE() ? 'click' : 'mouseup';
    eventName = isIPad() ? 'blur' : eventName;

    var container = this.getTemplate();
    container.on(eventName, "select.availableValues", domain.moveOption.bindAsEventListener(this, function () {
        return this.selectedValuesElement
    }.bind(this)));

    container.on(eventName, "select.selectedValues", domain.moveOption.bindAsEventListener(this, function () {
        return this.availableValuesElement
    }.bind(this)));
});

domain.MultipleValuesEditor.addMethod('updateDictionaryValuesSelect', function (response) {
    // Remove already chosen values from all values returned from server
    var selected = domain.getSelectValues(this.selectedValuesElement);
    var values = _.difference(response, selected);

    // Create new available values SELECT
    var newSelect = domain.createSelectWithOptions(values, {
        'class':this.availableValuesElement.readAttribute('class'),
        'multiple':'multiple'});

    // Replace old available values SELECT with recently created one
    var oldSelect = this.availableValuesElement;
    this.availableValuesElement.replace(newSelect);
    this.availableValuesElement = this.getTemplate().select('select.availableValues')[0];

});

domain.moveOption = domain.MultipleValuesEditor.moveSelectOption = function (event, oppositeSelect) {
    var select = event.element();
    var oppositeSelect = oppositeSelect();
    var item = (select.selectedIndex > -1) ? $(select.options[select.selectedIndex]) : event.element();

    function moveOneOption(item, toSelect) {
        item.remove();
        // Insert into appropriate place in alphabetical order.
        var option = _.find(toSelect.options, function (option) {
            return option.value > item.value;
        });
        var text = xssUtil.escape(item.text);
        if (option) {
            $(option).insert({before:new Element('option', { value:item.value, title:text}).update(text)});
        } else {
            toSelect.insert(new Element('option', { value: item.value, title:text}).update(text));
        }
        oppositeSelect.focus();
    }

    if (isIPad()) {
        select.childElements().each(function (option) {
            option.selected && moveOneOption(option, oppositeSelect);
        })
    } else {
        Object.isUndefined(item.selectedIndex) && moveOneOption(item, oppositeSelect);
    }
};

domain.MultipleValuesEditor.addMethod('createValidators', function () {
    return [
        {
            validator:function (value) {
                return domain.baseValidator(function (select) {
                    return select.options.length === 0;
                }.curry(this.selectedValuesElement), domain.getMessage('value_should_be_not_empty'));
            }.bind(this),
            element:this.selectedValuesElement
        }
    ];
});

/** It is no necessary to remove malicious for predefined values. */
domain.MultipleValuesEditor.addMethod('removeMalicious', function () {
});

domain.MultipleValuesEditor.addMethod('cancel', function () {
    ValidationModule.hideError(this.selectedValuesElement);
    this.reloadAvailable = true;
});

domain.MultipleValuesEditor.addMethod('setValue', function (newValue) {
    if (this.reloadAvailable) this.afterTemplateInitialization();

    domain.setSelectOptions(
        this.selectedValuesElement,
        newValue
    );
    this.afterValueSet();
});

domain.MultipleValuesEditor.addMethod('getAvailableValueElement', function () {
    return this.availableValuesElement;
});

domain.MultipleValuesEditor.addMethod('getValueElement', function () {
    return this.selectedValuesElement;
});

domain.MultipleValuesEditor.addMethod('getValue', function () {
    return domain.getSelectValues(this.selectedValuesElement);
});

domain.MultipleValuesEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_multiple_values_title', {comparison:domain.getMessage(comparisonId)});
});

////////////////////////
// Combo Box
////////////////////////

domain.ComboSelectEditor = function (filterValueAccessor, comparisonId, flowExecutionKey) {
    domain.SingleDictionaryEditor.apply(this, arguments);
};
domain.ComboSelectEditor.prototype = deepClone(domain.SingleDictionaryEditor.prototype);
domain.ComboSelectEditor.addVar('valueEditorId', 'comboValues');

domain.ComboSelectEditor.addMethod('initValueElements', function () {
    domain.SingleDictionaryEditor.prototype.initValueElements.apply(this, arguments);
    this.availableValuesElement = this.getTemplate().select('select')[0];
    this.inputElement = this.searchInputElement;
});

domain.ComboSelectEditor.addMethod('initEventHandlers', function () {
    domain.SingleDictionaryEditor.prototype.initEventHandlers.apply(this, arguments);
    this.initValueChangeHandler();
    new Field.Observer(this.inputElement, 0.3, function (element, value) {
        element.writeAttribute('title', value);
    });
});

domain.ComboSelectEditor.addMethod('initValueChangeHandler', function () {
    this.availableValuesElement.observe('change', this.valueSelectedHandler.bind(this));
});

domain.ComboSelectEditor.addMethod('valueSelectedHandler', function (event) {
    this.setValue(event.element().getValue());
});

domain.ComboSelectEditor.addMethod('updateDictionaryValuesSelect', function (response) {
    // Add EMPTY string if it is not already in response.
    var predefinedValues = response[0] === "" ? [] : [""];

    // Replace old available value SELECT with newly created one.
    Event.stopObserving(this.availableValuesElement);
    this.availableValuesElement.replace(domain.createSelectWithOptions(predefinedValues, response));
    this.availableValuesElement = this.getTemplate().select('select')[0];
    this.initValueChangeHandler();

    // Reset selected value to default.
    this.availableValuesElement.selectedIndex = 0;
});

domain.ComboSelectEditor.addMethod('onCharacterPressed', function () {
    domain.SingleDictionaryEditor.prototype.onCharacterPressed.call(this);
    this.availableValuesElement.selectedIndex = 0;
});

domain.ComboSelectEditor.addMethod('onClearButtonClicked', function () {
    domain.SingleDictionaryEditor.prototype.onClearButtonClicked.call(this);
    this.availableValuesElement.selectedIndex = 0;
});

domain.ComboSelectEditor.addMethod('setValue', function (newValue) {
    if (Object.isArray(newValue)) {
        newValue = newValue[0];
    }
    this.inputElement.setValue(newValue);
    this.afterValueSet();
});

domain.ComboSelectEditor.addMethod('getAvailableValueElement', function () {
    return this.availableValuesElement;
});

domain.ComboSelectEditor.addMethod('getValueElement', function () {
    return this.inputElement;
});

domain.ComboSelectEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_combo_title', {comparison:domain.getMessage(comparisonId)});
});

////////////////////////
// Text
////////////////////////

domain.StringValueEditor = function (filterValueAccessor, comparisonId) {
    domain.FilterValueEditor.apply(this, arguments);
};
domain.StringValueEditor.prototype = deepClone(domain.FilterValueEditor.prototype);
domain.StringValueEditor.addVar('valueEditorId', 'stringValues');

domain.StringValueEditor.addMethod('initValueElements', function () {
    this.stringValueElement = this.getTemplate().select('input')[0];
});

domain.StringValueEditor.addMethod('createValidators', function () {
    return [
        {
            validator:function (value) {
                return domain.maxLengthValidator(value, 1000, domain.getMessage('too_long_text'));
            }.bind(this),
            element:this.getValueElement()
        }
    ];
});

domain.StringValueEditor.addMethod('getValueElement', function () {
    return this.stringValueElement;
});

domain.StringValueEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_string_title', {comparison:domain.getMessage(comparisonId)});
});


////////////////////////
// Number
////////////////////////

domain.NumberValueEditor = function (filterValueAccessor, comparisonId) {
    domain.StringValueEditor.apply(this, arguments);
};
domain.NumberValueEditor.prototype = deepClone(domain.StringValueEditor.prototype);

domain.NumberValueEditor.addMethod('createValidators', function () {
    var javaType = this.getOriginalValue().javaType;
    var dataType = this.getOriginalValue().dataType;
    var bounds = domain.getNumberBounds(javaType) || {min:-Infinity, max:Infinity};
    return [
        {
            validator:function (value) {
                var result = domain.numberValidator(value, domain.filter.numberFormat,
                    domain.getMessage('wrong_number_format', {value:value}));
                if (result.isValid) {

                    result = domain.baseValidator(function () {
                        return dataType === 'Integer' && domain.filter.numberFormat.isInteger(value);
                    }, domain.getMessage('domain.filter.incorrect_integer_value'));
                    if (result.isValid) {

                        result = domain.numberBoundsValidator(domain.filter.toNumber(value), bounds,
                            domain.getMessage('number_out_of_bounds', { type:javaType}));
                    }
                }
                return result;
            },
            element:this.getValueElement()
        }
    ];
});

domain.NumberValueEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_number_title', {comparison:domain.getMessage(comparisonId)});
});

/////////////////////////
// Range : Common logic
/////////////////////////

domain.ValueRangeEditor = function (filterValueAccessor, comparisonId) {
    domain.FilterValueEditor.apply(this, arguments);
};

domain.ValueRangeEditor.prototype = deepClone(domain.FilterValueEditor.prototype);

domain.ValueRangeEditor.addMethod('initValueElements', function () {
    this.rangeValueElements = _.collect(this.getValueRangeIds(), function (names) {
        return this.getTemplate().select('#' + names.inputId)[0];
    }, this);
});

domain.ValueRangeEditor.addMethod('createCommonValidators', function () {
    return _.collect(this.getValueRangeIds(), function (names, i) {
        return {
            validator:function (index) {
                return domain.valueNotEmptyValidator(this.getElementValue(index),
                    domain.getMessage('value_should_be_not_empty'));
            }.bind(this, i),
            element:this.getElement(i)
        }
    }, this);
});

domain.ValueRangeEditor.addMethod('setValue', function (newValue) {
    _.each(this.getValueRangeIds(), function (names, i) {
        this.getElement(i).setValue(newValue[i]);
    }, this);
});

domain.ValueRangeEditor.addMethod('getElement', function (index) {
    return this.rangeValueElements[index];
});

domain.ValueRangeEditor.addMethod('getElementValue', function (i) {
    return this.getElement(i).getValue();
});

domain.ValueRangeEditor.addMethod('getValue', function () {
    return _.collect(this.getValueRangeIds(), function (names, i) {
        return this.getElementValue(i);
    }, this);
});

domain.ValueRangeEditor.addMethod('getValueElement', function () {
    return this.rangeValueElements;
});

domain.ValueRangeEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_range_title', {comparison:domain.getMessage(comparisonId)});
});

////////////////////////
// Number Range
////////////////////////

domain.NumberRangeEditor = function (filterValueAccessor, comparisonId) {
    var valueId = filterValueAccessor().id;
    this.valueEditorId = 'numberRangeValues';
    this.RANGE_INPUT_ID = 'rangeValue';
    this.BUTTON_SUFFIX = '_button';
    this.numberRangeNames = _.collect([1, 2], function (i) {
        var standardInputId = this.RANGE_INPUT_ID + '_' + i;
        return {
            standardInputId:standardInputId,
            inputId:valueId + '_' + standardInputId
        };
    }, this);

    domain.ValueRangeEditor.apply(this, arguments);
};
domain.NumberRangeEditor.prototype = deepClone(domain.ValueRangeEditor.prototype);

domain.NumberRangeEditor.addMethod('getValueRangeIds', function () {
    return this.numberRangeNames;
});

domain.NumberRangeEditor.addMethod('createTemplate', function () {
    var template = domain.FilterValueEditor.prototype.createTemplate.call(this);
    _.each(this.getValueRangeIds(), function (names) {
        template.select('#' + names.standardInputId)[0]
            .writeAttribute('id', names.inputId);
    });
    return template;
});

domain.NumberRangeEditor.addMethod('createValidators', function () {
    var javaType = this.getOriginalValue().javaType;
    var bounds = domain.getNumberBounds(javaType) || {min:-Infinity, max:Infinity};
    var dataType = this.getOriginalValue().dataType;
    return _.collect(this.getValueRangeIds(), function (names, i) {
        return {
            validator:function (index) {
                var value = this.getElementValue(index),
                    result;

                if(value.match(domain.filter.ATTRIBUTES_PATTERN)) {
                    result = domain.baseValidator(function() {
                        return false;
                    });
                } else {
                    result = domain.numberValidator(value, domain.filter.numberFormat,
                        domain.getMessage('wrong_number_format', {value:value}));
                    if (result.isValid) {
                        result = domain.baseValidator(function () {
                            return dataType === 'Integer' && domain.filter.numberFormat.isInteger(value);
                        }, domain.getMessage('domain.filter.incorrect_integer_value'));

                        if (result.isValid) {
                            result = domain.numberBoundsValidator(domain.filter.toNumber(value), bounds,
                                domain.getMessage('number_out_of_bounds', { type:javaType}));
                        }
                    }
                }

                return result;
            }.bind(this, i),
            element:this.getElement(i)
        }
    }, this).concat({
            validator:function () {
                var result,
                    from = this.getElementValue(0),
                    to = this.getElementValue(1),
                    attributePattern = domain.filter.ATTRIBUTES_PATTERN,
                    attributeValuePattern = domain.filter.ATTRIBUTE_VALUE_PATTERN,
                    fromAttribute = from.match(attributePattern),
                    toAttribute = to.match(attributePattern),
                    fromAttributeValue = from.match(attributeValuePattern),
                    toAttributeValue = to.match(attributeValuePattern);

                if(fromAttribute && toAttribute) {
                    result = domain.baseValidator(function() {
                            return fromAttributeValue[1] === toAttributeValue[1];
                        },
                        domain.getMessage('number_range_error', {from:from, to:to}));
                } else if(fromAttribute || toAttribute) {
                    result = domain.baseValidator(function() {
                        return false;
                    });
                } else {
                    result = domain.rangeValidator(domain.filter.toNumber(from), domain.filter.toNumber(to),
                        domain.getMessage('number_range_error', {from:from, to:to}));
                }

                return result;
            }.bind(this),
            element:this.getElement(1)
        });
});

////////////////////////
// Date
////////////////////////

domain.DateValueEditor = function (filterValueAccessor, comparisonId) {
    if (filterValueAccessor().dataType === 'Date') {
        this.dateFormat = domain.filter.CALENDAR_DATE_FORMAT;
        this.timeFormat = domain.filter.CALENDAR_TIME_FORMAT;

        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_DATE_FORMAT;
    } else if (filterValueAccessor().dataType === 'Time') {
//        this.dateFormat = domain.filter.CALENDAR_DATE_FORMAT;
        this.timeFormat = domain.filter.CALENDAR_TIME_FORMAT;

        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_TIME_FORMAT;
    } else {
        this.dateFormat = domain.filter.CALENDAR_DATE_FORMAT;
        this.timeFormat = domain.filter.CALENDAR_TIME_FORMAT;

        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_TIMESTAMP_FORMAT;
    }
    this.timeZoneOffset = domain.filter.TIMEZONE_OFFSET;

    this.valueEditorId = 'dateValues';
    this.CALENDAR_INPUT_ID = 'calendar_input';
    this.CALENDAR_BUTTON_ID = 'calendar_button';
    this.dateInputName = filterValueAccessor().id + this.CALENDAR_INPUT_ID;
    this.dateButtonName = filterValueAccessor().id + this.CALENDAR_BUTTON_ID;
    domain.FilterValueEditor.apply(this, arguments);
};

domain.DateValueEditor.prototype = deepClone(domain.FilterValueEditor.prototype);

domain.DateValueEditor.addMethod('initValueElements', function () {
    this.dateValueElement = this.getTemplate().select('#' + this.dateInputName)[0];
});

domain.DateValueEditor.addMethod('createTemplate', function () {
    var template = domain.FilterValueEditor.prototype.createTemplate.call(this);
    template.select('#' + this.CALENDAR_INPUT_ID)[0]
        .writeAttribute('id', this.dateInputName);
    return template;
});

domain.DateValueEditor.addMethod('afterDraw', function () {

    var $input =  jQuery('#' + this.dateInputName),
        controlName = this._getControlName();

    this.picker = new DateAndTimePicker({
        el: $input[0],
        showOn: "button",
        buttonText: "",
        dateFormat: controlName === "timepicker" ? null : this.dateFormat,
        timeFormat: controlName === "datepicker" ?  null : this.timeFormat,
        showSecond: this.isTimestampField() || this.isTimeField()
    });

    $input.next().addClass('button').addClass('picker');
    $input[0].getValue = function () {
        return jQuery(this).val()
    };
    this.fillinTemplate();
});

domain.DateValueEditor.addMethod('createValidators', function () {
    return [
        {
            validator:function (value) {
                if (this.isTimestampField() &&
                    getDateFromFormat(value, domain.filter.FILTER_DATE_FORMAT) !== 0) {
                    value += " 00:00";
                }
                return domain.dateValidator(value, this.getOriginalValue().dateFormat,
                    domain.getMessage('wrong_date_format', {value:value}));
            }.bind(this),
            element:this.getValueElement()
        }
    ];
});

domain.DateValueEditor.addMethod('getValueElement', function () {
    return this.dateValueElement;
});

domain.DateValueEditor.addMethod('getTitleMessage', function (comparisonId) {
    return domain.getMessage('filter_date_title', {comparison:domain.getMessage(comparisonId)});
});

////////////////////////
// Date Range
////////////////////////

domain.DateRangeEditor = function (filterValueAccessor, comparisonId) {
    if (filterValueAccessor().dataType === 'Date') {
        this.dateFormat = domain.filter.CALENDAR_DATE_FORMAT;
        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_DATE_FORMAT;
    }else if (filterValueAccessor().dataType === 'Time') {
        this.timeFormat = domain.filter.CALENDAR_TIME_FORMAT;

        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_TIME_FORMAT;
    } else {
        this.dateFormat = domain.filter.CALENDAR_DATE_FORMAT;
        this.timeFormat = domain.filter.CALENDAR_TIME_FORMAT;
        filterValueAccessor()['dateFormat'] = domain.filter.FILTER_TIMESTAMP_FORMAT;
    }
    this.timeZoneOffset = domain.filter.TIMEZONE_OFFSET;


    var valueId = filterValueAccessor().id;
    this.valueEditorId = 'dateRangeValues';
    this.RANGE_INPUT_ID = 'rangeValue';
    this.BUTTON_SUFFIX = '_button';
    this.dateRangeNames = _.collect([1, 2], function (i) {
        var standardInputId = this.RANGE_INPUT_ID + '_' + i;
        var standardButtonId = standardInputId + this.BUTTON_SUFFIX;
        return {
            standardInputId:standardInputId,
            inputId:valueId + '_' + standardInputId,
            standardButtonId:standardButtonId,
            buttonId:valueId + '_' + standardButtonId
        };
    }, this);

    domain.ValueRangeEditor.apply(this, arguments);

};

domain.DateRangeEditor.prototype = deepClone(domain.ValueRangeEditor.prototype);

domain.DateRangeEditor.addMethod('getValueRangeIds', function () {
    return this.dateRangeNames;
});

domain.DateRangeEditor.addMethod('createTemplate', function () {
    var template = domain.FilterValueEditor.prototype.createTemplate.call(this);
    _.each(this.getValueRangeIds(), function (names) {
        template.select('#' + names.standardInputId)[0]
            .writeAttribute('id', names.inputId);
    });
    return template;
});

domain.DateRangeEditor.addMethod('afterDraw', function () {
    _.each(this.getValueRangeIds(), function (names) {
        var $input =  jQuery('#' + names.inputId),
            controlName = this._getControlName();

        this.picker = new DateAndTimePicker({
            el: $input[0],
            showOn: "button",
            buttonText: "",
            dateFormat: controlName === "timepicker" ? null : this.dateFormat,
            timeFormat: controlName === "datepicker" ?  null : this.timeFormat,
            showSecond: this.isTimestampField() || this.isTimeField()
        });

        $input.next().addClass('button').addClass('picker');
        $input[0].getValue = function () {
            return jQuery(this).val()
        };
    }, this);
    this.fillinTemplate();
});

domain.DateRangeEditor.addMethod('createValidators', function () {
    return _.collect(this.getValueRangeIds(), function (names, i) {
        return {
            validator:function (index) {
                var value = this.getElementValue(index);
                if (this.isTimestampField() &&
                    getDateFromFormat(value, domain.filter.FILTER_DATE_FORMAT) !== 0) {
                    value += " 00:00";
                }
                return domain.dateValidator(value, this.getOriginalValue().dateFormat,
                    domain.getMessage('wrong_date_format', {value:value}));
            }.bind(this, i),
            element:this.getElement(i)
        }
    }, this).concat({
            validator:function () {
                var from = this.getElementValue(0), to = this.getElementValue(1);
                return domain.rangeValidator(
                    getDateFromFormat(from, this.getOriginalValue().dateFormat),
                    getDateFromFormat(to, this.getOriginalValue().dateFormat),
                    domain.getMessage('date_range_error', {from:from, to:to}))
            }.bind(this),
            element:this.getElement(1)
        });
});

////////////////////////
// Time Range
////////////////////////

domain.TimeRangeEditor = function (filterValueAccessor, comparisonId) {
    var valueId = filterValueAccessor().id;
    this.valueEditorId = 'numberRangeValues';
    this.RANGE_INPUT_ID = 'rangeValue';
    this.BUTTON_SUFFIX = '_button';
    this.numberRangeNames = _.collect([1, 2], function (i) {
        var standardInputId = this.RANGE_INPUT_ID + '_' + i;
        return {
            standardInputId:standardInputId,
            inputId:valueId + '_' + standardInputId
        };
    }, this);

    domain.ValueRangeEditor.apply(this, arguments);
};
domain.TimeRangeEditor.prototype = deepClone(domain.ValueRangeEditor.prototype);

domain.TimeRangeEditor.addMethod('getValueRangeIds', function () {
    return this.numberRangeNames;
});

domain.TimeRangeEditor.addMethod('createTemplate', function () {
    var template = domain.FilterValueEditor.prototype.createTemplate.call(this);
    _.each(this.getValueRangeIds(), function (names) {
        template.select('#' + names.standardInputId)[0]
            .writeAttribute('id', names.inputId);
    });
    return template;
});

////////////////////////
// Boolean
////////////////////////

domain.BooleanSelectEditor = function (filterValueAccessor, comparisonId) {
    domain.FilterValueEditor.apply(this, arguments);

    this.setID(filterValueAccessor().id);
    this.initBooleanLastValueMap();
    this.setInitialSelectValue();
};
domain.BooleanSelectEditor.prototype = deepClone(domain.FilterValueEditor.prototype);
domain.BooleanSelectEditor.addVar('valueEditorId', 'booleanComboValues');

domain.BooleanSelectEditor.addMethod('initValueElements', function () {
    this.selectElement = this.getTemplate().select('select')[0];
    this.inputElement = this.getTemplate().select('input')[0];
    this.inputElement.validatorMessageContainer = this.getTemplate().select('div.errorContainer')[0];
    this.setValueList();
    this.initEvents();
});

domain.BooleanSelectEditor.addMethod('setLastValue', function (value) {
    domain.booleanLastValueMap[this.id] = value;
});

domain.BooleanSelectEditor.addMethod('initBooleanLastValueMap', function () {
    domain.booleanLastValueMap = domain.booleanLastValueMap || [];
});

domain.BooleanSelectEditor.addMethod('setInitialSelectValue', function () {
    this.selectElement.setValue(domain.booleanLastValueMap[this.id]);
});

domain.BooleanSelectEditor.addMethod('setID', function (id) {
    this.id = id;
});

domain.BooleanSelectEditor.addMethod('initEvents', function () {
    var self = this;
    this.selectElement.observe('change', function(event){
        var elValue = event.element().getValue();
        var value = elValue === domain.getMessage('filter_empty_string') ? "" : elValue;
        self.inputElement.setValue(value);
        self.setLastValue(value);
    });

    this.inputElement.observe('keyup', function(event){
        self.selectElement.setValue(domain.getMessage('filter_empty_string'));
    });

    this.inputElement.observe('change', function(event){
        self.setLastValue(event.element().getValue());
    });
});

domain.BooleanSelectEditor.addMethod('setValueList', function () {
    domain.setSelectOptions(this.selectElement,
        [domain.getMessage('filter_empty_string'), 'true', 'false']);
});

domain.BooleanSelectEditor.addMethod('createValidators', function () {
    var self = this;

    return [
        {
            validator: function (value) {
                var result = domain.baseValidator(function (input) {
                    return self.inputElement.value === "";
                }, domain.getMessage('value_should_be_not_empty'));

                if(!result.isValid){
                    return result;
                }

                isMatchingPattern = value.match(domain.filter.ATTRIBUTES_PATTERN)
                    || value === "true"
                    || value === "false";

                return {
                    isValid: isMatchingPattern,
                    errorMessage: domain.getMessage('domain.filter.incorrect_attribute_pattern')
                }

            }.bind(self),
            element: self.inputElement
        }
    ];
});

domain.BooleanSelectEditor.addMethod('getValueElement', function () {
    return this.inputElement;
});

//////////////////////////////////
// Filter Model Controller.
//////////////////////////////////
domain.FilterModelController = function (filterContainerId, filterEditor, initParams) {
    // Initialize domain filters constants
    domain.filter.init(initParams);

    this.PRE_FILTERS_PANEL = "preFilters";
    this.FILTERS_LIST_ID = filterContainerId;
    this.FILTER_EDITOR_CANCEL_BUTTON_ID = 'filterEditorCancel';
    this.FILTER_EDITOR_OK_BUTTON_ID = 'filterEditorOk';
    // Filter edit modes.
    this.CREATE_MODE = 'create';
    this.UPDATE_MODE = 'update';

    this.targetHiddenFieldId = 'slRules';

    this.initParams = initParams;
    this.filterEditor = filterEditor;

    this._filterEditorsMap = null;
    this._currentFilter = null;

    // Editor Mode has two states 'create' and 'update'.
    this.mode = null;
};

domain.FilterModelController.addMethod('init', function () {
    // DynamicList of Filter Items.
    this._list = new dynamicList.List(this.FILTERS_LIST_ID, {
        listTemplateDomId:"list_domain_chooser_filter",
        itemTemplateDomId:"list_domain_chooser_filter:leaf",
        excludeFromSelectionTriggers:[".leaf *"],
        excludeFromEventHandling:true
    });

    if (isIPad()) {
        var listElement = $(this.FILTERS_LIST_ID);
        new TouchController(listElement, listElement.up());
    }

    try {
        this._filterEditorsMap = new domain.FilterList();
        this.initFilters();
    } catch (e) {
        window.console && console.error("Filters initialization failed. Error : #{error}".
            interpolate({error:e}));
    } finally {
        this.updateHiddenField();
        this._initListEvents();
        this.drawList();
    }
});

domain.FilterModelController.addMethod('initFilters', function () {
    this.initParams.filtersJson.each(function (jsonObject) {
        this.addNewToFilterEditorsMap(
            this.filterEditor.prototype.create(
                new domain.FilterItem({json:jsonObject}),
                this.initParams.flowExecutionKey));
    }.bind(this));
});

domain.FilterModelController.addMethod('initDropContainer', function (acceptClasses) {
    var options = {
        onDrop:this.onDropHandler.bind(this)
    };
    if (acceptClasses) {
        options['accept'] = acceptClasses;
    }
    Droppables.add($(this.PRE_FILTERS_PANEL), options);
});

domain.FilterModelController.addMethod('onDropHandler', function (dragElement) {
    var node = dragElement.node;
    if (!node) {
        return;
    }

    var selectedNodes = domain.getSelectedTreeNodes(dynamicTree.trees[node.getTreeId()]);
    try {
        if (selectedNodes.length === 1) {
            this.addFilter(new domain.FilterItem({node:node}));
        } else if (selectedNodes.length === 2) {
            this.addFieldFilter(selectedNodes);
        }
    } catch (e) {
        if (console) {
            console.error(e);
        }
    }
});

domain.FilterModelController.addMethod('addNewToFilterEditorsMap', function (filterEditor, position) {
    if (!filterEditor) {
        return;
    }
    var filterValue = filterEditor.getOriginalValue();
    if (this.mode !== this.UPDATE_MODE) {
        this._updateIdIfFilterPresent(filterValue);
    }
    this._filterEditorsMap.set(filterValue.id, filterEditor, position);
});

domain.FilterModelController.addMethod('_prepareListItem', function (value) {
    var resourceItem = new dynamicList.ListItem({
        cssClassName:layoutModule.LEAF_CLASS,
        value:value
    });

    resourceItem.processTemplate = value.processTemplate;
    return resourceItem;
});

domain.FilterModelController.addMethod('drawList', function () {
    var items = this._filterEditorsMap.values().collect(this._prepareListItem);

    this.getList().setItems(items);
    this.getList().show();
});


domain.FilterModelController.addMethod('refreshScroll', function () {
    var scroll = layoutModule.scrolls.get(this.PRE_FILTERS_PANEL);
    scroll && scroll.refresh();
});

domain.FilterModelController.addMethod('addFieldFilter', function (selectedNodes) {
    if (!domain.areNodesFromSameIsland(selectedNodes)) return;

    var filterItems = selectedNodes.collect(function (node) {
        return new domain.FilterItem({node:node});
    });
    var filterItem = filterItems.first();
    if (filterItem.type !== filterItems[1].type) {
        return;
    }
    filterItem.initFieldFilterItem(filterItems[1]);
    this.addFilter(filterItem);
});

domain.FilterModelController.addMethod('addFilter', function (filter) {
    try {
        this.cancelPreviousEditing();
        this._updateIdIfFilterPresent(filter);
        var currentFilterEditor = this.filterEditor.prototype.create(filter, this.initParams.flowExecutionKey);

        var item = this._prepareListItem(currentFilterEditor);

        this.setCurrentFilter(item);

        this.getList().insertItems(0, [item]);
        this.getList().refresh();
        // Scroll list to top
        $(this.FILTERS_LIST_ID).up().scrollTop = 0;
        // Switch list item to edit mode
        this.editMode(item);
        this.mode = this.CREATE_MODE;
    } catch (e) {
        this.setCurrentFilter(null);
        throw("Unknown filter creation error: #{error}".interpolate({error:e}));
    }
});

domain.FilterModelController.addMethod('editFilter', function (item) {
    this.cancelPreviousEditing();
    item.getValue().resetToCurrentEditor();
    this.editMode(item);
    this.mode = this.UPDATE_MODE;
});

domain.FilterModelController.addMethod('cancelPreviousEditing', function () {
    if (!this._currentFilter) {
        return;
    }
    var editor = this._currentFilter.getValue();
    editor.cancel();
    var filterValue = editor.getOriginalValue();
    if (!this._filterEditorsMap.get(filterValue.id)) {
        this.getList().removeItems([this._currentFilter]);
    } else {
        this._setItemClassName(this._currentFilter, '');
        this._currentFilter.refresh();
    }

    this.setCurrentFilter(null);
});

domain.FilterModelController.addMethod('removeFilter', function (item) {
    if (!item) {
        return;
    }

    var editor = item.getValue();
    editor.beforeRemove();
    this._filterEditorsMap.unset(editor.getOriginalValue().id);
    this.getList().removeItems([item]);
    this.refreshScroll();
    this.updateHiddenField();
});

domain.FilterModelController.addMethod('editMode', function (item) {
    this.setCurrentFilter(item);
    this._setItemClassName(item, 'editMode');

    // Perform some actions after filter has been redrawn.
    item.getValue().afterDraw();
    this.refreshScroll();
    enableSelection($(document.body));
});

/**
 * Performs new or existed filter saving.
 *
 * @param item Item to save.
 */
domain.FilterModelController.addMethod('saveFilter', function (item) {
    var editor = item.getValue();

    if (editor.validate()) {
        editor.applyEditorValue();
        this.addNewToFilterEditorsMap(editor, 0);
        this.cancelPreviousEditing();
        this.updateHiddenField();
    }
});

domain.FilterModelController.addMethod('getList', function () {
    return this._list;
});

domain.FilterModelController.addVar('listEventFactory', {
    'item:click':function (event) {
        Event.stop(event);
        var targetEvent = Event.extend(event.memo.targetEvent);
        var element = targetEvent.element();
        var item = event.memo.item;
        var elements = [element].concat(element.ancestors().slice(0, 2));
        var eventHandled = _.any(this._editorElementsMap, function (handler, selector) {
            if (Selector.findElement(elements, selector, 0)) {
                Event.stop(targetEvent);
                handler.call(this, item);
                return true;
            }
            return false;
        }, this);
        if (!eventHandled) {
            var filterEditor = item.getValue();
            filterEditor.handleClick(element);
        }
    }
});

domain.FilterModelController.addVar('_editorElementsMap', {
    '#filterEditorOk':function (item) {
        this.saveFilter(item);
    },

    '#filterEditorCancel':function () {
        this.cancelPreviousEditing();
    },

    '.change':function (item) {
        this.editFilter(item);
    },

    '.remove':function (item) {
        this.removeFilter(item);
    }

});

domain.FilterModelController.addVar('treeEventFactory', {
    'leaf:dblclick':function (e) {
        var node = e.memo.node;
        Event.stop(e);
        if (!node) {
            return;
        }
        var selectedNodes = domain.getSelectedTreeNodes(dynamicTree.trees[node.getTreeId()]);
        try {
            if (selectedNodes.length === 2) {
                this.addFieldFilter(selectedNodes);
            } else {
                this.addFilter(new domain.FilterItem({node:node}));
            }
        } catch (error) {
            if (console) {
                console.error(error);
            }
        }
    }
});

domain.FilterModelController.addMethod('setCurrentFilter', function (item) {
    this._currentFilter = item;
});

domain.FilterModelController.addMethod('_setItemClassName', function (item, className) {
    item.setCssClassName(className);
    item.refreshStyle();
});

domain.FilterModelController.addMethod('_initListEvents', function () {
    for (var eventName in this.listEventFactory) {
        this._list.observe(eventName, this.listEventFactory[eventName].bindAsEventListener(this));
    }
});

domain.FilterModelController.addMethod('_updateIdIfFilterPresent', function (filter) {
    var filterEditor = this._filterEditorsMap.get(filter.id);
    if (filterEditor) {
        filter.updateIndex(++(filterEditor.getOriginalValue().index));
    }
    return filter;
});

domain.FilterModelController.addMethod('updateHiddenField', function () {
    var json = Object.toJSON(this._filterEditorsMap.collect(function (filter) {
        return filter.getOriginalValue();
    }));
    $$('#' + this.targetHiddenFieldId)[0].writeAttribute('value', json);
});

//////////////////////////////
//   Utility Helper Methods
//////////////////////////////
domain.setSelectOptions = function (select, options) {
    if (!Object.isElement(select) || !options || !Object.isArray(options)) {
        return select;
    }
    var startTime = new Date();
    select.update('');
    var buf = [];
    domain.appendOptions(buf, options);
    select.update(buf.join(''));
    if (isIE()) {
        // the famous IE bug: http://stackoverflow.com/questions/5908494/
        select.className = select.className;
    }
    window.console && window.console.log("Select input update time : " + (new Date() - startTime) + " ms.");
    return select;
};

domain.createSelectWithOptions = function () {
    var startTime = new Date();
    var optionalArg = arguments[arguments.length - 1];
    var attributes = "";
    // Check for optional argument with SELECT input attributes.
    if (!_.isArray(optionalArg) && typeof optionalArg === 'object') {
        attributes = _.reduce(optionalArg || {}, function (attrs, value, key) {
            return attrs += key + "=\"" + value + "\" ";
        }, "");
    }
    var buf = ["<select " + attributes + ">"];
    for (var j = 0; j < arguments.length; j++) {
        var options = arguments[j];
        if (!options || !_.isArray(options)) {
            continue;
        }
        domain.appendOptions(buf, options);
    }
    buf.push("</select>");
    window.console && window.console.log("String conversion time : " + (new Date() - startTime) + " ms.");
    return buf.join('');
};

domain.appendOptions = function (select, options) {
    for (var i = 0, label, value; i < options.length; i++) {
        label = value = (options[i] !== null) ?
            options[i].replace(/'/g, '&#39;') :
            domain.getMessage('filter_null_value');
        if (options[i] === '') {
            label = domain.getMessage('filter_empty_string');
        }
        var escapedLabel = xssUtil.escape(label);
        select.push("<option title='" + escapedLabel + "' value='" + value + "'>" + escapedLabel + "</option>");
    }
};

/**
 * Retrieves Array of options values for a given select element.
 *
 * @param select Select element.
 */
domain.getSelectValues = function (select) {
    return _.map(select.options, function (option) {
        return option.readAttribute('value');
    });
};

/**
 * Retrieves selected option id for a given select element.
 *
 * @param select Select element.
 */
domain.getSelectedOptionId = function (select) {
    if (!Object.isElement(select)) {
        return null;
    }
    var option = select.options[select.selectedIndex];
    return option.readAttribute('id');
};
/**
 * Retrieves all selected Tree nodes from a given tree. Doesn't allow folders as selected node
 * @param tree Source tree.
 */
domain.getSelectedTreeNodes = function (tree) {
    var selectedNodes = tree.selectedNodes;
    if (!Object.isArray(selectedNodes)) {
        return;
    }
    // returns all selected nodes that is not Folder.
    return selectedNodes.findAll(function (node) {
        return !node.isParent();
    });
};
