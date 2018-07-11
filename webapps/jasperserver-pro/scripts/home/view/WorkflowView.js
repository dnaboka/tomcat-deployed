/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn.Tsaregradskyi
 * @version: ${Id}
 */

define(function(require) {

    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        CreateReport = require("create.report"),
        template = require("text!home/template/workflowTemplate.htm"),
        browser = require("home/util/browser"),
        relations = require("home/connectivity/relations");

    return Backbone.View.extend({

        template: template,

        events: {
            "click .button.left": "clickOnLeftButton",
            "click .button.right": "clickOnRightButton"
        },

        clickOnLeftButton: function(){
             var workflowName = this.model.get("name"),
                leftControl = this.dataToRender().leftControl;

            if (workflowName == "report" && leftControl.action == relations.create){
                CreateReport.selectADV();
            }else{
                browser.open(leftControl.href);
            }

        },

        clickOnRightButton: function(){
            var rightControl = this.dataToRender().rightControl;
            browser.open(rightControl.href);
        },

        dataToRender: function(){

            var data = {
                    tutorialControl : null,
                    leftControl: null,
                    rightControl: null
                },
                rawData = this.model.toJSON(),
                controls = this.model.getControls(),
                tutorialControl = controls[relations.contentReference],
                leftControl = controls[relations.create] || controls[relations.workflows]
                            || controls[relations.admin] || controls[relations.folder],
                rightControl = controls[relations.resources];

            if (tutorialControl){
                data.tutorialControl = tutorialControl;
            }

            if (leftControl){
                data.leftControl = leftControl;
            }

            if (rightControl){
                data.rightControl = rightControl;
            }

            return _.extend(data, rawData);

        },

        render: function () {
            var newElement = $(_.template(this.template, this.dataToRender()));
            this.setElement(newElement);
            return this;
        }
    });
});