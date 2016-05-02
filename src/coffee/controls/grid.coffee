namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Grid extends CodeFabric.Shopify.Controls.Html
    $ = null

    @html: '<div class="next-grid next-grid--inner-grid next-grid--no-padding next-grid--vertically-centered card-outer"></div>'
    @cellHtml: '<div class="next-grid__cell"></div>'
    @cellHtmlNoFlex: '<div class="next-grid__cell next-grid__cell--no-flex"></div>'

    constructor: () ->
      $ = using 'jQuery'

      @cells = []

      super()

    addCell: (cellContent, noFlex, cssClass) =>
      cell = 
        content: cellContent,
        noFlex: noFlex,
        cssClass: cssClass

      @cells.push cell

      if @isRendered
        @renderCell @element, cell

    renderCell: (grid, cell) =>
      element = null
      if cell.noFlex
        element = $ Grid.cellHtmlNoFlex
      else
        element = $ Grid.cellHtml

      if cell.cssClass
        element.addClass cell.cssClass

      cell.content.render element
      grid.append element

    render: (parent) =>
      @element = $ Grid.html

      for cell in @cells
        @renderCell @element, cell

      parent.append @element

      super parent, false
