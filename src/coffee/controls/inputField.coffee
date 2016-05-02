namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class InputField extends CodeFabric.Shopify.Controls.Html

    constructor: (@type, @name, @id) ->
      super "<input type=\"#{@type}\" name=\"#{@name}\" id=\"#{@id}\" />" 

    value: () =>
      if @isRendered
        return @element.val()
      else
        return null
