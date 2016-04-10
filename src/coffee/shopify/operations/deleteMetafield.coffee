define ['shopify/operation'], (Operation) ->

  class DeleteMetafield extends Operation

    constructor: (@id) ->
      super "Deleting metafield #{@id}",
        "metafields/#{@id}", 
        null,
        'DELETE'
