namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetProductMetafieldsByNamespace extends CodeFabric.Shopify.GetOperation

    constructor: (@productId, @fieldNamespace, @onDone, @onError = null) ->
      super "Getting metafields matching #{@fieldNamespace} for product #{@productId}",
            "products/#{@productId}/metafields.json?namespace=#{@fieldNamespace}",
            @onDone,
            @onError


