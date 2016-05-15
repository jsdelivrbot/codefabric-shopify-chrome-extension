namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class BulkActionMenuSection extends CodeFabric.Shopify.Controls.Html

    $ = null

    @sectionHtml = '<div class="next-popover__pane cfb_ext"></div>'

    constructor: (@items) ->
      $ = using 'jQuery'

      super()

    render: (parent) =>
      root = parent.find '.dropdown ul'
      if root.length < 1
        @element = $ BulkActionMenuSection.sectionHtml
        parent.find '.next-popover ul.next-list'
              .append @element
      else
        @element = root

      (item.render @element) for item in @items

      super parent, false
