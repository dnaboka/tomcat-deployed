/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
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
 * Simple adapter for dashboard to provide corresponding ap
 *
 * @author Zahar Tomchenko
 * @version: $Id: $
 */

define(function (require) {

    var _ = require("underscore"),
        $ = require("jquery");

    return function(model){
        this.controls = [];

        this.validate = function(){
            var res = new $.Deferred(),
                defs =  this.controls.map(function(control) {
                var id = control.model.getOwnerParameterName(),
                    values =  model.get("source").parameters.parameterValues,
                    params = {};

                params[id] = values[id];

                return control.inputControlCollection.updateState({params: params});
            });

            if (defs.length){
                if (defs.length === 1){
                    defs[0].done(function(val){
                        res.resolve(!val.inputControlState[0].error);
                    }).fail(function(){
                        res.fail();
                    })
                } else {
                    $.when.apply($, defs).done(function(){
                        res.resolve(_.reduce(arguments, function(memo, result){
                            return memo && !result[0].inputControlState[0].error;
                        }), true);
                    }).fail(function(){
                        res.reject();
                    });
                }
            } else {
                res.resolve(true);
            }

            return res;
        }
    }

});