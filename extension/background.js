// Consolidate the Chrome extension logic
const BACKEND_URL = "http://localhost:8000/index";

// Function to handle saving a URL to the backend
async function addWebArticle(data) {
  try {
    const response = await fetch(`${BACKEND_URL}/add_web_article`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(await response.text());

    const result = await response.json();
    console.log(`Success: ${result.message}`);
    alert(`Saved successfully: ${result.message}`);
  } catch (err) {
    console.error(`Error saving data: ${err.message}`);
    alert(`Error: ${err.message}`);
  }
}
async function addNote(data) {
  try {
    const response = await fetch(`${BACKEND_URL}/add_note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(await response.text());

    const result = await response.json();
    console.log(`Success: ${result.message}`);
    alert(`Saved successfully: ${result.message}`);
  } catch (err) {
    console.error(`Error saving data: ${err.message}`);
    alert(`Error: ${err.message}`);
  }
}

// Add context menu items on installation
chrome.runtime.onInstalled.addListener(() => {
  // Menu for saving page or link
  chrome.contextMenus.create({
    id: "saveWebArticle",
    title: "Save this page or link",
    contexts: ["page", "link"],
  });

  // Menu for saving highlighted text
  chrome.contextMenus.create({
    id: "saveHighlightedText",
    title: "Save Highlighted Text",
    contexts: ["selection"],
  });

  console.log("Context menus created.");
});

// Handle context menu actions
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveWebArticle") {
    const urlToSave = info.linkUrl || tab.url;
    if (urlToSave) {
      await addWebArticle({ url: urlToSave });
    } else {
      alert("No URL to save.");
    }
  } else if (info.menuItemId === "saveHighlightedText") {
    const selectedText = info.selectionText;
    if (selectedText) {
      await addWebArticle({ text: selectedText });
    } else {
      alert("No text selected to save.");
    }
  }
});

// Add functionality for shortcut buttons in popup.js
const savePageButton = document.getElementById("savePage");
const saveSelectionButton = document.getElementById("saveSelection");
const messageDiv = document.getElementById("message");

// Function to show messages in the popup
function showMessage(message, isError = false) {
  messageDiv.textContent = message;
  messageDiv.style.color = isError ? "red" : "green";
}

// Add event listeners for buttons
if (savePageButton) {
  savePageButton.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.url) {
        await addWebArticle({ url: tab.url });
        showMessage("Page saved successfully!");
      } else {
        showMessage("No URL to save.", true);
      }
    } catch (err) {
      showMessage(`Error: ${err.message}`, true);
    }
  });
}

if (saveSelectionButton) {
  saveSelectionButton.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const [selectedText] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString(),
      });

      if (selectedText.result) {
        await addNote({
          title: `${selectedText.result.slice(0, 25)}...`,
          content: selectedText.result,
        });
        showMessage("Selection saved successfully!");
      } else {
        showMessage("No text selected to save.", true);
      }
    } catch (err) {
      showMessage(`Error: ${err.message}`, true);
    }
  });
}
