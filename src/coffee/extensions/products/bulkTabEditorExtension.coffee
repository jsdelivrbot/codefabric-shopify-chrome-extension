namespace 'CodeFabric.Chrome.Products', (ns) ->

  Extension = using 'CodeFabric.Chrome.Extension'

  class BulkTabEditorExtension extends Extension
    $ = Logger = NewTabPopup = BulkActionMenuSection = BulkActionMenuItem = null
    CreateProductMetafield = GetProducts = API = null

    @existsElement = 'bulk-tabs-editor'

    constructor: () ->
      super()
      $ = using 'jQuery'
      Logger = using 'CodeFabric.Utils.Logger'
      NewTabPopup = using 'CodeFabric.Shopify.Controls.NewTabPopup'
      BulkActionMenuSection = using 'CodeFabric.Shopify.Controls.BulkActionMenuSection'
      BulkActionMenuItem = using 'CodeFabric.Shopify.Controls.BulkActionMenuItem'
      CreateProductMetafield = using 'CodeFabric.Shopify.Operations.CreateProductMetafield'
      GetProducts = using 'CodeFabric.Shopify.Operations.GetProducts'
      API = using 'CodeFabric.Shopify.Api'


    onAddTab: (e) =>
      newTabPopup = new NewTabPopup null, (tabEditor) =>
        @addTabToSelectedProducts tabEditor.name, tabEditor.value

      newTabPopup.show()

    onRemoveTab: (e) =>

    onReorderTabs: (e) =>

    addTabToSelectedProducts: (tabName, tabValue) =>
      @getSelectedProducts()
        .then (prods) =>
          Logger.showMessage "Adding tab #{tabName} to #{prods.length} products!"
          promises = []
          for prodId in prods
            promise = $.Deferred()
            operation = new CreateProductMetafield prodId, 'tab', tabName, tabValue || ' '
            operation.onDone = (res) =>
              promise.resolve res

            promises.push promise
            API.execute operation

          $.when promises
           .then (results) =>
              Logger.showMessage "Added tab #{tabName} to #{prods.length} products!"

    getSelectedProducts: () =>
      result = $.Deferred()
      products = []
      allSelected = $ '.bulk-select-all .bulk-action-all-selector'
                      .find 'span'
                      .hasClass 'hide'

      if allSelected
        @loadProducts 1
          .done (prods) => result.resolve prods

      else
        result.resolve ($(e).val() for e in ($ 'tbody input:checked'))
      
      return result

    loadProducts: (page) =>
      result = $.Deferred()
      products = []
      getOperation = new GetProducts page, 250, (prods) =>
        products = products.concat (p.id for p in prods.products)
        if prods.products.length >= 250
          @loadProducts ++page
            .done (moreProds) =>
              products = products.concat (mp.id for mp in moreProds)
              result.resolve products
        else
          result.resolve products

      API.execute getOperation

      return result

    load: =>
      if $(".#{BulkTabEditorExtension.existsElement}").length > 0
        return
        
      promise = super()

      bulkMenu = $ '.bulk-actions ul'
                    .addClass BulkTabEditorExtension.existsElement

      section = new BulkActionMenuSection [
        new BulkActionMenuItem 'Add product tab', @onAddTab
        new BulkActionMenuItem 'Remove product tab', @onRemoveTab
        new BulkActionMenuItem 'Change product tab order', @onReorderTabs
      ]

      section.render bulkMenu
      promise.resolve()

      return promise
