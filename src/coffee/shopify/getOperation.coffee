namespace 'CodeFabric.Shopify', (ns) ->

  class GetOperation extends CodeFabric.Shopify.Operation
    constructor: (@name, @url, @onDone, @onError = null) ->
      super @name, @url, null, 'GET', @onDone, @onError