namespace 'CodeFabric.Shopify', (ns) ->

  class Operation
    constructor: (@name, @url, @data = null, @method = 'GET', @onDone = null, @onError = null) ->

    toAjax: () ->
      return { 
        url: "/admin/#{@url}",
        method: @method,
        dataType: 'json',
        data: @data
      }