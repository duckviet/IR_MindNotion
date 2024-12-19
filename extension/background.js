chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu for right-click
  chrome.contextMenus.create({
    id: "saveWebArticle", // Unique ID for the menu item
    title: "Save this page or link", // Text shown in the right-click menu
    contexts: ["page", "link"], // Allow on pages or links
  });

  console.log("Context menu created: Save Web Article");
});

// Handle right-click menu click events
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let urlToSave;

  if (info.menuItemId === "saveWebArticle") {
    // If it's a link, use the link URL, otherwise use the page URL
    urlToSave = info.linkUrl || tab.url;

    try {
      const response = await fetch(
        "http://localhost:8000/index/add_web_article",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToSave }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log(`Success: ${data.message}`);
      alert(`Article saved successfully: ${data.message}`);
    } catch (err) {
      console.error(`Error saving the URL: ${err.message}`);
      alert(`Error saving the article: ${err.message}`);
    }
  }
});
// Create the right-click menu for selected text
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveHighlightedText",
    title: "Save Highlighted Text",
    contexts: ["selection"], // Only show when text is selected
  });
  console.log("Context menu for highlighted text created.");
});

// Handle the right-click menu click event
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveHighlightedText") {
    const selectedText = info.selectionText;

    if (selectedText) {
      try {
        // Send the selected text to your backend
        const response = await fetch(
          "http://localhost:8000/index/add_web_article",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText }),
          }
        );

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        console.log(`Success: ${data.message}`);
        alert(`Text saved successfully: ${data.message}`);
      } catch (err) {
        console.error(`Error saving the text: ${err.message}`);
        alert(`Error saving the text: ${err.message}`);
      }
    } else {
      alert("No text selected to save.");
    }
  }
});
