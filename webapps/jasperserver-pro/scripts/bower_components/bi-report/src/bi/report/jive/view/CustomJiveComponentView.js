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
 * @author: Igor Nesterenko
 * @version: $Id$
 */

/* global __visualize__, requirejs */

define(function (require) {

     "use strict";

    var Backbone =  require("backbone"),
        $ = require("jquery"),
       log =  require("logger").register("Report"),
       //looks like local 'require' doesn't support 'require.config'
       globalRequire = typeof __visualize__ !== "undefined" ? __visualize__.requirejs : requirejs;

    return Backbone.View.extend({

        initialize: function() {

            var model = this.model,
                loaderConfig = { paths: {}},
                css = model.get("css"),
                script = model.get("script");

            this.modules = [];

            loaderConfig.paths[script.name] = script.href;
            this.modules.push(script.name);

            if (css){
                loaderConfig.paths[css.name] = css.href;
                this.modules.push("csslink!"+ css.name)
            }

            globalRequire.config(loaderConfig);

            Backbone.View.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            var
                renderDeferred = new $.Deferred(),
                data = this.model.get("instanceData");

           globalRequire(this.modules, function(renderer){
               // Cleanup the DIV...
               // This is due to a bug in the interactive viewer which
               // inovkes the component twice.
               $("#" + data.id + " svg").remove();

               renderer(data);
               renderDeferred.resolve();
           }, function(err){
               log.error(err);
               renderDeferred.reject(err);
           });

           return renderDeferred;
        }

    });
});
