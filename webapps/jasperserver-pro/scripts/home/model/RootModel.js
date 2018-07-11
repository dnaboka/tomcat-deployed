/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        HalBaseModel = require("home/model/HalBaseModel"),
        relations = require("home/connectivity/relations"),
        providerFactory = require("home/connectivity/dataProviderFactory"),
        BaseCollection = require("home/collection/BaseCollection"),
        HalCollection = require("home/collection/HalBaseCollection"),
        WorkflowCollection = require("home/collection/WorkflowCollection"),
        mediaTypes = require("home/enum/mediaTypes");

    return HalBaseModel.extend({

        dataProvider : providerFactory(relations.root),

        relations : {
            "workflows" :  WorkflowCollection,
            "resources" :  HalCollection.extend({modelRel: relations.resource}),
            "contentReferences" :  HalCollection.extend({modelRel: relations.contentReference})
        },

        initialize : function(){

            this._initializeRelations();

            this._refreshRelationsOnChangeEvent();

        },

        getContentReferences: function(){
            return this.contentReferences;
        },

        getResources: function(){
            return this.resources;
        },

        getWorkflows: function(){
            return this.workflows;
        },

        _refreshRelationsOnChangeEvent: function(){
            this.on("change", _.bind(function(){
                var controls = this.getControls({type: mediaTypes.APPLICATION_HAL_JSON});
                _.each(this.relations, _.bind(function(collectionType, relation){
                    var control = controls[relation], dataProvider;
                    if (control){
                        if(control.entity){
                            this[relation].reset(control.entity)
                        }else if(control.href){
                            var childRel= this[relation].modelRel;
                            dataProvider = providerFactory({ id: relation, url: control.href, rel: childRel});
                            this[relation].dataProvider = dataProvider;
                            this[relation].fetch({reset: true});
                        }
                    }
                }, this));
            }, this));
        },

        _initializeRelations: function(){
            _.each(this.relations, _.bind(function(constructor, relation){
                this[relation] = new constructor();
            },this));
        }

    });
});
