namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class BulkActionMenuItem extends CodeFabric.Shopify.Controls.Html

    $ = null

    @itemHtml = '<li><a class="next-list__item" href></a></li>'

    constructor: (@name, @action) ->
      $ = using 'jQuery'

      super()

    onActionClick: (e) =>
      if @action?
        @action e

      e.preventDefault()
      return false

    render: (parent) =>
      @element = $ BulkActionMenuItem.itemHtml

      parent.append @element

      @element.find 'a'
              .text @name
              .on 'click', @onActionClick

      super parent, false
