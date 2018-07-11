/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function () {
    return [{
        name: "dataGrid",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_DATA_GRID",
        chartTypes: [{
            legacyAdhoc: "column",
            cssClass: "Crosstab",
            bundleName: "adhoc.visualisation.chooser.type.CROSSTAB",
            name: "Crosstab",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "column",
            cssClass: "Table",
            highchartsName: "column",
            bundleName: "adhoc.visualisation.chooser.type.TABLE",
            name: "Table",

            requirements: {
                categorizerDefaultOnly: true,
                measures: {
                    min: 0,
                    inRow: false
                },
                fields: {
                    min: 0
                }
            }
        }]
    }, {
        name: "columnAndBar",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_COLUMN_AND_BAR",
        chartTypes: [{
            legacyAdhoc: "column",
            cssClass: "Column",
            highchartsName: "column",
            bundleName: "adhoc.visualisation.chooser.type.COLUMN",
            name: "Column",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "stacked_column",
            cssClass: "ColumnStacked",
            highchartsName: "column",
            bundleName: "adhoc.visualisation.chooser.type.STACKED_COLUMN",
            name: "StackedColumn",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "percent_column",
            cssClass: "ColumnPercent",
            highchartsName: "column",
            bundleName: "adhoc.visualisation.chooser.type.PERCENT_COLUMN",
            name: "StackedPercentColumn",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "bar",
            cssClass: "Bar",
            highchartsName: "bar",
            bundleName: "adhoc.visualisation.chooser.type.BAR",
            name: "Bar",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "stacked_bar",
            cssClass: "BarStacked",
            highchartsName: "bar",
            bundleName: "adhoc.visualisation.chooser.type.STACKED_BAR",
            name: "StackedBar",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "percent_bar",
            cssClass: "BarPercent",
            highchartsName: "bar",
            bundleName: "adhoc.visualisation.chooser.type.PERCENT_BAR",
            name: "StackedPercentBar",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "spider_column",
            cssClass: "ColumnSpider",
            highchartsName: "column",
            bundleName: "adhoc.visualisation.chooser.type.SPIDER_COLUMN",
            name: "SpiderColumn",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }]
    }, {
        name: "lineAndArea",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_LINE_AND_AREA",
        chartTypes: [{
            legacyAdhoc: "line",
            cssClass: "Line",
            highchartsName: "line",
            bundleName: "adhoc.visualisation.chooser.type.LINE",
            name: "Line",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "spline",
            cssClass: "Spline",
            highchartsName: "spline",
            bundleName: "adhoc.visualisation.chooser.type.SPLINE",
            name: "Spline",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "area",
            cssClass: "Area",
            highchartsName: "area",
            bundleName: "adhoc.visualisation.chooser.type.AREA",
            name: "Area",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "stacked_area",
            cssClass: "AreaStacked",
            highchartsName: "area",
            bundleName: "adhoc.visualisation.chooser.type.STACKED_AREA",
            name: "StackedArea",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "percent_area",
            cssClass: "AreaPercent",
            highchartsName: "area",
            bundleName: "adhoc.visualisation.chooser.type.PERCENT_AREA",
            name: "StackedPercentArea",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "spline_area",
            cssClass: "AreaSpline",
            highchartsName: "areaspline",
            bundleName: "adhoc.visualisation.chooser.type.AREA_SPLINE",
            name: "AreaSpline",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "spider_line",
            cssClass: "LineSpider",
            highchartsName: "line",
            bundleName: "adhoc.visualisation.chooser.type.SPIDER_LINE",
            name: "SpiderLine",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "spider_area",
            cssClass: "AreaSpider",
            highchartsName: "area",
            bundleName: "adhoc.visualisation.chooser.type.SPIDER_AREA",
            name: "SpiderArea",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }]
    }, {
        name: "dualAndMultiAxis",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_DUAL_AND_MULTI_AXIS",
        chartTypes: [{
            legacyAdhoc: "column_line",
            cssClass: "ColumnLine",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.COLUMN_LINE",
            name: "ColumnLine",

            requirements: {
                measures: {
                    min: 2,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "column_spline",
            cssClass: "ColumnSpline",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.COLUMN_SPLINE",
            name: "ColumnSpline",

            requirements: {
                measures: {
                    min: 2,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "stacked_column_line",
            cssClass: "ColumnLineStacked",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.STACKED_COLUMN_LINE",
            name: "StackedColumnLine",

            requirements: {
                measures: {
                    min: 3,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "stacked_column_spline",
            cssClass: "ColumnSplineStacked",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.STACKED_COLUMN_SPLINE",
            name: "StackedColumnSpline",

            requirements: {
                measures: {
                    min: 3,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "multi_axis_line",
            cssClass: "LineMultiAxis",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.MULTI_AXIS_LINE",
            name: "MultiAxisLine",

            requirements: {
                measures: {
                    min: 2,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "multi_axis_spline",
            cssClass: "SplineMultiAxis",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.MULTI_AXIS_SPLINE",
            name: "MultiAxisSpline",

            requirements: {
                measures: {
                    min: 2,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "multi_axis_column",
            cssClass: "ColumnMultiAxis",
            highchartsName: "",
            bundleName: "adhoc.visualisation.chooser.type.MULTI_AXIS_COLUMN",
            name: "MultiAxisColumn",

            requirements: {
                measures: {
                    min: 2,
                    inRow: false
                },
                fields: {
                    min: 0,
                    inColumn: false
                }
            }
        }]
    }, {
        name: "timeSeries",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_TIME_SERIES",
        chartTypes: [{
            legacyAdhoc: "line_time_series",
            cssClass: "Line",
            highchartsName: "line",
            bundleName: "adhoc.visualisation.chooser.type.LINE_TIME_SERIES",
            name: "TimeSeriesLine",
            "isTimeSeries": true,

            requirements: {
                measures: {
                    min: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false,
                    type: "time",
                    categorizer: ["day", "hour", "minute", "second", "millisecond", "hour_by_day", "minute_by_day", "second_by_day", "millisecond_by_day"]
                }
            }
        }, {
            legacyAdhoc: "spline_time_series",
            cssClass: "Spline",
            highchartsName: "spline",
            bundleName: "adhoc.visualisation.chooser.type.SPLINE_TIME_SERIES",
            name: "TimeSeriesSpline",
            "isTimeSeries": true,

            requirements: {
                measures: {
                    min: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false,
                    type: "time",
                    categorizer: ["day", "hour", "minute", "second", "millisecond", "hour_by_day", "minute_by_day", "second_by_day", "millisecond_by_day"]
                }
            }
        }, {
            legacyAdhoc: "area_time_series",
            cssClass: "Area",
            highchartsName: "area",
            bundleName: "adhoc.visualisation.chooser.type.AREA_TIME_SERIES",
            name: "TimeSeriesArea",
            "isTimeSeries": true,

            requirements: {
                measures: {
                    min: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false,
                    type: "time",
                    categorizer: ["day", "hour", "minute", "second", "millisecond", "hour_by_day", "minute_by_day", "second_by_day", "millisecond_by_day"]
                }
            }
        }, {
            legacyAdhoc: "spline_area_time_series",
            cssClass: "AreaSpline",
            highchartsName: "areaspline",
            bundleName: "adhoc.visualisation.chooser.type.SPLINE_AREA_TIME_SERIES",
            name: "TimeSeriesAreaSpline",
            "isTimeSeries": true,

            requirements: {
                measures: {
                    min: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false,
                    type: "time",
                    categorizer: ["day", "hour", "minute", "second", "millisecond", "hour_by_day", "minute_by_day", "second_by_day", "millisecond_by_day"]
                }
            }
        }]
    }, {
        name: "scatterAndBubble",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_SCATTER_AND_BUBBLE",
        chartTypes: [{
            legacyAdhoc: "scatter",
            cssClass: "Scatter",
            highchartsName: "scatter",
            bundleName: "adhoc.visualisation.chooser.type.SCATTER",
            name: "Scatter",

            requirements: {
                measures: {
                    min: 2,
                    max: 2,
                    inRow: false
                },
                fields: {
                    min: 0
                },
                placement: {
                    forbidden: [{
                        column: "[f]+[m]{2}[f]+",
                        row: "[fm]*"
                    }]
                }
            }
        }, {
            legacyAdhoc: "bubble",
            cssClass: "Bubble",
            highchartsName: "bubble",
            bundleName: "adhoc.visualisation.chooser.type.BUBBLE",
            name: "Bubble",

            requirements: {
                measures: {
                    min: 3,
                    max: 3,
                    inRow: false
                },
                fields: {
                    min: 0
                },
                placement: {
                    forbidden: [{
                        column: "[f]+[m]{3}[f]+",
                        row: "[fm]*"
                    }]
                }
            }
        }]
    }, {
        name: "pie",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_PIE",
        chartTypes: [{
            legacyAdhoc: "pie",
            cssClass: "Pie",
            highchartsName: "pie",
            bundleName: "adhoc.visualisation.chooser.type.PIE",
            name: "Pie",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }, {
            legacyAdhoc: "dual_level_pie",
            cssClass: "PieDual",
            highchartsName: "pie",
            bundleName: "adhoc.visualisation.chooser.type.DUAL_LEVEL_PIE",
            name: "DualLevelPie",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 1,
                    inColumn: false
                },
                placement: {
                    allowed: [{
                        column: "m",
                        row: "[f]{1,2}"
                    }, {
                        column: "",
                        row: "f[m]+"
                    }, {
                        column: "",
                        row: "[m]+f"
                    }]
                }
            }
        }, {
            legacyAdhoc: "semi_pie",
            cssClass: "PieSemi",
            highchartsName: "pie",
            bundleName: "adhoc.visualisation.chooser.type.SEMI_PIE",
            name: "SemiPie",

            requirements: {
                measures: {
                    min: 1
                },
                fields: {
                    min: 0
                }
            }
        }]
    }, {
        name: "range",
        bundleName: "adhoc.visualisation.chooser.type.GROUP_RANGE",
        chartTypes: [{
            legacyAdhoc: "heat_map",
            cssClass: "HeatMap",
            highchartsName: "heatmap",
            bundleName: "adhoc.visualisation.chooser.type.HEAT_MAP",
            name: "HeatMap",

            requirements: {
                measures: {
                    min: 1,
                    max: 1,
                    inRow: false
                },
                fields: {
                    min: 2,
                    max: 2
                },
                placement: {
                    allowed: [{
                        column: "fm",
                        row: "f"
                    }]
                }
            }
        }, {
            legacyAdhoc: "heat_map_time_series",
            cssClass: "HeatMapTime",
            highchartsName: "heatmap",
            bundleName: "adhoc.visualisation.chooser.type.TIME_SERIES_HEAT_MAP",
            name: "TimeSeriesHeatMap",
            "isTimeSeries": true,

            requirements: {
                measures: {
                    min: 1,
                    max: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false,
                    type: "time",
                    categorizer: ["hour_by_day"]
                }
            }
        }, {
            legacyAdhoc: "dual_measure_tree_map",
            cssClass: "TreeMapDual",
            highchartsName: "treemap",
            bundleName: "adhoc.visualisation.chooser.type.DUAL_MEASURE_TREE_MAP",
            name: "DualMeasureTreeMap",

            requirements: {
                measures: {
                    min: 2,
                    max: 2,
                    inRow: false
                },
                fields: {
                    min: 1,
                    max: 1,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "tree_map",
            cssClass: "TreeMap",
            highchartsName: "treemap",
            bundleName: "adhoc.visualisation.chooser.type.TREE_MAP",
            name: "TreeMap",

            requirements: {
                measures: {
                    min: 1,
                    max: 1,
                    inRow: false
                },
                fields: {
                    min: 1,
                    inColumn: false
                }
            }
        }, {
            legacyAdhoc: "one_parent_tree_map",
            cssClass: "TreeMapParent",
            highchartsName: "treemap",
            bundleName: "adhoc.visualisation.chooser.type.ONE_PARENT_TREE_MAP",
            name: "OneParentTreeMap",

            requirements: {
                measures: {
                    min: 1,
                    max: 1,
                    inRow: false
                },
                fields: {
                    min: 2,
                    inColumn: false
                }
            }
        }]
    }];
});


