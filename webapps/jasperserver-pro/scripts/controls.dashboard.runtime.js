/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global _, JRS */

;(function (jQuery, _, Controls) {


    //module:
    //
    //  controls.dashboard.runtime
    //
    //summary:
    //
    //  Override controller and viewmodel to works with dashboard runtime
    //
    //main types:
    //
    // DashboardRuntimeViewModel - customize layout of controls
    // DashboardRuntimeController - allow to work with dashboard runtime state
    //
    //dependencies:
    //
    //
    //  jQuery          - v1.7.1
    //  _,              - underscore.js 1.3.1
    //  Controls        - control.controller
    //  clientKey       - id of dashboard state

    return _.extend(Controls,{

        DashboardRuntimeViewModel:Controls.ViewModel.extend({

            /*
             * Put controls to existing frames
             */

            draw:function () {
                _.each(this.getControls(), function (control) {
                    if (control.visible) {
                        var selectorTemplate = "div[data-inputControlName='{0}']";
                        var frameOverlaySelector = selectorTemplate.replace('{0}', control.id);
                        jQuery(frameOverlaySelector).after(control.getElem());
                    }
                });
            }
        }),

        DashboardRuntimeController:Controls.Controller.extend({

            fetchControlsStructure:function (initialValues) {
                var dashboardControlsIds = _.keys(initialValues),
                    viewModel = this.getViewModel();

                return this.dataTransfer.fetchControlsStructure(dashboardControlsIds, initialValues).done(function(response){
                    viewModel.set(response, true);
                });

            }
        }),

        SingleSelect:Controls.SingleSelect.extend({

            MAIN_CONTROL_CONTAINER_SELECTOR: "div.componentContainer.control.select",

            bindCustomEventListeners:function () {
                this.singleSelect.off("selection:change").on("selection:change", function (selection) {
                    this.set({selection:selection});
                }, this).off("expand").on("expand", function(singleSelect) {
                    var container = singleSelect.$el.parents("div.componentContainer.control.select");
                    this.set({zIndex: container.css("z-index")});
                    container.css("z-index", 1001);
                }, this).off("collapse").on("collapse", function(singleSelect) {
                    var container = singleSelect.$el.parents("div.componentContainer.control.select");
                    container.css("z-index", this.get("zIndex"));
                }, this);
            }
        })

    });

})(
    jQuery,
    _,
    JRS.Controls
);

