/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial JasperSoft Subscription License Agreement
 */

/**
 * @author: Sergey Prilukin
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var reference = require("./dashboardHyperlinkHandlerReference");

    return {
        events: {
            click: function (ev, link, dashlet) {
                reference.events.click.apply(this, arguments);
            }
        }
    }
});
