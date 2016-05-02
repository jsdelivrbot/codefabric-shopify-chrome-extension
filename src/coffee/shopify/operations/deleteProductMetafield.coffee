namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class DeleteProductMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@productId, @id) ->
      super "Deleting metafield #{@id}",
        "products/#{@productId}/metafields/#{@id}", 
        null,
        'DELETE'
