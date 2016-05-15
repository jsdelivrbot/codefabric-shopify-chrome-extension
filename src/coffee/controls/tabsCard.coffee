namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TabsCard extends CodeFabric.Shopify.Controls.Html
    $ = Card = Button = InputField = TabEditor = Popup = NewTabPopup = ReorderTabsPopup = Html = null
    GetProductMetafieldsByNamespace = UpdateProductMetafield = CreateProductMetafield = API = null

    constructor: (@productId) ->
      $ = using 'jQuery'
      Card = using 'CodeFabric.Shopify.Controls.Card'
      Button = using 'CodeFabric.Shopify.Controls.Button'
      InputField = using 'CodeFabric.Shopify.Controls.InputField'
      TabEditor = using 'CodeFabric.Shopify.Controls.TabEditor'
      Popup = using 'CodeFabric.Shopify.Controls.Popup'
      NewTabPopup = using 'CodeFabric.Shopify.Controls.NewTabPopup'
      ReorderTabsPopup = using 'CodeFabric.Shopify.Controls.ReorderTabsPopup'
      Html = using 'CodeFabric.Shopify.Controls.Html'

      GetProductMetafieldsByNamespace = using 'CodeFabric.Shopify.Operations.GetProductMetafieldsByNamespace'
      UpdateProductMetafield = using 'CodeFabric.Shopify.Operations.UpdateProductMetafield'
      CreateProductMetafield = using 'CodeFabric.Shopify.Operations.CreateProductMetafield'
      API = using 'CodeFabric.Shopify.Api'

      @tabs = []

      super()

    render: (parent) =>

      @tabsCard = new Card 'tabs-editor', 
                           'Tabs',
                           [
                             (new Button 'add-tab',
                                         'Add a new tab',
                                         @onAddTabClick),
                             (new Button 'tab-order',
                                         'Change tab order',
                                         @onReorderTabsClick)
                           ]

      cardsCell = parent.find 'div.section .next-card.images'
      promise = $.Deferred()

      getOperation = new GetProductMetafieldsByNamespace @productId, 'tab', (r) => 
        tabOrder = ot for ot in r.metafields when ot.key == '_order'
        if tabOrder?
          @tabOrderFieldId = tabOrder.id
          tabOrder = if tabOrder.value? then tabOrder.value.split(',') else []
        else
          tabOrder = []

        orderedTabs = []
        for tabKey in tabOrder
          tab = null
          tab = t for t in r.metafields when t.key == tabKey.trim()
          if tab?
            orderedTabs.push tab
            @addTab tab.id, tab.key, TabEditor.getType(tab.value), tab.value

        for otherTab in r.metafields when otherTab.key != '_order' and otherTab not in orderedTabs
          orderedTabs.push otherTab
          @addTab otherTab.id, otherTab.key, TabEditor.getType(otherTab.value), otherTab.value
        
        (@tabsCard.addContent te) for te in @tabs
        
        @tabsCard.renderBefore cardsCell
        @element = @tabsCard.element
        promise.resolve()

      API.execute getOperation

      super parent, false
      return promise

    addTab: (id, name, type, value) =>
      tabEditor = new TabEditor @productId, id, name, type, value
      @tabs.push tabEditor
      return tabEditor

    onAddTabClick: (e) =>
      addTabPopup = new NewTabPopup @productId, (newTabEditor) =>
        @tabs.push newTabEditor
        @tabsCard.addContent newTabEditor
        @element.parents 'form'
                .trigger 'change'
      addTabPopup.show()

    onReorderTabsClick: (e) =>
      reorderTabPopup = new ReorderTabsPopup (te.name for te in @tabs when not te.isDeleted), (newOrder) =>
        @reorderTabs newOrder
        @element.parents 'form'
                .trigger 'change'
      reorderTabPopup.show()

    reorderTabs: (newOrder) =>
      te.element.remove() for te in @tabs

      newOrderedTabs = []
      for tabKey in newOrder
        editor = e for e in @tabs when e.name == tabKey and not e.isDeleted
        @tabsCard.addContent editor
        newOrderedTabs.push editor

      @tabs = newOrderedTabs.concat (de for de in @tabs when de.isDeleted)

    save: =>
      promise = $.Deferred()
      $.when(tab.save() for tab in @tabs)
       .then (res) =>
          tabOrder = (t.name for t in @tabs when not t.isDeleted)
          tabOrderOperation = null
          if not @tabOrderFieldId?
            tabOrderOperation = new CreateProductMetafield @productId, 'tab', '_order', tabOrder.join ','
          else
            tabOrderOperation = new UpdateProductMetafield @productId, @tabOrderFieldId, tabOrder.join ','

          tabOrderOperation.onDone = (r) =>
            promise.resolve res

          API.execute tabOrderOperation

      return promise
