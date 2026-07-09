// Background service worker for Assix Companion Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log("Assix Browser Auto Companion Extension Installed.");
  chrome.storage.local.set({ status: "ready", sessionCount: 0 });
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  if (message.type === "GET_STATUS") {
    chrome.storage.local.get(["status", "sessionCount"], (data) => {
      sendResponse({ status: data.status || "ready", sessionCount: data.sessionCount || 0 });
    });
    return true; // async response
  }

  if (message.type === "START_AUTOMATION") {
    chrome.storage.local.set({ status: "running" }, () => {
      chrome.storage.local.get("sessionCount", (data) => {
        const count = (data.sessionCount || 0) + 1;
        chrome.storage.local.set({ sessionCount: count });
      });
      sendResponse({ success: true, status: "running" });
    });
    return true;
  }

  if (message.type === "STOP_AUTOMATION") {
    chrome.storage.local.set({ status: "ready" }, () => {
      sendResponse({ success: true, status: "ready" });
    });
    return true;
  }
});
