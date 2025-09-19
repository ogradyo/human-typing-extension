// Background script for Human Typing Simulator
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      enabled: true,
      typingSpeed: { min: 50, max: 150 },
      errorRate: 0.05,
      correctionDelay: { min: 200, max: 800 }
    });
    
    console.log('Human Typing Simulator installed successfully');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically due to the manifest configuration
  console.log('Extension icon clicked');
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    // Forward settings request to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
          sendResponse(response);
        });
      }
    });
    return true; // Keep message channel open for async response
  }
});

// Handle tab updates to ensure content script is injected
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the tab is a web page (not chrome:// or extension pages)
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
      // Content script will be automatically injected due to manifest configuration
      console.log('Page loaded, content script ready');
    }
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Human Typing Simulator started');
});
