define(["require","dashboard/Sandbox","underscore"],function(e){"use strict";var r=e("dashboard/Sandbox"),n=e("underscore");return{get:n.memoize(function(e){return e?new r:null})}});