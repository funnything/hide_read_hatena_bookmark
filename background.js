var urls = ['https://b.hatena.ne.jp/hotentry/*', 'https://www.amazon.co.jp/gp/*']

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'hideReadItems',
    title: 'Hide read items',
    documentUrlPatterns: urls
  });
  chrome.contextMenus.create({
    id: 'markItemsAsRead',
    title: 'Mark items as read',
    documentUrlPatterns: urls
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.executeScript(tab.id, { code: info.menuItemId + '();' })
});

// TODO: remove?
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    code: 'hideRead();'
  });
});

// Add identifier to message, if want to use messaging multiple purpose
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.getVisits) {
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
  } else if (message.markAsRead) {
    message.urls.forEach(function(url) {
      chrome.history.addUrl({ url: url });
    });
  } else {
    console.log(message);
    throw new Error('Uknown message');
  }
});
