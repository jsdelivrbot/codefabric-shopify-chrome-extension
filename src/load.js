chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "99f0fd3b0d5842b4b43f790ca86c268ec55f8ea4";
  var path = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/" + (branch ? branch + "/" : "") + "scripts/";
  path = "https://localhost:8080/scripts/";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "' + path + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});