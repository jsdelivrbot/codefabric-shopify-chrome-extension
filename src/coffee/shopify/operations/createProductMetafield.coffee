namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class CreateProductMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@productId, @fieldNamespace, @key, @value, @type) ->
      super "Adding product metafield #{@fieldNamespace}.#{@key} = #{@value}",
        "products/#{@productId}/metafields.json", 
        {
          metafield:
            namespace: @fieldNamespace,
            key: @key,
            value: @value,
            type: @type ? 'string'
        },
        'POST'
