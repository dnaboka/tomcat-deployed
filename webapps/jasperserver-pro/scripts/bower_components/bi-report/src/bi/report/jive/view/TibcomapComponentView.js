/*
 * Copyright (C) 2005 - 2015 Jaspersoft Corporation. All rights reserved.
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
 * @author: Pavel S
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var BaseJiveComponentView = require("./BaseJiveComponentView"),
        T = require("../jr/tibcoGeoanalitics");


    require("csslink!bi/report/jive/jr/theme/tibco-geoanalitics.css");

    return BaseJiveComponentView.extend({

        render: function($el) {
            this.$reportEl = $el;
            this.infowindow = {};

            this._init();
        },

        _init: function() {
            var it = this,
                instData = it.model.get("instanceData");

            it._showMap(it.model.get("id"), instData);

        },
        _showMap: function(canvasId, instData) {
            var it = this,
                mapData = instData.mapData,
                markers = instData.markerList,
                paths = instData.pathsList,
                mOptions = {}, lOptions = {}, layer, map;

            it._getCoords(mapData, mapData.customerName, mapData.customerKey).then(function(coords) {
                mOptions.center = new T.LatLng(coords.latitude, coords.longitude);
                mOptions.zoom = mapData.zoom ? mapData.zoom : 5;
                mOptions.urlLocation = false;
                if(mapData.minZoom) mOptions.minZoom = mapData.minZoom;
                if(mapData.maxZoom) mOptions.maxZoom = mapData.maxZoom;
                if(mapData.repeatX) mOptions.repeatX = it._isTrue(mapData.repeatX, true);

                map = new T.Map(it.$reportEl.find("#" + canvasId)[0], mOptions);

                if(mapData.layerName) lOptions.name = mapData.layerName;
                if(mapData.opacity) lOptions.opacity = mapData.opacity;
                layer = new T.TibcoLayer(lOptions);
                map.addLayer(layer);

                if (paths  && paths.length > 0) {
                    var vectorLayer, vOptions={}, k, props, prop, sOptions, lArray, isPoly, loc, j, latln, arr, poly, isClickable, isReverseCoordinates;

                    vOptions.useCanvas = it._isTrue(mapData.useCanvas, false);
                    if(mapData.pathsLayerName) vOptions.name = mapData.pathsLayerName;
                    if(mapData.clipOffset) vOptions.clipOffset = mapData.clipOffset;
                    vectorLayer = new T.VectorLayer(vOptions);
                    map.addLayer(vectorLayer);

                    for (k = 0; k < paths.length; k++) {
                        props = paths[k];
                        sOptions={};
                        lArray=[];
                        isPoly = false;
                        for (prop in props){
                            if (prop === 'locations' && props[prop]) {
                                loc = props[prop];
                                for (j = 0; j < loc.length; j++) {
                                    latln = loc[j];
                                    it._getCoords(latln, mapData.customerName, mapData.customerKey).then(function (vcoords) {
                                            lArray.push([vcoords.latitude, vcoords.longitude]);
                                        },
                                        function (err) {
                                            //FIXME: error handling here
                                        });
                                }
                            } else if (prop === 'dashArray' || prop === 'lineCap' || prop === 'lineJoin'){
                                vectorLayer.options.defaultStyle[prop] = props[prop];
                            } else if (prop === 'isPolygon'){
                                isPoly = it._isTrue(props[prop], false);
                            } else if (prop === 'clickable') {
                                isClickable = it._isTrue(props[prop], true);
                            } else if (prop === 'reverseCoordinates') {
                                isReverseCoordinates = it._isTrue(props[prop], false);
                            } else if (prop === 'stroke' || prop === 'fill') {
                                sOptions[prop] = it._isTrue(props[prop], true);
                            } else {
                                sOptions[prop] = props[prop];
                            }
                        }

                        if (isPoly){
                            var pl = [lArray];
                            poly = new T.Polygon(pl);
                        } else {
                            poly = new T.Polyline(lArray);
                        }
                        poly.options.clickable = isClickable;
                        poly.options.reverseCoordinates = isReverseCoordinates;
                        poly.setStyle(sOptions);
                        vectorLayer.addGeometry(poly);
                    }
                }

                if (markers && markers.length > 0) {
                    var markersLayer, mlOptions={}, i,
                        markerProps, markerLatLng, isDraggable, markerOptions, marker, xoffset, yoffset, html, target;

                    if(mapData.markersLayerName) mlOptions.name = mapData.markersLayerName;
                    markersLayer = new T.MarkersLayer(mlOptions);
                    map.addLayer(markersLayer);

                    for (i = 0; i < markers.length; i++) {
                        markerProps = markers[i];
                        (function(markerProps) {
                            it._getCoords(markerProps, mapData.customerName, mapData.customerKey).then(function (mcoords) {
                                    markerLatLng = new T.LatLng(mcoords.latitude, mcoords.longitude);
                                    isDraggable = it._isTrue(markerProps['draggable'],false);
                                    xoffset = markerProps['xoffset'] ? markerProps['xoffset'] : 0;
                                    yoffset = markerProps['yoffset'] ? markerProps['yoffset'] : 0;
                                    markerOptions = {
                                        draggable: isDraggable,
                                        offset: new T.Point(xoffset, yoffset)
                                    };
                                    if(markerProps['anchor']) {
                                        markerOptions.anchor = markerProps['anchor'];
                                    }
                                    if (markerProps['icon.url'] && markerProps['icon.url'].length > 0) {
                                        if(markerProps['title'] && markerProps['title'].length > 0) {
                                            html = "<img src='"+markerProps['icon.url']+"' title='"+markerProps['title']+"'";
                                            if(markerProps['hyperlink'] && markerProps['hyperlink'].length > 0) {
                                                target=markerProps['target'] && markerProps['target'].length > 0 ? markerProps['target'] : '_blank';
                                                html+=" onclick=\"javascript:window.open('"+markerProps['hyperlink']+"', '"+target +"')\"";
                                            }
                                            html+="/>";
                                            marker = new T.HtmlMarker(markerLatLng, html, markerOptions);
                                        } else {
                                            marker = new T.ImageMarker(markerLatLng,markerProps['icon.url'],markerOptions);
                                            if (markerProps['hyperlink'] && markerProps['hyperlink'].length > 0) {
                                                marker.myUrl = markerProps['hyperlink'];
                                                marker.target = markerProps['target'] && markerProps['target'].length > 0 ? markerProps['target'] : '_blank';
                                            }
                                        }
                                    } else if (markerProps['html'] && markerProps['html'].length > 0) {
                                        marker = new T.HtmlMarker(markerLatLng,markerProps['html'],markerOptions);
                                    }

                                    if (marker) {
                                        markersLayer.addMarker(marker);
                                    }
                                },
                                function (err) {
                                    //FIXME: error handling here
                                });
                        })(markerProps);
                    }
                    markersLayer.events.on("marker-click", function (m) {
                        if(m && m.myUrl) window.open(m.myUrl, m.target);
                    });
                }

                if(it._isTrue(mapData['layers.control'], false)) {
                    map.addControl(new T.LayersControl({}));
                }
            }, function(err) {
                //FIXME: error handling here
            });
        },

        _getCoords: function(data, customerName, customerKey) {
            var coords;
            var result = new T.Promise();

            if(data.latitude || data.longitude){
                coords = {};
                coords.latitude = data.latitude;
                coords.longitude = data.longitude;
                result.resolve(coords);
            } else if (data.country) {
                var geocoder = new T.Geocoder(customerName, customerKey),
                    goptions = {
                        country: data.country,
                        city: data.city,
                        zip: data.zip,
                        state: data.state,
                        street: data.street
                    };
                geocoder.geocode(goptions).then(function (results) {
                    if(results[0]) {
                        coords = {};
                        // only the first element in the GeocoderResult array will be considered
                        coords.latitude = results[0].location.lat;
                        coords.longitude = results[0].location.lng;
                        result.resolve(coords);
                    }
                }, function (err) {
                    result.reject(err);
                });
            }
            return result;
        },

        _isTrue: function(v, d) {
            if(v) return (v === true || v === 'true');
            else return (d === true || d === 'true');
        }
    });
});
