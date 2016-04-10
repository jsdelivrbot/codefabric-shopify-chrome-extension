define ['jquery', 'shopify', 'utils/logger'], (jquery, shopify, logger) ->

  class Api
    @isProcessing = false
    @queue = []

    constructor: ->

    execute: (operation) ->
      Api.queue.push operation

      if not Api.isProcessing
        @processQueue()

      return

    processQueue = () ->
      if Api.queue.length > 0
        shopify.Loading.start()
        Api.isProcessing = true

        operation = Api.queue.pop()
        logger.showMessage "Doing the thing: #{operation.name}"

        promise = jquery.ajax operation.toAjax()
        promise.done (r) ->
        promise.fail (e) ->
          logger.showError e.responseText

        promise.always () =>
          @processQueue()

      else
        logger.showMessage('Done all the things!')
        shopify.Loading.stop()
        Api.isProcessing = false

      return



