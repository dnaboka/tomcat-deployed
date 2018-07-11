define(["require","common/component/tree/Tree","jquery","underscore","common/component/tree/TreeDataLayer","common/component/tree/plugin/TooltipPlugin","common/component/tree/plugin/ContextMenuTreePlugin","bi/repository/enum/repositoryResourceTypes","text!../template/repositoryFoldersTreeLevelTemplate.htm","bundle!CommonBundle","settings/generalSettings"],function(e){"use strict";function t(e){var t=2;return e.isWritable&&(t=4|t),e.isRemovable&&(t=16|t),e.isAdministrable&&(t=1),t}var r=e("common/component/tree/Tree"),o=e("jquery"),n=e("underscore"),i=e("common/component/tree/TreeDataLayer"),s=e("common/component/tree/plugin/TooltipPlugin"),l=(e("common/component/tree/plugin/ContextMenuTreePlugin"),e("bi/repository/enum/repositoryResourceTypes")),a=e("text!../template/repositoryFoldersTreeLevelTemplate.htm"),u=e("bundle!CommonBundle"),c=e("settings/generalSettings"),m={folderTreeProcessor:{processItem:function(e){return e._node=!0,e._readonly=!(1==e.value.permissionMask||4&e.value.permissionMask),e}},filterPublicFolderProcessor:{processItem:function(e){return e.value.uri!==p.settings.publicFolderUri&&e.value.uri!==p.settings.tempFolderUri?e:void 0}},i18n:{processItem:function(e){return e.i18n=u,e}},tenantProcessor:{processItem:function(e){return e._node=!0,e.value.label=e.value.tenantName,e.value.uri=e.value.tenantUri,e}}},p=function(e){return r.use(s,{i18n:u,contentTemplate:e.tooltipContentTemplate}).create().instance({additionalCssClasses:"folders",dataUriTemplate:e.contextPath+"/rest_v2/resources?{{= id != '@fakeRoot' ? 'folderUri=' + id : ''}}&recursive=false&type="+l.FOLDER+"&offset={{= offset }}&limit={{= limit }}",levelDataId:"uri",bufferSize:5e3,itemsTemplate:a,collapsed:!0,lazyLoad:!0,rootless:!0,selection:{allowed:!0,multiple:!1},customDataLayers:{"/":n.extend(new i({dataUriTemplate:e.contextPath+"/flow.html?_flowId=searchFlow&method=getNode&provider=repositoryExplorerTreeFoldersProvider&uri=/&depth=1",processors:n.chain(m).omit("filterPublicFolderProcessor","tenantProcessor").values().value(),getDataArray:function(e){e=JSON.parse(o(e).text());var r=n.find(e.children,function(e){return"/public"===e.uri}),i=[{id:"@fakeRoot",label:e.label,uri:"/",resourceType:"folder",permissionMask:t(e.extra),_links:{content:"@fakeContentLink"}}];return r&&i.push({id:"/public",label:r.label,uri:"/public",resourceType:"folder",permissionMask:t(r.extra),_links:{content:"@fakeContentLink"}}),i}}),{accept:"text/html",dataType:"text"})},processors:[m.i18n,m.folderTreeProcessor,m.filterPublicFolderProcessor],getDataArray:function(e,t,r){return e?e[l.RESOURCE_LOOKUP]:[]}})};return p.settings=c,p});