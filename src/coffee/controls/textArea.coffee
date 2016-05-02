namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class TextArea extends CodeFabric.Shopify.Controls.Html
    $ = null

    @html = '<textarea class="next-input"></textarea>'

    constructor: (@columns, @rows, @content) ->
      $ = using 'jQuery'
      @val = null
      super()

    render: (parent) =>
      @element = $ TextArea.html
                    .attr
                      rows: @rows
                      size: @columns
                    .val @content

      parent.append @element

      if @val
        @element.val @val

      super parent, false

    value: (value) =>
      if value
        @val = value

        if @isRendered
          @element.val @val

      if @isRendered
        @val = @element.val()
      
      return @val
