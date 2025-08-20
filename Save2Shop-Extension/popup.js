(() => {
  const STORAGE_KEY = "shoppingItems";
  const LAST_CATEGORY_KEY = "lastCategory";

  // Grab DOM elements
  const categorySelect = document.getElementById("category");
  const saveBtn = document.getElementById("saveBtn");
  const clearBtn = document.getElementById("clearBtn");
  const itemsEl = document.getElementById("items");
  const statusEl = document.getElementById("status");
  const itemTemplate = document.getElementById("itemTemplate");
  const previewText = document.getElementById("previewText");
  const itemCount = document.getElementById("itemCount");

  /** 
   * Truncate a string to maxLength characters
   * and append "…" if it was cut.
   */
  function truncate(str, maxLength = 50) {
    return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
  }

  /** Get all items from storage */
  async function getItems() {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    return Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
  }

  /** Save all items back to storage */
  async function setItems(items) {
    await chrome.storage.local.set({ [STORAGE_KEY]: items });
  }

  /** Last category helpers */
  async function getLastCategory() {
    const data = await chrome.storage.local.get(LAST_CATEGORY_KEY);
    return data[LAST_CATEGORY_KEY] || "";
  }
  async function setLastCategory(value) {
    await chrome.storage.local.set({ [LAST_CATEGORY_KEY]: value });
  }

  /**
   * Render items grouped by category into separate lists.
   * Structure:
   * <div class="category-group">
   *   <div class="category-title">Category</div>
   *   <ul class="category-list"> ...items... </ul>
   * </div>
   */
  function render(items) {
    itemsEl.innerHTML = "";
    
    // Update item count
    updateItemCount(items.length);

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "🛒 No items saved yet. Start shopping!";
      itemsEl.appendChild(empty);
      return;
    }

    // Group by category
    const groups = items.reduce((acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    }, {});

    // Sort categories alphabetically for consistent UI
    const categories = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    for (const cat of categories) {
      const wrapper = document.createElement("div");
      wrapper.className = "category-group";

      const title = document.createElement("div");
      title.className = "category-title";
      const emoji = getCategoryEmoji(cat);
      title.textContent = `${emoji} ${cat} (${groups[cat].length})`;

      const list = document.createElement("ul");
      list.className = "category-list";

      for (const item of groups[cat]) {
        const li = itemTemplate.content.firstElementChild.cloneNode(true);
        const badge = li.querySelector(".badge");
        badge.textContent = getCategoryEmoji(item.category);
        const link = li.querySelector(".link");
        link.href = item.url;
        link.textContent = truncate(item.title || item.url);

        // Delete handler per item
        const deleteBtn = li.querySelector(".delete");
        deleteBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Add confirmation for delete
          if (!confirm(`Remove "${truncate(item.title, 30)}" from ${item.category}?`)) {
            return;
          }
          
          try {
            const current = await getItems();
            const updated = current.filter(i => i.id !== item.id);
            await setItems(updated);
            render(updated);
            speak("✅ Removed");
          } catch (error) {
            speak("❌ Delete failed");
            console.error("Delete error:", error);
          }
        });

        list.appendChild(li);
      }

      wrapper.appendChild(title);
      wrapper.appendChild(list);
      itemsEl.appendChild(wrapper);
    }
  }

  /** Show a temporary status message */
  function speak(msg) {
    statusEl.textContent = msg;
    setTimeout(() => (statusEl.textContent = ""), 1500);
  }

  /** Save current tab info into storage */
  async function saveCurrentTab() {
    const category = categorySelect.value;
    if (!category) {
      speak("⚠️ Please select a category first.");
      categorySelect.focus();
      return;
    }

    // Show loading state
    saveBtn.disabled = true;
    const btnText = saveBtn.querySelector('.btn-text');
    btnText.textContent = "Saving...";

    try {
      // Persist selection for next time
      await setLastCategory(category);

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);
      if (!tab || !tab.url) {
        speak("No valid tab found.");
        return;
      }

      const url = tab.url;
      const title = truncate(tab.title || url);

      const items = await getItems();

      // Prevent duplicates (same url + category)
      if (items.some(i => i.url === url && i.category === category)) {
        speak("Already saved.");
        return;
      }

      const newItem = {
        id: Date.now(),
        url,
        title,
        category,
        dateAdded: new Date().toISOString()
      };

      const updated = [newItem, ...items];
      await setItems(updated);
      render(updated);
      speak("✅ Saved!");

      // Refresh preview after saving
      await showPreview();
    } catch (error) {
      speak("❌ Save failed");
      console.error("Save error:", error);
    } finally {
      // Reset button state
      saveBtn.disabled = !categorySelect.value;
      const btnText = saveBtn.querySelector('.btn-text');
      btnText.textContent = "Save Item";
    }
  }

  /** Clear all items */
  async function clearAll() {
    const items = await getItems();
    if (!items.length) return;
    if (confirm("Remove all saved items?")) {
      await setItems([]);
      render([]);
      speak("Cleared.");
    }
  }

  /** Show preview of current tab's title */
  async function showPreview() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);
      if (tab && tab.title) {
        previewText.textContent = truncate(tab.title, 60);
        previewText.title = tab.title; // Full title on hover
      } else {
        previewText.textContent = "No title available";
        previewText.title = "";
      }
    } catch (error) {
      previewText.textContent = "Unable to load preview";
      console.error("Preview error:", error);
    }
  }

  // Keep UI synced if storage changes in another popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
      render(changes[STORAGE_KEY].newValue || []);
    }
  });

  // Initialize popup
  document.addEventListener("DOMContentLoaded", async () => {
    showPreview();
    render(await getItems());

    // Preselect last used category and reflect enabled state
    const last = await getLastCategory();
    if (last) {
      categorySelect.value = last;
    }
    saveBtn.disabled = !categorySelect.value;

    categorySelect.addEventListener("change", async (e) => {
      const val = e.target.value;
      saveBtn.disabled = !val;
      if (val) await setLastCategory(val);
    });

    // Add debouncing to prevent double-clicks
    let saveTimeout;
    saveBtn.addEventListener("click", () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCurrentTab, 100);
    });
    clearBtn.addEventListener("click", clearAll);
  });

  /** Get emoji for category */
  function getCategoryEmoji(category) {
    const emojis = {
      'Books': '📚',
      'Clothes': '👕',
      'Shoes': '👟',
      'Electronics': '📱',
      'Pets': '🐾',
      'Health': '💊',
      'Home': '🏠',
      'Sports': '⚽',
      'Beauty': '💄',
      'Food': '🍕'
    };
    return emojis[category] || '🛍️';
  }

  /** Update item count display */
  function updateItemCount(count) {
    if (itemCount) {
      itemCount.textContent = count > 0 ? `(${count})` : '';
    }
  }
})();
