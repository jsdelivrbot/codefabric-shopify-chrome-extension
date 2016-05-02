namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Card extends CodeFabric.Shopify.Controls.Html

    $ = Html = Grid = ChildGrid = null

    @cardHtml: '<div class="next-card"></div>'
    @cardHeader: '<header class="next-card__header card-header"></header>'
    @cardHeaderTitle: '<h2 class="next-heading"></h2>'
    @cardContentWrapper: '<div class="next-card__section"></div>'

    constructor: (@cssClass, @headerText, @headerButtons) ->
      $ = using 'jQuery'
      Html = using 'CodeFabric.Shopify.Controls.Html'
      Grid = using 'CodeFabric.Shopify.Controls.Grid'
      ChildGrid = using 'CodeFabric.Shopify.Controls.ChildGrid'


      @cardContent = []

      super()


#       @cardHtml = "<div class=\"next-tab #{@cssClass}\">
#   <header class=\"next-card__header card-header\">"
#       if !@headerButtons or @headerButtons.length == 0
#         @cardHtml += "<h2 class=\"next-heading\">#{@headerText}</h2>"
#       else
#         var grid = header.append(cardOuterGrid).find('.next-grid');
            
#     //         grid.append(jq(cardGridCell).append(jq(cardHeaderTitle).text(headerText)));

#     //         var actionsGrid = grid.append(jq(cardGridCellNoFlex).append(jq(cardInnerGrid).addClass('actions'))).find('.actions');
#     //         for (var actionIdx = 0; actionIdx < actions.length; actionIdx++) {
#     //           var action = actions[actionIdx];
#     //           var actionLink = actionsGrid.append(jq(cardGridCellNoFlex).append('<a class="action-' + action.handle + '" href>' + action.title + '</a>')).find('.action-' + action.handle);
#     //           actionLink.on('click', action.onClick);
#     //         }
#         @cardHtml += ""
      
#       @cardHtml += "</header>
# </div>"


    addContent: (content) ->
      @cardContent.push content

    render: (parent) =>
      renderInternal()
      parent.append @element

      super parent, false

    renderBefore: (sibling) =>
      renderInternal()
      sibling.before @element

      super sibling, false

    renderInternal = () ->

      @element = $ Card.cardHtml
               .addClass @cssClass
      header = $ Card.cardHeader
      @element.append header

      headerTextHtml = new Html($ Card.cardHeaderTitle
                                      .text @headerText)

      if not @headerButtons or @headerButtons.length == 0
        headerTextHtml.render header
      else
        headerGrid = new Grid()
        headerGrid.addCell headerTextHtml

        buttonsGrid = new ChildGrid()
        (buttonsGrid.addCell button, true) for button in @headerButtons
        headerGrid.addCell buttonsGrid, true, 'actions'

        headerGrid.render header

      contentWrapper = $ Card.cardContentWrapper
      (content.render contentWrapper) for content in @cardContent

      @element.append contentWrapper







    # //       if (!actions || actions.length == 0) {
    # //         header.append(jq(cardHeaderTitle).text(headerText));
    # //       }
    # //       else {
    # //         var grid = header.append(cardOuterGrid).find('.next-grid');
            
    # //         grid.append(jq(cardGridCell).append(jq(cardHeaderTitle).text(headerText)));

    # //         var actionsGrid = grid.append(jq(cardGridCellNoFlex).append(jq(cardInnerGrid).addClass('actions'))).find('.actions');
    # //         for (var actionIdx = 0; actionIdx < actions.length; actionIdx++) {
    # //           var action = actions[actionIdx];
    # //           var actionLink = actionsGrid.append(jq(cardGridCellNoFlex).append('<a class="action-' + action.handle + '" href>' + action.title + '</a>')).find('.action-' + action.handle);
    # //           actionLink.on('click', action.onClick);
    # //         }
    # //       }

