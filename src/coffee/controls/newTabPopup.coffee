namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class NewTabPopup extends CodeFabric.Shopify.Controls.Popup

    $ = null
    TabEditor = Button = null

    @wrapperHtml = '<div class="next-input-wrapper"></div>'
    @labelHtml = '<label class="next-label next-label--inline"></label>'

    constructor: (@productId, @onCreate) ->
      $ = using 'jQuery'
      TabEditor = using 'CodeFabric.Shopify.Controls.TabEditor'
      Button = using 'CodeFabric.Shopify.Controls.Button'

      @okButton = new Button 'btn btn-primary btn-close-modal', 'OK', @onConfirmClick
      super 'Add a new tab', @buildContent, 
        [ 
          @okButton,
          new Button 'btn btn-close-modal', 'Cancel'
        ]

    buildContent: () =>
      content = $ NewTabPopup.wrapperHtml

      @editor = new TabEditor @productId, null, null, 'text', ' '
      @editor.render content

      return content

    onConfirmClick: () =>
      if @onCreate?
        @onCreate @editor
        return true

      return false


