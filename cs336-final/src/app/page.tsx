"use client";
import Card from "@/components/Card";
import { useEffect, useState } from "react";

export default function Home() {
  const [indexName, setIndexName] = useState("cs336");
  const [query, setQuery] = useState<string>("");
  const [topK, setTopK] = useState(3);
  const [connectMessage, setConnectMessage] = useState("");
  const [queryResults, setQueryResults] = useState<any>(null);
  const [error, setError] = useState("");
  const [webArticleUrl, setWebArticleUrl] = useState(""); // URL input for adding article

  const connectToIndex = async () => {
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8000/index/connect?index_name=${indexName}`
      );
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setConnectMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const queryIndex = async () => {
    setError("");
    try {
      const response = await fetch(`http://localhost:8000/index/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vector: query,
          top_k: topK,
          namespace: indexName,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setQueryResults(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addWebArticle = async () => {
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8000/index/add_web_article`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: webArticleUrl }),
        }
      );
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      alert(`Article added successfully: ${data.message}`);
      setWebArticleUrl(""); // Clear the input field after successful add
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    console.log(queryResults);
  }, [queryResults]);

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Pinecone Vector Search API
      </h1>

      {/* URL Input */}

      {/* Index Name Input */}
      <div className="my-10">
        <input
          type="text"
          placeholder="Enter Index Name"
          value={indexName}
          onChange={(e) => setIndexName(e.target.value)}
          className="w-full h-[50px] bg-transparent px-3 text-xl focus:outline-none border-b-2 border-gray-200 relative py-2
             before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-gray-400 before:transition-all before:duration-500 focus:before:w-full"
        />
      </div>

      {/* Connect to Index */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Connect to Index
        </h2>
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="text"
            placeholder="Enter Index Name"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={connectToIndex}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Connect
          </button>
        </div>
        {connectMessage && (
          <p className="text-green-600 mt-4">{connectMessage}</p>
        )}
      </div>

      {/* Add Web Article */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Add Web Article</h2>
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="text"
            placeholder="Enter Article URL"
            value={webArticleUrl}
            onChange={(e) => setWebArticleUrl(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addWebArticle}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Article
          </button>
        </div>
      </div>

      {/* Query Index */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Query Index</h2>
        <textarea
          placeholder="Enter Query Vector (comma-separated)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          rows={3}
        ></textarea>
        <div className="flex items-center space-x-4 mt-4">
          <label className="text-gray-600">Top K:</label>
          <input
            type="number"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value, 10))}
            className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={queryIndex}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Query
          </button>
        </div>
      </div>

      {queryResults && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-4">Query Results:</h3>
          <div className="grid gap-4 grid-cols-4">
            {queryResults.result.map((result: any, index: number) => (
              <div key={index} className="col-span-1 flex flex-col gap-4">
                <p className="text-xl font-medium p-1 rounded-xl text-center ">
                  {result.embed}
                </p>
                <div className="h-[1px] w-full bg-gray-400 px-4"></div>

                {result.matches.map((result: any, idx: number) => (
                  <Card index={idx} match={result} key={idx} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </div>
  );
}
