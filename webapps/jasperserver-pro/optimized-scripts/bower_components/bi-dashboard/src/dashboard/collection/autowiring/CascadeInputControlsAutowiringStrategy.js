define(["require","underscore","./BaseAutowiringStrategy","../../enum/dashboardComponentTypes"],function(e){"use strict";function r(e,r,n,o){var u=n.collection.filter(function(e){return e.getOwnerUri&&e.getOwnerUri()==n.getOwnerUri()&&t.contains(e.get("masterDependencies")||[],n.getOwnerParameterName())}),c=r.find(function(e){return e.component.resource&&e.component.resource.id===n.resource.id});t.each(u,function(e){c.consumers.add({consumer:e.id+":"+n.getOwnerParameterName()})})}function n(e,r,n,o){t.each(t.keys(o.slots),function(e){var t=r.find(function(r){return r.get("name")==e&&r.component.get("ownerResourceId")==n.get("ownerResourceId")});t&&t.consumers.add({consumer:n.id+":"+e})})}var t=e("underscore"),o=e("./BaseAutowiringStrategy"),u=e("../../enum/dashboardComponentTypes");return o.extend({autowire:function(e,t,o){t.resource&&t.resource.resource&&t.resource.resource.type===u.INPUT_CONTROL&&(r(this,e,t,o),n(this,e,t,o))}})});