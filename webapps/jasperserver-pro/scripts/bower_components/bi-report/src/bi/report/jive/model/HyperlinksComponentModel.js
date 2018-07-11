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
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        BaseComponentModel = require("./BaseComponentModel"),
        jiveTypes = require("../enum/jiveTypes"),
        hyperlinkTargets = require("../enum/hyperlinkTargets"),
        hyperlinkTypes = require("../enum/hyperlinkTypes");

    return BaseComponentModel.extend({
        defaults: function() {
            return {
                hyperlinks: [],
                id: undefined,
                type: jiveTypes.HYPERLINKS
            }
        },

        constructor: function(attrs, options) {
            options || (options = {});
            options.parse || (options = _.extend({}, options, {parse: true}));

            BaseComponentModel.call(this, attrs, options);
        },
        parse: function(data) {
            var self = this;

            data.hyperlinks = _.map(data.hyperlinks, function(jrLink){
                var hyperlink = {
                    id: jrLink.id,
                    parameters: jrLink.params,
                    href: jrLink.href,
                    type: jrLink.type,
                    tooltip: jrLink.tooltip,
                    target: _.isUndefined(jrLink.target) ? hyperlinkTargets.SELF : jrLink.target,
                    anchor: jrLink.anchor,
                    pages: jrLink.page
                };

                if (_.contains([hyperlinkTypes.REPORT_EXECUTION, hyperlinkTypes.LOCAL_PAGE, hyperlinkTypes.LOCAL_ANCHOR], jrLink.type)) {
                    hyperlink.href = "";
                    hyperlink.resource = jrLink.params && !_.isUndefined(jrLink.params._report)
                        ? jrLink.params._report
                        : self.parent.get("reportURI")
                }

                if (jrLink.type === hyperlinkTypes.REPORT_EXECUTION) {
                    hyperlink.anchor = jrLink.params ? jrLink.params._anchor : undefined;
                    hyperlink.pages = jrLink.params ? jrLink.params._page : undefined;
                }

                return hyperlink;
            });

            return data;
        }
    });
});

