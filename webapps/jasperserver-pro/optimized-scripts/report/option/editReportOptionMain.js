define(["require","!domReady","underscore","jrs.configs","report/option/controls.editoptions","report.view","controls.base"],function(o){"use strict";var r=o("!domReady"),t=o("underscore"),e=o("jrs.configs"),n=o("report/option/controls.editoptions"),s=o("report.view"),i=o("controls.base");r(function(){s.reportUnitURI=e.Report.reportUnitURI,t.extend(i,e.inputControlsConstants);new n("#reportOptionsForm",e.Report.reportOptionsURI)})});