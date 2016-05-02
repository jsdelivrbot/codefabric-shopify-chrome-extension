namespace 'CodeFabric.Shopify.Operations', (ns) ->

  Operation = using 'CodeFabric.Shopify.Operation'

  class CreateMetafield extends Operation

    constructor: (@fieldNamespace, @key, @value, @type) ->
      super "Adding metafield #{@fieldNamespace}.#{@key} = #{@value}",
        'metafields', 
        {
          metafield:
            namespace: @fieldNamespace,
            key: @key,
            value: @value,
            type: @type ? 'string'
        },
        'POST'
