({
  "mainConfigFile": "require.config.js",
  "optimizeCss": "none",
  "optimize": "uglify2",
  "uglify2": {
    "output": {
      "ascii_only": true
    }
  },
  "namespace": "__visualize__",
  "skipDirOptimize": true,
  "removeCombined": true,
  "preserveLicenseComments": false,
  "excludeText": [],
  "paths": {
    "jquery": "empty:",
    "fusioncharts": "empty:",
    "jasper": "loader/jasper"
  },
  "shim": {
    "visualize": {
      "deps": [
        "jasper",
        "BiComponentFactory",
        "auth/Authentication",
        "jive.component.deps",
        "config/dateAndTimeSettings"
      ],
      "exports": "visualize"
    },
    "mustache": {
      "init": function () {
                return Mustache;
            }
    },
    "backbone.original": {
      "deps": [
        "underscore",
        "bower_components/jquery/dist/jquery"
      ],
      "exports": "Backbone",
      "init": function () {
                var Backbone = this.Backbone;
                Backbone.noConflict();
                return Backbone;
            }
    }
  },
  "name": "visualize",
  "include": [
    "bower_components/requirejs/require",
    "vizShim"
  ],
  "wrap": {
    "startFile": "client/visualize.js.start.frag",
    "endFile": "client/visualize.js.end.frag"
  },
  "out": "build/optimized/client/visualize.js",
  "fileExclusionRegExp": /(^\.|prototype.*patched\.js)/
})