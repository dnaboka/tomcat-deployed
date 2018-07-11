/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
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


/*
 * @author inesterenko
 * @version: $Id$
 */

define(function (require, exports, module) {

    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        $ = require("jquery"),
        _ = require("underscore"),
        log = require("logger").register(module),
        SingleSelect = require("components/singleSelect/view/SingleSelect"),
        CacheableDataProvider = require("components/singleSelect/dataprovider/CacheableDataProvider"),
        Mustache = require("mustache"),
        icHelper = require("../../util/inputControlHelpers"),
        singleSelectTemplate = require("text!../../template/singleSelectTemplate.htm");

    return BaseInputControlView.extend({

        template: singleSelectTemplate,

        renderStructure: function() {
            if (!this.singleSelect) {
                this.dataProvider = new CacheableDataProvider();
                this.singleSelect = new SingleSelect({
                    getData: this.dataProvider.getData
                }).setDisabled(this.model.get("readOnly"));
            }

            if (this.template) {
                this.singleSelect.undelegateEvents();
                this.setElement($(Mustache.to_html(this.template, this.model.toJSON())));
                this.singleSelect.renderData();
                this.singleSelect.$el.insertBefore(this.$el.find(".jr-mInput-alert"));
                this.singleSelect.delegateEvents();
                this.updateOptionsSelection();
            }
        },

	    updateOptionsSelection: function() {
            var controlData = this.model.state.options.toJSON();
            this.dataProvider.setData(controlData);

            var that = this;
            this.singleSelect.fetch(function() {
                that.singleSelect.setValue(icHelper.extractSelection(controlData, true), {silent: true});
            });
        },

        bindCustomEventListeners: function() {
            var self = this;
            this.singleSelect.off("selection:change").on("selection:change", function (selection) {
                this.model.changeState(selection);
            }, this);

            this.model.state.options.on("reset", this.updateOptionsSelection, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);
            this.$el.on("click", ".jr-mInput-label", function() {
                self.singleSelect.$input.focus();
            });
        },
        remove: function() {
            this.$el.off('change', 'input');
            this.$el.off('click','a');
            this.$el.off('click','.jr-mInput-label');
            this.singleSelect.remove();
            this.model.state.options.off("reset", this.updateOptionsSelection, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }
    });
});

