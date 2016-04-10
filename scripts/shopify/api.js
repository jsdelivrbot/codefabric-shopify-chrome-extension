define(['jquery', 'shopify', 'utils/logger'], function(jquery, shopify, logger) {
  var Api;
  return Api = (function() {
    var processQueue;

    Api.isProcessing = false;

    Api.queue = [];

    function Api() {}

    Api.prototype.execute = function(operation) {
      Api.queue.push(operation);
      if (!Api.isProcessing) {
        this.processQueue();
      }
    };

    processQueue = function() {
      var operation, promise;
      if (Api.queue.length > 0) {
        shopify.Loading.start();
        Api.isProcessing = true;
        operation = Api.queue.pop();
        logger.showMessage("Doing the thing: " + operation.name);
        promise = jquery.ajax(operation.toAjax());
        promise.done(function(r) {});
        promise.fail(function(e) {
          return logger.showError(e.responseText);
        });
        promise.always((function(_this) {
          return function() {
            return _this.processQueue();
          };
        })(this));
      } else {
        logger.showMessage('Done all the things!');
        shopify.Loading.stop();
        Api.isProcessing = false;
      }
    };

    return Api;

  })();
});

//# sourceMappingURL=api.js.map
