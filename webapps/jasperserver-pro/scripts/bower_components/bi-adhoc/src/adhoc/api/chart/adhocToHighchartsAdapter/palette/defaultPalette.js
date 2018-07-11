/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        // Browser globals.
        globalScope.hcDefaultPalette = factory();
    }
}(function () {
    "use strict";

    return {

        colors: [
            '#0d233a',
            '#2f7ed8',
            '#910000',
            '#8bbc21',
            '#492970',
            '#ff7f27',
            '#ffc90e',
            '#1aadce',
            '#c42525',
            '#158349',
            '#77a1e5',
            '#c40062',
            '#dbaa00',
            '#4572a7',
            '#aa4643',
            '#89a54e',
            '#80699b',
            '#74462e',
            '#c03c03',
            '#b58c00'
        ],

        rgbColors: [
            [13,35,58],
            [47,126,216],
            [145,0,0],
            [139,188,33],
            [73,41,112],
            [255,127,39],
            [255,201,14],
            [26,173,206],
            [196,37,37],
            [21,131,73],
            [119,161,229],
            [196,0,98],
            [219,170,0],
            [69, 114, 167],
            [170, 70, 67],
            [137, 165, 78],
            [128, 105, 155],
            [61, 150, 174],
            [219, 132, 61],
            [146, 168, 205],
            [164, 125, 124],
            [181, 202, 146]
        ],

        colorAxis: {
            stops: [
                [0.1, '#F6365F'],
                [0.5, '#FFD961'],
                [0.9, '#50C463']
            ]
        }

    };
}, this));