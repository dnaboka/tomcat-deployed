/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id: $
 */

define(function (require) {
        var _ = require("underscore"),
            i18n = require("bundle!AdHocBundle"),
            formatsMappingUtil = require("./formatsMappingUtil"),
            config = require("jrs.configs");

        var polyfillFormatter = {
            format: function (val, format, opts) {
                var separator = separatorsFactory(config.userLocale);

                if (formatsMappingUtil.isNullOrEmpty(val)) {
                    return "";
                }

                if (formatsMappingUtil.isOtherNode(val)) {
                    return val;
                }

                if (format === "#,##0.00") {
                    return formatNumber(val, false, separator.THOUSAND, 2, 2, false, separator.DECIMAL);
                }

                if (format === "0") {
                    return formatNumber(val, false, "", 0, 0);
                }

                if (format === "$#,##0.00;($#,##0.00)") {
                    return formatNumber(val, true, separator.THOUSAND, 2, 2, "$", separator.DECIMAL);
                }

                if (format === "$#,##0;($#,##0)") {
                    return formatNumber(val, true, separator.THOUSAND, 0, 0, "$");
                }

                if (format === "$#,##0.000#############") {
                    return formatNumber(val, false, separator.THOUSAND, 3, 16, "$", separator.DECIMAL);
                }

                if (format === "$#,##0,00;($#,##0,00)") {
                    return formatNumber(val, true, separator.THOUSAND, 2, 2, "$", separator.DECIMAL);
                }

                if (format === "#,##0") {
                    return formatNumber(val, false, separator.THOUSAND, 0, 0);
                }

                if (format === "$#,##0;($#,##0)") {
                    return formatNumber(val, true, separator.THOUSAND, 0, 0, "$");
                }

                if (format === "#,##0;(#,##0)") {
                    return formatNumber(val, true, separator.THOUSAND, 0, 0);
                }

                return val;
            }
        };

        function formatNumber(number, negativeAsBrackets, thousandsSeparator, fixedMin, fixedMax, prefix, decimalSeparator) {
            var res, negative = number[0] === "-";

            if (negative) {
                number = number.substring(1)
            }

            res = formatBigValues(number, fixedMin || 0, fixedMax || 0, decimalSeparator, thousandsSeparator);

            prefix && (res = prefix + res);

            if (negative) {
                if (negativeAsBrackets) {
                    res = "(" + res + ")";
                } else {
                    res = "-" + res;
                }
            }

            return res;
        }

        function formatBigValues(numberStr, fixedMin, fixedMax, decimalSeparator, thousandsSeparator) {
            var decimalParts = numberStr.split("."),
                intPart = decimalParts[0],
                mantissPart = decimalParts[1] || "",
                mantissPartValue = decimalParts[1] ? +("0." + mantissPart) : 0,
                fixed = mantissPart.length,
                integerParts;

                fixed = Math.max(fixed, fixedMin);
                fixed = Math.min(fixed, fixedMax);

            if (fixed){
                if (mantissPart.length > fixed){
                    mantissPart = mantissPartValue.toFixed(fixed).substring(2);

                    if (+mantissPart === 0 && Math.round(mantissPartValue)){
                        intPart = (+intPart + 1).toString();
                    }

                } else if (mantissPart.length < fixed){
                    for (var i = mantissPart.length; i < fixed; i++){
                        mantissPart += "0";
                    }
                }
            } else {
                if (intPart.length < 17 && Math.round(mantissPartValue)){
                    intPart = (+intPart + 1).toString();
                }
            }

            if (thousandsSeparator){
                integerParts = [];
                for (var i = intPart.length - 3; i >= 0 ; i -= 3) {
                    integerParts.push(intPart.substr(i,3));
                }

                if (3 + i > 0){
                    integerParts.push(intPart.substr(0, 3 + i));
                }

                intPart =  integerParts.reverse().join(thousandsSeparator);
            }

            return fixed ? intPart + (decimalSeparator || ".") + mantissPart : intPart;
        }

        function separatorsFactory(locale) {
            var separator = {
                THOUSAND: ","
            };

            if (locale.indexOf("es") === 0 || locale.indexOf("de") === 0 || locale.indexOf("it") === 0 || locale.indexOf("pt_BR") === 0){
                separator.DECIMAL = ",";
                separator.THOUSAND = ".";
            } else if (locale.indexOf("fr") === 0){
                separator.DECIMAL = ",";
                separator.THOUSAND = " ";
            }

            return separator;
        }

        return polyfillFormatter;
    }
);

