define ['shopify/operation'], (Operation) ->

  class CreateMetafield extends Operation

    constructor: (@namespace, @key, @value, @type) ->
      super "Adding metafield #{@namespace}.#{@key} = #{@value}",
        'metafields', 
        {
          metafield:
            namespace: @namespace,
            key: @key,
            value: @value,
            type: @type ? 'string'
        },
        'POST'
