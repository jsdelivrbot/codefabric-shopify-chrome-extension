namespace 'CodeFabric.Utils', (ns) ->
  class Logger

    @showMessage: (message) ->
      Shopify = using 'Shopify'
      console.log message
      if (Shopify.Flash)
      	Shopify.Flash.notice message

    @showError: (message) ->
      Shopify = using 'Shopify'
      console.error message
      if (Shopify.Flash)
        Shopify.Flash.error message
