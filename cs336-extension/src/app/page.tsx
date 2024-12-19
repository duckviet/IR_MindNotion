"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    console.log(window.location.href);
    setCurrentUrl(window.location.href);
  }, []);

  const addWebArticle = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await fetch(`http://localhost:8000/index/add_web_article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentUrl }),
      });

      setMessage(`Success! Article saved.`);
    } catch (err) {
      setMessage(`Error: Failed to save the article.`);
      console.error("Detailed error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => console.log("Working!")}>Testing</button>
      <button
        style={styles.button(isLoading)}
        onClick={addWebArticle}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Current Page"}
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Reusable styles
const styles = {
  container: {},
  button: (isLoading: boolean) => ({
    padding: "10px 20px",
    backgroundColor: isLoading ? "#6c757d" : "#007BFF",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s, transform 0.2s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    ...(isLoading ? {} : { hover: { backgroundColor: "#0056b3" } }),
  }),
  message: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#333",
    textAlign: "center" as const,
  },
};
