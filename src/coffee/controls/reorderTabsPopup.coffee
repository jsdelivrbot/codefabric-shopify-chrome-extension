namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class ReorderTabsPopup extends CodeFabric.Shopify.Controls.Popup

    $ = null
    Button = null

    @tabListHtml = '<div><p class="ssb">Reorder tabs to change how they appear in on your store.</p><ol class="js-product-options reorder-modal__options-list ui-sortable"></ol></div>'
    @tabItemHtml = '<li class="reorder-modal__options-row js-product-option next-grid next-grid--no-outside-padding"><div class="next-grid__cell next-grid__cell--quarter next-grid__cell--vertically-centered"><div class="js-product-option-name js-product-option-name--is-draggable drag"><div class="next-grid next-grid--no-padding"><div class="next-grid__cell next-grid__cell--no-flex"><i class="ico ico-drag-handle reorder-modal__option-drag-handle"></i></div><div class="next-grid__cell"><span class="next-label next-label--no-margin"></span></div></div></div></div></li>';

    constructor: (@tabs, @onReorder) ->
      $ = using 'jQuery'
      Button = using 'CodeFabric.Shopify.Controls.Button'

      @okButton = new Button 'btn btn-primary btn-close-modal', 'OK', @onConfirmClick
      @okButton.disable()

      @tabOrder = (tab for tab in @tabs)
      super 'Reorder tabs', @buildContent, 
        [ 
          @okButton,
          new Button 'btn btn-close-modal', 'Cancel'
        ]

    buildContent: () =>
      content = $ ReorderTabsPopup.tabListHtml
      @tabList = content.find 'ol.ui-sortable'

      for tab in @tabOrder
        item = $ ReorderTabsPopup.tabItemHtml
                  .attr
                    'data-key': tab
        item.find '.next-label'
            .text tab

        @tabList.append item

        @tabList.sortable
          handle: ".js-product-option-name--is-draggable"
          opacity: .8
          axis: "y"

      return content

    onConfirmClick: () =>
      if @onReorder?
        @onReorder ($(t).data 'key' for t in @tabList.find 'li')
        return true

      return false


