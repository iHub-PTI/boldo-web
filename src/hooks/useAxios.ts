import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import * as Sentry from '@sentry/react'
import { useToasts } from "../components/Toast"

export function useAxiosFetch<T>(url: string, params: {}) {
  const { addToast } = useToasts()
  const [data, setData] = useState<T>(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  // to load the first time or to reload the data
  const reload = () => {
    setLoading(true)
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

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, reload };
}

export function useAxiosPost(url: string) {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState<AxiosError>(null);

  const sendData = <T>(body: {}, sendDataSuccess?: (value) => void) => {
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