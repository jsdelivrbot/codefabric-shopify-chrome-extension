namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Button extends CodeFabric.Shopify.Controls.Html
    $ = null

    @buttonHtml = "<a></a>"

    constructor: (@cssClass, @text, @callback) ->
      $ = using 'jQuery'
      @isEnabled = true
      super()

    buttonCallback: (e) =>
      if @callback
        @callback e

    render: (parent) =>
      @element = $ Button.buttonHtml 
      @element.addClass @cssClass
            .text @text
            .attr
              disabled: !@isEnabled
      parent.append @element

      @attachEventHandler @element

      super parent, false

    attachEventHandler: (element) =>
      element.on 'click', @buttonCallback

    enable: () =>
      @isEnabled = true
      if @isRendered
        @element.attr
          disabled: false

    disable: () =>
      @isEnabled = false
      if @isRendered
        @elemenet.attr
          disabled: true

