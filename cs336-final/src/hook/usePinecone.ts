import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ListRecordsParams {
  dimensions: number;
  namespace: string;
}

interface QueryIndexParams {
  vector: string;
  top_k: number;
  namespace: string;
}

const usePinecone = (initialNamespace: string, initialDimensions: number) => {
  const [namespace, setNamespace] = useState(initialNamespace);
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const listRecords = async ({ dimensions, namespace }: ListRecordsParams) => {
    setIsLoading(true);
    return toast.promise(
      fetch(`http://localhost:8000/index/list-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dimensions, namespace }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          setQueryResults(data);
          setIsLoading(false);
        })
        .catch((err: any) => {
          setError(err.message);
          setIsLoading(false);
          throw err;
        }),
      {}
    );
  };

  const queryIndex = async ({ vector, top_k, namespace }: QueryIndexParams) => {
    setIsLoading(true);
    top_k = vector === "" ? 100 : top_k;
    return toast.promise(
      fetch(`http://localhost:8000/index/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vector, top_k, namespace }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          setQueryResults(data);
          setIsLoading(false);
        })
        .catch((err: any) => {
          setError(err.message);
          setIsLoading(false);
          throw err;
        }),
      {
        pending: "Querying index...",
        success: "Index queried successfully!",
        error: "Failed to query index.",
      }
    );
  };
  const handleDelete = async (id: string) => {
    return toast.promise(
      fetch(`http://localhost:8000/index/delete_record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, namespace }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then(() => {
          setQueryResults((prevResults: any) => ({
            ...prevResults,
            result: prevResults.result.filter(
              (record: any) => record.id !== id
            ),
          }));
        })
        .catch((err: any) => {
          setError(err.message);
          throw err;
        }),
      {
        pending: "Deleting record...",
        success: "Record deleted successfully!",
        error: "Failed to delete record.",
      }
    );
  };
  // Automatically fetch list of records when the hook is used
  useEffect(() => {
    listRecords({ dimensions, namespace });
  }, [dimensions, namespace]);

  return {
    namespace,
    setNamespace,
    dimensions,
    setDimensions,
    queryResults,
    error,
    listRecords,
    queryIndex,
    isLoading,
    handleDelete,
  };
};

export default usePinecone;
