define(function() {
  var Operation;
  return Operation = (function() {
    function Operation(name, url, data, method) {
      this.name = name;
      this.url = url;
      this.data = data;
      this.method = method;
    }

    Operation.prototype.toAjax = function() {
      var ref;
      return {
        url: this.url,
        method: (ref = this.method) != null ? ref : 'GET',
        dataType: 'json',
        data: this.data
      };
    };

    return Operation;

  })();
});

//# sourceMappingURL=operation.js.map
