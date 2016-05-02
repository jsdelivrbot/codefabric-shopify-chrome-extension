namespace 'CodeFabric.Shopify.Operations', (ns) ->

  class UpdateMetafield extends  CodeFabric.Shopify.Operation

    constructor: (@id, @value) ->
      super "Updating metafield #{@id} => #{@value}",
        "metafields/#{@id}.json", 
        {
          metafield:
            id: @id,
            value: @value
        },
        'PUT'