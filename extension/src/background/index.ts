console.log('LinkedIn Profile Insights: Background service worker started.');

// Setup listeners or auth implementation here
// Keep the service worker active by adding a listener
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "AUTH_SUCCESS") {
        console.log("Auth success received in background:", message.user);
        // Ideally, store the token or perform other background tasks
        sendResponse({ status: "success" });
    }
    // Return true if you want to sendResponse asynchronously
});
