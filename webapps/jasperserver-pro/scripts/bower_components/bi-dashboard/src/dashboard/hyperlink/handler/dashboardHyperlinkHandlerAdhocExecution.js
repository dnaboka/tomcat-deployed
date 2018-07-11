/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Zakhar.Tomchenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        hyperlinkTargets = require("bi/report/jive/enum/hyperlinkTargets");

    return {
        events: {
            click: function (ev, link, dashlet) {
                if (dashlet.model.get("exposeOutputsToFilterManager") && link.parameters) {
                    // in case of Open new page/ Replace page its still required to notify wiring to route parameter values
                    // because the url may contain parameters. But this change should not be saved in parameters undo/redo stack
                    if (dashlet.model.get("dashletHyperlinkUrl")) {
                        try {
                            dashlet.model.collection.disableParametersStateStack();
                            dashlet.notify(link.parameters);
                            dashlet.model.collection.enableParametersStateStack();
                        } catch (error) {
                            dashlet.model.collection.enableParametersStateStack();
                            throw error;
                        }
                    } else {
                        dashlet.notify(link.parameters);
                    }
                }

                if (dashlet.model.get("dashletHyperlinkUrl") && dashlet.model.get("dashletHyperlinkTarget")) {
                    dashlet.model.getLinkUrl(dashlet.model.paramsModel.attributes).done(function (url) {
                        var hyperlinkN = getUrlParameter(window.location.href, "_ddHyperlink");
                        if (hyperlinkN && +hyperlinkN.value){
                            hyperlinkN = +hyperlinkN.value;
                        } else {
                            hyperlinkN = 0;
                        }

                        url = setUrlParameter(url, "_ddHyperlink", hyperlinkN + 1);

                        if (dashlet.model.get("dashletHyperlinkTarget") === hyperlinkTargets.BLANK) {
                            url = setUrlParameter(url, "noReturn", true);
                        }

                        dashlet.model.get("dashletHyperlinkTarget") === hyperlinkTargets.SELF
                            ? window.location.href = url
                            : window.open(url);
                    }).fail(function (msg) {
                        dashlet.showErrorDialog(msg);
                    });
                }
            }
        }
    };

    function getUrlParameter(url, name){
        return _.find(parseParameters(extractParameters(url)), function(parameter){
            return parameter.name === name;
        });
    }

    function setUrlParameter (url, parameter, value) {
        var result,
            questionIdx = url.indexOf('?'),
            hashIdx = url.indexOf('#'),
            parameters = concatParameters(setParameterValue(parseParameters(extractParameters(url)), parameter, value));

        if (questionIdx === -1) {
            if (hashIdx === -1) {
                result =  url.concat("?", parameters);
            } else {
                result = url.slice(0, hashIdx).concat("?", parameters, url.slice(hashIdx));
            }
        } else {
            if (hashIdx === -1) {
                result = url.slice(0, questionIdx + 1).concat(parameters);
            } else {
                result = url.slice(0, questionIdx + 1).concat(parameters, url.slice(hashIdx));
            }
        }

        return result;
    }

    function extractParameters(url){
        var questionIdx, hashIdx, res = "";

        if ((questionIdx = url.indexOf('?')) >= 0){
            if ((hashIdx = url.indexOf('#')) >= questionIdx){
                res = url.substring(questionIdx + 1, hashIdx);
            } else {
                res =  url.substring(questionIdx + 1);
            }
        }

        return res;
    }

    function parseParameters(paramStr){
        return paramStr ? _.compact(_.map(paramStr.split("&"), function(param){
            if (param){
                var vals = param.split("=");
                return {
                    name: vals[0],
                    value: vals[1]
                }
            }
        })) : [];
    }

    function concatParameters(parameters){
        return _.map(parameters, function(param){
            if (_.isUndefined(param.value)){
                return param.name;
            } else {
                return param.name.concat("=", param.value);
            }

        }).join("&");
    }

    function setParameterValue(parameters, name, value){
        for (var i = 0; i < parameters.length; i++){
            if (parameters[i].name === name){
                parameters[i].value = value;
                return parameters;
            }
        }

        parameters.push({
            name: name,
            value: value
        });

        return parameters;
    }
});
