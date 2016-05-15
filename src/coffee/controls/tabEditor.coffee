namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TabEditor extends CodeFabric.Shopify.Controls.Html
    $ = Grid = ChildGrid = Html = Dropdown = TextArea = RadioButton = Button = InputField = null
    Logger = Api = GetSnippets = GetTheme = GetPages = UpdateProductMetafield = CreateProductMetafield = DeleteProductMetafield = null

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
      Button = using 'CodeFabric.Shopify.Controls.Button'
      InputField = using 'CodeFabric.Shopify.Controls.InputField'

      Api = using 'CodeFabric.Shopify.Api'
      GetTheme = using 'CodeFabric.Shopify.Operations.GetTheme'
      GetSnippets = using 'CodeFabric.Shopify.Operations.GetSnippets'
      GetPages = using 'CodeFabric.Shopify.Operations.GetPages'
      UpdateProductMetafield = using 'CodeFabric.Shopify.Operations.UpdateProductMetafield'
      CreateProductMetafield = using 'CodeFabric.Shopify.Operations.CreateProductMetafield'
      DeleteProductMetafield = using 'CodeFabric.Shopify.Operations.DeleteProductMetafield'

      @handle = if @name? then @name.toLowerCase().replace(/ /g, '-') else 'new-tab'
      @isDeleted = false

      super()

    render: (parent) =>

      @element = $ TabEditor.contentWrapper

      headerGrid = new Grid()

      nameInput = null
      if @name? and @name != ''
        headerGrid.addCell new Html("<label for=\"tab-#{@handle}\">#{@name}</label>")
      else
        nameInput = new InputField 'text', 'tab-name', 'tab-name', 'New tab'
        headerGrid.addCell nameInput

      snippetRadio = new RadioButton 'Snippet', 'snippet-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-snippet", "snippet"
      pageRadio = new RadioButton 'Page', 'page-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-page", "page"
      textRadio = new RadioButton 'Text', 'text-radio', "tab-type-#{@handle}", "tab-type-#{@handle}-text", "text"

      radioGroup = new ChildGrid()
      radioGroup.addCell snippetRadio, true
      radioGroup.addCell pageRadio, true
      radioGroup.addCell textRadio, true

      headerGrid.addCell radioGroup, true

      deleteButton = new Button 'btn btn-delete', '', (e) => 
        @isDeleted = true
        parent.parents 'form'
              .trigger 'change'
        @element.remove()

      headerGrid.addCell deleteButton, true

      @snippetSelector = new Dropdown 'snippets', 'snippets', null, null, TabEditor.getSnippets
      @snippetSelector.hide()

      @pageSelector = new Dropdown 'pages', 'pages', 'handle', 'title', TabEditor.getPages
      @pageSelector.hide()

      @textArea = new TextArea 30, 10
      @textArea.hide()

      if @type == 'snippet'
        snippetRadio.check()
        @snippetSelector.show()
        @snippetSelector.value (@value.match TabEditor.snippetRegex)[1]
      else if @type == 'page'
        pageRadio.check()
        @pageSelector.show()
        @pageSelector.value (@value.match TabEditor.pageRegex)[1]
      else
        textRadio.check()
        @textArea.show()
        @textArea.value @value

      headerGrid.render @element

      if nameInput?
        nameInput.element.on 'change', (e) =>
          @name = nameInput.value()
          @handle = if @name? then @name.toLowerCase().replace(/ /g, '-') else 'new-tab'

      @snippetSelector.render @element
      @pageSelector.render @element
      @textArea.render @element

      parent.append @element

      snippetRadio.onChange = (e) =>
        @pageSelector.hide()
        @textArea.hide()

        if snippetRadio.isChecked()
          @snippetSelector.show()
          @type = 'snippet'
          @value = "{#{@snippetSelector.value()}}"

      @snippetSelector.onChange = (e) =>
        if snippetRadio.isChecked()
          @value = "{#{@snippetSelector.value()}}"

      pageRadio.onChange = (e) =>
        @snippetSelector.hide()
        @textArea.hide()

        if pageRadio.isChecked()
          @pageSelector.show()
          @type = 'page'
          @value = "[#{@pageSelector.value()}]"

      @pageSelector.onChange = (e) =>
        if pageRadio.isChecked()
          @value = "[#{@pageSelector.value()}]"

      textRadio.onChange = (e) =>
        @snippetSelector.hide()
        @pageSelector.hide()

        if textRadio.isChecked()
          @textArea.show()
          @type = 'text'
          @value = @textArea.value()

      @textArea.onChange = (e) =>
        if textRadio.isChecked()
          @value = @textArea.value()

      super parent, false

    save: () =>
      promise = $.Deferred()
      if @isDeleted and not @tabId?
        promise.resolve()
      else
        operation = null
        if @isDeleted
          Logger.showMessage "Deleting tab #{@name}"
          operation = new DeleteProductMetafield @productId, @tabId
        else
          Logger.showMessage "Saving tab #{@name}"

          if @tabId
            operation = new UpdateProductMetafield @productId, @tabId, @value || ' '
          else
            operation = new CreateProductMetafield @productId, 'tab', @name, @value || ' '

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
