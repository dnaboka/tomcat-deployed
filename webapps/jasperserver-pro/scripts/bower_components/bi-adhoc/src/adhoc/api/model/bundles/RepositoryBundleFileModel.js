/*
 * Copyright (C) 2005 - 2016 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id:$
 */

define(function (require) {
    "use strict";

    var RepositoryFileModel = require("bi/repository/model/RepositoryFileModel"),
        repositoryFileTypes = require("bi/repository/enum/repositoryFileTypes"),
        javaPropertiesParser = require("common/util/parse/javaProperties"),
        _ = require("underscore");

    function parseUnicode(contentJSON) {
        return _.reduce(contentJSON, function (memo, valueWithUnicode, key) {
            memo[key] = valueWithUnicode.replace(/\\u\w\w\w\w/g, function (match) {
                return String.fromCharCode("0x".concat(match.slice(2)));
            });
            return memo;
        }, {});
    }

    return RepositoryFileModel.extend({
        stringifyContent: false,

        defaults: (function() {
            return _.extend({}, RepositoryFileModel.prototype.defaults, {
                type: repositoryFileTypes.PROP
            });
        })(),

        setContent: function(content) {
            this.content = content;
            this.contentJSON = parseUnicode(javaPropertiesParser(content));
        },
        
        toJSON: function(addContent){
            var json = RepositoryFileModel.prototype.call(this);
            addContent && (json.content = this._encodeContent(this.content));
            return json;
        }
    });
});