namespace 'CodeFabric.Shopify.Controls', (ns) ->

  class InputField

    constructor: (@type, @name) ->

    render: (parent) ->
      parent.append "<input type=\"#{@type}\" name=\"#{@name}\" />" 
