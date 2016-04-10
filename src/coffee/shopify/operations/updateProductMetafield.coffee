define ['shopify/operation'], (Operation) ->

  class UpdateProductMetafield extends Operation

    constructor: (@productId, @id, @value) ->
      super "Updating product metafield #{@id} => #{@value}",
        "products/#{@productId}/metafields/#{@id}", 
        {
          metafield:
            id: @id,
            value: @value
        },
        'PUT'