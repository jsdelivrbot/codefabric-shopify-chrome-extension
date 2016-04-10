define () ->

  class Operation

    constructor: (@name, @url, @data, @method) ->

    toAjax: () ->
      return { 
        url: @url,
        method: @method ? 'GET',
        dataType: 'json',
        data: @data
      }