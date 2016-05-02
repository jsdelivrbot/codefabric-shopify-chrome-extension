namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class RadioButton extends CodeFabric.Shopify.Controls.Html
    $ = null

    @labelHtml = '<label class="next-label next-label--inline"></label>'
    @radioHtml = '<input type="radio"></input>'

    constructor: (@label, @cssClass, @name, @id, @value, @onChange) ->
      $ = using 'jQuery'

      @checked = false
      super()

    isChecked: =>
      if not @isRendered
        return @checked

      return @element.is ':checked'

    check: =>
      @checked = true

      if @isRendered  
        @element.attr
          checked: true

    onRadioChange: (e) =>
      @checked = @isChecked()

      if @onChange
        @onChange e

    render: (parent) =>
      @element = $ RadioButton.radioHtml
                      .attr(
                        id: @id
                        name: @name
                        value: @value)
                      .addClass @cssClass

      parent.append($ RadioButton.labelHtml
                      .attr(
                        for: @id)
                      .text @label)

      parent.append @element

      @element.on 'change', @onRadioChange

      super parent, false
      
      if @checked
        @check()