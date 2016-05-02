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

      if not @isVisible
        @hide()

      @isRendered = true

    renderAfter: (sibling, render = true) =>
      if render
        sibling.after @element

      if not @isVisible
        @hide()

      @isRendered = true

    render: (parent, render = true) =>
      if render
        parent.append @element

      if not @isVisible
        @hide()

      @isRendered = true

    show: () =>
      @isVisible = true
      if @isRendered
        @element.show()

    hide: () =>
      @isVisible = false
      if @isRendered
        @element.hide()
