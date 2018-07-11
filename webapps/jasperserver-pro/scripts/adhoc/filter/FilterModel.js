/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        i18n = require("bundle!AdHocFiltersBundle"),
        numberUtilsOptions = require("settings!decimalFormatSymbols"),
        NumberUtils = require("common/util/parse/NumberUtils"),
        numberUtils = new NumberUtils(numberUtilsOptions),
        dateRangeFilterModelTrait = require("adhoc/filter/filterModelTrait/dateRangeFilterModelTrait"),
        listFilterModelTrait = require("adhoc/filter/filterModelTrait/listFilterModelTrait"),
        literalFilterModelTrait = require("adhoc/filter/filterModelTrait/literalFilterModelTrait"),
        rangeFilterModelTrait = require("adhoc/filter/filterModelTrait/rangeFilterModelTrait"),
        readOnlyFilterModelTrait = require("adhoc/filter/filterModelTrait/readOnlyFilterModelTrait"),
        filterDataTypes = require("adhoc/filter/enum/filterDataTypes"),
        filterExpressionTypes = require("adhoc/filter/enum/filterExpressionTypes"),
        filterOperators = require("adhoc/filter/enum/filterOperators"),
        filterModelValidationFactory = require("adhoc/filter/factory/filterModelValidationFactory"),
        filterModelExpressionTypeFactory = require("adhoc/filter/factory/filterModelExpressionTypeFactory"),
        filterModelDefaultValueFactory = require("adhoc/filter/factory/filterModelDefaultValueFactory"),
        OlapFilterValueFormatter = require("adhoc/filter/format/OlapFilterValueFormatter"),
        DataProvider = require("components/singleSelect/dataprovider/DataProviderNew"),
        ValueFormattingDataProvider = require("components/singleSelect/dataprovider/ValueFormattingDataProvider"),
        adhocFilterSettings = require("settings!adhocFilterSettings");

    require("adhoc/filter/validation/backboneValidationExtensions");

    var expressionTypeToFilterModelTraitMap = {};
    expressionTypeToFilterModelTraitMap[filterExpressionTypes.LITERAL] = literalFilterModelTrait;
    expressionTypeToFilterModelTraitMap[filterExpressionTypes.LIST] = listFilterModelTrait;
    expressionTypeToFilterModelTraitMap[filterExpressionTypes.DATE_RANGE] = dateRangeFilterModelTrait;
    expressionTypeToFilterModelTraitMap[filterExpressionTypes.RANGE] = rangeFilterModelTrait;
    expressionTypeToFilterModelTraitMap[filterExpressionTypes.READ_ONLY] = readOnlyFilterModelTrait;

    var readOnlyLabelCodes = {
        DATA_CHOOSER_NO_PROMPT: "ADH_1215_DYNAMIC_FILTER_UNEDITABLE_TITLE",
        SLICE_COMPLEX_KEEPONLY: "ADH_1208_DYNAMIC_FILTER_KEEP",
        SLICE_COMPLEX_EXCLUDE: "ADH_1209_DYNAMIC_FILTER_EXCLUDE"
    };

    /////////////////////////////
    // Data Type Helpers
    /////////////////////////////
    function isDate(dataType) {
        return dataType === filterDataTypes.TIMESTAMP || dataType === filterDataTypes.DATE;
    }

    function isBoolean(dataType) {
        return dataType === filterDataTypes.BOOLEAN;
    }

    function isTime(dataType) {
        return dataType === filterDataTypes.TIME;
    }

    function isString(dataType) {
        return dataType === filterDataTypes.STRING;
    }

    function isNumber(dataType) {
        return dataType === filterDataTypes.INTEGER
            || dataType === filterDataTypes.DECIMAL
            || dataType === filterDataTypes.LONG
            || dataType === filterDataTypes.NUMERIC;
    }

    //////////////////////
    // Filter Model
    //////////////////////
    var FilterModel = Backbone.Model.extend({
        initialize : function(attributes, options) {
            this.service = options.service;
            this.isOlap = options.isOlap;

            adhocFilterSettings = _.defaults(adhocFilterSettings || {}, {
                availableItemsPageSizeOlap: "999",
                availableItemsPageSize: "999"
            });

            this.dataProvider = new DataProvider({
                pageSize: this.isOlap
                    ? +adhocFilterSettings.availableItemsPageSizeOlap
                    : +adhocFilterSettings.availableItemsPageSize,
                request: new ValueFormattingDataProvider({
                    request: _.bind(this._requestValues, this),
                    format: this.isOlap
                        ? new OlapFilterValueFormatter(this.get("isFirstLevelInHierarchyAll")).format
                        : null
                }).getData,
                controlGetTotal: true,
                saveLastCriteria: true
            });

            this.removeAvailableData();
            this.removeMinMaxValues();

            this.on("change:operatorName", this._onOperatorNameChange);
            this.on("change:expressionType", this._onExpressionTypeChange);

            this._updateModelBehavior();
        },

        _requestValues: function(options) {
            var showLoading = this.get("showLoading");
            return this.service.fetchValues(this.get("name"), options, showLoading);
        },

        setShowLoading: function(showLoading) {
            this.set("showLoading", showLoading, {silent: true});
        },

        removeAvailableData: function() {
            this.dataProvider.clear();
        },

        removeMinMaxValues: function() {
            this._minMaxValuesDeferred = null;
            this.minValue = null;
            this.maxValue = null;
        },

        fetchDataForChangeFilterType: function() {
            return this.dataProvider.getData({offset: 0, limit: 1});
        },

        fetchMinMaxValues: function() {
            var self = this;

            if (!this._minMaxValuesDeferred) {
                this._minMaxValuesDeferred = this.service.getMaxMinValues(this.get("name")).done(function(respone) {
                    var maxMin = respone.maxMin;
                    self.minValue = maxMin[0];
                    self.maxValue = maxMin[1];
                });
            }

            return this._minMaxValuesDeferred;
        },

        loadAdditionalServerData: function(isInit) {
            var self = this;

            return this.additionalServerDataDeferred(isInit).done(function() { self._setValue(); });
        },

        additionalServerDataDeferred: function(isInit) {
            // standard resolved Deferred for those combinations when we don't need any additional info from server
            var dfd = new $.Deferred();
            dfd.resolve();

            if (this.isString() && _.include([filterOperators.IN, filterOperators.NOT_IN, filterOperators.EQUALS, filterOperators.NOT_EQUAL], this.get("operatorName"))) {
                if (!isInit) {
                    //Do not load available items if it's initialization call
                    dfd = $.when(this.fetchDataForChangeFilterType());
                }
            } else if (this.isNumber() || this.isDate() || this.isTime()) {
                if (_.include([filterOperators.IN, filterOperators.NOT_IN], this.get("operatorName"))) {
                    if (!isInit) {
                        //Do not load available items if it's initialization call
                        dfd = $.when(this.fetchDataForChangeFilterType());
                    }
                } else if (_.include([filterOperators.LESS, filterOperators.LESS_OR_EQUAL, filterOperators.GREATER,
                    filterOperators.GREATER_OR_EQUAL, filterOperators.BETWEEN, filterOperators.NOT_BETWEEN,
                    filterOperators.BETWEEN_DATES, filterOperators.NOT_BETWEEN_DATES], this.get("operatorName"))) {
                    dfd = $.when(this.fetchMinMaxValues());
                }
            }

            return dfd;
        },

        _onOperatorNameChange: function() {
            var previousAttributes = this.previousAttributes();

            if (typeof previousAttributes.operatorName !== "undefined"
                && previousAttributes.operatorName === filterOperators.IN
                && this.get("operatorName") !== filterOperators.IS_ANY_VALUE
                && this.get("isAnyValue")) {
                this.set("isAnyValue", false, { silent: true });
            }

            var expressionType = filterModelExpressionTypeFactory(this.get("filterDataType"), this.get("operatorName"));
            this.set("expressionType", expressionType, {silent: true});

            // force triggering change event
            this.trigger("change:expressionType", this, this.get("expressionType"));
        },

        saveValue : function() {
            return this.service.update(this.get("id"), this.toExpression());
        },

        _onExpressionTypeChange: function() {
            var self = this;

            this._updateModelBehavior();
            this.loadAdditionalServerData().done(function() { self.trigger("operationChange", self); });
        },

        _updateModelBehavior: function() {
            this._updateInstanceWithTrait();
            this._updateInstanceWithValidation();
        },

        _setValue: function() {
            // we don't need to set anything for read-only filters
            if (this.isReadOnly()) {
                return;
            }

            var previousAttrs = this.previousAttributes();

            if (!_.isEmpty(previousAttrs) && this._isDefaultValueSelected(previousAttrs)) {

                // Reset the value to default for current operator type.
                this._setDefaultValue();

            } else {
                // Try to preserve the changed value.
                var userValue = this.get("value");

                // todo: we may refactor these conditions to more elegant code
                var stringLiteralSelectOperators = [
                    filterOperators.EQUALS,
                    filterOperators.NOT_EQUAL
                ];
                var stringLiteralTextOperators = [
                    filterOperators.CONTAINS,
                    filterOperators.NOT_CONTAINS,
                    filterOperators.STARTS_WITH,
                    filterOperators.NOT_STARTS_WITH,
                    filterOperators.ENDS_WITH,
                    filterOperators.NOT_ENDS_WITH
                ];
                var stringListOperators = [
                    filterOperators.IN,
                    filterOperators.NOT_IN
                ];

                // switch from text LITERAL to selection LITERAL (contains to equals) -> set default
                if (_.include(stringLiteralTextOperators, previousAttrs.operatorName) && _.include(stringLiteralSelectOperators, this.get("operatorName"))) {
                    this._setDefaultValue();

                    // switch from select LITERAL to LIST (equals to isOneOf) -> set selected userValue
                } else if ((this.isString() || this.isBoolean()) && _.include(stringLiteralSelectOperators, previousAttrs.operatorName) &&
                    _.include(stringListOperators, this.get("operatorName"))) {
                    this.set({ value: [userValue] }, { silent: true, validate: true });

                    // switch from LIST to LITERAL -> set the first value of selected userValues
                } else if (previousAttrs.expressionType === filterExpressionTypes.LIST && this.get("expressionType") === filterExpressionTypes.LITERAL) {
                    this.set({ value: _.isArray(userValue) ? userValue[0] : userValue}, { silent: true, validate: true });

                    // switch from LIST to RANGE -> set the first and last value of selected userValues
                } else if (previousAttrs.expressionType === filterExpressionTypes.LIST &&
                    _.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], this.get("expressionType"))) {
                    this.set({ value: [ userValue[0], userValue[userValue.length-1]]}, { silent: true, validate: true });


                    // switch from LITERAL EQUALS to RANGE -> set [userValue:userValue]
                } else if (_.include([filterOperators.EQUALS, filterOperators.NOT_EQUAL], previousAttrs.operatorName) &&
                    _.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], this.get("expressionType"))) {
                    this.set({ value: [userValue,userValue]}, { silent: true, validate: true });

                    // switch from LITERAL GREATER to RANGE -> set [userValue:maxValue]
                } else if (_.include([filterOperators.GREATER, filterOperators.GREATER_OR_EQUAL], previousAttrs.operatorName) &&
                    _.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], this.get("expressionType")) ) {
                    this.set({ value: [userValue, this.maxValue]}, { silent: true, validate: true });

                    // switch from LITERAL LESS to RANGE -> set [minValue:userValue]
                } else if (_.include([filterOperators.LESS, filterOperators.LESS_OR_EQUAL], previousAttrs.operatorName) &&
                    _.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], this.get("expressionType")) ) {
                    this.set({ value: [this.minValue, userValue]}, { silent: true, validate: true });

                    // switch from RANGE to LIST -> set default
                } else if (_.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], previousAttrs.expressionType) &&
                    this.get("expressionType") === filterExpressionTypes.LIST) {
                    // todo: Implement the range selection for multiselects. Set default for now.
                    this._setDefaultValue();

                    // switch from RANGE to LITERAL EQUALS or GREATER -> set the min value of selected userValue
                } else if (_.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], previousAttrs.expressionType) &&
                    _.include([filterOperators.EQUALS, filterOperators.NOT_EQUAL, filterOperators.GREATER, filterOperators.GREATER_OR_EQUAL], this.get("operatorName"))) {
                    this.set({ value: userValue[0]}, { silent: true, validate: true });

                    // switch from RANGE to LITERAL LESS -> set the max value of selected userValue
                } else if (_.include([filterExpressionTypes.RANGE, filterExpressionTypes.DATE_RANGE], previousAttrs.expressionType) &&
                    _.include([filterOperators.LESS, filterOperators.LESS_OR_EQUAL], this.get("operatorName"))) {
                    this.set({ value: userValue[userValue.length-1]}, { silent: true, validate: true });
                }
                if (!this.isValid(true)) {
                    this._setDefaultValue();
                }
            }
        },

        _getDefaultValue : function() {
            return filterModelDefaultValueFactory(this.get("filterDataType"),this.get("operatorName"), this.isOlap,
                this.additionalModelDataForDefaultValue());
        },

        _setDefaultValue : function() {
            // TODO: turn validation off and move it to unit tests as filterModelDefaultValueFactory Test.
            this.set(this._getDefaultValue(), { silent: true });

            this.isValid(true);
        },

        _isDefaultValueSelected: function(attrs) {
            var defaultValueObj = filterModelDefaultValueFactory(this.get("filterDataType"), attrs.operatorName, this.isOlap,
                this.additionalModelDataForDefaultValue());

            var currentValueObj = {
                value: attrs.value,
                isAnyValue: attrs.isAnyValue
            };

            return FilterModel.valueObjectsAreEqual(currentValueObj, defaultValueObj);
        },

        additionalModelDataForDefaultValue: function() {
            var values = [];

            if (this.dataProvider.dataCacheTotal > 0) {
                var firstPage = this.dataProvider.dataCache.slice(0, this.dataProvider.pageSize);
                values = _.map(firstPage, function(item) { return item.value; });
            }

            return {
                min: this.minValue,
                max: this.maxValue,
                values: values,
                allValuesLoaded: this.dataProvider.dataCacheTotal <= this.dataProvider.pageSize //used only for OLAP for now
            }
        },

        // override Backbone.Model.set method in order to always have normalized set of values
        set: function(key, val, options) {
            var attrs;

            if (key == null) {
                return this;
            }

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options || (options = {});

            attrs = FilterModel.normalizeAttributes(attrs);

            return Backbone.Model.prototype.set.call(this, attrs, options);
        },

        _updateInstanceWithTrait: function() {
            return _.extend(this, expressionTypeToFilterModelTraitMap[this.get("expressionType")]);
        },

        _updateInstanceWithValidation: function() {
            this.validation = filterModelValidationFactory(this.get("filterDataType"), this.get("operatorName"));
        },

        /**
         * Performs conversion from filter model to filter expression,
         * that is understood on the back-end
         */
        toExpression : function() {
            var operatorName = this.get("operatorName");

            // TODO: this is workaround for Number filters, that has nonstandard between expression name: in instead of range.
            if (this.isTime() || this.isNumber()) {
                if (operatorName === filterOperators.BETWEEN) {
                    operatorName = filterOperators.IN;
                } else if (operatorName === filterOperators.NOT_BETWEEN) {
                    operatorName = filterOperators.NOT_IN;
                }
            }

            if (this.get("isAnyValue")) {
                operatorName = filterOperators.IS_ANY_VALUE;
            }

            var filterExpression = {
                type : this.get("operatorType"),

                name : operatorName,
                operands : [{
                    type : this.get("filterLabelType"),
                    name : this.get("name")
                }]
            };

            if (!this.get("isAnyValue")) {
                [].push.apply(filterExpression.operands, this._rValue());
            }

            return [filterExpression];
        },

        _rValue : function() {
            var rValue = this._expressionRValue();
            return  _.isArray(rValue) ? rValue : [rValue];
        },

        isDate : function() {
            return isDate(this.get("filterDataType"));
        },

        isBoolean : function() {
            return isBoolean(this.get("filterDataType"));
        },

        isTime : function() {
            return isTime(this.get("filterDataType"));
        },

        isString : function() {
            return isString(this.get("filterDataType"));
        },

        isNumber : function() {
            return isNumber(this.get("filterDataType"));
        },

        isReadOnly : function()  {
            return !this.get("editable");
        }
    }, {
        normalizeAttributes : function(originalAttrs) {
            var attrs = _.clone(originalAttrs);

            // We don't ever use this property on UI, but since it breaks Models equality we should remove it.
            if (attrs.hasOwnProperty("expressionAsString")) {
                delete attrs.expressionAsString;
            }

            if (attrs.hasOwnProperty("editable")) {
                if (!attrs.editable) {
                    attrs.filterDataType = filterDataTypes.READ_ONLY;
                    attrs.operatorName = filterOperators.READ_ONLY;
                    attrs.label = i18n[readOnlyLabelCodes[originalAttrs.source] || readOnlyLabelCodes.DATA_CHOOSER_NO_PROMPT];
                    attrs.isComplex = originalAttrs.name.toLowerCase() === "complex";
                }
            }

            if (_.isUndefined(attrs.isAnyValue) && attrs.hasOwnProperty("operatorName")) {
                if (attrs.operatorName === filterOperators.IS_ANY_VALUE) {
                    attrs.isAnyValue = true;
                    attrs.operatorName = isDate(attrs.filterDataType) ? filterOperators.BETWEEN_DATES : filterOperators.IN;
                } else {
                    attrs.isAnyValue = false;
                }
            }

            if (attrs.hasOwnProperty("operatorName") && attrs.hasOwnProperty("filterDataType")) {
                var expressionType = filterModelExpressionTypeFactory(attrs.filterDataType, attrs.operatorName);
                if (_.isUndefined(attrs.expressionType)) {
                    attrs.expressionType = expressionType;
                }

                if (expressionType === filterExpressionTypes.LITERAL &&
                    attrs.hasOwnProperty("value") && _.isArray(attrs.value) && attrs.value.length === 1) {

                    attrs.value = attrs.value[0];
                }
            }

            return attrs;
        },
        _isArraysEquals: function(array1, array2) {
            if (array1.length != array2.length) {
                return false;
            }

            var i, hash = {};

            //Just copy all values from 1st array to a hash object
            //Assume arrays can not contain duplicates, but they could be not sorted.
            for (i = 0; i < array1.length; i++) {
                hash[array1[i]] = true;
            }

            //Loop through second array and if any of its values is not present in hash - arrays are different
            for (i = 0; i < array2.length; i++) {
                if (!hash[array2[i]]) {
                    return false;
                }
            }

            return true;
        },
        valueObjectsAreEqual: function(valueObject1, valueObject2) {
            if ((typeof valueObject1.isAnyValue === "undefined" && valueObject2.isAnyValue === true) ||
                (typeof valueObject2.isAnyValue === "undefined" && valueObject1.isAnyValue === true) ||
                (typeof valueObject1.isAnyValue !== "undefined" && typeof valueObject2.isAnyValue !== "undefined" && valueObject1.isAnyValue !== valueObject2.isAnyValue)) {
                return false;
            } else {
                var value1 = valueObject1.value,
                    value2 = valueObject2.value;

                if (_.isArray(value1) && _.isArray(value2)) {
                    return this._isArraysEquals(value1, value2);
                } else if (!_.isArray(value1) && !_.isArray(value2)) {
                    // first try to treat values as numbers in order to be able to compare values like 1000 and 1,000.00
                    var numberValue1 = numberUtils.parseNumber(value1),
                        numberValue2 = numberUtils.parseNumber(value2);

                    // if non of values is a number, we will compare initial strings
                    if (typeof numberValue1 === "undefined" && typeof numberValue2 === "undefined") {
                        return value1 == value2;
                    } else {
                        return numberValue1 == numberValue2;
                    }
                } else {
                    return false;
                }
            }
        }
    });

    _.extend(FilterModel.prototype, Backbone.Validation.mixin);

    return FilterModel;
});
