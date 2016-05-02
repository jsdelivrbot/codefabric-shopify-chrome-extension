chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "e3c0df743d7703946ddcf2b99c7582efa5b83aec";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/' + (branch ? branch + '/' : '') + 'scripts/' + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});