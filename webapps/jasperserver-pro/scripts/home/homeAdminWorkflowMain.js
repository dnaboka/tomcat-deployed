/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: ${Id}
 */

define(function (require) {

    "use strict";

    require("commons.main");
    require("domReady!");

    var $ = require("jquery"),
        WorkflowCollection = require("home/collection/WorkflowCollection"),
        ListView = require("home/view/ListView"),
        WorkflowView = require("home/view/WorkflowView"),
        template = require("text!home/template/adminWorkflowTemplate.htm"),

        adminWorkflowsView = new ListView({
            collection: new WorkflowCollection({defaultParams:{parentName: "admin"}}),
            listElementView: WorkflowView,
            className :  "workflowsBlock",
            template: "",
            fetchCollection: true,
            tagName: "ul"
        });


    $("#display div.body")
        .append(template)
        .find(".homeAdmin")
        .append(adminWorkflowsView.$el);

});
