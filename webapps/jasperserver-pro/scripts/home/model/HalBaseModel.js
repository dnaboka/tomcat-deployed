/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

/**
 *  Create facade on top of HAL format
 */

define(function (require) {

    "use strict";

    var BaseModel = require("home/model/BaseModel"),
        mediaTypes = require("home/enum/mediaTypes"),
        _ = require("underscore");

    function filterByMediaType(links, mediaType){
        return _.find(links, function(link) { return link.type == mediaType; });
    }

    return BaseModel.extend({


        initialize: function(){
            BaseModel.prototype.initialize.apply(this, arguments);
        },

         linkToControl: function(link){
            return {
                label : link.title,
                action : link.relation,
                href :  link.href
            };
        },

        embeddedToControl: function(relation, entity){
            return {
                label : entity.title,
                action : relation,
                entity : entity
            };
        },

        /**
         * Transform available relations to controls objects,
         * leave only controls which redirect to another page
         * @returns {Object}
         */

        linksToControls : function(options){
            var linkRelations = this.get("_links"),
                that = this,
                mediaType = mediaTypes.TEXT_HTML;

            if(options && options.type){
                mediaType = options.type;
            }

            return _.chain(linkRelations)
                    .map(function(links, relation){

                        var result, link;

                        if (!_.isArray(links)){
                            links = [links];
                        }

                        link = filterByMediaType(links, mediaType);

                        if (link){
                            result = [relation, that.linkToControl(link)];
                        }

                        return result;
                    })
                    .compact()
                    .object()
                    .value()
        },

        /**
         * Transform available relations to controls objects,
         * leave only controls which redirect to another page
         * @returns {Object}
         */

        embeddedToControls : function(){
            var embeddedRelations = this.get("_embedded"),
                that = this;

            return  _.chain(embeddedRelations)
                    .map(function(entity, relation){

                        var result;

                        if (entity){
                            result = [relation, that.embeddedToControl(relation, entity)];
                        }

                        return result;
                    })
                    .compact()
                    .object()
                    .value()
        },

        getControls : function(options){
            return _.extend(this.linksToControls(options), this.embeddedToControls());
        },

        /**
         * Augment core data with hypermedia controls
         * @returns {*}
         */

        toJSON: function(){

            var data = BaseModel.prototype.toJSON.apply(this, arguments);

            data.controls = this.getControls();

            return data;
        }

    });
});