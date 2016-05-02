namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class GetSnippets extends CodeFabric.Shopify.GetOperation

    constructor: (@themeId, @onDone, @onError = null) ->
      super "Getting snippets",
            "themes/#{@themeId}/assets.json",
            @onDone,
            @onError


