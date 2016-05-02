namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetMetafieldsByNamespace extends CodeFabric.Shopify.Operation

    constructor: (@fieldNamespace, @onDone) ->
      super "Getting metafields matching #{@fieldNamespace}",
        "metafields.json?namespace=#{@fieldNamespace}"


