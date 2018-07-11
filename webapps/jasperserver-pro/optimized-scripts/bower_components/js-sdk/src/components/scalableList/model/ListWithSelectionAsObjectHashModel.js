define(["require","underscore","components/scalableList/model/BaseListWithSelectionModel"],function(e){"use strict";var t=e("underscore"),i=e("components/scalableList/model/BaseListWithSelectionModel"),n=i.extend({_addToSelection:function(e,t){this.selection[e]=!0},_removeFromSelection:function(e,t){delete this.selection[e]},_clearSelection:function(){this.selection={}},_selectionContains:function(e,t){return this.selection[e]},_getSelection:function(){return t.keys(this.selection)},select:function(e,i){if(this._clearSelection(),"string"==typeof e)this._addToSelection(e);else if(t.isArray(e))for(var n=0;n<e.length;n++)this._addToSelection(e[n]);else if("undefined"!=typeof e)for(var o in e)if(e.hasOwnProperty(o)){var s=e[o];void 0!==s&&this._addToSelection(s,o)}this._afterSelect&&this._afterSelect(e,i),this._triggerSelectionChange(i)}});return n});