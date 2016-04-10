define ['shopify/operation'], (Operation) ->

  class CreateProductMetafield extends Operation

    constructor: (@productId, @namespace, @key, @value, @type) ->
      super "Adding product metafield #{@namespace}.#{@key} = #{@value}",
        "products/#{@productId}/metafields", 
        {
          metafield:
            namespace: @namespace,
            key: @key,
            value: @value,
            type: @type ? 'string'
        },
        'POST'
