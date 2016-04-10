var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['shopify/operation'], function(Operation) {
  var CreateMetafield;
  return CreateMetafield = (function(superClass) {
    extend(CreateMetafield, superClass);

    function CreateMetafield(namespace, key, value, type) {
      var ref;
      this.namespace = namespace;
      this.key = key;
      this.value = value;
      this.type = type;
      CreateMetafield.__super__.constructor.call(this, "Adding metafield " + this.namespace + "." + this.key + " = " + this.value, 'metafields', {
        metafield: {
          namespace: this.namespace,
          key: this.key,
          value: this.value,
          type: (ref = this.type) != null ? ref : 'string'
        }
      }, 'POST');
    }

    return CreateMetafield;

  })(Operation);
});

//# sourceMappingURL=createMetafield.js.map
