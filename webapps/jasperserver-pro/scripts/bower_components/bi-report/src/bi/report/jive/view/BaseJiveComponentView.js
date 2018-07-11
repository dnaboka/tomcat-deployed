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

//we can rid off of that class as a mandatory for JIVE components
define(function (require) {
    "use strict";

    var Backbone =  require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        log =  require("logger").register("Report"),
        browserDetection = require("common/util/browserDetection");

    return Backbone.View.extend({
        initialize: function(options) {
            this.stateModel = options.stateModel;
            this.report = options.report;

            log.debug("Create jive view", this);

            Backbone.View.prototype.initialize.apply(this, arguments);
        },

        //protected
        getReportId: function(){
            return this.report && this.report.id;
        },

        //protected
        setDataReportId: function($el, id){
            $el.attr('data-reportId', id);
        },

        //protected
        getReportContainer: function(id){
            return $("[data-reportId = '"+ id +"']");
        },

        
        //optional
        scale: function(scaleFactor){
            this.model.set("scaleFactor", scaleFactor);
        },

        // should be overridden; each implementation should return a deferred object
        render: function($el) {
            var renderDeferred = new $.Deferred();
            renderDeferred.resolve();

            return renderDeferred;
        },

        // should be overridden, optional
        detachEvents: function(){},

        remove: function() {
            this.detachEvents();
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        _applyScaleTransform: function($container, scaleFactor) {
            var scale = "scale(" + scaleFactor + ")",
                origin = "0 0",
                transform =  {
                    '-webkit-transform': scale,
                    '-webkit-transform-origin': origin,
                    '-moz-transform': scale,
                    '-moz-transform-origin': origin,
                    '-ms-transform': scale,
                    '-ms-transform-origin': origin,
                    '-o-transform': scale,
                    '-o-transform-origin': origin,
                    'transform': scale,
                    'transform-origin': origin
                };

            // transform: scale, analog for IE8 and lower.
            if(browserDetection.isIE8()){
                transform.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + scaleFactor + ", M12=0, M21=0, M22=" + scaleFactor + ", SizingMethod='auto expand')";
            }

            $container.css(transform);
        }
    });

});

