import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import * as Sentry from '@sentry/react'
import { useToasts } from "../components/Toast"

/**
 * 
 * @param url - The URL to fetch the data list from.
 * @param params 
 * @param dependencies - boolean dependency, that only if it is true the request will be made
 * @returns 
 */
export function useAxiosFetch<T>(url: string, params: {}, dependency: boolean) {
  const { addToast } = useToasts()
  const [data, setData] = useState<T>(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const load = () => {
    setLoading(true)
    setError(null)
    axios.get(url, {
      params: params,
    })
      .then((res) => {
        setData(res.data)
        //reset
        setError(null)
      })
      .catch((error) => {
        setError(error)
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          ...params
        })
        if (error.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTags({
            'data': error.response.data,
            'headers': error.response.headers,
            'status_code': error.response.status
          })
        } else if (error.request) {
          // The request was made but no response was received
          Sentry.setTag('request', error.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', error.message)
        }
        Sentry.captureException(error)
        if (error.response?.status === 500) {
          addToast({ type: 'error', title: 'Lo siento, hubo un error interno del servidor al procesar su solicitud', text: error.message })
        } else {
          addToast({ type: 'error', title: 'Lo siento, ocurrió un error inesperado', text: error.message })
        }
      })
      .finally(() => setLoading(false));
  }

  // to load the first time or to reload the data
  const reload = () => {
    setError(null)
    setLoading(true)
    load()
  }

  useEffect(() => {
    if(dependency)
      load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency]);

  return { data, loading, error, reload };
}

export function useAxiosPost(url: string) {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const sendData = <T>(body: {}, sendDataSuccess?: (value) => void) => {
    setError(null)
    setLoading(true)
    axios.post(url, body)
      .then((res) => {
        if (sendDataSuccess) sendDataSuccess(res.data)
      }
      )
      .catch((error) => {
        setError(error)
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          ...body
        })
        if (error.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTags({
            'data': error.response.data,
            'headers': error.response.headers,
            'status_code': error.response.status
          })
        } else if (error.request) {
          // The request was made but no response was received
          Sentry.setTag('request', error.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', error.message)
        }
        Sentry.captureException(error)

        if (error.response?.status === 500) {
          addToast({ type: 'error', title: 'Lo sentimos, hubo un error interno del servidor al procesar su solicitud', text: error.message })
        } else {
          addToast({ type: 'error', title: 'Lo sentimos, ocurrió un inesperado', text: error.message })
        }
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, sendData };
}

export function useAxiosDelete(url: string) {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const deleteData = <T>(id: string, deleteSuccessData?: (value) => void) => {
    setError(null)
    setLoading(true)
    axios.delete(url + "/" + id)
      .then((res) => {
        if (deleteSuccessData) deleteSuccessData(res.data)
      }
      )
      .catch((error) => {
        setError(error)
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          'id_object_to_delete': id
        })
        if (error.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTags({
            'data': error.response.data,
            'headers': error.response.headers,
            'status_code': error.response.status
          })
        } else if (error.request) {
          // The request was made but no response was received
          Sentry.setTag('request', error.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', error.message)
        }
        Sentry.captureException(error)

        if (error.response?.status === 500) {
          addToast({ type: 'error', title: 'Lo siento, hubo un error interno del servidor al procesar su solicitud', text: error.message })
        } else {
          addToast({ type: 'error', title: 'Lo siento, ocurrió un inesperado', text: error.message })
        }
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, deleteData };
}

export function useAxiosPut(url: string) {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateData = <T>(id: string, data?: {}, successCallback?: (value: T) => void) => {
    setError(null)
    setLoading(true);
    axios
      .put(`${url}/${id}`, data)
      .then((res) => {
        if (successCallback) successCallback(res.data);
      })
      .catch((error) => {
        setError(error);
        Sentry.setTags({
          endpoint: url,
          method: 'PUT',
          id_object_to_update: id,
        });
        if (error.response) {
          Sentry.setTags({
            data: error.response.data,
            headers: error.response.headers,
            status_code: error.response.status,
          });
        } else if (error.request) {
          Sentry.setTag('request', error.request);
        } else {
          Sentry.setTag('message', error.message);
        }
        Sentry.captureException(error);

        if (error.response?.status === 500) {
          addToast({ type: 'error', title: 'Lo siento, hubo un error interno del servidor al procesar su solicitud', text: error.message });
        } else {
          addToast({ type: 'error', title: 'Lo siento, ocurrió un error inesperado', text: error.message });
        }
      })
      .finally(() => setLoading(false));
  };

  return { loading, error, updateData };
}