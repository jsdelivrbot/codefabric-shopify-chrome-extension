namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TabEditor extends CodeFabric.Shopify.Controls.Html
    $ = Grid = ChildGrid = Html = Dropdown = TextArea = RadioButton = null
    Logger = Api = GetSnippets = GetTheme = GetPages = UpdateProductMetafield = CreateProductMetafied = null

    @snippetPromise = null
    @snippets = null
    @pagesPromise = null
    @pages = null

    @snippetRegex: /^\{([^\{\}]+)\}$/
    @pageRegex: /^\[([^\[\]]+)\]$/

    @contentWrapper = '<div class="next-input-wrapper"></div>'

    constructor: (@productId, @tabId, @name, @type, @value)->
      $ = using 'jQuery'
      Logger = using 'CodeFabric.Utils.Logger'
      Grid = using 'CodeFabric.Shopify.Controls.Grid'
      ChildGrid = using 'CodeFabric.Shopify.Controls.ChildGrid'
      Html = using 'CodeFabric.Shopify.Controls.Html'
      Dropdown = using 'CodeFabric.Shopify.Controls.Dropdown'
      TextArea = using 'CodeFabric.Shopify.Controls.TextArea'
      RadioButton = using 'CodeFabric.Shopify.Controls.RadioButton'

      Api = using 'CodeFabric.Shopify.Api'
      GetTheme = using 'CodeFabric.Shopify.Operations.GetTheme'
      GetSnippets = using 'CodeFabric.Shopify.Operations.GetSnippets'
      GetPages = using 'CodeFabric.Shopify.Operations.GetPages'
      UpdateProductMetafield = using 'CodeFabric.Shopify.Operations.UpdateProductMetafield'
      CreateProductMetafied = using 'CodeFabric.Shopify.Operations.CreateProductMetafield'

      @handle = @name.toLowerCase().replace(/ /g, '-')

      super()

    render: (parent) =>

      @element = $ TabEditor.contentWrapper

      headerGrid = new Grid()

      headerGrid.addCell new Html("<label for=\"tab-#{@handle}\">#{@name}</label>")

      snippetRadio = new RadioButton 'Snippet', 'snippet-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-snippet", "snippet"
      pageRadio = new RadioButton 'Page', 'page-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-page", "page"
      textRadio = new RadioButton 'Text', 'text-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-text", "text"

      radioGroup = new ChildGrid()
      radioGroup.addCell snippetRadio, true
      radioGroup.addCell pageRadio, true
      radioGroup.addCell textRadio, true

      headerGrid.addCell radioGroup, true
      
      headerGrid.render @element

      @snippetSelector = new Dropdown 'snippets', 'snippets', null, null, TabEditor.getSnippets
      @snippetSelector.hide()
      @snippetSelector.render @element

      @pageSelector = new Dropdown 'pages', 'pages', 'handle', 'title', TabEditor.getPages
      @pageSelector.hide()
      @pageSelector.render @element

      @textArea = new TextArea 30, 10
      @textArea.hide()
      @textArea.render @element

      parent.append @element

      if @type == 'snippet'
        snippetRadio.check()
        @snippetSelector.show()
      else if @type == 'page'
        pageRadio.check()
        @pageSelector.show()
      else
        textRadio.check()
        @textArea.show()

      snippetRadio.onChange = (e) =>
        @pageSelector.hide()
        @textArea.hide()

        if snippetRadio.isChecked()
          @snippetSelector.show()
          @type = 'snippet'


      pageRadio.onChange = (e) =>
        @snippetSelector.hide()
        @textArea.hide()

        if pageRadio.isChecked()
          @pageSelector.show()
          @type = 'page'

      textRadio.onChange = (e) =>
        @snippetSelector.hide()
        @pageSelector.hide()

        if textRadio.isChecked()
          @textArea.show()
          @type = 'text'

      super parent, false

    save: () =>
      Logger.showMessage "Saving tab #{name}"
      promise = $.Deferred()

      value = switch @type
        when 'snippet' then "{#{@snippetSelector.value()}}"
        when 'page' then "[#{@pageSelector.value()}]"
        else @textArea.value()

      operation = null
      if @id
        operation = new UpdateProductMetafield @productId, @id, value
      else
        operation = new CreateProductMetafied @productId, 'tab', @name, value

      operation.onDone = (res) ->
        promise.resolve res

      Api.execute operation

      return promise


    @getSnippets: () ->
      if not TabEditor.snippetPromise

        TabEditor.snippetPromise = $.Deferred()
        if TabEditor.snippets?
          TabEditor.snippetPromise.resolve TabEditor.snippets
        else
          Api.execute new GetTheme (result) ->
            Api.execute new GetSnippets result.themes[0].id, (result2) ->
              TabEditor.snippets = (e.key.match(/^snippets\/(.+)\.liquid$/i)[1] for e in result2.assets when /^snippets\/.+\.liquid$/i.test(e.key))
              TabEditor.snippetPromise.resolve TabEditor.snippets

      return TabEditor.snippetPromise

    @getPages: () ->
      if not TabEditor.pagesPromise

        TabEditor.pagesPromise = $.Deferred()

        if TabEditor.pages?
          TabEditor.pagesPromise.resolve TabEditor.pages
        else
          Api.execute new GetPages (result) ->
            TabEditor.pages = result.pages
            TabEditor.pagesPromise.resolve TabEditor.pages

      return TabEditor.pagesPromise

    @getType: (value) ->
      if value

        if value.match TabEditor.snippetRegex
          return 'snippet'
        if value.match TabEditor.pageRegex
          return 'page'

      return 'text'
