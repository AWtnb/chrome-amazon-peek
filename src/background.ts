'use strict';

const isTargetPage = (url: string): boolean => {
  const targets = ['https://www.amazon.co.jp/s', 'https://www.amazon.com/s'];
  return targets.some((t) => url.startsWith(t));
};

const requestToContentScript = (payload: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab.id) {
      return;
    }
    chrome.tabs.sendMessage(
      tab.id,
      {
        payload: payload,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("something wrong happened: ", chrome.runtime.lastError.message);
        }
      }
    );
  });
};

chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) => {
    if (tab.url && isTargetPage(tab.url)) {
      requestToContentScript('call-content-script');
    }
  });
});

chrome.tabs.onUpdated.addListener(
  (_: number, change: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (!tab.active || !change.url || !tab.url) {
      return;
    }
    if (isTargetPage(tab.url)) {
      requestToContentScript('call-content-script');
    }
  }
);
