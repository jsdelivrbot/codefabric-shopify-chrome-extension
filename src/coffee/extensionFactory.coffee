namespace 'CodeFabric.Chrome', (ns) ->

  class ExtensionFactory
    TabEditorExtension = null


    constructor: ->
      TabEditorExtension = using 'CodeFabric.Chrome.Products.TabEditorExtension'

    create: (url) ->
      adminPage = getAdminPage url
      extensions = [] 

      if adminPage and adminPage.length > 1

        switch adminPage[1]
          when 'products'
            console.log "Load product extensions"
            if adminPage[2]
              extensions.push new TabEditorExtension(adminPage[2])
            else

          else
            console.log "Don't have any extensions to load for #{adminPage[1]}!"

      return extensions

    getAdminPage = (url) ->
      return url.match /^http[s]?\:\/\/[^\\\/]+\.myshopify\.com\/admin\/([^\\\/\?]+)[\/]?(\d+)*.*$/i