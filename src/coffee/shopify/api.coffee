namespace 'CodeFabric.Shopify', (ns) ->

  class Api
    @isProcessing = false
    @queue = []

    @execute: (operation) ->
      Api.queue.push operation

      if not Api.isProcessing
        @processQueue()

      return

    @processQueue = () ->
      Shopify = using 'Shopify'
      Logger = using 'CodeFabric.Utils.Logger'
      $ = using 'jQuery'

      if Api.queue.length > 0
        Shopify.Loading.start()
        Api.isProcessing = true

        operation = Api.queue.pop()
        Logger.showMessage "Doing the thing: #{operation.name}"

        ajaxOptions = operation.toAjax()
        promise = $.ajax ajaxOptions
        promise.done (r) ->
          if operation.onDone != null 
            operation.onDone r
        promise.fail (e) ->
          Logger.showError e.responseText
          if operation.onError != null
            operation.onError e

        promise.always () =>
          Api.processQueue()

      else
        Logger.showMessage('Done all the things!')
        Shopify.Loading.stop()
        Api.isProcessing = false

      return



