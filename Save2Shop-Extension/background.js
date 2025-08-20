const STORAGE_KEY = "shoppingItems";

// Update the badge with current saved item count
async function updateBadge() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    const items = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
    const count = items.length;
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#2563eb" });
  } catch (e) {
    // Fail silently; badge isn't critical
    chrome.action.setBadgeText({ text: "" });
  }
}

// Listen for storage changes and update badge
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[STORAGE_KEY]) {
    updateBadge();
  }
});

// Initialize when extension loads
chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
