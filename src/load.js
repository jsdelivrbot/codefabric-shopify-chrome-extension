chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "759d4267b5a5f4859eee44fb1037c6820b8ec0a2";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/' + (branch ? branch + '/' : '') + 'scripts/' + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});