/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko
 * @version: $Id$
 */

/**
 * @class DefaultFormatMap
 *
 * @readonly
 * @enum {string}
 */
define(function (require) {

    return {
        //date
        ADH_100_MASK_date_0: "medium,hide",
        ADH_100_MASK_date_1: "short,hide",
        ADH_100_MASK_date_2: "long,hide",
        //decimal
        ADH_100_MASK_dec_0: "#,##0.00",
        ADH_100_MASK_dec_1: "0",
        ADH_100_MASK_dec_2: "$#,##0.00;($#,##0.00)",
        ADH_100_MASK_dec_3: "$#,##0;($#,##0)",
        ADH_100_MASK_dec_4: "$#,##0.000#############",
        //integer
        ADH_100_MASK_int_0: "#,##0",
        ADH_100_MASK_int_1: "0",
        ADH_100_MASK_int_2: "$#,##0;($#,##0)",
        ADH_100_MASK_int_3: "#,##0;(#,##0)",
        //time
        ADH_100_MASK_time_0: "hide,medium",
        ADH_100_MASK_time_1: "hide,short",
        ADH_100_MASK_time_2: "hide,long",
        ADH_100_MASK_time_3: "HH:mm:ss",
        //timestamp
        ADH_100_MASK_timestamp_0: "medium,hide",
        ADH_100_MASK_timestamp_1: "short,hide",
        ADH_100_MASK_timestamp_2: "long,hide",
        ADH_100_MASK_timestamp_3: "medium,medium",
        ADH_100_MASK_timestamp_4: "hide,medium"
    };
});
