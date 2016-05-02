namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetTheme extends CodeFabric.Shopify.GetOperation

    constructor: (@onDone, @onError = null) ->
      super "Getting the main theme",
            "themes.json?role=main",
            @onDone,
            @onError


