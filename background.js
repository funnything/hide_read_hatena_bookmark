chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    code: 'hideRead();'
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const trav = function(urls, index, results) {
    if (index < urls.length) {
      chrome.history.getVisits({ url: urls[index] }, function (items) {
        results[urls[index]] = items.length == 0;
        trav(urls, index + 1, results);
      });
    } else {
      sendResponse(results);
    }
  };

  trav(message.urls, 0, {});

  // wait async sendResponse
  return true;
});
