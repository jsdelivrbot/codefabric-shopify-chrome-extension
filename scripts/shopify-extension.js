
if (!namespace) {
  var root = this;
  root.__namespaceQueue = [];
  var namespace = function (name, code) {
    getOrCreateNamespace(name);

    root.__namespaceQueue.push(function() {
		//Have to go get the actual namespace from the root again, since the closure variable is a copy
		var ns = getOrCreateNamespace(name);

	  	var result = code.call(ns, ns);
	  	addResultToNamespace(name, ns, result);
  	});

    function getOrCreateNamespace (theName) {
      var ns = root;
      var names = theName.split('.');
      for (var i = 0; i < names.length; i++) {
        var part = names[i];
        if (!ns[part]) {
          ns[part] = {};
        }

        ns = ns[part];
      }

      return ns;
    }

    function addResultToNamespace(name, ns, result) {
      if (result instanceof Array) {
        //Assuming list of name, value pairs as a single array
        for (var idx = 0; idx < (result.length - 1); idx += 2) {
          var objName = result[idx];
          var value = result[idx + 1];

          ns[objName] = value;
        }
        return;
      }
      if (typeof result === 'object') {
        if (result._name) {
          ns[result._name] = result;
        }
      }
      if (typeof result === 'function') {
        if (result.name) {
          ns[result.name] = result;
        }
      }
    };


  };

  namespace.init = function() {
						for (var i = 0; i < root.__namespaceQueue.length; i++) {
							root.__namespaceQueue[i]();
						}
					};

  var using = function (namespace) {
  	var ns = root;
      var names = namespace.split('.');
      for (var i = 0; i < names.length; i++) {
        var part = names[i];
        if (!ns[part]) {
          throw 'Could not find namespace ' + namespace;
        }

        ns = ns[part];
      }
 
      return ns;
  };

}
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Html;
  return Html = (function() {
    var $;

    $ = null;

    function Html(content) {
      this.content = content;
      this.hide = bind(this.hide, this);
      this.show = bind(this.show, this);
      this.render = bind(this.render, this);
      this.renderAfter = bind(this.renderAfter, this);
      this.renderBefore = bind(this.renderBefore, this);
      $ = using('jQuery');
      this.element = this.content ? $(this.content) : null;
      this.isRendered = false;
      this.isVisible = true;
    }

    Html.prototype.renderBefore = function(sibling, render) {
      if (render == null) {
        render = true;
      }
      if (render) {
        sibling.before(this.element);
      }
      this.isRendered = true;
      if (!this.isVisible) {
        return this.hide();
      }
    };

    Html.prototype.renderAfter = function(sibling, render) {
      if (render == null) {
        render = true;
      }
      if (render) {
        sibling.after(this.element);
      }
      this.isRendered = true;
      if (!this.isVisible) {
        return this.hide();
      }
    };

    Html.prototype.render = function(parent, render) {
      if (render == null) {
        render = true;
      }
      if (render) {
        parent.append(this.element);
      }
      this.isRendered = true;
      if (!this.isVisible) {
        return this.hide();
      }
    };

    Html.prototype.show = function() {
      this.isVisible = true;
      if (this.isRendered) {
        return this.element.show();
      }
    };

    Html.prototype.hide = function() {
      this.isVisible = false;
      if (this.isRendered) {
        return this.element.hide();
      }
    };

    return Html;

  })();
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Popup;
  return Popup = (function(superClass) {
    var $, Shopify;

    extend(Popup, superClass);

    $ = null;

    Shopify = null;

    Popup.modalWrapper = '<script type="text/html" class="modal_source"></script>';

    Popup.modalHeader = '<header><h2></h2><a href="#" class="close-modal">x</a></header>';

    Popup.modalBodyWrapper = '<div class="body clearfix"></div>';

    Popup.modalButtonsWrapper = '<div class="buttons"></div>';

    function Popup(header1, popupContentFunc, buttons) {
      this.header = header1;
      this.popupContentFunc = popupContentFunc;
      this.buttons = buttons;
      this.show = bind(this.show, this);
      this.render = bind(this.render, this);
      $ = using('jQuery');
      Shopify = using('Shopify');
      Popup.__super__.constructor.call(this);
    }

    Popup.prototype.render = function(parent) {
      return Popup.__super__.render.call(this, parent, false);
    };

    Popup.prototype.show = function() {
      var body, button, buttonsWrapper, cb, content, element, header, i, modal, ref;
      element = $(Popup.modalWrapper);
      modal = new Shopify.Modal(element.get(0));
      modal.show();
      element = $('#modal_container');
      header = $(Popup.modalHeader);
      header.find('h2').text(this.header);
      element.append(header);
      body = $(Popup.modalBodyWrapper);
      content = this.popupContentFunc();
      if (content.render != null) {
        content.render(body);
      } else {
        body.append(content);
      }
      element.append(body);
      buttonsWrapper = $(Popup.modalButtonsWrapper);
      ref = this.buttons;
      for (i = ref.length - 1; i >= 0; i += -1) {
        button = ref[i];
        if (button.cssClass.indexOf('btn-close-modal' > -1)) {
          cb = button.callback;
          button.callback = (function(_this) {
            return function(e) {
              if ((cb == null) || cb(e)) {
                return modal.hide();
              }
            };
          })(this);
        }
        button.render(buttonsWrapper);
      }
      return element.append(buttonsWrapper);
    };

    return Popup;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var BulkActionMenuSection;
  return BulkActionMenuSection = (function(superClass) {
    var $;

    extend(BulkActionMenuSection, superClass);

    $ = null;

    BulkActionMenuSection.sectionHtml = '<div class="next-popover__pane cfb_ext"></div>';

    function BulkActionMenuSection(items) {
      this.items = items;
      this.render = bind(this.render, this);
      $ = using('jQuery');
      BulkActionMenuSection.__super__.constructor.call(this);
    }

    BulkActionMenuSection.prototype.render = function(parent) {
      var i, item, len, ref, root;
      root = parent.find('.dropdown ul');
      if (root.length < 1) {
        this.element = $(BulkActionMenuSection.sectionHtml);
        parent.find('.next-popover ul.next-list').append(this.element);
      } else {
        this.element = root;
      }
      ref = this.items;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        item.render(this.element);
      }
      return BulkActionMenuSection.__super__.render.call(this, parent, false);
    };

    return BulkActionMenuSection;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var BulkActionMenuItem;
  return BulkActionMenuItem = (function(superClass) {
    var $;

    extend(BulkActionMenuItem, superClass);

    $ = null;

    BulkActionMenuItem.itemHtml = '<li><a class="next-list__item" href></a></li>';

    function BulkActionMenuItem(name, action) {
      this.name = name;
      this.action = action;
      this.render = bind(this.render, this);
      this.onActionClick = bind(this.onActionClick, this);
      $ = using('jQuery');
      BulkActionMenuItem.__super__.constructor.call(this);
    }

    BulkActionMenuItem.prototype.onActionClick = function(e) {
      if (this.action != null) {
        this.action(e);
      }
      e.preventDefault();
      return false;
    };

    BulkActionMenuItem.prototype.render = function(parent) {
      this.element = $(BulkActionMenuItem.itemHtml);
      parent.append(this.element);
      this.element.find('a').text(this.name).on('click', this.onActionClick);
      return BulkActionMenuItem.__super__.render.call(this, parent, false);
    };

    return BulkActionMenuItem;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Button;
  return Button = (function(superClass) {
    var $;

    extend(Button, superClass);

    $ = null;

    Button.buttonHtml = "<a></a>";

    function Button(cssClass, text, callback) {
      this.cssClass = cssClass;
      this.text = text;
      this.callback = callback;
      this.disable = bind(this.disable, this);
      this.enable = bind(this.enable, this);
      this.attachEventHandler = bind(this.attachEventHandler, this);
      this.render = bind(this.render, this);
      this.buttonCallback = bind(this.buttonCallback, this);
      $ = using('jQuery');
      this.isEnabled = true;
      Button.__super__.constructor.call(this);
    }

    Button.prototype.buttonCallback = function(e) {
      if (this.callback) {
        return this.callback(e);
      }
    };

    Button.prototype.render = function(parent) {
      this.element = $(Button.buttonHtml);
      this.element.addClass(this.cssClass).text(this.text).attr({
        disabled: !this.isEnabled
      });
      parent.append(this.element);
      this.attachEventHandler(this.element);
      return Button.__super__.render.call(this, parent, false);
    };

    Button.prototype.attachEventHandler = function(element) {
      return element.on('click', this.buttonCallback);
    };

    Button.prototype.enable = function() {
      this.isEnabled = true;
      if (this.isRendered) {
        return this.element.attr({
          disabled: false
        });
      }
    };

    Button.prototype.disable = function() {
      this.isEnabled = false;
      if (this.isRendered) {
        return this.elemenet.attr({
          disabled: true
        });
      }
    };

    return Button;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Card;
  return Card = (function(superClass) {
    var $, ChildGrid, Grid, Html;

    extend(Card, superClass);

    $ = Html = Grid = ChildGrid = null;

    Card.cardHtml = '<div class="next-card"></div>';

    Card.cardHeader = '<header class="next-card__header card-header"></header>';

    Card.cardHeaderTitle = '<h2 class="next-heading"></h2>';

    Card.cardContentWrapper = '<div class="next-card__section"></div>';

    function Card(cssClass, headerText, headerButtons) {
      this.cssClass = cssClass;
      this.headerText = headerText;
      this.headerButtons = headerButtons;
      this.renderContentItem = bind(this.renderContentItem, this);
      this.renderInternal = bind(this.renderInternal, this);
      this.renderBefore = bind(this.renderBefore, this);
      this.render = bind(this.render, this);
      this.addContent = bind(this.addContent, this);
      $ = using('jQuery');
      Html = using('CodeFabric.Shopify.Controls.Html');
      Grid = using('CodeFabric.Shopify.Controls.Grid');
      ChildGrid = using('CodeFabric.Shopify.Controls.ChildGrid');
      this.cardContent = [];
      Card.__super__.constructor.call(this);
    }

    Card.prototype.addContent = function(content) {
      this.cardContent.push(content);
      if (this.isRendered) {
        return this.renderContentItem(content);
      }
    };

    Card.prototype.render = function(parent) {
      this.renderInternal();
      parent.append(this.element);
      return Card.__super__.render.call(this, parent, false);
    };

    Card.prototype.renderBefore = function(sibling) {
      this.renderInternal();
      sibling.before(this.element);
      return Card.__super__.renderBefore.call(this, sibling, false);
    };

    Card.prototype.renderInternal = function() {
      var button, buttonsGrid, content, header, headerGrid, headerTextHtml, i, j, len, len1, ref, ref1;
      this.element = $(Card.cardHtml).addClass(this.cssClass);
      header = $(Card.cardHeader);
      this.element.append(header);
      headerTextHtml = new Html($(Card.cardHeaderTitle).text(this.headerText));
      if (!this.headerButtons || this.headerButtons.length === 0) {
        headerTextHtml.render(header);
      } else {
        headerGrid = new Grid();
        headerGrid.addCell(headerTextHtml);
        buttonsGrid = new ChildGrid();
        ref = this.headerButtons;
        for (i = 0, len = ref.length; i < len; i++) {
          button = ref[i];
          buttonsGrid.addCell(button, true);
        }
        headerGrid.addCell(buttonsGrid, true, 'actions');
        headerGrid.render(header);
      }
      this.contentWrapper = $(Card.cardContentWrapper);
      ref1 = this.cardContent;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        content = ref1[j];
        this.renderContentItem(content);
      }
      return this.element.append(this.contentWrapper);
    };

    Card.prototype.renderContentItem = function(item) {
      if (this.contentWrapper != null) {
        if (item.render != null) {
          return item.render(this.contentWrapper);
        } else {
          return this.contentWrapper.append(item);
        }
      }
    };

    return Card;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var ChildGrid;
  return ChildGrid = (function(superClass) {
    var $;

    extend(ChildGrid, superClass);

    $ = null;

    ChildGrid.html = '<div class="next-grid next-grid--no-outside-padding next-grid--vertically-centered card-inner"></div>';

    ChildGrid.cellHtml = '<div class="next-grid__cell"></div>';

    ChildGrid.cellHtmlNoFlex = '<div class="next-grid__cell next-grid__cell--no-flex"></div>';

    function ChildGrid() {
      this.render = bind(this.render, this);
      this.addCell = bind(this.addCell, this);
      $ = using('jQuery');
      this.cells = [];
      ChildGrid.__super__.constructor.call(this);
    }

    ChildGrid.prototype.addCell = function(cellContent, noFlex, cssClass) {
      var cell;
      cell = {
        content: cellContent,
        noFlex: noFlex,
        cssClass: cssClass
      };
      this.cells.push(cell);
      if (this.isRendered) {
        return this.renderCell(this.element, cell);
      }
    };

    ChildGrid.prototype.renderCell = function(grid, cell) {
      var element;
      element = null;
      if (cell.noFlex) {
        element = $(ChildGrid.cellHtmlNoFlex);
      } else {
        element = $(ChildGrid.cellHtml);
      }
      if (cell.cssClass) {
        element.addClass(cell.cssClass);
      }
      cell.content.render(element);
      return grid.append(element);
    };

    ChildGrid.prototype.render = function(parent) {
      var cell, i, len, ref;
      this.element = $(ChildGrid.html);
      ref = this.cells;
      for (i = 0, len = ref.length; i < len; i++) {
        cell = ref[i];
        this.renderCell(this.element, cell);
      }
      parent.append(this.element);
      return ChildGrid.__super__.render.call(this, parent, false);
    };

    return ChildGrid;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Dropdown;
  return Dropdown = (function(superClass) {
    var $;

    extend(Dropdown, superClass);

    $ = null;

    Dropdown.html = '<select></select>';

    Dropdown.optionHtml = '<option></option>';

    function Dropdown(cssClass, name, keyField, valueField, data1, onChange) {
      this.cssClass = cssClass;
      this.name = name;
      this.keyField = keyField;
      this.valueField = valueField;
      this.data = data1;
      this.onChange = onChange;
      this.value = bind(this.value, this);
      this.onValueChange = bind(this.onValueChange, this);
      this.appendOptions = bind(this.appendOptions, this);
      this.render = bind(this.render, this);
      $ = using('jQuery');
      this.val = null;
      Dropdown.__super__.constructor.call(this);
    }

    Dropdown.prototype.render = function(parent) {
      this.element = $(Dropdown.html).attr('name', this.name).addClass(this.cssClass);
      if (typeof this.data === 'function') {
        this.data().then((function(_this) {
          return function(result) {
            _this.appendOptions(_this.element, result);
            if (_this.val) {
              return _this.element.val(_this.val);
            }
          };
        })(this));
      } else {
        this.appendOptions(this.element, this.data);
        if (this.val) {
          this.element.val(this.val);
        }
      }
      parent.append(this.element);
      this.element.on('change', this.onValueChange);
      return Dropdown.__super__.render.call(this, parent, false);
    };

    Dropdown.prototype.appendOptions = function(dropdown, data) {
      var i, len, results, value;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        value = data[i];
        results.push(dropdown.append($(Dropdown.optionHtml).text(this.valueField ? value[this.valueField] : value).attr('value', this.keyField ? value[this.keyField] : value)));
      }
      return results;
    };

    Dropdown.prototype.onValueChange = function(e) {
      if (this.onChange) {
        return this.onChange(e);
      }
    };

    Dropdown.prototype.value = function(value) {
      if (value) {
        this.val = value;
        if (this.isRendered) {
          this.element.val(this.val);
        }
      }
      if (this.isRendered) {
        this.val = this.element.val();
      }
      return this.val;
    };

    return Dropdown;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var Grid;
  return Grid = (function(superClass) {
    var $;

    extend(Grid, superClass);

    $ = null;

    Grid.html = '<div class="next-grid next-grid--inner-grid next-grid--no-padding next-grid--vertically-centered card-outer"></div>';

    Grid.cellHtml = '<div class="next-grid__cell"></div>';

    Grid.cellHtmlNoFlex = '<div class="next-grid__cell next-grid__cell--no-flex"></div>';

    function Grid() {
      this.render = bind(this.render, this);
      this.renderCell = bind(this.renderCell, this);
      this.addCell = bind(this.addCell, this);
      $ = using('jQuery');
      this.cells = [];
      Grid.__super__.constructor.call(this);
    }

    Grid.prototype.addCell = function(cellContent, noFlex, cssClass) {
      var cell;
      cell = {
        content: cellContent,
        noFlex: noFlex,
        cssClass: cssClass
      };
      this.cells.push(cell);
      if (this.isRendered) {
        return this.renderCell(this.element, cell);
      }
    };

    Grid.prototype.renderCell = function(grid, cell) {
      var element;
      element = null;
      if (cell.noFlex) {
        element = $(Grid.cellHtmlNoFlex);
      } else {
        element = $(Grid.cellHtml);
      }
      if (cell.cssClass) {
        element.addClass(cell.cssClass);
      }
      cell.content.render(element);
      return grid.append(element);
    };

    Grid.prototype.render = function(parent) {
      var cell, i, len, ref;
      this.element = $(Grid.html);
      ref = this.cells;
      for (i = 0, len = ref.length; i < len; i++) {
        cell = ref[i];
        this.renderCell(this.element, cell);
      }
      parent.append(this.element);
      return Grid.__super__.render.call(this, parent, false);
    };

    return Grid;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var InputField;
  return InputField = (function(superClass) {
    extend(InputField, superClass);

    function InputField(type, name, id, val) {
      this.type = type;
      this.name = name;
      this.id = id;
      this.val = val;
      this.value = bind(this.value, this);
      this.render = bind(this.render, this);
      InputField.__super__.constructor.call(this, "<input type=\"" + this.type + "\" name=\"" + this.name + "\" id=\"" + this.id + "\" />");
    }

    InputField.prototype.render = function(parent) {
      InputField.__super__.render.call(this, parent);
      return this.element.val(this.val);
    };

    InputField.prototype.value = function(newValue) {
      if (typeof newValue !== 'undefined') {
        this.val = newValue;
        if (this.isRendered) {
          this.element.val(newValue);
        }
      }
      if (this.isRendered) {
        return this.element.val();
      } else {
        return this.val;
      }
    };

    return InputField;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var NewTabPopup;
  return NewTabPopup = (function(superClass) {
    var $, Button, TabEditor;

    extend(NewTabPopup, superClass);

    $ = null;

    TabEditor = Button = null;

    NewTabPopup.wrapperHtml = '<div class="next-input-wrapper"></div>';

    NewTabPopup.labelHtml = '<label class="next-label next-label--inline"></label>';

    function NewTabPopup(productId, onCreate) {
      this.productId = productId;
      this.onCreate = onCreate;
      this.onConfirmClick = bind(this.onConfirmClick, this);
      this.buildContent = bind(this.buildContent, this);
      $ = using('jQuery');
      TabEditor = using('CodeFabric.Shopify.Controls.TabEditor');
      Button = using('CodeFabric.Shopify.Controls.Button');
      this.okButton = new Button('btn btn-primary btn-close-modal', 'OK', this.onConfirmClick);
      NewTabPopup.__super__.constructor.call(this, 'Add a new tab', this.buildContent, [this.okButton, new Button('btn btn-close-modal', 'Cancel')]);
    }

    NewTabPopup.prototype.buildContent = function() {
      var content;
      content = $(NewTabPopup.wrapperHtml);
      this.editor = new TabEditor(this.productId, null, null, 'text', ' ');
      this.editor.render(content);
      return content;
    };

    NewTabPopup.prototype.onConfirmClick = function() {
      if (this.onCreate != null) {
        this.onCreate(this.editor);
        return true;
      }
      return false;
    };

    return NewTabPopup;

  })(CodeFabric.Shopify.Controls.Popup);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var RadioButton;
  return RadioButton = (function(superClass) {
    var $;

    extend(RadioButton, superClass);

    $ = null;

    RadioButton.labelHtml = '<label class="next-label next-label--inline"></label>';

    RadioButton.radioHtml = '<input type="radio"></input>';

    function RadioButton(label, cssClass, name, id, value, onChange) {
      this.label = label;
      this.cssClass = cssClass;
      this.name = name;
      this.id = id;
      this.value = value;
      this.onChange = onChange;
      this.render = bind(this.render, this);
      this.onRadioChange = bind(this.onRadioChange, this);
      this.check = bind(this.check, this);
      this.isChecked = bind(this.isChecked, this);
      $ = using('jQuery');
      this.checked = false;
      RadioButton.__super__.constructor.call(this);
    }

    RadioButton.prototype.isChecked = function() {
      if (!this.isRendered) {
        return this.checked;
      }
      return this.element.is(':checked');
    };

    RadioButton.prototype.check = function() {
      this.checked = true;
      if (this.isRendered) {
        return this.element.attr({
          checked: true
        });
      }
    };

    RadioButton.prototype.onRadioChange = function(e) {
      this.checked = this.isChecked();
      if (this.onChange) {
        return this.onChange(e);
      }
    };

    RadioButton.prototype.render = function(parent) {
      this.element = $(RadioButton.radioHtml).attr({
        id: this.id,
        name: this.name,
        value: this.value
      }).addClass(this.cssClass);
      parent.append($(RadioButton.labelHtml).attr({
        "for": this.id
      }).text(this.label));
      parent.append(this.element);
      this.element.on('change', this.onRadioChange);
      RadioButton.__super__.render.call(this, parent, false);
      if (this.checked) {
        return this.check();
      }
    };

    return RadioButton;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var ReorderTabsPopup;
  return ReorderTabsPopup = (function(superClass) {
    var $, Button;

    extend(ReorderTabsPopup, superClass);

    $ = null;

    Button = null;

    ReorderTabsPopup.tabListHtml = '<div><p class="ssb">Reorder tabs to change how they appear in on your store.</p><ol class="js-product-options reorder-modal__options-list ui-sortable"></ol></div>';

    ReorderTabsPopup.tabItemHtml = '<li class="reorder-modal__options-row js-product-option next-grid next-grid--no-outside-padding"><div class="next-grid__cell next-grid__cell--quarter next-grid__cell--vertically-centered"><div class="js-product-option-name js-product-option-name--is-draggable drag"><div class="next-grid next-grid--no-padding"><div class="next-grid__cell next-grid__cell--no-flex"><i class="ico ico-drag-handle reorder-modal__option-drag-handle"></i></div><div class="next-grid__cell"><span class="next-label next-label--no-margin"></span></div></div></div></div></li>';

    function ReorderTabsPopup(tabs, onReorder) {
      var tab;
      this.tabs = tabs;
      this.onReorder = onReorder;
      this.onConfirmClick = bind(this.onConfirmClick, this);
      this.buildContent = bind(this.buildContent, this);
      $ = using('jQuery');
      Button = using('CodeFabric.Shopify.Controls.Button');
      this.okButton = new Button('btn btn-primary btn-close-modal', 'OK', this.onConfirmClick);
      this.okButton.disable();
      this.tabOrder = (function() {
        var i, len, ref, results;
        ref = this.tabs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          tab = ref[i];
          results.push(tab);
        }
        return results;
      }).call(this);
      ReorderTabsPopup.__super__.constructor.call(this, 'Reorder tabs', this.buildContent, [this.okButton, new Button('btn btn-close-modal', 'Cancel')]);
    }

    ReorderTabsPopup.prototype.buildContent = function() {
      var content, i, item, len, ref, tab;
      content = $(ReorderTabsPopup.tabListHtml);
      this.tabList = content.find('ol.ui-sortable');
      ref = this.tabOrder;
      for (i = 0, len = ref.length; i < len; i++) {
        tab = ref[i];
        item = $(ReorderTabsPopup.tabItemHtml).attr({
          'data-key': tab
        });
        item.find('.next-label').text(tab);
        this.tabList.append(item);
        this.tabList.sortable({
          handle: ".js-product-option-name--is-draggable",
          opacity: .8,
          axis: "y"
        });
      }
      return content;
    };

    ReorderTabsPopup.prototype.onConfirmClick = function() {
      var t;
      if (this.onReorder != null) {
        this.onReorder((function() {
          var i, len, ref, results;
          ref = this.tabList.find('li');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            t = ref[i];
            results.push($(t).data('key'));
          }
          return results;
        }).call(this));
        return true;
      }
      return false;
    };

    return ReorderTabsPopup;

  })(CodeFabric.Shopify.Controls.Popup);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var TabEditor;
  return TabEditor = (function(superClass) {
    var $, Api, Button, ChildGrid, CreateProductMetafield, DeleteProductMetafield, Dropdown, GetPages, GetSnippets, GetTheme, Grid, Html, InputField, Logger, RadioButton, TextArea, UpdateProductMetafield;

    extend(TabEditor, superClass);

    $ = Grid = ChildGrid = Html = Dropdown = TextArea = RadioButton = Button = InputField = null;

    Logger = Api = GetSnippets = GetTheme = GetPages = UpdateProductMetafield = CreateProductMetafield = DeleteProductMetafield = null;

    TabEditor.snippetPromise = null;

    TabEditor.snippets = null;

    TabEditor.pagesPromise = null;

    TabEditor.pages = null;

    TabEditor.snippetRegex = /^\{([^\{\}]+)\}$/;

    TabEditor.pageRegex = /^\[([^\[\]]+)\]$/;

    TabEditor.contentWrapper = '<div class="next-input-wrapper"></div>';

    function TabEditor(productId, tabId, name, type, value1) {
      this.productId = productId;
      this.tabId = tabId;
      this.name = name;
      this.type = type;
      this.value = value1;
      this.save = bind(this.save, this);
      this.render = bind(this.render, this);
      $ = using('jQuery');
      Logger = using('CodeFabric.Utils.Logger');
      Grid = using('CodeFabric.Shopify.Controls.Grid');
      ChildGrid = using('CodeFabric.Shopify.Controls.ChildGrid');
      Html = using('CodeFabric.Shopify.Controls.Html');
      Dropdown = using('CodeFabric.Shopify.Controls.Dropdown');
      TextArea = using('CodeFabric.Shopify.Controls.TextArea');
      RadioButton = using('CodeFabric.Shopify.Controls.RadioButton');
      Button = using('CodeFabric.Shopify.Controls.Button');
      InputField = using('CodeFabric.Shopify.Controls.InputField');
      Api = using('CodeFabric.Shopify.Api');
      GetTheme = using('CodeFabric.Shopify.Operations.GetTheme');
      GetSnippets = using('CodeFabric.Shopify.Operations.GetSnippets');
      GetPages = using('CodeFabric.Shopify.Operations.GetPages');
      UpdateProductMetafield = using('CodeFabric.Shopify.Operations.UpdateProductMetafield');
      CreateProductMetafield = using('CodeFabric.Shopify.Operations.CreateProductMetafield');
      DeleteProductMetafield = using('CodeFabric.Shopify.Operations.DeleteProductMetafield');
      this.handle = this.name != null ? this.name.toLowerCase().replace(/ /g, '-') : 'new-tab';
      this.isDeleted = false;
      TabEditor.__super__.constructor.call(this);
    }

    TabEditor.prototype.render = function(parent) {
      var deleteButton, headerGrid, nameInput, pageRadio, radioGroup, snippetRadio, textRadio;
      this.element = $(TabEditor.contentWrapper);
      headerGrid = new Grid();
      nameInput = null;
      if ((this.name != null) && this.name !== '') {
        headerGrid.addCell(new Html("<label for=\"tab-" + this.handle + "\">" + this.name + "</label>"));
      } else {
        nameInput = new InputField('text', 'tab-name', 'tab-name', 'New tab');
        headerGrid.addCell(nameInput);
      }
      snippetRadio = new RadioButton('Snippet', 'snippet-radio', "tab-type-" + this.handle, "tab-type-" + this.handle + "-snippet", "snippet");
      pageRadio = new RadioButton('Page', 'page-radio', "tab-type-" + this.handle, "tab-type-" + this.handle + "-page", "page");
      textRadio = new RadioButton('Text', 'text-radio', "tab-type-" + this.handle, "tab-type-" + this.handle + "-text", "text");
      radioGroup = new ChildGrid();
      radioGroup.addCell(snippetRadio, true);
      radioGroup.addCell(pageRadio, true);
      radioGroup.addCell(textRadio, true);
      headerGrid.addCell(radioGroup, true);
      deleteButton = new Button('btn btn-delete', '', (function(_this) {
        return function(e) {
          _this.isDeleted = true;
          parent.parents('form').trigger('change');
          return _this.element.remove();
        };
      })(this));
      headerGrid.addCell(deleteButton, true);
      this.snippetSelector = new Dropdown('snippets', 'snippets', null, null, TabEditor.getSnippets);
      this.snippetSelector.hide();
      this.pageSelector = new Dropdown('pages', 'pages', 'handle', 'title', TabEditor.getPages);
      this.pageSelector.hide();
      this.textArea = new TextArea(30, 10);
      this.textArea.hide();
      if (this.type === 'snippet') {
        snippetRadio.check();
        this.snippetSelector.show();
        this.snippetSelector.value((this.value.match(TabEditor.snippetRegex))[1]);
      } else if (this.type === 'page') {
        pageRadio.check();
        this.pageSelector.show();
        this.pageSelector.value((this.value.match(TabEditor.pageRegex))[1]);
      } else {
        textRadio.check();
        this.textArea.show();
        this.textArea.value(this.value);
      }
      headerGrid.render(this.element);
      if (nameInput != null) {
        nameInput.element.on('change', (function(_this) {
          return function(e) {
            _this.name = nameInput.value();
            return _this.handle = _this.name != null ? _this.name.toLowerCase().replace(/ /g, '-') : 'new-tab';
          };
        })(this));
      }
      this.snippetSelector.render(this.element);
      this.pageSelector.render(this.element);
      this.textArea.render(this.element);
      parent.append(this.element);
      snippetRadio.onChange = (function(_this) {
        return function(e) {
          _this.pageSelector.hide();
          _this.textArea.hide();
          if (snippetRadio.isChecked()) {
            _this.snippetSelector.show();
            _this.type = 'snippet';
            return _this.value = "{" + (_this.snippetSelector.value()) + "}";
          }
        };
      })(this);
      this.snippetSelector.onChange = (function(_this) {
        return function(e) {
          if (snippetRadio.isChecked()) {
            return _this.value = "{" + (_this.snippetSelector.value()) + "}";
          }
        };
      })(this);
      pageRadio.onChange = (function(_this) {
        return function(e) {
          _this.snippetSelector.hide();
          _this.textArea.hide();
          if (pageRadio.isChecked()) {
            _this.pageSelector.show();
            _this.type = 'page';
            return _this.value = "[" + (_this.pageSelector.value()) + "]";
          }
        };
      })(this);
      this.pageSelector.onChange = (function(_this) {
        return function(e) {
          if (pageRadio.isChecked()) {
            return _this.value = "[" + (_this.pageSelector.value()) + "]";
          }
        };
      })(this);
      textRadio.onChange = (function(_this) {
        return function(e) {
          _this.snippetSelector.hide();
          _this.pageSelector.hide();
          if (textRadio.isChecked()) {
            _this.textArea.show();
            _this.type = 'text';
            return _this.value = _this.textArea.value();
          }
        };
      })(this);
      this.textArea.onChange = (function(_this) {
        return function(e) {
          if (textRadio.isChecked()) {
            return _this.value = _this.textArea.value();
          }
        };
      })(this);
      return TabEditor.__super__.render.call(this, parent, false);
    };

    TabEditor.prototype.save = function() {
      var operation, promise;
      promise = $.Deferred();
      if (this.isDeleted && (this.tabId == null)) {
        promise.resolve();
      } else {
        operation = null;
        if (this.isDeleted) {
          Logger.showMessage("Deleting tab " + this.name);
          operation = new DeleteProductMetafield(this.productId, this.tabId);
        } else {
          Logger.showMessage("Saving tab " + this.name);
          if (this.tabId) {
            operation = new UpdateProductMetafield(this.productId, this.tabId, this.value || ' ');
          } else {
            operation = new CreateProductMetafield(this.productId, 'tab', this.name, this.value || ' ');
          }
        }
        operation.onDone = function(res) {
          return promise.resolve(res);
        };
        Api.execute(operation);
      }
      return promise;
    };

    TabEditor.getSnippets = function() {
      if (!TabEditor.snippetPromise) {
        TabEditor.snippetPromise = $.Deferred();
        if (TabEditor.snippets != null) {
          TabEditor.snippetPromise.resolve(TabEditor.snippets);
        } else {
          Api.execute(new GetTheme(function(result) {
            return Api.execute(new GetSnippets(result.themes[0].id, function(result2) {
              var e;
              TabEditor.snippets = (function() {
                var i, len, ref, results;
                ref = result2.assets;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                  e = ref[i];
                  if (/^snippets\/.+\.liquid$/i.test(e.key)) {
                    results.push(e.key.match(/^snippets\/(.+)\.liquid$/i)[1]);
                  }
                }
                return results;
              })();
              return TabEditor.snippetPromise.resolve(TabEditor.snippets);
            }));
          }));
        }
      }
      return TabEditor.snippetPromise;
    };

    TabEditor.getPages = function() {
      if (!TabEditor.pagesPromise) {
        TabEditor.pagesPromise = $.Deferred();
        if (TabEditor.pages != null) {
          TabEditor.pagesPromise.resolve(TabEditor.pages);
        } else {
          Api.execute(new GetPages(function(result) {
            TabEditor.pages = result.pages;
            return TabEditor.pagesPromise.resolve(TabEditor.pages);
          }));
        }
      }
      return TabEditor.pagesPromise;
    };

    TabEditor.getType = function(value) {
      if (value) {
        if (value.match(TabEditor.snippetRegex)) {
          return 'snippet';
        }
        if (value.match(TabEditor.pageRegex)) {
          return 'page';
        }
      }
      return 'text';
    };

    return TabEditor;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var TabsCard;
  return TabsCard = (function(superClass) {
    var $, API, Button, Card, CreateProductMetafield, GetProductMetafieldsByNamespace, Html, InputField, NewTabPopup, Popup, ReorderTabsPopup, TabEditor, UpdateProductMetafield;

    extend(TabsCard, superClass);

    $ = Card = Button = InputField = TabEditor = Popup = NewTabPopup = ReorderTabsPopup = Html = null;

    GetProductMetafieldsByNamespace = UpdateProductMetafield = CreateProductMetafield = API = null;

    function TabsCard(productId) {
      this.productId = productId;
      this.save = bind(this.save, this);
      this.reorderTabs = bind(this.reorderTabs, this);
      this.onReorderTabsClick = bind(this.onReorderTabsClick, this);
      this.onAddTabClick = bind(this.onAddTabClick, this);
      this.addTab = bind(this.addTab, this);
      this.render = bind(this.render, this);
      $ = using('jQuery');
      Card = using('CodeFabric.Shopify.Controls.Card');
      Button = using('CodeFabric.Shopify.Controls.Button');
      InputField = using('CodeFabric.Shopify.Controls.InputField');
      TabEditor = using('CodeFabric.Shopify.Controls.TabEditor');
      Popup = using('CodeFabric.Shopify.Controls.Popup');
      NewTabPopup = using('CodeFabric.Shopify.Controls.NewTabPopup');
      ReorderTabsPopup = using('CodeFabric.Shopify.Controls.ReorderTabsPopup');
      Html = using('CodeFabric.Shopify.Controls.Html');
      GetProductMetafieldsByNamespace = using('CodeFabric.Shopify.Operations.GetProductMetafieldsByNamespace');
      UpdateProductMetafield = using('CodeFabric.Shopify.Operations.UpdateProductMetafield');
      CreateProductMetafield = using('CodeFabric.Shopify.Operations.CreateProductMetafield');
      API = using('CodeFabric.Shopify.Api');
      this.tabs = [];
      TabsCard.__super__.constructor.call(this);
    }

    TabsCard.prototype.render = function(parent) {
      var cardsCell, getOperation, promise;
      this.tabsCard = new Card('tabs-editor', 'Tabs', [new Button('add-tab', 'Add a new tab', this.onAddTabClick), new Button('tab-order', 'Change tab order', this.onReorderTabsClick)]);
      cardsCell = parent.find('div.section .next-card.images');
      promise = $.Deferred();
      getOperation = new GetProductMetafieldsByNamespace(this.productId, 'tab', (function(_this) {
        return function(r) {
          var i, j, k, l, len, len1, len2, len3, len4, m, orderedTabs, ot, otherTab, ref, ref1, ref2, ref3, t, tab, tabKey, tabOrder, te;
          ref = r.metafields;
          for (i = 0, len = ref.length; i < len; i++) {
            ot = ref[i];
            if (ot.key === '_order') {
              tabOrder = ot;
            }
          }
          if (tabOrder != null) {
            _this.tabOrderFieldId = tabOrder.id;
            tabOrder = tabOrder.value != null ? tabOrder.value.split(',') : [];
          } else {
            tabOrder = [];
          }
          orderedTabs = [];
          for (j = 0, len1 = tabOrder.length; j < len1; j++) {
            tabKey = tabOrder[j];
            tab = null;
            ref1 = r.metafields;
            for (k = 0, len2 = ref1.length; k < len2; k++) {
              t = ref1[k];
              if (t.key === tabKey.trim()) {
                tab = t;
              }
            }
            if (tab != null) {
              orderedTabs.push(tab);
              _this.addTab(tab.id, tab.key, TabEditor.getType(tab.value), tab.value);
            }
          }
          ref2 = r.metafields;
          for (l = 0, len3 = ref2.length; l < len3; l++) {
            otherTab = ref2[l];
            if (!(otherTab.key !== '_order' && indexOf.call(orderedTabs, otherTab) < 0)) {
              continue;
            }
            orderedTabs.push(otherTab);
            _this.addTab(otherTab.id, otherTab.key, TabEditor.getType(otherTab.value), otherTab.value);
          }
          ref3 = _this.tabs;
          for (m = 0, len4 = ref3.length; m < len4; m++) {
            te = ref3[m];
            _this.tabsCard.addContent(te);
          }
          _this.tabsCard.renderBefore(cardsCell);
          _this.element = _this.tabsCard.element;
          return promise.resolve();
        };
      })(this));
      API.execute(getOperation);
      TabsCard.__super__.render.call(this, parent, false);
      return promise;
    };

    TabsCard.prototype.addTab = function(id, name, type, value) {
      var tabEditor;
      tabEditor = new TabEditor(this.productId, id, name, type, value);
      this.tabs.push(tabEditor);
      return tabEditor;
    };

    TabsCard.prototype.onAddTabClick = function(e) {
      var addTabPopup;
      addTabPopup = new NewTabPopup(this.productId, (function(_this) {
        return function(newTabEditor) {
          _this.tabs.push(newTabEditor);
          _this.tabsCard.addContent(newTabEditor);
          return _this.element.parents('form').trigger('change');
        };
      })(this));
      return addTabPopup.show();
    };

    TabsCard.prototype.onReorderTabsClick = function(e) {
      var reorderTabPopup, te;
      reorderTabPopup = new ReorderTabsPopup((function() {
        var i, len, ref, results;
        ref = this.tabs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          te = ref[i];
          if (!te.isDeleted) {
            results.push(te.name);
          }
        }
        return results;
      }).call(this), (function(_this) {
        return function(newOrder) {
          _this.reorderTabs(newOrder);
          return _this.element.parents('form').trigger('change');
        };
      })(this));
      return reorderTabPopup.show();
    };

    TabsCard.prototype.reorderTabs = function(newOrder) {
      var de, e, editor, i, j, k, len, len1, len2, newOrderedTabs, ref, ref1, tabKey, te;
      ref = this.tabs;
      for (i = 0, len = ref.length; i < len; i++) {
        te = ref[i];
        te.element.remove();
      }
      newOrderedTabs = [];
      for (j = 0, len1 = newOrder.length; j < len1; j++) {
        tabKey = newOrder[j];
        ref1 = this.tabs;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          e = ref1[k];
          if (e.name === tabKey && !e.isDeleted) {
            editor = e;
          }
        }
        this.tabsCard.addContent(editor);
        newOrderedTabs.push(editor);
      }
      return this.tabs = newOrderedTabs.concat((function() {
        var l, len3, ref2, results;
        ref2 = this.tabs;
        results = [];
        for (l = 0, len3 = ref2.length; l < len3; l++) {
          de = ref2[l];
          if (de.isDeleted) {
            results.push(de);
          }
        }
        return results;
      }).call(this));
    };

    TabsCard.prototype.save = function() {
      var promise, tab;
      promise = $.Deferred();
      $.when((function() {
        var i, len, ref, results;
        ref = this.tabs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          tab = ref[i];
          results.push(tab.save());
        }
        return results;
      }).call(this)).then((function(_this) {
        return function(res) {
          var t, tabOrder, tabOrderOperation;
          tabOrder = (function() {
            var i, len, ref, results;
            ref = this.tabs;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              t = ref[i];
              if (!t.isDeleted) {
                results.push(t.name);
              }
            }
            return results;
          }).call(_this);
          tabOrderOperation = null;
          if (_this.tabOrderFieldId == null) {
            tabOrderOperation = new CreateProductMetafield(_this.productId, 'tab', '_order', tabOrder.join(','));
          } else {
            tabOrderOperation = new UpdateProductMetafield(_this.productId, _this.tabOrderFieldId, tabOrder.join(','));
          }
          tabOrderOperation.onDone = function(r) {
            return promise.resolve(res);
          };
          return API.execute(tabOrderOperation);
        };
      })(this));
      return promise;
    };

    return TabsCard;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Controls', function(ns) {
  var TextArea;
  return TextArea = (function(superClass) {
    var $;

    extend(TextArea, superClass);

    $ = null;

    TextArea.html = '<textarea class="next-input"></textarea>';

    function TextArea(columns, rows, content, onChange) {
      this.columns = columns;
      this.rows = rows;
      this.content = content;
      this.onChange = onChange;
      this.value = bind(this.value, this);
      this.onValueChanged = bind(this.onValueChanged, this);
      this.render = bind(this.render, this);
      $ = using('jQuery');
      this.val = null;
      TextArea.__super__.constructor.call(this);
    }

    TextArea.prototype.render = function(parent) {
      this.element = $(TextArea.html).attr({
        rows: this.rows,
        size: this.columns
      }).val(this.content);
      parent.append(this.element);
      if (this.val) {
        this.element.val(this.val);
      }
      this.element.on('change', this.onValueChanged);
      return TextArea.__super__.render.call(this, parent, false);
    };

    TextArea.prototype.onValueChanged = function(e) {
      if (this.onChange != null) {
        return this.onChange(e);
      }
    };

    TextArea.prototype.value = function(value) {
      if (value) {
        this.val = value;
        if (this.isRendered) {
          this.element.val(this.val);
        }
      }
      if (this.isRendered) {
        this.val = this.element.val();
      }
      return this.val;
    };

    return TextArea;

  })(CodeFabric.Shopify.Controls.Html);
});
 })(using, namespace);
(function (using, namespace) { namespace('CodeFabric.Chrome', function(ns) {
  var Extension;
  return Extension = (function() {
    var $;

    $ = null;

    function Extension() {
      $ = using('jQuery');
    }

    Extension.prototype.load = function() {
      return $.Deferred();
    };

    return Extension;

  })();
});
 })(using, namespace);
(function (using, namespace) { namespace('CodeFabric.Chrome', function(ns) {
  var ExtensionFactory;
  return ExtensionFactory = (function() {
    var BulkTabEditorExtension, TabEditorExtension, getAdminPage;

    TabEditorExtension = BulkTabEditorExtension = null;

    function ExtensionFactory() {
      TabEditorExtension = using('CodeFabric.Chrome.Products.TabEditorExtension');
      BulkTabEditorExtension = using('CodeFabric.Chrome.Products.BulkTabEditorExtension');
    }

    ExtensionFactory.prototype.create = function(url) {
      var adminPage, extensions;
      adminPage = getAdminPage(url);
      extensions = [];
      if (adminPage && adminPage.length > 1) {
        switch (adminPage[1]) {
          case 'products':
            console.log("Load product extensions");
            if (adminPage[2]) {
              extensions.push(new TabEditorExtension(adminPage[2]));
            } else {
              extensions.push(new BulkTabEditorExtension());
            }
            break;
          default:
            console.log("Don't have any extensions to load for " + adminPage[1] + "!");
        }
      }
      return extensions;
    };

    getAdminPage = function(url) {
      return url.match(/^http[s]?\:\/\/[^\\\/]+\.myshopify\.com\/admin\/([^\\\/\?]+)[\/]?(\d+)*.*$/i);
    };

    return ExtensionFactory;

  })();
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Chrome.Products', function(ns) {
  var BulkTabEditorExtension, Extension;
  Extension = using('CodeFabric.Chrome.Extension');
  return BulkTabEditorExtension = (function(superClass) {
    var $, API, BulkActionMenuItem, BulkActionMenuSection, CreateProductMetafield, GetProducts, Logger, NewTabPopup;

    extend(BulkTabEditorExtension, superClass);

    $ = Logger = NewTabPopup = BulkActionMenuSection = BulkActionMenuItem = null;

    CreateProductMetafield = GetProducts = API = null;

    BulkTabEditorExtension.existsElement = 'bulk-tabs-editor';

    function BulkTabEditorExtension() {
      this.load = bind(this.load, this);
      this.loadProducts = bind(this.loadProducts, this);
      this.getSelectedProducts = bind(this.getSelectedProducts, this);
      this.addTabToSelectedProducts = bind(this.addTabToSelectedProducts, this);
      this.onReorderTabs = bind(this.onReorderTabs, this);
      this.onRemoveTab = bind(this.onRemoveTab, this);
      this.onAddTab = bind(this.onAddTab, this);
      BulkTabEditorExtension.__super__.constructor.call(this);
      $ = using('jQuery');
      Logger = using('CodeFabric.Utils.Logger');
      NewTabPopup = using('CodeFabric.Shopify.Controls.NewTabPopup');
      BulkActionMenuSection = using('CodeFabric.Shopify.Controls.BulkActionMenuSection');
      BulkActionMenuItem = using('CodeFabric.Shopify.Controls.BulkActionMenuItem');
      CreateProductMetafield = using('CodeFabric.Shopify.Operations.CreateProductMetafield');
      GetProducts = using('CodeFabric.Shopify.Operations.GetProducts');
      API = using('CodeFabric.Shopify.Api');
    }

    BulkTabEditorExtension.prototype.onAddTab = function(e) {
      var newTabPopup;
      newTabPopup = new NewTabPopup(null, (function(_this) {
        return function(tabEditor) {
          return _this.addTabToSelectedProducts(tabEditor.name, tabEditor.value);
        };
      })(this));
      return newTabPopup.show();
    };

    BulkTabEditorExtension.prototype.onRemoveTab = function(e) {};

    BulkTabEditorExtension.prototype.onReorderTabs = function(e) {};

    BulkTabEditorExtension.prototype.addTabToSelectedProducts = function(tabName, tabValue) {
      return this.getSelectedProducts().then((function(_this) {
        return function(prods) {
          var i, len, operation, prodId, promise, promises;
          Logger.showMessage("Adding tab " + tabName + " to " + prods.length + " products!");
          promises = [];
          for (i = 0, len = prods.length; i < len; i++) {
            prodId = prods[i];
            promise = $.Deferred();
            operation = new CreateProductMetafield(prodId, 'tab', tabName, tabValue || ' ');
            operation.onDone = function(res) {
              return promise.resolve(res);
            };
            API.execute(operation);
          }
          return $.when(promises).then(function(results) {
            return Logger.showMessage("Added tab " + tabName + " to " + prods.length + " products!");
          });
        };
      })(this));
    };

    BulkTabEditorExtension.prototype.getSelectedProducts = function() {
      var allSelected, e, products, result;
      result = $.Deferred();
      products = [];
      allSelected = $('.bulk-select-all .bulk-action-all-selector').find('span').hasClass('hide');
      if (allSelected) {
        this.loadProducts(1).done((function(_this) {
          return function(prods) {
            return result.resolve(prods);
          };
        })(this));
      } else {
        result.resolve((function() {
          var i, len, ref, results1;
          ref = $('tbody input:checked');
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            e = ref[i];
            results1.push($(e).val());
          }
          return results1;
        })());
      }
      return result;
    };

    BulkTabEditorExtension.prototype.loadProducts = function(page) {
      var getOperation, products, result;
      result = $.Deferred();
      products = [];
      getOperation = new GetProducts(page, 250, (function(_this) {
        return function(prods) {
          var p;
          products = products.concat((function() {
            var i, len, ref, results1;
            ref = prods.products;
            results1 = [];
            for (i = 0, len = ref.length; i < len; i++) {
              p = ref[i];
              results1.push(p.id);
            }
            return results1;
          })());
          if (prods.products.length >= 250) {
            return _this.loadProducts(++page).done(function(moreProds) {
              var mp;
              products = products.concat((function() {
                var i, len, results1;
                results1 = [];
                for (i = 0, len = moreProds.length; i < len; i++) {
                  mp = moreProds[i];
                  results1.push(mp.id);
                }
                return results1;
              })());
              return result.resolve(products);
            });
          } else {
            return result.resolve(products);
          }
        };
      })(this));
      API.execute(getOperation);
      return result;
    };

    BulkTabEditorExtension.prototype.load = function() {
      var bulkMenu, promise, section;
      if ($("." + BulkTabEditorExtension.existsElement).length > 0) {
        return;
      }
      promise = BulkTabEditorExtension.__super__.load.call(this);
      bulkMenu = $('.bulk-actions ul').addClass(BulkTabEditorExtension.existsElement);
      section = new BulkActionMenuSection([new BulkActionMenuItem('Add product tab', this.onAddTab), new BulkActionMenuItem('Remove product tab', this.onRemoveTab), new BulkActionMenuItem('Change product tab order', this.onReorderTabs)]);
      section.render(bulkMenu);
      promise.resolve();
      return promise;
    };

    return BulkTabEditorExtension;

  })(Extension);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Chrome.Products', function(ns) {
  var Extension, TabEditorExtension;
  Extension = using('CodeFabric.Chrome.Extension');
  return TabEditorExtension = (function(superClass) {
    var $, InputField, Logger, TabsCard;

    extend(TabEditorExtension, superClass);

    $ = Logger = TabsCard = InputField = null;

    TabEditorExtension.existsElement = 'tabs-editor';

    function TabEditorExtension(productId) {
      this.productId = productId;
      this.load = bind(this.load, this);
      TabEditorExtension.__super__.constructor.call(this);
      $ = using('jQuery');
      Logger = using('CodeFabric.Utils.Logger');
      InputField = using('CodeFabric.Shopify.Controls.InputField');
      TabsCard = using('CodeFabric.Shopify.Controls.TabsCard');
    }

    TabEditorExtension.prototype.load = function() {
      var checkField, form, promise, renderResult, tabsCard;
      if ($("form#edit_product_" + this.productId + " #" + TabEditorExtension.existsElement).length > 0) {
        return;
      }
      promise = TabEditorExtension.__super__.load.call(this);
      form = $("form#edit_product_" + this.productId);
      checkField = new InputField('hidden', TabEditorExtension.existsElement, TabEditorExtension.existsElement);
      checkField.render(form);
      tabsCard = new TabsCard(this.productId);
      renderResult = tabsCard.render(form);
      form.on('submit', (function(_this) {
        return function(e) {
          return tabsCard.save().then(function(res) {
            return Logger.showMessage("Saved the things");
          });
        };
      })(this));
      form.on('change', (function(_this) {
        return function(e) {
          if ($("form#edit_product_" + _this.productId + " #" + TabEditorExtension.existsElement).length <= 0) {
            return window.setTimeout(_this.load, 500);
          }
        };
      })(this));
      if (renderResult && typeof renderResult.then === 'function') {
        renderResult.then((function(_this) {
          return function(result) {
            Logger.showMessage("Loaded the tab editor for product id " + _this.productId);
            return promise.resolve();
          };
        })(this));
      } else {
        Logger.showMessage("Loaded the tab editor for product id " + this.productId);
        promise.resolve();
      }
      return promise;
    };

    return TabEditorExtension;

  })(Extension);
});
 })(using, namespace);
(function (using, namespace) { var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('CodeFabric.Shopify.Chrome', function(ns) {
  var Main;
  return Main = (function() {
    var $, ExtensionFactory, Logger, Shopify;

    Logger = null;

    ExtensionFactory = null;

    $ = null;

    Shopify = null;

    function Main() {
      this.attachToWindow = bind(this.attachToWindow, this);
      this.loadExtensions = bind(this.loadExtensions, this);
      this.run = bind(this.run, this);
      Logger = using('CodeFabric.Utils.Logger');
      ExtensionFactory = using('CodeFabric.Chrome.ExtensionFactory');
      $ = using('jQuery');
      Shopify = using('Shopify');
      this.factory = new ExtensionFactory();
    }

    Main.prototype.run = function() {
      Logger.showMessage('Hoorah!');
      return this.loadExtensions().then((function(_this) {
        return function(results) {
          Logger.showMessage('All extensions loaded!');
          return _this.attachToWindow();
        };
      })(this));
    };

    Main.prototype.loadExtensions = function() {
      var e, extensions, i, len, promises;
      extensions = this.factory.create(window.location.href);
      for (i = 0, len = extensions.length; i < len; i++) {
        e = extensions[i];
        promises = e.load();
      }
      return $.when(promises).promise();
    };

    Main.prototype.attachToWindow = function() {
      var oldPushState, oldReplaceState;
      if ((typeof window !== "undefined" && window !== null) && window.history) {
        oldPushState = window.history.pushState;
        window.history.pushState = function(state) {
          $(window).trigger('pushstate', state);
          return oldPushState.apply(window.history, arguments);
        };
        oldReplaceState = window.history.replaceState;
        window.history.replaceState = function(state) {
          $(window).trigger('replacestate', state);
          return oldReplaceState.apply(window.history, arguments);
        };
      }
      return $(window).on('popstate', (function(_this) {
        return function(e) {
          return window.setTimeout(_this.loadExtensions, 2000);
        };
      })(this)).on('pushstate', (function(_this) {
        return function(e) {
          return window.setTimeout(_this.loadExtensions, 2000);
        };
      })(this)).on('replacestate', (function(_this) {
        return function(e) {
          return window.setTimeout(_this.loadExtensions, 2000);
        };
      })(this));
    };

    return Main;

  })();
});
 })(using, namespace);
(function (using, namespace) { namespace('CodeFabric.Shopify', function(ns) {
  var Operation;
  return Operation = (function() {
    function Operation(name, url, data, method, onDone, onError) {
      this.name = name;
      this.url = url;
      this.data = data != null ? data : null;
      this.method = method != null ? method : 'GET';
      this.onDone = onDone != null ? onDone : null;
      this.onError = onError != null ? onError : null;
    }

    Operation.prototype.toAjax = function() {
      return {
        url: "/admin/" + this.url,
        method: this.method,
        dataType: 'json',
        data: this.data
      };
    };

    return Operation;

  })();
});
 })(using, namespace);
(function (using, namespace) { namespace('CodeFabric.Shopify', function(ns) {
  var Api;
  return Api = (function() {
    function Api() {}

    Api.isProcessing = false;

    Api.queue = [];

    Api.execute = function(operation) {
      Api.queue.push(operation);
      if (!Api.isProcessing) {
        this.processQueue();
      }
    };

    Api.processQueue = function() {
      var $, Logger, Shopify, ajaxOptions, operation, promise;
      Shopify = using('Shopify');
      Logger = using('CodeFabric.Utils.Logger');
      $ = using('jQuery');
      if (Api.queue.length > 0) {
        Shopify.Loading.start();
        Api.isProcessing = true;
        operation = Api.queue.pop();
        Logger.showMessage("Doing the thing: " + operation.name);
        ajaxOptions = operation.toAjax();
        promise = $.ajax(ajaxOptions);
        promise.done(function(r) {
          if (operation.onDone !== null) {
            return operation.onDone(r);
          }
        });
        promise.fail(function(e) {
          Logger.showError(e.responseText);
          if (operation.onError !== null) {
            return operation.onError(e);
          }
        });
        promise.always((function(_this) {
          return function() {
            return Api.processQueue();
          };
        })(this));
      } else {
        Logger.showMessage('Done all the things!');
        Shopify.Loading.stop();
        Api.isProcessing = false;
      }
    };

    return Api;

  })();
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify', function(ns) {
  var GetOperation;
  return GetOperation = (function(superClass) {
    extend(GetOperation, superClass);

    function GetOperation(name, url, onDone, onError) {
      this.name = name;
      this.url = url;
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      GetOperation.__super__.constructor.call(this, this.name, this.url, null, 'GET', this.onDone, this.onError);
    }

    return GetOperation;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var CreateMetafield, Operation;
  Operation = using('CodeFabric.Shopify.Operation');
  return CreateMetafield = (function(superClass) {
    extend(CreateMetafield, superClass);

    function CreateMetafield(fieldNamespace, key, value, type) {
      var ref;
      this.fieldNamespace = fieldNamespace;
      this.key = key;
      this.value = value;
      this.type = type;
      CreateMetafield.__super__.constructor.call(this, "Adding metafield " + this.fieldNamespace + "." + this.key + " = " + this.value, 'metafields.json', {
        metafield: {
          namespace: this.fieldNamespace,
          key: this.key,
          value: this.value,
          value_type: (ref = this.type) != null ? ref : 'string'
        }
      }, 'POST');
    }

    return CreateMetafield;

  })(Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var CreateProductMetafield;
  return CreateProductMetafield = (function(superClass) {
    extend(CreateProductMetafield, superClass);

    function CreateProductMetafield(productId, fieldNamespace, key, value, type) {
      var ref;
      this.productId = productId;
      this.fieldNamespace = fieldNamespace;
      this.key = key;
      this.value = value;
      this.type = type;
      CreateProductMetafield.__super__.constructor.call(this, "Adding product metafield " + this.fieldNamespace + "." + this.key + " = " + this.value, "products/" + this.productId + "/metafields.json", {
        metafield: {
          namespace: this.fieldNamespace,
          key: this.key,
          value: this.value,
          value_type: (ref = this.type) != null ? ref : 'string'
        }
      }, 'POST');
    }

    return CreateProductMetafield;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var DeleteMetafield;
  return DeleteMetafield = (function(superClass) {
    extend(DeleteMetafield, superClass);

    function DeleteMetafield(id) {
      this.id = id;
      DeleteMetafield.__super__.constructor.call(this, "Deleting metafield " + this.id, "metafields/" + this.id + ".json", null, 'DELETE');
    }

    return DeleteMetafield;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var DeleteProductMetafield;
  return DeleteProductMetafield = (function(superClass) {
    extend(DeleteProductMetafield, superClass);

    function DeleteProductMetafield(productId, id) {
      this.productId = productId;
      this.id = id;
      DeleteProductMetafield.__super__.constructor.call(this, "Deleting metafield " + this.id, "products/" + this.productId + "/metafields/" + this.id + ".json", null, 'DELETE');
    }

    return DeleteProductMetafield;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetMetafieldsByNamespace;
  return GetMetafieldsByNamespace = (function(superClass) {
    extend(GetMetafieldsByNamespace, superClass);

    function GetMetafieldsByNamespace(fieldNamespace, onDone) {
      this.fieldNamespace = fieldNamespace;
      this.onDone = onDone;
      GetMetafieldsByNamespace.__super__.constructor.call(this, "Getting metafields matching " + this.fieldNamespace, "metafields.json?namespace=" + this.fieldNamespace);
    }

    return GetMetafieldsByNamespace;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetPages;
  return GetPages = (function(superClass) {
    extend(GetPages, superClass);

    function GetPages(onDone, onError) {
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      GetPages.__super__.constructor.call(this, "Getting pages", "pages.json", this.onDone, this.onError);
    }

    return GetPages;

  })(CodeFabric.Shopify.GetOperation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetProductMetafieldsByNamespace;
  return GetProductMetafieldsByNamespace = (function(superClass) {
    extend(GetProductMetafieldsByNamespace, superClass);

    function GetProductMetafieldsByNamespace(productId, fieldNamespace, onDone, onError) {
      this.productId = productId;
      this.fieldNamespace = fieldNamespace;
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      GetProductMetafieldsByNamespace.__super__.constructor.call(this, "Getting metafields matching " + this.fieldNamespace + " for product " + this.productId, "products/" + this.productId + "/metafields.json?namespace=" + this.fieldNamespace, this.onDone, this.onError);
    }

    return GetProductMetafieldsByNamespace;

  })(CodeFabric.Shopify.GetOperation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetProducts;
  return GetProducts = (function(superClass) {
    extend(GetProducts, superClass);

    function GetProducts(page, limit, onDone, onError) {
      this.page = page;
      this.limit = limit;
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      this.page = this.page || 1;
      this.limit = this.limit || 250;
      GetProducts.__super__.constructor.call(this, "Getting a page of " + this.limit + " products", "products.json?limit=" + this.limit + "&page=" + this.page, this.onDone, this.onError);
    }

    return GetProducts;

  })(CodeFabric.Shopify.GetOperation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetSnippets;
  return GetSnippets = (function(superClass) {
    extend(GetSnippets, superClass);

    function GetSnippets(themeId, onDone, onError) {
      this.themeId = themeId;
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      GetSnippets.__super__.constructor.call(this, "Getting snippets", "themes/" + this.themeId + "/assets.json", this.onDone, this.onError);
    }

    return GetSnippets;

  })(CodeFabric.Shopify.GetOperation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var GetTheme;
  return GetTheme = (function(superClass) {
    extend(GetTheme, superClass);

    function GetTheme(onDone, onError) {
      this.onDone = onDone;
      this.onError = onError != null ? onError : null;
      GetTheme.__super__.constructor.call(this, "Getting the main theme", "themes.json?role=main", this.onDone, this.onError);
    }

    return GetTheme;

  })(CodeFabric.Shopify.GetOperation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var UpdateMetafield;
  return UpdateMetafield = (function(superClass) {
    extend(UpdateMetafield, superClass);

    function UpdateMetafield(id, value, type) {
      this.id = id;
      this.value = value;
      this.type = type != null ? type : 'string';
      UpdateMetafield.__super__.constructor.call(this, "Updating metafield " + this.id + " => " + this.value, "metafields/" + this.id + ".json", {
        metafield: {
          id: this.id,
          value: this.value,
          value_type: this.type
        }
      }, 'PUT');
    }

    return UpdateMetafield;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

namespace('CodeFabric.Shopify.Operations', function(ns) {
  var UpdateProductMetafield;
  return UpdateProductMetafield = (function(superClass) {
    extend(UpdateProductMetafield, superClass);

    function UpdateProductMetafield(productId, id, value, type) {
      this.productId = productId;
      this.id = id;
      this.value = value;
      this.type = type != null ? type : 'string';
      UpdateProductMetafield.__super__.constructor.call(this, "Updating product metafield " + this.id + " => " + this.value, "products/" + this.productId + "/metafields/" + this.id + ".json", {
        metafield: {
          id: this.id,
          value: this.value,
          value_type: this.type
        }
      }, 'PUT');
    }

    return UpdateProductMetafield;

  })(CodeFabric.Shopify.Operation);
});
 })(using, namespace);
(function (using, namespace) { namespace('Shopify', function(ns) {
  return window.shopify;
});
 })(using, namespace);
(function (using, namespace) { namespace('CodeFabric.Utils', function(ns) {
  var Logger;
  return Logger = (function() {
    function Logger() {}

    Logger.showMessage = function(message) {
      var Shopify;
      Shopify = using('Shopify');
      console.log(message);
      if (Shopify.Flash) {
        return Shopify.Flash.notice(message);
      }
    };

    Logger.showError = function(message) {
      var Shopify;
      Shopify = using('Shopify');
      console.error(message);
      if (Shopify.Flash) {
        return Shopify.Flash.error(message);
      }
    };

    return Logger;

  })();
});
 })(using, namespace);
(function (using, namespace) { 
namespace.init();

var Main = using('CodeFabric.Shopify.Chrome.Main');

var _m = new Main();
_m.run();
 })(using, namespace);