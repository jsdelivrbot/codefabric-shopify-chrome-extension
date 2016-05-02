namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class UpdateProductMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@productId, @id, @value, @type = 'string') ->
      super "Updating product metafield #{@id} => #{@value}",
        "products/#{@productId}/metafields/#{@id}.json", 
        {
          metafield:
            id: @id,
            value: @value,
            value_type: @type
        },
        'PUT'