/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        hyperlinkTargets = require("bi/report/jive/enum/hyperlinkTargets"),
        hyperlinkTypes = require("bi/report/jive/enum/hyperlinkTypes"),
        urlTemplate = _.template("{{=url}}{{=parameters}}{{=anchor}}");

    return {
        events: {
            click: function (ev, link, dashlet) {
                // TODO check if we need to parse href
                var //http://somehost?param=value#anchor ->
                //["http://somehost?param=value#anchor", "http://somehost", "?param=value", "#anchor"]
                    urlParts = link.href.match(/^([^\?\#]+)(\?[^\#]+)?(\#.*)?$/),
                    params = "",
                    anchor = urlParts[3] || "",
                    url;

                //merge url parameters and link params
                if (urlParts[2]) {
                    params += urlParts[2];
                }

                if (link.parameters) {
                    params += ((params ? "&" : "?") + $.param(link.parameters, true));
                }

                url = urlTemplate({
                    url: urlParts[1],
                    parameters: params,
                    anchor: anchor
                });

                if (link.target !== hyperlinkTargets.SELF) {
                    window.open(url, _.contains(_.values(hyperlinkTargets), link.target) ? "_" + link.target.toLowerCase() : link.target);
                } else {
                    dashlet && dashlet.drilldown && dashlet.drilldown(_.extend({}, link, {
                        type: hyperlinkTypes.REFERENCE,
                        href: url
                    }));
                }
            }
        }
    }
});
