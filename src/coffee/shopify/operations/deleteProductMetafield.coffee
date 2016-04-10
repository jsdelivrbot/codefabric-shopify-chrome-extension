define ['shopify/operation'], (Operation) ->

  class DeleteProductMetafield extends Operation

    constructor: (@productId, @id) ->
      super "Deleting metafield #{@id}",
        "products/#{@productId}/metafields/#{@id}", 
        null,
        'DELETE'
