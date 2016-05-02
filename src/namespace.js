
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