var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var UpdateMetafield;
  return UpdateMetafield = (function(superClass) {
    extend(UpdateMetafield, superClass);

    function UpdateMetafield(id, value) {
      this.id = id;
      this.value = value;
      UpdateMetafield.__super__.constructor.call(this, "Updating metafield " + this.id + " => " + this.value, "metafields/" + this.id, {
        metafield: {
          id: this.id,
          value: this.value
        }
      }, 'PUT');
    }

    return UpdateMetafield;

  })(Operation);
});

//# sourceMappingURL=updateMetafield.js.map
