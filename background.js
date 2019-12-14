chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    code: 'hideRead();'
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const trav = function(urls, index, results) {
    if (index < urls.length) {
      chrome.history.getVisits({ url: urls[index] }, function (items) {
        if (urls[index] == 'https://qiita.com/nfujita55a/items/5848fcfbbe6cbf7d98c3') {
          console.log('actually');
          console.log(items);
        }
        if (urls[index] == 'https://www.gizmodo.jp/2019/12/mac-pro.html') {
          console.log('virtually');
          console.log(items);
        }
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
