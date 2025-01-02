const noteAction = {
  async postAddWebArticle(url: string) {
    try {
      const response = await fetch(
        `http://localhost:8000/index/add_web_article`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return data;
      //   setConnectMessage(data.message);
    } catch (err: any) {
      //   setError(err.message);
      console.log(err);
    }
  },
  async postAddNote(title: string, content: string) {
    try {
      const response = await fetch(`http://localhost:8000/index/add_note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return data;
      //   setConnectMessage(data.message);
    } catch (err: any) {
      //   setError(err.message);
      console.log(err);
    }
  },
};

export default noteAction;
