namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TabsCard extends CodeFabric.Shopify.Controls.Html
    $ = Card = Button = InputField = TabEditor = GetProductMetafieldsByNamespace = API = null

    constructor: (@productId) ->
      $ = using 'jQuery'
      Card = using 'CodeFabric.Shopify.Controls.Card'
      Button = using 'CodeFabric.Shopify.Controls.Button'
      InputField = using 'CodeFabric.Shopify.Controls.InputField'
      GetProductMetafieldsByNamespace = using 'CodeFabric.Shopify.Operations.GetProductMetafieldsByNamespace'
      API = using 'CodeFabric.Shopify.Api'
      TabEditor = using 'CodeFabric.Shopify.Controls.TabEditor'

      @tabs = []

      super()

    render: (parent) =>
      tabsCard = new Card 'tabs-editor', 
                           'Tabs',
                           [
                             (new Button 'add-tab',
                                         'Add a new tab',
                                         onAddTabClick),
                             (new Button 'tab-order',
                                         'Change tab order',
                                         onReorderTabsClick)
                           ]

      cardsCell = parent.find 'div.section .next-card.images'

      tabsCard.addContent(new InputField 'hidden', 'tabs-deleted')

      promise = $.Deferred()

      getOperation = new GetProductMetafieldsByNamespace @productId, 'tab', (r) -> 
        @tabs = ((new TabEditor @productId, tab.id, tab.key, TabEditor.getType(tab.value), tab.value) for tab in r.metafields when tab.key != '_order')
        (tabsCard.addContent tab) for tab in @tabs
        tabsCard.renderBefore cardsCell
        promise.resolve()

      API.execute getOperation

      super parent, false
      return promise

    onAddTabClick = (e) ->

    onReorderTabsClick = (e) ->

    save: =>
      promise = $.Deferred()
      $.when(tab.save() for tab in @tabs)
       .then (res) ->
          promise.resolve res

      return promise
