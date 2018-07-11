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

define(function (require) {

    "use strict";

    var BaseInputControlView = require("../BaseInputControlView"),
        $ = require("jquery"),
        _ = require("underscore"),
        Sizer = require("components/sizer/Sizer"),
        MultiSelect = require("components/multiSelect/view/MultiSelect"),
        DataProviderWithLabelHash = require("components/multiSelect/dataprovider/DataProviderWithLabelHash"),
        Mustache = require("mustache"),
        icHelper = require("../../util/inputControlHelpers"),
        multiSelectTemplate = require("text!../../template/multiSelectTemplate.htm");

    return BaseInputControlView.extend({

        template: multiSelectTemplate,

        renderStructure: function () {
            var self = this;

            if (!this.multiSelect) {
                this.dataProvider = new DataProviderWithLabelHash();
                this.multiSelect = new MultiSelect({
                    getData: this.dataProvider.getData,
                    selectedListOptions: {
                        formatLabel: function(value) {
                            return self.dataProvider.getDataLabelHash()[value];
                        }
                    },
                    resizable: true
                });
                this.multiSelect.setDisabled(this.model.get("readOnly"));

            }

            if (this.template) {
                this.multiSelect.undelegateEvents();
                this.setElement($(Mustache.to_html(this.template, this.model.toJSON())));
                this.multiSelect.render().renderData();
                this.$el.find(".jr-mInput-label").after(this.multiSelect.el);

                //according to IC specifics, sizer should be before alert message
                this.multiSelect.$el.find(".jr-mSizer")
                    .detach()
                    .insertAfter(this.$el.find(".jr-mInput-alert"));

                this.multiSelect.delegateEvents();

                this.updateOptionsSelection();
            }
        },

        updateOptionsSelection:function () {
            var controlData = this.model.state.options.toJSON();
            this.dataProvider.setData(controlData);

            var that = this;
            this.multiSelect.fetch(function() {
                var selection = icHelper.extractSelection(controlData);

                that.multiSelect.setValue(selection, {silent: true});
                that.multiSelect.resize();
            }, {keepPosition: true});
        },

        bindCustomEventListeners:function () {
            this.multiSelect.off("selection:change").on("selection:change", function (selection) {
                this.model.changeState(selection);
            }, this);

            this.model.state.options.on("reset", this.updateOptionsSelection, this);
            this.model.state.options.on("change:selected", this.updateOptionsSelection, this);
        },

        remove: function() {
            this.multiSelect.remove();
            this.model.state.options.off("reset", this.updateOptionsSelection, this);
            this.model.state.options.off("change:selected", this.updateOptionsSelection, this);
            BaseInputControlView.prototype.remove.call(this);
        }
    });
});

