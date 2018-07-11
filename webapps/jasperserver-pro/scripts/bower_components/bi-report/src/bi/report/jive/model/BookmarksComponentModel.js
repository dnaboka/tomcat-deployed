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
 * @author: Narcis Marcu
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        BaseComponentModel = require("./BaseComponentModel"),
        jiveTypes = require("../enum/jiveTypes");

    return BaseComponentModel.extend({
        defaults: function() {
            return {
                bookmarks: [],
                id: undefined,
                type: jiveTypes.BOOKMARKS
            }
        },

        constructor: function(attrs, options) {
            options || (options = {});
            options.parse || (options = _.extend({}, options, {parse: true}));

            BaseComponentModel.call(this, attrs, options);
        },

        parse: function(data) {
            data.bookmarks = this._processBookmarks(data.bookmarks);
            return data;
        },

        _processBookmarks: function(bookmarks) {
            if (bookmarks) {
                var self = this;

                return _.map(bookmarks, function(bookmark) {
                    return {
                        anchor: bookmark.label,
                        page: bookmark.pageIndex + 1,
                        bookmarks: self._processBookmarks(bookmark.bookmarks)
                    };
                });
            }
            return null;
        }
    });
});

