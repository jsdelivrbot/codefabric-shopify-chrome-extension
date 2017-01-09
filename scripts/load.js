chrome.browserAction.onClicked.addListener(function(tab) {
  /* 
  No tabs or host permissions needed!
  */
  var branch = "32f6d22cf8e6f1896f5a20bb2c26c2931e054603";
  var path = "https://rawgit.com/codefabric/codefabric-shopify-chrome-extension/" + (branch ? branch + "/" : "") + "scripts/";
  //path = "https://localhost:8080/scripts/";
  var script = "shopify-extension.js";
  chrome.tabs.executeScript({
    code: 'var codefabric = document.createElement("script");codefabric.type = "text/javascript";codefabric.src = "' + path + script + '";document.getElementsByTagName("head")[0].appendChild(codefabric);'
  });
});