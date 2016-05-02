namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetPages extends CodeFabric.Shopify.GetOperation

    constructor: (@onDone, @onError = null) ->
      super "Getting pages",
            "pages.json",
            @onDone,
            @onError


