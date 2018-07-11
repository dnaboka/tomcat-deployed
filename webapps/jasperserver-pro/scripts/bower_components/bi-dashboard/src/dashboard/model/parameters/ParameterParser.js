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
        grammar = require("./ParameterGrammar"),
        grammarKeys = _.map(_.keys(grammar), function (key) {
            return grammar[key].hasDefaultResolution ? key : key + "{";
        });

    function splitToParts(urlPattern, offset, parts, fn, options){
        var expression = getNextExpression(urlPattern, offset);

        if (expression) {
            parts.push(urlPattern.substring(offset, expression.begin));
            parts.push(grammar[expression.type].resolve(urlPattern.substring(expression.begin, expression.end), fn, options));

            splitToParts(urlPattern, expression.end, parts, fn, options);
        } else {
            parts.push(urlPattern.substring(offset));
        }

        return parts;
    }

    function getNextExpression(urlPattern, offset) {
        var expr = _.reduce(grammarKeys, function (memo, key) {
            var index = urlPattern.indexOf(key, offset);
            if (index >= 0) {
                if (!memo || memo.begin > index) {
                    memo = {
                        type: key[key.length - 1] === "{" ? key.substring(0, key.length - 1) : key,
                        begin: index
                    }
                }
            }
            return memo;
        }, false);

        if (expr){
            if (grammar[expr.type].hasDefaultResolution && urlPattern[expr.begin + expr.type.length] !== "{"){
                expr.end = expr.type.length + expr.begin;
            } else {
                var index = urlPattern.indexOf("}", expr.begin);
                expr.end =  1 + (index < 0 ? urlPattern.length : index);
            }
        }

        return expr;
    }

    return {
        substitute: function (parametrizedString, valuesResolver, options) {
            return splitToParts(parametrizedString, 0, [], valuesResolver, options).join("");
        },

        completionOptions: function(input, cursorPosition, options){
            var result;
            if (cursorPosition === 0){
                result = []
            } else {
                var match = [],
                    result = _.reduce(grammar, function (memo, grammarUnit) {
                        return memo.concat(grammarUnit.getSubstitutionOptions(input, cursorPosition, options))
                    }, []);

                if (!result.length) {
                    _.each(_.keys(grammar), function (key) {
                        var index = key.toLowerCase().indexOf(input[cursorPosition - 1].toLowerCase()),
                            offset = cursorPosition - 1 - index;
                        if (index !== -1 && offset >= 0){
                            for (var i = 0; i < index; i++){
                                if (key[i].toLowerCase() !== input[offset + i].toLowerCase()){
                                    return;
                                }
                            }

                            match.push({
                                begin: cursorPosition - index - 1,
                                end: cursorPosition,
                                substitution: key,
                                label: key,
                                action: key,
                                newCursorPos: cursorPosition - index + key.length - 1,
                                removeIfSingle: index === key.length - 1
                            });
                        }
                    });

                    if (match.length === 1 && match[0].removeIfSingle){
                        match = [];
                    }

                    _.each(match, function (info) {
                        match.removeIfSingle = undefined;

                        if (grammar[info.action].hasDefaultResolution) {
                            result.push(_.clone(info));
                        }

                        info.label = info.label + "{ ... }";
                        info.substitution = info.substitution + "{}";
                        info.action = info.action + "{}";
                        info.newCursorPos++;
                        info.hasOptions = true;

                        result.push(info);
                    });
                }
            }

            return result;
        }
    }
});