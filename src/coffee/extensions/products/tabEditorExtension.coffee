namespace 'CodeFabric.Chrome.Products', (ns) ->

  Extension = using 'CodeFabric.Chrome.Extension'

  class TabEditorExtension extends Extension
    $ = Logger = TabsCard = InputField = null

    @existsElement = 'tabs-editor'

    constructor: (@productId) ->
      super()
      $ = using 'jQuery'
      Logger = using 'CodeFabric.Utils.Logger'
      InputField = using 'CodeFabric.Shopify.Controls.InputField'
      TabsCard = using 'CodeFabric.Shopify.Controls.TabsCard'


    load: =>
      if $("form#edit_product_#{@productId} ##{TabEditorExtension.existsElement}").length > 0
        return
        
      promise = super()

      form = $ "form#edit_product_#{@productId}"

      checkField = new InputField 'hidden', TabEditorExtension.existsElement, TabEditorExtension.existsElement
      checkField.render form

      tabsCard = new TabsCard(@productId)
      renderResult = tabsCard.render form

      form.on 'submit', (e) =>
        tabsCard.save()
                .then (res) =>
                  Logger.showMessage "Saved the things"

      form.on 'change', (e) =>
        if $("form#edit_product_#{@productId} ##{TabEditorExtension.existsElement}").length <= 0
          window.setTimeout @load, 500

      if renderResult and typeof renderResult.then == 'function'
        renderResult.then (result) =>
          Logger.showMessage "Loaded the tab editor for product id #{@productId}"
          promise.resolve()
      else
        Logger.showMessage "Loaded the tab editor for product id #{@productId}"
        promise.resolve()

      return promise
