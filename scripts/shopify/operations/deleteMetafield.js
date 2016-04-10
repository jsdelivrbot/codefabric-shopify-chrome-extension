var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var DeleteMetafield;
  return DeleteMetafield = (function(superClass) {
    extend(DeleteMetafield, superClass);

    function DeleteMetafield(id) {
      this.id = id;
      DeleteMetafield.__super__.constructor.call(this, "Deleting metafield " + this.id, "metafields/" + this.id, null, 'DELETE');
    }

    return DeleteMetafield;

  })(Operation);
});

//# sourceMappingURL=deleteMetafield.js.map
