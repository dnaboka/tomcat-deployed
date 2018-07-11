/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        log = require("logger").register(module),
        BaseModel = require("common/model/BaseModel"),
        substitutions = require("../enum/substitutionConstants"),
        dateUtils = require("common/util/parse/date"),
        timeUtils = require("common/util/parse/time"),
        numberUtilsOptions = require("settings/decimalFormatSymbols"),
        NumberUtils = require("common/util/parse/NumberUtils"),
        numberUtils = new NumberUtils(numberUtilsOptions),
        i18n = require("bundle!InputControlsValidation"),
        InputControlOptionCollection = require("../collection/InputControlOptionCollection");

    return BaseModel.extend({
        defaults: {
            id: undefined,
            value: undefined,
            options: undefined,
            uri: undefined,
            error: undefined
        },

        initialize: function() {
            BaseModel.prototype.initialize.apply(this, arguments);

            this.isValue = _.isUndefined(this.get("options"));

            this.options = new InputControlOptionCollection(this.get("options") || []);

            this.on("change:options", _.bind(function() {
                this.options.reset(this.get("options") || []);
            }, this));
            this.on("all", log.debug, log);

        },
        validation: function() {
            var value = this.get("value"),
                compare,
                dataType = this.dataType;

            if (this.isValue) {
                if (this.mandatory
                    && (value === "" || _.isUndefined(value) || value === substitutions.NULL_SUBSTITUTION_VALUE)) {
                    return i18n["fillParameters.error.mandatoryField"];
                }
            } else {
                if (this.mandatory && !this.getData().length) {
                    return i18n["fillParameters.error.mandatoryField"];
                }
                return null;
            }


            if (!dataType || value === "") {
                return null;
            }

            if (dataType.type === "text") {
                if (dataType.pattern && !RegExp("^" + dataType.pattern + "$").test(value)) {
                    return i18n["fillParameters.error.invalidPattern"];
                }
            }

            if (dataType.type === "number") {
                value = numberUtils.parseNumber(value);
                if (!_.isNumber(value) || _.isNaN(value)) {
                    return i18n["fillParameters.error.invalidValueForType"].replace("{0}", "number");
                }

                if (dataType.minValue) {
                    if (dataType.strictMin && dataType.minValue >= value) {
                        return i18n["fillParameters.error.smallerThan"];
                    }
                    if (!dataType.strictMin && dataType.minValue > value) {
                        return i18n["fillParameters.error.smallerOrEqual"];
                    }
                }
                if (dataType.maxValue) {
                    if (dataType.strictMax && dataType.maxValue <= value) {
                        return i18n["fillParameters.error.greaterThan"];
                    }
                    if (!dataType.strictMax && dataType.maxValue < value) {
                        return i18n["fillParameters.error.greaterOrEqual"];
                    }
                }
            }

            // TODO add validation for relative dates comparation with min/max dates (date and datetime types)
            if (dataType.type === "date") {
                var localizedDate = dateUtils.isoDateToLocalizedDate(value);

                if (!dateUtils.isDate(localizedDate) && !dateUtils.isRelativeDate(value)) {
                    return i18n["fillParameters.error.invalidValueForType"].replace("{0}", "Date");
                }
                if (dataType.minValue ) {
                    compare = dateUtils.compareDates(dateUtils.isoDateToLocalizedDate(dataType.minValue.substr(0, 10)), localizedDate);
                    if (dataType.strictMin) {
                        if (compare !== -1) {
                            return i18n["fillParameters.error.smallerThan"];
                        }
                    } else {
                        if (compare !== -1 && compare !== 0) {
                            return i18n["fillParameters.error.smallerOrEqual"];
                        }
                    }
                }
                if (dataType.maxValue ) {
                    compare = dateUtils.compareDates(dateUtils.isoDateToLocalizedDate(dataType.maxValue.substr(0, 10)), localizedDate);
                    if (dataType.strictMax) {
                        if (compare !== 1) {
                            return i18n["fillParameters.error.greaterThan"];
                        }
                    } else {
                        if (compare !== 1 && compare !== 0) {
                            return i18n["fillParameters.error.greaterOrEqual"];
                        }
                    }
                }
            }
            if (dataType.type === "time") {
                var localizedTime = dateUtils.isoTimeToLocalizedTime(value);

                if (!timeUtils.isTime(localizedTime)) {
                    return i18n["fillParameters.error.invalidValueForType"].replace("{0}", "Time");
                }

                if (dataType.minValue ) {
                    compare = timeUtils.compareTimes(dateUtils.isoTimeToLocalizedTime(dataType.minValue), localizedTime);
                    if (dataType.strictMin) {
                        if (compare !== -1) {
                            return i18n["fillParameters.error.smallerThan"];
                        }
                    } else {
                        if (compare !== -1 && compare !== 0) {
                            return i18n["fillParameters.error.smallerOrEqual"];
                        }
                    }
                }
                if (dataType.maxValue ) {
                    compare = timeUtils.compareTimes(dateUtils.isoTimeToLocalizedTime(dataType.maxValue), localizedTime);
                    if (dataType.strictMax) {
                        if (compare !== 1) {
                            return i18n["fillParameters.error.greaterThan"];
                        }
                    } else {
                        if (compare !== 1 && compare !== 0) {
                            return i18n["fillParameters.error.greaterOrEqual"];
                        }
                    }
                }
            }
            if (dataType.type === "datetime") {
                var localizedTimestamp = dateUtils.isoTimestampToLocalizedTimestamp(value);
                value = value.replace("T", " ");

                if (!dateUtils.isTimestamp(localizedTimestamp) && !dateUtils.isRelativeTimestamp(value)) {
                    return i18n["fillParameters.error.invalidValueForType"].replace("{0}", "DateTime");
                }
                if (dataType.minValue ) {
                    compare = dateUtils.compareTimestamps(dateUtils.isoTimestampToLocalizedTimestamp(dataType.minValue), localizedTimestamp);
                    if (dataType.strictMin) {
                        if (compare !== -1) {
                            return i18n["fillParameters.error.smallerThan"];
                        }
                    } else {
                        if (compare !== -1 && compare !== 0) {
                            return i18n["fillParameters.error.smallerOrEqual"];
                        }
                    }
                }
                if (dataType.maxValue ) {
                    compare = dateUtils.compareTimestamps(dateUtils.isoTimestampToLocalizedTimestamp(dataType.maxValue), localizedTimestamp);
                    if (dataType.strictMax) {
                        if (compare !== 1) {
                            return i18n["fillParameters.error.greaterThan"];
                        }
                    } else {
                        if (compare !== 1 && compare !== 0) {
                            return i18n["fillParameters.error.greaterOrEqual"];
                        }
                    }
                }
            }


            return null;

        },

        changeState: function(data) {
            if (this.isValue) {
                this.set("value", data);
            } else {
                data = _.isArray(data) ? data : [data];
                this.options.each(function(option) {
                    option.set("selected", _.contains(data, option.get("value")), {silent: true});
                });
                this.options.trigger("change:selected");
                this.options.trigger("change");
            }

            var error = this.validation();
            this.set("error", error);

            return error;
        },

        getData: function() {
            if (this.isValue) {
                return [this.get("value")];
            } else {

                return this.options.reduce(function(memo, option) {
                    if (option.get("selected")) {
                        memo.push(option.get("value"));
                    }
                    return memo;
                }, []);

            }
        }
    });
});