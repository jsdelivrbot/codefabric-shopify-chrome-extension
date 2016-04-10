define(['shopify'], function(shopify) {
  var Logger;
  return Logger = (function() {
    function Logger() {}

    Logger.showMessage = function(message) {
      return shopify.Flash.notice(message);
    };

    Logger.showError = function(message) {
      return shopify.Flash.error(message);
    };

    return Logger;

  })();
});

//# sourceMappingURL=logger.js.map
