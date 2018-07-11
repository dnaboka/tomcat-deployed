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

    var reportExecution = require("./dashboardHyperlinkHandlerReportExecution");

    return {
        events: {
            click: function(ev, link, dashlet) {
                reportExecution.events.click.apply(this, arguments);
            }
        }
    }
});
