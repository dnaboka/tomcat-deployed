/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        nothingToDisplayTemplate = require("text!home/template/nothingToDisplayTemplate.htm"),
        i18n = require("bundle!HomeBundle");

    return Backbone.View.extend({

        initialize: function(options) {

            this.subviews = [];
            this.initOptions = options; // save it because we need it below

            if (options){
                var defaultMessage = i18n["default.nothing.display"];
                this._msgNothingToDisplay = !options.msgNothingToDisplay ? defaultMessage : options.msgNothingToDisplay;

                if (options.fetchCollection) {
                    this.collection.fetch({ reset: true });
                }

                // Since our "List" view is also used for displaying tables
                // (see HomeView for examples), provide a way to add the
                // appropriate container tags, to avoid doing things like
                // <table><div>You have no recently viewed items.</div></table>
                // because <TR> and <TD> wrappers are required.  This allows
                // the template itself to be used in both kinds of lists.
                this._nothingPrefix = ('nothingPrefix' in options) ? options.nothingPrefix : "";
                this._nothingSuffix = ('nothingSuffix' in options) ? options.nothingSuffix : "";
            }

            this.collection.on("reset", this.render, this);
        },

        render: function () {

            var nothingToDisplayElement;

            // Make the list view itself a tab stop, for use with Standard
            // Navigation (stdnav).  This will work for any type that stdnav
            // either has built-in support for, or a plugin for, notably
            // including ol, ul, table, and div (with js-navtype="grid", etc.).
            // This is now the default-- pass in tabindex:"-1" to avoid it.
            if (this.initOptions['tabindex']===undefined) {
                this.$el.attr("tabindex", 0);
            } else {
                this.$el.attr("tabindex", this.initOptions['tabindex']);
            }

            if (this.initOptions['itemPlural']===undefined){
                this.$el.attr("js-itemplural", "items");
            } else {
                this.$el.attr("js-itemplural", this.initOptions['itemPlural']);
            }

            if (this.collection.length > 0){
                //cleanup only for 'nothing' msg, no listeners to remove here
                this.$el.html("");

                this.collection.forEach(_.bind(function(model){
                    var view = new this.initOptions.listElementView({ model: model });
                    this.subviews.push(view);
                    this.$el.append(view.render().$el);
                },this));

            }else{
                nothingToDisplayElement = _.template(nothingToDisplayTemplate,
                    {
                        message: this._msgNothingToDisplay,
                        markupPrefix: this._nothingPrefix,
                        markupSuffix: this._nothingSuffix
                    });
                this.$el.append(nothingToDisplayElement);
            }

            return this;
        }

    });
});