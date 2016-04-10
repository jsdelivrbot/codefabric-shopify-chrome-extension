var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var DeleteProductMetafield;
  return DeleteProductMetafield = (function(superClass) {
    extend(DeleteProductMetafield, superClass);

    function DeleteProductMetafield(productId, id) {
      this.productId = productId;
      this.id = id;
      DeleteProductMetafield.__super__.constructor.call(this, "Deleting metafield " + this.id, "products/" + this.productId + "/metafields/" + this.id, null, 'DELETE');
    }

    return DeleteProductMetafield;

  })(Operation);
});

//# sourceMappingURL=deleteProductMetafield.js.map
