define(function(require){

    var _ = require('underscore'),
        Backbone = require('backbone'),
        i18n = require("bundle!DomainTopicBundle"),
        BackboneValidation = require('backbone.validation');

    var SaveAsTopicModel = Backbone.Model.extend({
        defaults: {
            stagingQueryTimeOut: 0,
            name: "",
            location: "/",
            description: "",
            stagingEnabled: false
        },

        validationPattern: function(params){
            return {
                name: [
                    {
                        fn: function(value, attr, computedState){
                            if(computedState["stagingEnabled"] && !value){
                                return true;
                            }

                        },
                        msg: i18n["error.name.is.required"]
                    },
                    {
                        maxLength: params.maxNameLength || 100,
                        msg: i18n['error.name.is.too.long'].replace("{0}", params.maxNameLength || 100)
                    }
                ],
                description:[
                    {
                        maxLength: params.maxDescLength || 300,
                        msg: i18n['error.description.is.too.long'].replace("{0}", params.maxDescLength || 300)
                    }
                ],
                stagingQueryTimeOut:[
                    {
                        fn: function(value, attr, computedState){
                            if(!/^[-+]?\d+$/.test(value)){
                                return true;
                            }
                        },
                        msg: i18n["error.staging.query.time.out.only.integers.above.zero"]
                    },
                    {
                        min: params.minStagingQueryTimeOut || 10,
                        msg: i18n['error.min.staging.query.time.out.units'].replace("{0}", params.i18n.minStagingQueryTimeOut || 10 + " " + i18n["min.staging.query.time.out.units"])
                    },
                    {
                        max: params.maxStagingQueryTimeOut || 10080,
                        msg: i18n['error.max.staging.query.time.out.units'].replace("{0}", params.i18n.maxStagingQueryTimeOut || 7 +  " " + i18n["max.staging.query.time.out.units"])
                    }
                ]
            }
        },

        initialize: function(attrs, options){
            this.setValidationRules((options && options.customValidationValues) || {i18n:{}});
        },

        setValidationRules: function(customValidationValues){
            this.validation = this.validationPattern(customValidationValues);
        },

        validateAttr: function(attrName, attrValue, options){
            var error = BackboneValidation.mixin.preValidate.call(this, attrName, attrValue);

            var attrObj = {};

            attrObj[attrName] = attrValue;

            if(!error) {
                this.trigger('attr:valid', this, attrObj, error, options);
            }else{
                this.trigger('attr:invalid', this, attrObj, error, options);
            }

            return !error;
        }
    });

    _.extend(SaveAsTopicModel.prototype, BackboneValidation.mixin);

    return SaveAsTopicModel;


});