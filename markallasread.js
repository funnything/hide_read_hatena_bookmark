function getNodes(xpath, root) {
  var nodes = [];
  let iter = document.evaluate(xpath, root || document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var node;
  while (node = iter.iterateNext()) {
    nodes.push(node);
  }
  return nodes;
}

function getNode(xpath, root) {
  return document.evaluate(xpath, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

function hatenaBookmark() {
  var nodes = {};

  let arr = getNodes("//section[@class='entrylist-unit']//div[@class='entrylist-header']").concat(getNodes("//section[@class='entrylist-unit']//ul[contains(@class,'entrylist-item')]/li"));
  arr.forEach(function(node) {
    let title = getNode(".//h3[@class='entrylist-contents-title']", node);
    let url = getNode(".//a", title).getAttribute('href');
    nodes[url] = node;
  });

  return nodes;
}

// TODO: 毎回違うパラメーターが付いてくる。URL を正規化して判定＆表示中の項目の URL を置換する
function amazon() {
  var nodes = {};

  let arr = getNodes("//li[@class='zg-item-immersion']")
  arr.forEach(function(node) {
    // NOTE: naive method (use first anchor)
    let rel = getNodes(".//a", node)[0].getAttribute('href');
    let url = new URL(rel, location.href).href;
    nodes[url] = node;
  });

  return nodes;
}

function parseNodes() {
  var url = location.href;
  if (url.startsWith('https://b.hatena.ne.jp/hotentry/')) {
    return hatenaBookmark();
  } else if (url.startsWith('https://www.amazon.co.jp/gp/')) {
    return amazon();
  } else {
    throw new Error('Uknown url: ' + url);
  }
}

function hideReadItems() {
  console.log('will hideReadItems');
  var nodes = parseNodes();

  chrome.runtime.sendMessage({
    getVisits: true,
    urls: Object.keys(nodes)
  }, null, function(response) {
    Object.keys(response).forEach(function(url) {
      if (!response[url]) {
        let node = nodes[url];
        node.parentNode.removeChild(node);
      }
    });
    console.log('callback hideReadItems');
  });
  console.log('did hideReadItems');
}

function markItemsAsRead() {
  console.log('will markItemsAsRead');
  var nodes = parseNodes();

  chrome.runtime.sendMessage({
    markAsRead: true,
    urls: Object.keys(nodes)
  });
  console.log('did markItemsAsRead');
}

function hideRead() {
  console.log('will hideRead');
  var nodes = hatenaBookmark();

  chrome.runtime.sendMessage({
    getVisits: true,
    urls: Object.keys(nodes)
  }, null, function(response) {
    Object.keys(response).forEach(function(url) {
      if (!response[url]) {
        let node = nodes[url];
        node.parentNode.removeChild(node);
      }
    });
  });
  console.log('did hideRead');
}
