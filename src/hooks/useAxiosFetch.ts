import axios from "axios";
import { useState, useEffect } from "react";

export function useAxiosFetch(url: string, params: {}) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(url, {
      params: params,
    })
      .then((res) => setData(res.data))
      .catch((error) => {
        setError(error)
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}