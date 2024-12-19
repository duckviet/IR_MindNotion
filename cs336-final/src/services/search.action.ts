const searchAction = {
  async connectToIndex(name: string) {
    try {
      const response = await fetch(
        `http://localhost:8000/index/connect?index_name=${name}`
      );
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      //   setConnectMessage(data.message);
    } catch (err: any) {
      //   setError(err.message);
      console.log(err);
    }
  },
  async queryIndex(query: string, top_k: string, name: string) {
    try {
      // const vector = query.split(",").map((v) => parseFloat(v.trim()));
      const response = await fetch(`http://localhost:8000/index/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vector: query,
          top_k: top_k,
          namespace: name,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      //   setQueryResults(data);
    } catch (err: any) {
      //   setError(err.message);
    }
  },
};

export default searchAction;
