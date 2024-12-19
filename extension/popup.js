document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  const message = document.getElementById("message");

  saveButton.addEventListener("click", async () => {
    message.textContent = "Saving...";
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const currentUrl = tab.url;

      // Send the URL to the backend API
      const response = await fetch(
        "http://localhost:8000/index/add_web_article",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentUrl }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      message.textContent = `Success! Article saved: ${data.message}`;
    } catch (err) {
      console.error(err);
      message.textContent = `Error: ${err.message}`;
    }
  });
});
