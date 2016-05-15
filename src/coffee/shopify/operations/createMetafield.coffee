namespace 'CodeFabric.Shopify.Operations', (ns) ->

  Operation = using 'CodeFabric.Shopify.Operation'

  class CreateMetafield extends Operation

    constructor: (@fieldNamespace, @key, @value, @type) ->
      super "Adding metafield #{@fieldNamespace}.#{@key} = #{@value}",
        'metafields.json', 
        {
          metafield:
            namespace: @fieldNamespace,
            key: @key,
            value: @value,
            value_type: @type ? 'string'
        },
        'POST'
