namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class UpdateProductMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@productId, @id, @value) ->
      super "Updating product metafield #{@id} => #{@value}",
        "products/#{@productId}/metafields/#{@id}", 
        {
          metafield:
            id: @id,
            value: @value
        },
        'PUT'