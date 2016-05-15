namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetProducts extends CodeFabric.Shopify.GetOperation

    constructor: (@page, @limit, @onDone, @onError = null) ->
      @page = @page || 1
      @limit = @limit || 250
      super "Getting a page of #{@limit} products",
            "products.json?limit=#{@limit}&page=#{@page}",
            @onDone,
            @onError


