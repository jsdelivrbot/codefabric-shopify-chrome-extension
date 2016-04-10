define ['shopify'], (shopify) ->

  class Logger

    @showMessage: (message) ->
      shopify.Flash.notice message

    @showError: (message) ->
      shopify.Flash.error message
