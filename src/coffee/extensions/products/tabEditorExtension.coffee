namespace 'CodeFabric.Chrome.Products', (ns) ->

  Extension = using 'CodeFabric.Chrome.Extension'

  class TabEditorExtension extends Extension
    $ = Logger = TabsCard = null

    constructor: (@productId) ->
      super()
      $ = using 'jQuery'
      Logger = using 'CodeFabric.Utils.Logger'
      TabsCard = using 'CodeFabric.Shopify.Controls.TabsCard'


    load: ->
      promise = super()

      form = $ "form#edit_product_#{@productId}"

      tabsCard = new TabsCard(@productId)
      renderResult = tabsCard.render form

      form.on 'submit', (e) ->
        tabsCard.save()
                .then (res) ->
                  Logger.showMessage "Saved the things"

      if renderResult and typeof renderResult.then == 'function'
        renderResult.then (result) ->
          Logger.showMessage "Loaded the tab editor for product id #{@productId}"
          promise.resolve()
      else
        Logger.showMessage "Loaded the tab editor for product id #{@productId}"
        promise.resolve()

      return promise
