namespace 'CodeFabric.Chrome', (ns) ->

  class Extension

    $ = null

    constructor: ->
      $ = using 'jQuery'

    load: () ->
      return $.Deferred()

