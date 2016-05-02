chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "7ade41db179f442f81aa7c4db8b5ef79defe3f77";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/' + (branch ? branch + '/' : '') + 'scripts/' + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});