chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    code: 'hide_read();'
  });
});

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   var urls = message.urls;
//   for (var i = 0; i < urls.length; i++) {
//     var url = { url: urls[i] };
//     if (message.visited) {
//       chrome.history.deleteUrl(url);
//     } else {
//       chrome.history.addUrl(url);
//     }
//   }
// });
