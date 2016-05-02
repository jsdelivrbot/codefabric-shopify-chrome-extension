namespace 'CodeFabric.Shopify.Chrome', (ns) ->

  class Main 
    Logger = null
    ExtensionFactory = null
    $ = null

    constructor: ->
      Logger = using 'CodeFabric.Utils.Logger'
      ExtensionFactory = using 'CodeFabric.Chrome.ExtensionFactory'
      $ = using 'jQuery'

    run: () ->
      Logger.showMessage 'Hoorah!'
      factory = new ExtensionFactory()
      extensions = factory.create window.location.href

      promises = e.load() for e in extensions
      $.when promises
       .then (results) ->
          Logger.showMessage 'All extensions loaded!'