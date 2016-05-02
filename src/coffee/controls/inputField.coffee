namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class InputField extends CodeFabric.Shopify.Controls.Html

    constructor: (@type, @name) ->
      super "<input type=\"#{@type}\" name=\"#{@name}\" />" 

    value: () =>
      if @isRendered
        return @element.val()
      else
        return null
