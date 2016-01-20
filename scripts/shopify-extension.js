(function() {

  var extensionJs = (function(shopify, jq, cardBuilder, extensions) {
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
        var cardHeader = '<header class="next-card__header card-header"></header>';
        var cardOuterGrid = '<div class="next-grid next-grid--inner-grid next-grid--no-padding next-grid--vertically-centered card-outer"></div>';
        var cardInnerGrid = '<div class="next-grid next-grid--no-outside-padding next-grid--vertically-centered card-inner"></div>';
        var cardGridCell = '<div class="next-grid__cell"></div>';
        var cardGridCellNoFlex = '<div class="next-grid__cell next-grid__cell--no-flex"></div>';
        var cardHeaderTitle = '<h2 class="next-heading"></h2>';

        var cardContentWrapper = '<div class="next-card__section"></div>';
        var cardInputWrapper = '<div class="next-input-wrapper"></div>';
        var cardInputTitle = '<label class="next-label title"></label>';
        var cardInputTextBox = '<input type="text" class="next-input" size="30" />';
        var cardInputTextArea = '<textarea class="next-input" size="30" rows="10"></textarea>';
        var cardInputDropdown = '<select></select>';

        var tabOrderField = '<input type="hidden" name="tab-order" />';

        //Modals
        var addTabModal = '<script type="text/html" class="modal_source"><header><h2>New tab</h2><a href="#" class="close-modal">x</a></header><div class="body clearfix"><label for="new-tab-title">Tab name</label><input type="text" id="new-tab-title" class="next-input" /></div><div class="buttons"><a class="btn close-modal">Cancel</a><a href="#" class="btn btn-primary close-modal btn-ok">Add</a></div></script>';
        var reorderTabItem = '<li class="reorder-modal__options-row js-product-option next-grid next-grid--no-outside-padding"><div class="next-grid__cell next-grid__cell--quarter next-grid__cell--vertically-centered"><div class="js-product-option-name js-product-option-name--is-draggable drag"><div class="next-grid next-grid--no-padding"><div class="next-grid__cell next-grid__cell--no-flex"><i class="ico ico-drag-handle reorder-modal__option-drag-handle"></i></div><div class="next-grid__cell"><span class="next-label next-label--no-margin"></span></div></div></div></div></li>';
        var reorderTabsModalContent = '<header><h2>Reorder tabs</h2><a href="#" class="close-modal">x</a></header><div class="body"><p class="ssb">Reorder tabs to change how they appear in on your store.</p><ol class="js-product-options reorder-modal__options-list ui-sortable"></ol></div><div class="buttons"><a class="btn close-modal">Cancel</a><a href="#" class="btn btn-primary close-modal btn-ok">OK</a></div>';
        var modalWrapper = '<script type="text/html" class="modal_source"></script>';

        //API functions
        var apiQueue = [];
        var isProcessing = false;
        var processApiQueue = function() {
          if (apiQueue.length > 0) {
            isProcessing = true;
            var op = apiQueue.pop();

            jq.ajax({
              url: op.url,
              method: op.method,
              dataType: 'json',
              data: op.data
            }).done(function(r) {
              
            }).fail(function(e) {
              showError(e.responseText);
            }).always(function() {
              processApiQueue();
            });
          }
          else {
            isProcessing = false;
          }
        };

        var addMetafield = function (parentType, parentId, namespace, key, value, type) {
          var url = '/admin/';
          switch (parentType) {
            case 'product':
              url += 'products/' + parentId;
              break;
          }
          url += '/metafields.json';

          apiQueue.push({
            url: url,
            method: 'POST',
            data: {
              metafield: {
                namespace: namespace,
                key: key,
                value: value,
                value_type: type || 'string'
              }
            }
          });

          if (!isProcessing) {
            processApiQueue();
          }
        };

        var updateMetafield = function(parentType, parentId, id, value, type) {
          if (!id || id == '') { return; }

          var url = '/admin/';
          switch (parentType) {
            case 'product':
              url += 'products/' + parentId + '/';
              break;
          }
          url += 'metafields/' + id + '.json';

          apiQueue.push({
            url: url,
            method: 'PUT',
            data: {
              metafield: {
                id: id,
                value: value,
                value_type: type || 'string'
              }
            }
          });

          if (!isProcessing) {
            processApiQueue();
          }
        };

        var deleteMetafield = function(parentType, parentId, id) {
          if (!id || id == '') { return; }

          var url = '/admin/';
          switch (parentType) {
            case 'product':
              url += 'products/' + parentId + '/';
              break;
          }
          url += 'metafields/' + id + '.json';

          apiQueue.push({
            url: url,
            method: 'DELETE'
          });

          if (!isProcessing) {
            processApiQueue();
          }
        };


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
          var wrapper = jq(this).find('.next-card__section');
          if (!wrapper || wrapper.length == 0) {
            wrapper = jq(this).append(cardContentWrapper).find('.next-card__section');
          }

          jq(wrapper).append(content);

          return this;
        };

        var createRichTextArea = function (title, handle, value) {
          var wrapper = jq(cardInputWrapper).append(jq(cardInputTitle).text(title))
                                     .append(jq(cardInputTextArea).val(value)
                                                                  .attr({'name': handle, 'id': handle}));
          new shopify.Rte(wrapper);
          return wrapper;
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

        var createInputDropdown = function (type, name, handle, options) {
          return jq(cardInputDropdown)
                  .addClass(type)
                  .data('type', type)
                  .append(options)
                  .hide()
                  .attr({'name': 'tab-' + handle, 'id': 'tab-' + handle + '_' + type });
        };

        var createInputTextArea = function (type, name, handle, value) {
          return jq(cardInputTextArea)
                  .addClass(type)
                  .data('type', type)
                  .val(value)
                  .hide()
                  .attr({'name': 'tab-' + handle, 'id': 'tab-' + handle + '_' + type });
        };

        var createTabTypeRadio = function (type, name, handle) {
          return jq(cardGridCellNoFlex).append('<label for="' + handle +'_type_' + type.toLowerCase() + '" class="next-label next-label--inline">' + type + '</label><input type="radio" name="type-' + handle + '" id="' + handle +'_type_' + type.toLowerCase() + '" value="' + type.toLowerCase() + '" data-type="' + type.toLowerCase() + '" />');
        };

        var createTab = function (tab, pages, snippets) {
          var pageOptions = '';
          for (var pageIdx = 0; pageIdx < pages.length; pageIdx++) {
            var page = pages[pageIdx];
            pageOptions += '<option value="' + page.handle + '">' + page.title + '</option>';
          }

          var snippetOptions = '';
          for (var snippetIdx = 0; snippetIdx < snippets.length; snippetIdx++) {
            var snippet = snippets[snippetIdx];
            snippetOptions += '<option value="' + snippet + '">' + snippet + '</option>';
          }

          var keyHandle = tab.key.toLowerCase().replace(/ /g, '-');

          var tabTypeRadioGrid = jq(cardInnerGrid)
                                  .append(createTabTypeRadio('Text', tab.key, keyHandle))
                                  .append(createTabTypeRadio('Page', tab.key, keyHandle))
                                  .append(createTabTypeRadio('Snippet', tab.key, keyHandle))
                                  .append(jq(cardGridCellNoFlex).append('<a class="btn-slim btn--icon delete-tab-btn" href><i class="next-icon next-icon--12 next-icon--delete-blue"></i></a>'));

          var tabHeader = jq(cardOuterGrid)
                            .append(
                              jq(cardGridCell).append(jq(cardInputTitle).text(tab.key).attr({ 'for': 'tab-' + keyHandle }))
                            )
                            .append(
                              jq(cardGridCellNoFlex).append(tabTypeRadioGrid)
                            );

          var tabContent = jq(cardInputWrapper).addClass('tab-content-' + tab.id).data('id', tab.id).data('key', tab.key);

          tabContent.append(tabHeader);
          tabContent.append(createInputTextArea('text', tab.key, keyHandle, tab.value));
          tabContent.append(createInputDropdown('page', tab.key, keyHandle, pageOptions));
          tabContent.append(createInputDropdown('snippet', tab.key, keyHandle, snippetOptions));

          return tabContent;
        };

        var setupTabContentEvents = function (tab, tabContent, hideDelete) {
          var keyHandle = tab.key.toLowerCase().replace(/ /g, '-');

          var textarea = tabContent.find('#tab-' + keyHandle +'_text');
          var snippetDropdown = tabContent.find('#tab-' + keyHandle +'_snippet');
          var pageDropdown = tabContent.find('#tab-' + keyHandle +'_page');

          var snippetRadio = tabContent.find('#' + keyHandle +'_type_snippet');
          var pageRadio = tabContent.find('#' + keyHandle +'_type_page');
          var textRadio = tabContent.find('#' + keyHandle +'_type_text');

          var snippetMatch = tab.value.match(/^\{([^\{\}]+)\}$/);
          var pageMatch = tab.value.match(/^\[([^\[\]]+)\]$/);
          if (snippetMatch && snippetMatch.length > 1) {
            snippetDropdown.val(snippetMatch[1].trim()).show();
            snippetRadio.prop('checked', true);
          }
          else if (pageMatch && pageMatch.length > 1) {
            pageDropdown.val(pageMatch[1].trim()).show();
            pageRadio.prop('checked', true);
          }
          else {
            textarea.val(tab.value).prop('required', true).show();
            textRadio.prop('checked', true);
          }

          snippetRadio.on('change', function(e) {
            e.preventDefault();
            jq(this).closest('.next-input-wrapper').find('.text, .snippet, .page').removeAttr('required').hide();
            if (this.checked) {
              jq(this).closest('.next-input-wrapper').find('.snippet').show();
            }
          });

          pageRadio.on('change', function(e) {
            e.preventDefault();
            jq(this).closest('.next-input-wrapper').find('.text, .snippet, .page').removeAttr('required').hide();
            if (this.checked) {
              jq(this).closest('.next-input-wrapper').find('.page').show();
            }
          });

          textRadio.on('change', function(e) {
            e.preventDefault();
            jq(this).closest('.next-input-wrapper').find('.text, .snippet, .page').removeAttr('required').hide();
            if (this.checked) {
              jq(this).closest('.next-input-wrapper').find('.text').prop('required', true).show();
            }
          });

          var deleteBtn = tabContent.find('.delete-tab-btn').on('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you wish to delete the tab "' + jq(this).closest('.next-input-wrapper').data('key') + '"?')) {
              var tabName = jq(this).closest('.next-input-wrapper').data('key');

              var delField = jq(this).closest('.tabs-editor').find('input[name=tabs-deleted]');
              var ids = delField.val() ? delField.val().split(';') : [];
              ids.push(jq(this).closest('.next-input-wrapper').data('id'));
              delField.val(ids.join(';'));

              var orderField = jq(this).closest('.tabs-editor').find('input[name=tab-order]');
              if (orderField && orderField.length > 0) {
                var newOrder = orderField.val().split(',').filter(function (e) { return e.trim() != tabName; });
                orderField.val(newOrder.join(','));
              }
              jq(this).closest('form').trigger('change');
              jq(this).closest('.next-input-wrapper').remove();
            }
          });
          if (hideDelete) {
            deleteBtn.hide();
          }

          return tabContent;
        };

        var reorderTabs = function (container, newOrder) {
          var orderField = container.find('input[name=tab-order]');
          if (!orderField || orderField.length == 0) {
            orderField = container.append(jq(tabOrderField)).find('input[name=tab-order]');
          }

          var tabEls = container.find('.next-input-wrapper');
          var inputContainer = tabEls.parent();
          tabEls.detach();

          orderField.val(newOrder.join(','));
          for (var oIdx = 0; oIdx < newOrder.length; oIdx++) {
            var tabName = newOrder[oIdx];
            var matchingTabEls = tabEls.filter(function() { return jq(this).data('key').trim() == tabName.trim(); });
            inputContainer.append(matchingTabEls);
          }
        };

        /*** PRODUCT LIST ***/
        var loadProductListExtensions = function() {
          var result = jq.Deferred();

          addBulkMenuItems([
            { title: 'Add product tab', click: bulkAddProductTab },
            { title: 'Remove product tab', click: bulkRemoveProductTab },
            { title: 'Change product tab order', click: bulkChangeProductTabOrder },
           ]);

          result.resolve();

          return result;
          // jq.get('/admin/themes.json?role=main')
          //   .done(function (theme) {

          //     jq.when(jq.get('/admin/pages.json'),
          //             jq.get('/admin/themes/' + theme.themes[0].id + '/assets.json'))
          //       .done(function (pageData, themeData) {
          //       });
          //   });
        };

        var toolbarSegmentedButtonList = '<ul class="segmented"></ul>';
        var toolbarSegmentedButton = '<li><a class="btn"></a></li>';

        var dropdownMenuItemWithBreak = '<li class="break-top"><a href></a></li>';
        var dropdownMenuItem = '<li><a href></a></li>';

        var bulkAddTabModalContent = '<header><h2>Add a tab to {0} products</h2><a href="#" class="close-modal">x</a></header><div class="body clearfix"></div><div class="buttons"><a class="btn close-modal">Cancel</a><a href="#" class="btn btn-primary close-modal btn-ok">Add</a></div>';

        var addToolbarButtons = function (buttons) {
          var toolbar = jq('header.header');
          if (buttons.primary) {

          }
          else if (buttons.secondary) {
            var buttonContainer = jq(toolbarSegmentedButtonList);
            for (var btnIdx = 0; btnIdx < buttons.secondary.length; btnIdx++) {
              var button = buttons.secondary[btnIdx];

              var buttonEl = jq(toolbarSegmentedButton);
              buttonEl.find('.btn')
                      .text(button.title)
                      .on('click', button.click);
              buttonContainer.append(buttonEl);
            }
            toolbar.find('.header__secondary-actions').append(buttonContainer);
          }
        };

        var addBulkMenuItems = function(items) {
          var bulkMenu = jq('.bulk-actions ul .dropdown ul');
          for (var itemIdx = 0; itemIdx < items.length; itemIdx++) {
            var item = items[itemIdx];
            var itemEl = null;
            if (itemIdx == 0) {
              itemEl = jq(dropdownMenuItemWithBreak);
            }
            else {
              itemEl = jq(dropdownMenuItem);
            }

            itemEl.find('a')
                  .text(item.title)
                  .on('click', item.click);

            bulkMenu.append(itemEl);
          }
        };

        var getSelectedItems = function() {
          var result = jq.Deferred();
          var products = [];
          var allSelected = jq('.bulk-select-all .bulk-action-all-selector').find('span').hasClass('hide');
          if (allSelected) {
            loadProducts(1)
              .done(function (prods) {
                result.resolve(prods);
              });
          }
          else {
            result.resolve(jq('tbody input:checked').map(function(idx, e) { return $(e).val(); }));
          }

          return result;
        };

        var loadProducts = function (page) {
          var result = jq.Deferred();
          var products = [];
          jq.get('/admin/products.json?limit=250&page=' + (page || 1))
            .done(function (prods) {
              for (var pIdx = 0; pIdx < prods.products.length; pIdx++) {
                products.push(prods.products[pIdx].id);
              }
              if (prods.products.length == 250) {
                loadProducts((page || 1) + 1)
                  .done(function (pRes) {
                    products.push(pRes.products);
                    result.resolve(products);
                  });
              }
              else {
                result.resolve(products);
              }
            });
        };

        var pages = null, snippets = null;
        var getPages = function() {
          var result = $.Deferred();
          if (pages) {
            result.resolve(pages);
          }
          else {
            jq.get('/admin/pages.json')
              .done(function (pageData) {
                pages = pageData.pages;
                result.resolve(pages);
              });
          }
          return result;
        };
        var getSnippets = function() {
          var result = $.Deferred();
          if (snippets) {
            result.resolve(snippets);
          }
          else {

          jq.get('/admin/themes.json?role=main')
            .done(function (theme) {
              jq.get('/admin/themes/' + theme.themes[0].id + '/assets.json')
                .done(function (themeData) {
                  snippets = themeData.assets.filter(function(e) { return /^snippets\/.+\.liquid$/i.test(e.key); }).map(function(e) { return e.key.match(/^snippets\/(.+)\.liquid$/i)[1]; });
                  result.resolve(snippets);
                });
              });
          }
          return result;
        };

        var bulkAddProductTab = function (e) {
          e.preventDefault();

          jq.when(getPages(), getSnippets(), getSelectedItems())
            .done(function (pages, snippets, selection) {
                var itemsText = selection.length;
                var modalContent = jq(bulkAddTabModalContent.replace('{0}', itemsText));
                var modalBody = jq(modalContent[1]);
                var tabContent = createTab({ key: 'New Tab', value: '', id: 'new-tab' }, pages, snippets);
                modalBody.append(tabContent);

                modalBody.prepend(jq(cardInputWrapper).append('<label class="next-label" for="new-tab-name">Tab Name</label><input type="text" id="new-tab-name" class="next-input" required />'));

                modalContent = modalContent.wrapAll(modalWrapper).closest('script');
                var modal = new shopify.Modal(modalContent.get(0));
                var confirmed = false;
                modal.show();

                setupTabContentEvents({ key: 'New Tab', value: '', id: 'new-tab' }, jq(modal.$container()).find('.tab-content-new-tab'), true);
                jq(modal.$container()).find(".btn-ok").on('click', function (e) {
                  confirmed = true;
                });
                modal.onClose(function (e) { 
                  if (confirmed) {
                    var editorRd = jq(modal.$container()).find('.tab-content-new-tab input[type=radio]:checked');
                    var wrapper = editorRd.closest('.next-input-wrapper');
                    var textEditor = wrapper.find('.next-input.text');
                    var pageEditor = wrapper.find('select.page');
                    var snippetEditor = wrapper.find('select.snippet');

                    var tabId = wrapper.data('id');
                    var tabKey = wrapper.data('key');

                    var value = textEditor.val();
                    if (editorRd.data('type') == 'snippet') {
                      value = '{' + snippetEditor.val() + '}';
                    }
                    else if (editorRd.data('type') == 'page') {
                      value = '[' + pageEditor.val() + ']';
                    }

                    for (var prodIdx = 0; prodIdx < selection.length; prodIdx++) {
                      addMetafield('product', selection[prodIdx], 'tab', tabKey, value);
                    }
                  }
                });
            })
         
        };

        var bulkRemoveProductTab = function (e) {
          e.preventDefault();
          alert('2');
        };

        var bulkChangeProductTabOrder = function (e) {
          e.preventDefault();
          alert('3');
        };

        /*** END PRODUCT LIST ***/

        /*** PRODUCT ***/
        var loadProductExtensions = function(productId) {
          var result = jq.Deferred();

          var productForm = jq('form#edit_product_' + productId);
          if (!productForm || productForm.length == 0) {
            return;
          }
          else {
            var isLoadedField = productForm.find('#codefabric_extension_loaded');
            if (!isLoadedField || isLoadedField.length == 0) {
              productForm.append('<input type="hidden" id="codefabric_extension_loaded" value="true" />');
              productForm.on('submit', function() {
                window.setTimeout(function() { loadProductExtensions(productId); }, 2000);
              }); 
            }
            else {
              return;
            }
          }

          jq.get('/admin/themes.json?role=main')
            .done(function (theme) {

              jq.when(jq.get('/admin/products/' + productId + '/metafields.json?namespace=tab'),
                      jq.get('/admin/pages.json'),
                      jq.get('/admin/themes/' + theme.themes[0].id + '/assets.json'))
                .done(function (productData, pageData, themeData) {
                  var snippets = themeData[0].assets.filter(function(e) { return /^snippets\/.+\.liquid$/i.test(e.key); }).map(function(e) { return e.key.match(/^snippets\/(.+)\.liquid$/i)[1]; });
                  var tabsCard = jq(cardHtml).addClass('tabs-editor');

                  tabsCard.append('<input type="hidden" name="tabs-deleted" />');
                  productForm.on('submit', function() {
                    //Save the metafields
                    var tabEditors = jq(this).find('.tabs-editor').find('input[type=radio]:checked');
                    for (var editorIdx = 0; editorIdx < tabEditors.length; editorIdx++) {
                      var editorRd = jq(tabEditors[editorIdx]);

                      var wrapper = editorRd.closest('.next-input-wrapper');
                      var textEditor = wrapper.find('.next-input.text');
                      var pageEditor = wrapper.find('select.page');
                      var snippetEditor = wrapper.find('select.snippet');

                      var tabId = wrapper.data('id');
                      var tabKey = wrapper.data('key');

                      var value = textEditor.val();
                      if (editorRd.data('type') == 'snippet') {
                        value = '{' + snippetEditor.val() + '}';
                      }
                      else if (editorRd.data('type') == 'page') {
                        value = '[' + pageEditor.val() + ']';
                      }

                      if (tabId) {
                        updateMetafield('product', productId, tabId, value);
                      }
                      else {
                        addMetafield('product', productId, 'tab', tabKey, value);
                      }
                    }

                    var tabOrder = jq(this).find('input[name=tab-order]');
                    if (tabOrder && tabOrder.length > 0) {
                      var orderId = tabOrder.data('id');
                      if (orderId) {
                        updateMetafield('product', productId, orderId, tabOrder.val());
                      }
                      else {
                        addMetafield('product', productId, 'tab', '_order', tabOrder.val());
                      }
                    }

                    var deletedTabs = jq(this).find('.tabs-editor input[name=tabs-deleted]').val().split(';');
                    for (var delIdx = 0; delIdx < deletedTabs.length; delIdx++) {
                      var delId = deletedTabs[delIdx];
                      deleteMetafield('product', productId, delId);
                    }
                  });

                  addCardHeader.call(tabsCard, 'Tabs', [ 
                    { handle: 'add-tab', title: 'Add a new tab', onClick: function(e) {
                        e.preventDefault();
                        var modal = new shopify.Modal(jq(addTabModal).get(0));
                        var confirmed = false;
                        modal.show();
                        jq(modal.$container()).find(".btn-ok").on('click', function (e) {
                          confirmed = true;
                        });
                        modal.onClose(function (e) { 
                          if (confirmed) {
                            var tabName = jq(this).find('#new-tab-title').val();
                            if (tabName && tabName.length > 0) {
                              var newTab = {
                                namespace: 'tab',
                                key: tabName,
                                value: ''
                              };

                              var newTabElement = createTab(newTab, pageData[0].pages, snippets);
                              newTabElement = setupTabContentEvents(newTab, newTabElement);
                              addCardContent.call(tabsCard, newTabElement);

                              var orderField = tabsCard.find('input[name=tab-order]');
                              if (orderField && orderField.length > 0) {
                                var newOrder = orderField.val().split(',');
                                newOrder.push(tabName);
                                orderField.val(newOrder.join(','));
                              }

                              productForm.trigger('change');
                            }
                          }
                        });
                    } },
                    { handle: 'tab-order', title: 'Change tab order', onClick: function(e) {
                        e.preventDefault();

                        var modalContent = jq(reorderTabsModalContent);
                        var modalOl = modalContent.find('ol');

                        var currentTabs = productForm.find('.tabs-editor').find('.next-input-wrapper');
                        for (var oTabIdx = 0; oTabIdx < currentTabs.length; oTabIdx++) {
                          var tabEl = jq(currentTabs[oTabIdx]);
                          var tabName = tabEl.data('key');
                          var tabId = tabEl.data('id');

                          var reorderItem = jq(reorderTabItem);
                          reorderItem.attr('data-key', tabName).find('.next-label').text(tabName);
                          modalOl.append(reorderItem);
                        }

                        modalContent = modalContent.wrapAll(modalWrapper).closest('script');
                        var modal = new shopify.Modal(modalContent.get(0));
                        var confirmed = false;
                        modal.show();
                        jq(modal.$container()).find('ol').sortable({
                          handle: ".js-product-option-name--is-draggable",
                          opacity: .8,
                          axis: "y"
                        });
                        jq(modal.$container()).find(".btn-ok").on('click', function (e) {
                          confirmed = true;
                        });
                        modal.onClose(function (e) { 
                          if (confirmed) {
                            var newTabOrder = [];
                            jq(this).find('ol li').each(function (i, el) { newTabOrder.push(jq(el).data('key')); });
                            reorderTabs(productForm.find('.tabs-editor'), newTabOrder);
                            productForm.trigger('change');
                          }
                        });
                    } } 
                  ]);

                  var tabs = productData[0].metafields;
                  var order = [];
                  if (tabs.filter(function(e, i) { return e.key == '_order'; }).length > 0) {
                    var orderTab = tabs.filter(function(e, i) { return e.key == '_order'; })[0];
                    order = orderTab.value.split(',');
                    var orderField = tabsCard.find('input[name=tab-order]');
                    if (!orderField || orderField.length == 0) {
                      orderField = tabsCard.append(jq(tabOrderField).data('id', orderTab.id)).find('input[name=tab-order]');
                    }
                    orderField.val(order.join(','));
                  }

                  if (order) {
                    for (var orderIdx = 0; orderIdx < order.length; orderIdx++) {
                      var tabName = order[orderIdx].trim();
                      var tab = tabs.filter(function(e, i) { return e.key == tabName; });
                      if (tab.length > 0) {
                        tab = tab[0];
                        var tabElement = createTab(tab, pageData[0].pages, snippets);
                        tabElement = setupTabContentEvents(tab, tabElement);
                        addCardContent.call(tabsCard, tabElement);
                      }
                    }

                    for (var tabIdx = 0; tabIdx < tabs.length; tabIdx++) {
                      var tab = tabs[tabIdx];
                      if (tab.key == '_order') {
                        continue;
                      }

                      if (order.filter(function (e, i) { return e.trim() == tab.key; }) == 0) {
                        var tabElement = createTab(tab, pageData[0].pages, snippets);
                        tabElement = setupTabContentEvents(tab, tabElement);
                        addCardContent.call(tabsCard, tabElement);
                      }
                    }
                  }
                  else {
                    for (var tabIdx = 0; tabIdx < tabs.length; tabIdx++) {
                      var tab = tabs[tabIdx];
                      var tabElement = createTab(tab, pageData[0].pages, snippets);
                      tabElement = setupTabContentEvents(tab, tabElement);
                      addCardContent.call(tabsCard, tabElement);
                    }
                  }

                  jq('.next-card.images').before(tabsCard);

                  result.resolve();
                });
          });

          /*** END PRODUCT ***/

          return result;
        };

        // Public
        return {
          init: function () {
            if (!isShopify()) {
              showError('CodeFabric Shopify extensions cannot be used outside of Shopify Admin!');
              return;
            }

            var adminPage = getAdminPage();
            if (adminPage && adminPage.length > 1)
            {
              var promise = null;
              switch (adminPage[1]) {
                case 'products':
                  if (adminPage[2]) {
                    promise = loadProductExtensions(adminPage[2]);
                  }
                  else {
                    promise = loadProductListExtensions();
                  }
                  break;

                default:
                  console.log("Don't have any extensions to load for " + adminPage[1] + "!");
                  break;
              }
            }

            if (promise) {
              promise.done(function () {
                showMessage('CodeFabric Shopify extensions loaded!');
              });
            }
            else {
              showMessage('CodeFabric Shopify extensions loaded!');
            }
            
          }
        };

      };
    }

    var extension = new CodeFabric.Shopify.Extension();
    extension.init();
  });

  /** Utilities and loading **/

  var rootLoadPath = 'https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/master/scripts/';

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
    loadScripts: function (rootUrl, scriptNames, callback) {
        var scriptsToLoad = scriptNames.length;
        for (var scriptIdx = 0; scriptIdx < scriptNames.length; scriptIdx++) {
          var script = document.createElement("script")
          script.type = "text/javascript";

          if (script.readyState) {  //IE
              script.onreadystatechange = function () {
                  if (script.readyState == "loaded" ||
                          script.readyState == "complete") {
                      script.onreadystatechange = null;
                      if (--scriptsToLoad <= 0) {
                        callback();
                      }
                  }
              };
          } else {  //Others
              script.onload = function () {
                if (--scriptsToLoad <= 0) {
                  callback();
                }
              };
          }

          script.src = rootUrl + scriptNames[scriptIdx];
          document.getElementsByTagName("head")[0].appendChild(script);
        }
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

    loadExtensions: function(callback) {
      callback();
      //utils.loadScripts(rootLoadPath, ['shopify-card-builder', 'tabs-extension', 'product-attributes-extension'], callback);
    },

    ensureDependencies: function (callback) {
      utils.ensureCss(function() {
        utils.ensureJQuery(1.9, '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
          function ($) {
            utils.ensureShopify(function(shopify) {
              utils.loadExtensions(function() { callback(shopify, $); });
            });
          }
        );
      });
    }
  };

  if (typeof(CodeFabric) === 'undefined') {
    CodeFabric = {
      Shopify: { }
    };
  }
  utils.ensureDependencies(function (s, jq) {
    extensionJs.call(this, s, jq, {});
  });

})();