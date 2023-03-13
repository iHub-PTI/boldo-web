import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

export function useAxiosFetch<T>(url: string, params: {}) {

  const [data, setData] = useState<T>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError>(null);

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

export function useAxiosPost(url: string) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const sendData = <T>(body: {}, sendDataSuccess?: (value) => void) => {
    setLoading(true)
    axios.post(url, body)
      .then((res) => {
        console.log(res.data)
        sendDataSuccess(res.data)
      }
      )
      .catch((error) => {
        setError(error)
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, sendData };
}

export function useAxiosDelete(url: string) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const deleteData = <T>(id:string, deleteSuccessData?: (value) => void) => {
    setLoading(true)
    axios.delete(url + "/" + id)
      .then((res) => {
        console.log(res.data)
        deleteSuccessData(res.data)
      }
      )
      .catch((error) => {
        setError(error)
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, deleteData };
}