namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TextArea extends CodeFabric.Shopify.Controls.Html
    $ = null

    @html = '<textarea class="next-input"></textarea>'

    constructor: (@columns, @rows, @content) ->
      $ = using 'jQuery'

      super()

    render: (parent) =>
      @element = $ TextArea.html
                    .attr
                      rows: @rows
                      size: @columns
                    .val @content

      parent.append @element

      super parent, false
