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
 * @version: $Id$
 */

define(function(require) {
    var $ = require("jquery"),
        xdm = require("xdm");

    //Function was copied from easyXDM.  This is quick and dirty since we are planning to go to CORS soon.
    function getLocation(url){
        var reURI = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/; // returns groups for protocol (2), domain (3) and port (4)
        var m = url.toLowerCase().match(reURI);
        var proto = m[2], domain = m[3], port = m[4] || "";
        if ((proto == "http:" && port == ":80") || (proto == "https:" && port == ":443")) {
            port = "";
        }
        return proto + "//" + domain + port;
    }

    var requests = {},
        remote = new xdm.Rpc(
            {
                acl: ['*']
            },
            {
                local: {
                    // define the exposed method
                    request: function (config, success, error) {
                        if (config.headers === undefined)
                            config.headers = {};
                        config.headers['X-Remote-Domain'] = remote.origin;
                        config.headers['X-Local-Domain'] = getLocation(location.href);

                        var dfd = $.ajax(config);
                        if(config.id){
                            requests[config.id] = dfd;
                        }
                        dfd.then(function (data, status, jqXhr) {
                            // TODO: this is hack to fix xdm issue with transmitting more than one callback params. I'm packing all params to single one
                            jqXhr.responseHeadersString = jqXhr.getAllResponseHeaders();
                            success({
                                data: data,
                                status: status,
                                xhr: jqXhr
                            });
                        }, error);
                    },
                    abort: function(id){
                        requests[id] && requests[id].state() == 'pending' && requests[id].abort();
                        delete requests[id];
                    }
                }
            });

    //Not sure that we still need it
    window.remote = remote;
});
