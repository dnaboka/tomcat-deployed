/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),
        browser = require("home/util/browser"),
        tooltipTemplate = require("text!home/template/resourceTooltipTemplate.htm"),
        JSTooltip = require("components.tooltip"),
        resourceDefaultTemplate = require("text!home/template/recentItemTemplate.htm"),
        i18n = require("bundle!HomeBundle");


    var tooltipId = _.uniqueId("tooltip");
    //draw common tooltip element from provided tooltip template
    $("body").append($(_.template(tooltipTemplate, { uid: tooltipId, i18n : i18n })));


    return Backbone.View.extend({

        template: resourceDefaultTemplate,

        events: {
            "click a": "clickOnResource"
        },

        render: function () {
            this.setElement(_.template(this.template, this.dataToRender()));

            //use brand old tooltip from repository
            new JSTooltip(this.el, {
                text: [this.model.get("label"), this.model.get("description")],
                templateId: tooltipId
            });

            return this;
        },

        dataToRender: function() {
            var data = this.model.toJSON(),
                relations = _.keys(data._links);

            data.isAnyActionAvaliable = relations.length > 0;

            data["typeLabel"] = i18n[this.model.get("resourceType")];

            return  data;
        },

        clickOnResource: function() {

            var resourceData = this.model.toJSON(),
                links = resourceData._links,
                relations = _.keys(links),
                url;

            if (_.contains(relations, "run")){
                url = links["run"].href;
            }else if (_.contains(relations, "edit")){
                url = links["edit"].href;
            }else if (_.contains(relations, "open")){
                url = links["open"].href;
            }

            if(url){
                browser.open(url);
            }

            return false;
        }

    });
});