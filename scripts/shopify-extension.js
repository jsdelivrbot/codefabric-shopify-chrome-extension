(function() {
  
  var extensionJs = (function(shopify, jq) {
    var CodeFabric = CodeFabric || {};
    CodeFabric.Shopify = CodeFabric.Shopify || {};
    if (!CodeFabric.Shopify.Extension) {

      CodeFabric.Shopify.Extension = function () {

        // Private
        var self = this;

        //Shopify functions
        var showMessage = function (message, isError) {
          isError ? shopify.Flash.error(message) : shopify.Flash.notice(message);
        };

        var showError = function (error) {
          showMessage(error, true);
        };

        // HTML snippets
        var cardHtml = '<div class="next-card"></div>';
        var cardHeader = '<header class="next-card__header"></header>';
        var cardOuterGrid = '<div class="next-grid next-grid--inner-grid next-grid--no-padding next-grid--vertically-centered"></div>';
        var cardInnerGrid = '<div class="next-grid next-grid--no-outside-padding next-grid--vertically-centered"></div>';
        var cardGridCell = '<div class="next-grid__cell"></div>';
        var cardGridCellNoFlex = '<div class="next-grid__cell next-grid__cell--no-flex"></div>';
        var cardHeaderTitle = '<h2 class="next-heading"></h2>';

        var cardContentWrapper = '<div class="next-card__section"></div>';
        var cardInputWrapper = '<div class="next-input-wrapper"></div>';
        var cardInputTitle = '<label class="next-label"></label>';
        var cardInputTextBox = '<input type="text" class="next-input" size="30" />';
        var cardInputTextArea = '<textarea class="next-input" size="30" rows="10"></textarea>';
        var cardInputDropdown = '<select class="next-input"></select>';

        // HTML builder functions
        var addCard = function (cardHandle) {
          return this.append(jq(cardHtml).addClass(cardHandle)).find('.' + cardHandle);
        };

        var addCardHeader = function(headerText, actions) {
          var header = this.append(cardHeader).find('header');

          if (!actions || actions.length == 0) {
            header.append(jq(cardHeaderTitle).text(headerText));
          }
          else {
            var grid = header.append(cardOuterGrid).find('.next-grid');
            
            grid.append(jq(cardGridCell).append(jq(cardHeaderTitle).text(headerText)));

            var actionsGrid = grid.append(jq(cardGridCellNoFlex).append(jq(cardInnerGrid).addClass('actions'))).find('.actions');
            for (var actionIdx = 0; actionIdx < actions.length; actionIdx++) {
              var action = actions[actionIdx];
              var actionLink = actionsGrid.append(jq(cardGridCellNoFlex).append('<a class="action-' + action.handle + '" href>' + action.title + '</a>')).find('.action-' + action.handle);
              actionLink.on('click', action.onClick);
            }
          }

          return this;
        };

        var addCardContent = function (content) {
          var wrapper = this.find('.next-card__section');
          if (!wrapper) {
            wrapper = this.append(cardContentWrapper).find('.next-card__section');
          }

          wrapper.append(content);

          return this;
        };

        var createTextArea = function (title, handle, value) {
          return jq(cardInputWrapper).append(jq(cardInputTitle).text(title))
                                     .append(jq(cardInputTextArea).val(value)
                                                                  .attr({'name': handle, 'id': handle}));
        };

        var addDropdown = function (title, handle, options, value) {

        };

        var isShopify = function () {
          return /^http[s]?\:\/\/[^\\\/]+\.myshopify\.com\/admin\/.*$/i.test(location.href);
        };

        var getAdminPage = function () {
          return location.href.match(/^http[s]?\:\/\/[^\\\/]+\.myshopify\.com\/admin\/([^\\\/]+)[\/]?(\d+)*.*$/i);
        };

        var loadProductListExtensions = function() {

        };

        var loadProductExtensions = function(productId) {
          var tabsCard = jq(cardHtml).addClass('tabs-editor');

          addCardHeader.call(tabsCard, 'Tabs', [ 
            { handle: 'add-tab', title: 'Add a new tab', onClick: function() {} },
            { handle: 'tab-order', title: 'Change tab order', onClick: function() {} } 
          ]);

          addCardContent.call(tabsCard, createTextArea('Test', 'test', 'Something to test'));


          jq('.next-card.images').before(tabsCard);
        };

        // Public
        return {
          init: function () {
            debugger;
            if (!isShopify()) {
              showError('CodeFabric Shopify extensions cannot be used outside of Shopify Admin!');
              return;
            }

            var adminPage = getAdminPage();
            if (adminPage.length > 1)
            {
              switch (adminPage[1]) {
                case 'products':
                  if (adminPage.length > 2) {
                    loadProductExtensions(adminPage[2]);
                  }
                  else {
                    loadProductListExtensions();
                  }
                  break;

                default:
                  console.log("Don't have any extensions to load for " + adminPage[1] + "!");
                  break;
              }
            }

            showMessage('CodeFabric Shopify extensions loaded!');
          }
        };

      };
    }

    var extension = new CodeFabric.Shopify.Extension();
    extension.init();
  });

  /** Utilities and loading **/

  var utils = {
    loadScript: function (url, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },

    loadCss: function (url, callback) {

        var link = document.createElement("link")
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "all";

        if (link.readyState) {  //IE
            link.onreadystatechange = function () {
                if (link.readyState == "loaded" ||
                        link.readyState == "complete") {
                    link.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            link.onload = function () {
                callback();
            };
        }

        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },

    ensureCss: function (callback) {
      utils.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', callback);
    },

    ensureJQuery: function (minVersion, src, callback) {
      if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < minVersion)) {
        utils.loadScript(src, function () {
            jqCodeFabric = jQuery.noConflict(true);
            jqCodeFabric(function() { callback(jqCodeFabric); });
        });
      } else {
        jQuery(function () { callback(jQuery); });
      }
    },

    ensureShopify: function (callback) {
      if (typeof Shopify === 'undefined') {
        console.error('Not loaded from a Shopify store!')
      } else {
        callback(Shopify);
      }
    },

    ensureDependencies: function (callback) {
      utils.ensureCss(function() {
        utils.ensureJQuery(1.9, '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
          function ($) {
            utils.ensureShopify(function(shopify) {
              callback(shopify, $);
            });
          }
        );
      });
    }
  };

  utils.ensureDependencies(function (s, jq) {
    extensionJs.call(this, s, jq, {});
  });

})();