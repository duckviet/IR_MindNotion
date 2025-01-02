"use client";
import Card from "@/components/Card";
import MasonryGrid from "@/components/MasonryGrid";
import SearchField from "@/components/SearchField";
import { Textarea } from "@/components/ui/textarea";
import usePinecone from "@/hook/usePinecone";
import { useState } from "react";

export default function Home() {
  const {
    namespace,
    queryResults,
    error,
    queryIndex,
    isLoading,
    handleDelete,
  } = usePinecone("cs336", 1024); // Initialize with namespace and dimensions
  // console.log(queryResults);
  const [query, setQuery] = useState<string>("");
  const [topK, setTopK] = useState(6);

  const handleQueryIndex = () => {
    queryIndex({ vector: query, top_k: topK, namespace });
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      {/* Index Name Input */}
      <SearchField
        query={query}
        setQuery={setQuery}
        onEnter={handleQueryIndex}
      />

      {/* Query Results */}
      {isLoading && <>Loading</>}
      {queryResults && queryResults.result && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-4">Query Results:</h3>

          <MasonryGrid
            data={queryResults}
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
        </div>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </div>
  );
}
