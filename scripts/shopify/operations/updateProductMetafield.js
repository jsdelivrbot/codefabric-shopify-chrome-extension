var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var UpdateProductMetafield;
  return UpdateProductMetafield = (function(superClass) {
    extend(UpdateProductMetafield, superClass);

    function UpdateProductMetafield(productId, id, value) {
      this.productId = productId;
      this.id = id;
      this.value = value;
      UpdateProductMetafield.__super__.constructor.call(this, "Updating product metafield " + this.id + " => " + this.value, "products/" + this.productId + "/metafields/" + this.id, {
        metafield: {
          id: this.id,
          value: this.value
        }
      }, 'PUT');
    }

    return UpdateProductMetafield;

  })(Operation);
});

//# sourceMappingURL=updateProductMetafield.js.map
