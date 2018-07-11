/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
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
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        $ = require("jquery");

    return Backbone.View.extend({

        initialize: function($reportElement) {
            this.setElement($("<iframe></iframe>", { scrolling: "no" }).css({ border: "none", width: "100%"}));
            this.frameLoaded = new $.Deferred();

            this.$el.on("load", _.bind(this.onLoad, this, $reportElement));

        },

        onLoad: function($reportElement) {
            if (this.el.contentWindow || this.el.contentDocument) {
                this.frameDoc = (this.el.contentWindow || this.el.contentDocument).document;
	            this.$frameBody = $(this.frameDoc.getElementsByTagName("body")[0]);

	            this.$frameBody.css({
                    position: "relative",
                    margin: 0
                }).html($reportElement);

                this.frameLoaded.resolve();
            } else {
                setTimeout(function() {
                    _.bind(this.onLoad, this);
                }, 1000);
            }
        },
        remove: function() {
            this.$el.off("load");
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });
});