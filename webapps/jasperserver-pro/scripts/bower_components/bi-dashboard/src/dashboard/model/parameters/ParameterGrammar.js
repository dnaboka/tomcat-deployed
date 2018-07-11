/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 *
 * @version: $Id: $
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        moment = require("moment"),
        momentTimezone = require('momentTimezone'),
        jrsConfigs = require("jrs.configs"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        $ = require("jquery");

    return {
        "$P": {
            resolve: resolveParameterPlaceholder,
            getSubstitutionOptions: getParameterSubstitutionOptions,
            hasDefaultResolution: false
        },
        "$Date": {
            resolve: resolveDatePlaceholder,
            getSubstitutionOptions: _.bind(getDateTimeSubstitutionOptions, this, dashboardSettings.DEFAULT_DATE_FORMATS, "$Date{", "}"),
            hasDefaultResolution: true
        },
        $Time: {
            resolve: resolveTimePlaceholder,
            getSubstitutionOptions: _.bind(getDateTimeSubstitutionOptions, this, dashboardSettings.DEFAULT_TIME_FORMATS, "$Time{", "}"),
            hasDefaultResolution: true
        }
    };

    function resolveParameterPlaceholder(expression, fn, options) {
        var parts = splitExpression(expression), variablePart, values, res = expression;

        if (parts.length){
            variablePart = _.find(parts, function(part){
                return part.value[0] !== '"' && part.value[part.value.length - 1] !== '"';
            });

            values = variablePart ? fn(variablePart.value, options && options.tolerateMissing) : [""];

            res = _.reduce(values, function(memo, currentValue, index){
                memo.push(_.reduce(parts, function(memo, part){
                    (part.optional && index === values.length - 1) || memo.push((variablePart && part.value === variablePart.value) ? currentValue : extractLiteralValueFromLiteralExpression(part.value));
                    return memo;
                }, []).join(""));
                return memo;
            }, []).join("");
        }

        return res;
    }

    function splitExpression(expression){
        var inLiteral = false,
            inExpression = false,
            isOptional = false,
            result = [],
            start = 0;

        for (var i = 0; i < expression.length; i++){
            if (expression[i] === '{'){
                inExpression = true;
                start = i + 1;
            }

            if (expression[i] === '}'){
                inExpression = false;
                start == i || result.push({
                    value: $.trim(expression.substring(start, i)),
                    optional: isOptional
                });
            }

            if (inExpression){
                if ((expression[i] === ',' || expression[i] === '?') && !inLiteral){
                    start == i || result.push({
                        value: $.trim(expression.substring(start, i)),
                        optional: isOptional
                    });

                    isOptional = expression[i] === '?';
                    start = i + 1;
                }

                if (expression[i] === '"' && expression[i-1] !== '\\'){
                    inLiteral = !inLiteral;
                }
            }
        }

        return result;
    }

    function extractLiteralValueFromLiteralExpression(value){
        return value.substring(1, value.length - 1)
    }

    function resolveDatePlaceholder(expression, fn, options){
        var format = expression.substring(expression.indexOf("{") + 1, expression.lastIndexOf("}"));
        return moment().tz(jrsConfigs.userTimezone).format(format || 'MMMM D, YYYY');
    }

    function resolveTimePlaceholder(expression, fn, options){
        var format = expression.substring(expression.indexOf("{") + 1, expression.lastIndexOf("}"));
        return moment().tz(jrsConfigs.userTimezone).format(format || 'h:mm a');
    }

    function getDateTimeSubstitutionOptions(formats, exprStart, exprEnd, input, cursorPos) {
        var result = formats,
            startBrace = input.substring(0, cursorPos).lastIndexOf(exprStart),
            endBrace = input.indexOf(exprEnd, startBrace);

        if (startBrace === -1) {
            result = [];
        } else {
            startBrace += exprStart.length;

            if (startBrace <= cursorPos && (cursorPos <= endBrace || endBrace === -1)) {
                endBrace = cursorPos;

                for (; input[startBrace] === " " && startBrace < endBrace; startBrace++);

                for (var index = startBrace; index < endBrace; index++) {
                    var newOpts = [];
                    for (var inOpts = 0; inOpts < result.length; inOpts++) {
                        if (result[inOpts][index - startBrace] == input[index]) {
                            newOpts.push(result[inOpts]);
                        }
                    }
                    result = newOpts;
                }

                if (result.length === 1 && result[0].length === endBrace - startBrace) {
                    result = [];
                }
            } else {
                result = [];
            }
        }

        return _.map(result, function (format) {
            return {
                begin: startBrace,
                end: cursorPos,
                substitution: format,
                label: format,
                action: format,
                newCursorPos: cursorPos + format.length
            }
        });
    }

    function getParameterSubstitutionOptions(input, cursorPos, options){
        var result,
            exprStart = "$P{", exprEnd = "}",
            startBrace = input.substring(0, cursorPos).lastIndexOf(exprStart),
            endBrace = input.indexOf(exprEnd, startBrace);

        if (startBrace === -1) {
            result = [];
        } else {
            startBrace += exprStart.length;

            if (startBrace <= cursorPos && (cursorPos <= endBrace || endBrace === -1)) {
                endBrace = cursorPos;

                result = options.wiring.reduce(function(memo, connection){
                    if (connection.component.isValueProducer() && _.indexOf(_.values(dashboardWiringStandardIds), connection.get("name")) < 0){
                        var label = readLabel(connection);
                        memo.push(_.extend({
                            producer: connection.get("producer"),
                            label: label,
                            substitution: label
                        }, connection.attributes));
                    }
                    return memo;
                }, []);

                if (result.length) {
                    for (; input[startBrace] === " " && startBrace < endBrace; startBrace++);
                    input = input.toLowerCase();

                    for (var index = startBrace; index < endBrace; index++) {
                        var newOpts = [];
                        for (var inOpts = 0; inOpts < result.length; inOpts++) {
                            if (result[inOpts].substitution[index - startBrace].toLowerCase() == input[index]) {
                                newOpts.push(result[inOpts]);
                            }
                        }
                        result = newOpts;
                    }

                    if (result.length === 1 && result[0].length === endBrace - startBrace) {
                        result = [];
                    }
                }
            } else {
                result = [];
            }
        }

        return _.map(result, function (conn) {
            return _.extend(conn, {
                begin: startBrace,
                end: cursorPos,
                action: conn.producer,
                newCursorPos: cursorPos + conn.name.length
            });
        });
    }

    function readLabel(connection){
        var result;
        if (connection.component.getParent()){
            result = connection.component.get("name");
        } else {
            var name = connection.get("name"),
                param = _.findWhere(connection.component.get("outputParameters"), {id: name});
            result =  param ? param.label : name;
        }

        return result;
    }
});