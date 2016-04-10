define ['shopify/operation'], (Operation) ->

  class UpdateMetafield extends Operation

    constructor: (@id, @value) ->
      super "Updating metafield #{@id} => #{@value}",
        "metafields/#{@id}", 
        {
          metafield:
            id: @id,
            value: @value
        },
        'PUT'