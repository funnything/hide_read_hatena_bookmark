function getNodes(xpath) {
  var nodes = [];
  let iter = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var node;
  while (node = iter.iterateNext()) {
    nodes.push(node);
  }
  return nodes;
}

function getNode(xpath, root) {
  return document.evaluate(xpath, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

function hideRead() {
  console.log('will hideRead');
  var nodes = {};

  let arr = getNodes("//section[@class='entrylist-unit']//div[@class='entrylist-header']").concat(getNodes("//section[@class='entrylist-unit']//ul[contains(@class,'entrylist-item')]/li"));
  arr.forEach(function(node) {
    let title = getNode(".//h3[@class='entrylist-contents-title']", node);
    let url = getNode(".//a", title).getAttribute('href');
    console.log(getNode(".//a", title).getAttribute('title'), url);
    nodes[url] = node;
  });

  chrome.runtime.sendMessage({
    urls: Object.keys(nodes)
  }, null, function(response) {
    console.log(response);
    Object.keys(response).forEach(function(url) {
      if (!response[url]) {
        let node = nodes[url];
        node.parentNode.removeChild(node);
      }
    });
  });
  console.log('did hideRead');
}
