namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class Dropdown extends CodeFabric.Shopify.Controls.Html
    $ = null

    @html: '<select></select>'
    @optionHtml: '<option></option>'

    constructor: (@cssClass, @name, @keyField, @valueField, @data, @onChange) ->
      $ = using 'jQuery'

      super()

    render: (parent) =>
      @element = $ Dropdown.html
                    .attr 'name', @name
                    .addClass @cssClass

      if typeof @data is 'function'
        @data().then (result) =>
          @appendOptions @element, result
      else
        @appendOptions @element, @data

      parent.append @element
      @element.on 'change', @onValueChange

      super parent, false

    appendOptions: (dropdown, data) =>
      dropdown.append ($ Dropdown.optionHtml
                          .text if @valueField then value[@valueField] else value
                          .attr 'value', if @keyField then value[@keyField] else value) for value in data

    onValueChange: (e) =>
      if @onChange
        @onChange e