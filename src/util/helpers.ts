import axios from 'axios'
import * as Sentry from '@sentry/react'

export const validateDate = (dateInput: string, pastOrFuture?: 'past' | 'future') => {
  try {
    const date = new Date(dateInput)
    const isoString = date.toISOString().split('T')[0]
    if (pastOrFuture === 'past' && new Date() < date) return false // Please enter a Date in the past
    if (pastOrFuture === 'future' && new Date() > date) return false // Please enter a Date in the future
    return isoString === dateInput
  } catch (err) {
    return false
  }
}

export const validateTime = (timeInput: string) => {
  const match = timeInput.match(/((\d{2}):(\d{2}))/)

  if (match?.[0] !== timeInput || isNaN(+match?.[2]) || isNaN(+match?.[3]) || +match?.[2] > 23 || +match?.[3] > 59)
    return false
  else return true
}

export const avatarPlaceholder = (profession: string, gender?: string) => {
  let genderShort = gender === 'male' ? 'm' : 'f'
  return `/img/${profession}-${genderShort}.svg`
}

export async function getReports(appointmentId) {
  const url = `/profile/doctor/appointments/${appointmentId}/encounter/reports`;

  axios
    .get(url, {
      params: {
        reports: 'prescriptions',
      },
      responseType: 'blob',
    })
    .then(function (res) {
      console.log('res: ', res);
      const filename = 'prescription';
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(function (err) {
      console.log(err);
      Sentry.setTag('appointment_id', appointmentId);
      Sentry.setTag('endpoint', url);
      if (err.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        Sentry.setTag('data', err.response.data);
        Sentry.setTag('headers', err.response.headers);
        Sentry.setTag('status_code', err.response.status);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        Sentry.setTag('request', err.request);
        console.log(err.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        Sentry.setTag('message', err.message);
        console.log('Error', err.message);
      }
      Sentry.captureException(err);
    })
}
