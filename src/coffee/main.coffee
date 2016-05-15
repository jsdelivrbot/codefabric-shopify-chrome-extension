namespace 'CodeFabric.Shopify.Chrome', (ns) ->

  class Main 
    Logger = null
    ExtensionFactory = null
    $ = null
    Shopify = null

    constructor: ->
      Logger = using 'CodeFabric.Utils.Logger'
      ExtensionFactory = using 'CodeFabric.Chrome.ExtensionFactory'
      $ = using 'jQuery'
      Shopify = using 'Shopify'

      @factory = new ExtensionFactory()

    run: () =>
      Logger.showMessage 'Hoorah!'

      @loadExtensions()
        .then (results) =>
          Logger.showMessage 'All extensions loaded!'
          @attachToWindow()


    loadExtensions: () =>
      extensions = @factory.create window.location.href

      promises = e.load() for e in extensions
      $.when promises
       .promise()
       

    attachToWindow: () =>
      if window? and window.history
        oldPushState = window.history.pushState
        window.history.pushState = (state) ->
          $ window
            .trigger 'pushstate', state

          oldPushState.apply window.history, arguments

        oldReplaceState = window.history.replaceState
        window.history.replaceState = (state) ->
          $ window
            .trigger 'replacestate', state

          oldReplaceState.apply window.history, arguments

      $ window
        .on 'popstate', (e) =>
          window.setTimeout @loadExtensions, 2000
        .on 'pushstate', (e) =>
          window.setTimeout @loadExtensions, 2000
        .on 'replacestate', (e) =>
          window.setTimeout @loadExtensions, 2000

