namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class InputField extends CodeFabric.Shopify.Controls.Html

    constructor: (@type, @name, @id, @val) ->
      super "<input type=\"#{@type}\" name=\"#{@name}\" id=\"#{@id}\" />" 

    render: (parent) =>
      super parent

      @element.val @val

    value: (newValue) =>
      if typeof(newValue) != 'undefined'
        @val = newValue
        if @isRendered
          @element.val newValue

      if @isRendered
        return @element.val()
      else
        return @val
