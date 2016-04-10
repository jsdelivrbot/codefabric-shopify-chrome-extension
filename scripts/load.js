chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/dev/scripts/shopify-extension.js";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});