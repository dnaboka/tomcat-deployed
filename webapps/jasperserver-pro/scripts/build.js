({
  "dir": "build/optimized/",
  "mainConfigFile": "require.config.js",
  "optimizeCss": "none",
  "optimize": "uglify2",
  "skipDirOptimize": false,
  "removeCombined": false,
  "preserveLicenseComments": false,
  "paths": {
    "common": "bower_components/js-sdk/src/common",
    "jquery": "empty:",
    "prototype": "empty:",
    "report.global": "empty:",
    "wcf.scroll": "empty:",
    "ReportRequireJsConfig": "empty:",
    "fusioncharts": "empty:",
    "ireport.highcharts.default.service": "empty"
  },
  "modules": [
    {
      "name": "commons.main"
    },
    {
      "name": "addResource/dataType/addDataTypeMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/fileResource/addFileResourceMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/inputControls/addInputControlMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/inputControls/addInputControlQueryInformationMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/inputControls/dataTypeLocateMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/inputControls/listOfValuesLocateMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/jasperReport/addJasperReportMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/jasperReport/addJasperReportLocateControlMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/jasperReport/addJasperReportResourceNamingMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/jasperReport/addJasperReportResourcesAndControlsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/listOfValues/addListOfValuesMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/mondrianXml/addMondrianXmlMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/analysisView/addOLAPViewMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/query/addQueryMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/query/addQueryWithResourceLocatorMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/analysisClientConnection/addAnalysisClientConnectionMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/administerCustomAttributesMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/administerExportMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/administerImportMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/administerLoggingMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/administerAnalysisOptionsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administer/resetSettings/resetSettingsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "manage/manageRolesMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "manage/manageUsersMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dataSource/dataSourceMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/analysisClientConnection/locateDataSourceMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/analysisClientConnection/locateMondrianConnectionSourceMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/query/locateQueryMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "addResource/analysisClientConnection/locateXmlConnectionSourceMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "login/loginMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "olapView/olapViewMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "reportViewer/reportViewerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "repository/repositoryMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "messages/details/messageDetailsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "messages/list/messageListMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "scheduler/schedulerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "encrypt/encryptMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "system/systemErrorMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "system/errorMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardViewer/dashboardViewerBareMain"
    },
    {
      "name": "adhoc/adhocMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "adhoc/adhocStartMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administerPro/administerAdhocCacheMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "administerPro/administerAdhocOptionsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "managePro/manageOrgsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardDeprecated/dashboardDesignerFrameMain"
    },
    {
      "name": "dashboardDeprecated/dashboardDesignerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardDeprecated/dashboardRuntimeFrameMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardDeprecated/dashboardRuntimeMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardDesigner/dashboardDesignerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardViewer/dashboardViewerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dashboardViewer/dashboardViewerExporterMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerCalculatedFieldsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerDerivedTablesMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerDisplayMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerFiltersMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerJoinsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainDesignerTablesMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "domain/domainSetupMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dataChooser/dataChooserDisplayMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dataChooser/dataChooserFieldsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dataChooser/dataChooserPreFiltersMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "dataChooser/dataChooserSaveAsTopicMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "home/homeMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "home/homeDeprecatedMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "home/homeAdminWorkflowMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "logCollectors/logCollectorsMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "reportOptions/editReportOptionMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "schedulerPro/schedulerMain",
      "exclude": [
        "commons.main"
      ]
    },
    {
      "name": "xdmRemote/xdmRemoteMain"
    },
    {
      "name": "jasper",
      "include": [
        "bower_components/jquery/dist/jquery",
        "loader/jqueryNoConflict",
        "logger",
        "xdm"
      ]
    }
  ],
  "uglify2": {
    "output": {
      "ascii_only": true
    }
  },
  "inlineText": true,
  "excludeText": [],
  "fileExclusionRegExp": /(^\.|prototype.*patched\.js|Owasp\.CsrfGuard\.js)/,
  "shim": {
    "mustache": {
      "init": function () {
                    return Mustache;
                }
    }
  }
})