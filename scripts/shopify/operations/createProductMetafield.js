var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var CreateProductMetafield;
  return CreateProductMetafield = (function(superClass) {
    extend(CreateProductMetafield, superClass);

    function CreateProductMetafield(productId, namespace, key, value, type) {
      var ref;
      this.productId = productId;
      this.namespace = namespace;
      this.key = key;
      this.value = value;
      this.type = type;
      CreateProductMetafield.__super__.constructor.call(this, "Adding product metafield " + this.namespace + "." + this.key + " = " + this.value, "products/" + this.productId + "/metafields", {
        metafield: {
          namespace: this.namespace,
          key: this.key,
          value: this.value,
          type: (ref = this.type) != null ? ref : 'string'
        }
      }, 'POST');
    }

    return CreateProductMetafield;

  })(Operation);
});

//# sourceMappingURL=createProductMetafield.js.map
