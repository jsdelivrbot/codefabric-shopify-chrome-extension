namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Html
    $ = null

    constructor: (@content) ->
      $ = using 'jQuery'

      @element = if @content then $ @content else null
      @isRendered = false
      @isVisible = true

    renderBefore: (sibling, render = true) =>
      if render
        sibling.before @element

      @isRendered = true

      if not @isVisible
        @hide()

    renderAfter: (sibling, render = true) =>
      if render
        sibling.after @element

      @isRendered = true

      if not @isVisible
        @hide()

    render: (parent, render = true) =>
      if render
        parent.append @element

      @isRendered = true

      if not @isVisible
        @hide()

    show: () =>
      @isVisible = true
      if @isRendered
        @element.show()

    hide: () =>
      @isVisible = false
      if @isRendered
        @element.hide()
