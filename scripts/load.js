chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "03e64be8ceae1bb5e200a12082fc0c6759accc0c";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/' + (branch ? branch + '/' : '') + 'scripts/' + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});