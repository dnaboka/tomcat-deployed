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


/*
 * @author afomin, inesterenko
 * @version: $Id$
 */

/* global console*/

define(function (require) {

    "use strict";

    var isIE = navigator.userAgent.toLowerCase().indexOf("msie") > -1;

    var $ = require("jquery"),
        _ = require("underscore"),
        //dialogs = require("components.dialogs"),

        AJAX_LOADING_ID = "loading";

    return {

        LOADING_DIALOG_DELAY : 800,

        //check presents of element in DOM
        isElementInDom:function (elem) {
            var nextSibling = elem.nextSibling;
            var parent = elem.parentNode && elem.parentNode.nodeType  !== 11;
            return nextSibling || parent;

        },

        // Optimized inserting of big content to DOM
        setInnerHtml:function (el, template, data) {

            var nextSibling, parent, display;

            if (this.isElementInDom(el)) {
                nextSibling = el.nextSibling;
                parent = el.parentNode;
                display = el.style.display;
                //turn off css reflows on it element during update
                el.style.display = 'none';
                //remove from the dom, it also reduce reflows on this element
                parent.removeChild(el);
            }

            el.innerHTML = "";

            if (isIE && el.tagName == "SELECT") {
                //workaround for bug in IE, select element and innerHTML functionality
                //TODO: rewrite it, because it hardcoded for one special case it doesn't use template
                var fragment = document.createDocumentFragment();
                _.each(data.data, function (data) {
                    var option = document.createElement('OPTION');
                    //hardcoded workaround for report options
                    option.value = !_.isUndefined(data.value) ? data.value : data.id;
                    option.innerHTML = data.label;
                    if (data.selected) {
                        option.setAttribute('selected', 'selected');
                    }
                    fragment.appendChild(option);
                });
                el.appendChild(fragment);
            } else {
                el.innerHTML = template(data);
            }

            if (nextSibling) {
                parent.insertBefore(el, nextSibling);
            } else {
                parent.appendChild(el);
            }

            el.style.display = display;

            if (isIE && el.tagName == "SELECT"){
                //workaround for IE8,9, where width of 'select' not updates, before user click on.
                //reset style to force browser's reflows for 'select' element
                var styleContent = el.getAttribute("style");
                el.removeAttribute("style");
                el.setAttribute("style", styleContent);
            }

        },

        wait:function (delay) {
            return $.Deferred(function (dfr) {
                setTimeout(dfr.resolve, delay);
            });
        },

        showLoadingDialogOn:function (deferred, delay, modal) {
            this.wait(delay ? delay : this.LOADING_DIALOG_DELAY).then(_.bind(function () {
                if (deferred.state() == "pending") {
                    //Do not focus on loading dialog
                    // TODO replace dialog
                    //dialogs.popup.show(jQuery(AJAX_LOADING_ID), modal, {focus: false});
                    $.when(deferred).always(_.bind(function () {
                        //don't close loading dialog very fast it irritates user
                        this.wait(500).then(function () {
                            // TODO replace dialog
                            //dialogs.popup.hide(jQuery(AJAX_LOADING_ID));
                        });
                    },this));
                }
            }, this));
        },

        createTimer : function(message){
            var timer = new $.Deferred();
            timer.done(function(startTime){
                var endTime = (new Date()).getTime();
                var diff = endTime - startTime;
                console.log(message+ " took time: "+ diff + " msec.");
            });
            return {
                start : function(){
                    this.startTime = (new Date()).getTime();
                    return this;
                },

                stop : function(){
                    timer.resolve(this.startTime);
                    return this;
                }
            };
        },

        //merge  values  with selection
        merge:function (values, selections) {

            if(_.isNull(values) || _.isUndefined(values)){
                return selections;
            }

            if (_.isNull(selections) || _.isUndefined(selections)){
                return values;
            }

            if (_.isArray(selections)) {
                return _.map(values, function (option) {
                    var selectedValue = _.find(selections, function (selection) {
                        return selection === option.value;
                    });
                    if (selectedValue !== undefined) {
                        option.selected = true;
                    } else {
                        delete option.selected;
                    }
                    return option
                });
            }else {
                return this.merge(values, [selections]);
            }
        },

        extractSelection: function (controlData, single) {

            if (!controlData) {
                return null;
            }

            var selection = {};

            for (var i = 0; i < controlData.length; i++) {
                var item = controlData[i];
                if (item.selected) {
                    selection[i] = item.value;

                    if (single) {
                        break;
                    }
                }
            }

            return selection;
        },

        //check for changes between two objects
        isSelectionChanged: function (previous,next) {
            var previousControlIds = previous ? _(previous).keys() : [];
            var nextControlIds = next ? _(next).keys() : [];
            var controlsIdUnion = _.union(previousControlIds, nextControlIds);
            if (controlsIdUnion.length === previousControlIds.length){
                var previousFlattenValues = previous ? _.flatten(_(previous).values()) : [];
                var nextFlattenValues = next ? _.flatten(_(next).values()) : [];
                return  _.difference(previousFlattenValues, nextFlattenValues).length > 0 ||
                    _.difference(nextFlattenValues, previousFlattenValues).length > 0;
            }
            return true;
        }

    };
});

