function hideRead() {
  const urls = ['https://www.publickey1.jp/blog/19/spotifykubernetes.html', 'https://www.appps.jp/332577/'];
  console.log('urls', urls);

  chrome.runtime.sendMessage({
    urls: urls
  }, null, function(response) {
    console.log('response', response);
  });
}
