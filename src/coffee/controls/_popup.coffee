namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Popup extends CodeFabric.Shopify.Controls.Html

    $ = null
    Shopify = null

    @modalWrapper = '<script type="text/html" class="modal_source"></script>'
    @modalHeader = '<header><h2></h2><a href="#" class="close-modal">x</a></header>'
    @modalBodyWrapper = '<div class="body clearfix"></div>'
    @modalButtonsWrapper = '<div class="buttons"></div>'

    constructor: (@header, @popupContentFunc, @buttons) ->
      $ = using 'jQuery'
      Shopify = using 'Shopify'

      super()

    render: (parent) =>
      super parent, false

    show: () =>
      element = $ Popup.modalWrapper

      modal = new Shopify.Modal element.get 0
      modal.show()

      element = $ '#modal_container'

      header = $ Popup.modalHeader      
      header.find 'h2'
            .text @header

      element.append header

      body = $ Popup.modalBodyWrapper

      content = @popupContentFunc()
      if content.render?
        content.render body
      else
        body.append content

      element.append body

      buttonsWrapper = $ Popup.modalButtonsWrapper
      for button in @buttons by -1
        if button.cssClass.indexOf 'btn-close-modal' > -1
          button.oldCallback = button.callback
          button.callback = (e) ->
            if not @oldCallback? or @oldCallback e
              modal.hide()

        button.render buttonsWrapper
      
      element.append buttonsWrapper




