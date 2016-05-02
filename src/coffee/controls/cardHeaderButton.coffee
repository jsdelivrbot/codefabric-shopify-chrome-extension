namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Button extends CodeFabric.Shopify.Controls.Html
    $ = null

    @buttonHtml = "<a></a>"

    constructor: (@cssClass, @text, @callback) ->
      $ = using 'jQuery'

      super()

    buttonCallback: (e) =>
      if @callback
        @callback e

    render: (parent) ->
      @element = $ Button.buttonHtml 
      @element.addClass @cssClass
            .text @text
      parent.append @element

      @element.on 'click', @buttonCallback

      super parent, false
