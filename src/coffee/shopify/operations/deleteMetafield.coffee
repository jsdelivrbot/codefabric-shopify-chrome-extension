namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class DeleteMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@id) ->
      super "Deleting metafield #{@id}",
        "metafields/#{@id}.json", 
        null,
        'DELETE'
