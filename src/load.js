chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "bc3db202b39870f78c16d2ec5bb683b7d5b4b371";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/' + (branch ? branch + '/' : '') + 'scripts/' + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});