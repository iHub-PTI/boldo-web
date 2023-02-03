import moment from 'moment'
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

export const validateOpenHours = (openHours: Boldo.OpenHours) => {
  try {
    // we need obtain the keys of the object
    let days = Object.keys(openHours)
    // for each key we have an array of intervals
    for (let i = 0; i < days.length; i++) {
      let interval = openHours[days[i]]
      if (interval !== null && interval !== undefined) {
        for (let j = 0; j < interval.length; j++) {
          //console.log("start => ", interval[j].start)
          //console.log("end => ", interval[j].end)
          if( interval[j].start === interval[j].end ) {
            return false
          }
        }
      }
    }
  } catch(err) {
    Sentry.captureMessage('Could not validate open hours')
    Sentry.captureException(err)
    return false
  }
  return true
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

export const toUpperLowerCase = (sentence: string) => {
  const words = sentence.split(' ')

  return words
    .map(word => {
      return word[0].toUpperCase() + word.substring(1).toLowerCase()
    })
    .join(' ')
}

//count the days
export const countDays = (days: string) => {
  const currentDate = moment(new Date())
  const days_diff = currentDate.diff(moment(days), 'days')
  switch (days_diff) {
    case 0:
      return 'Hoy'
    case 1:
      return 'Ayer'
    default:
      return `Hace ${days_diff} días`
  }
}

export async function getReports(appointment, setLoading) {
  const url = `/profile/doctor/appointments/${appointment.id}/encounter/reports`
  setLoading(true)
  axios
    .get(url, {
      params: {
        reports: 'prescriptions',
      },
      responseType: 'blob',
    })
    .then(function (res) {
      console.log('res: ', res)
      const date = new Date(appointment.start)
      const patientName = `${appointment.patient.familyName ?? 'sin nombre'}`
      const appointmentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      const appointmentTime = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}-${date.getMinutes()}`
      const filename = `consulta_${patientName}_${appointmentDate}_${appointmentTime}`
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
      setTimeout(() => {
        // here we free an existing object URL we create previously
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }, 0)
      setLoading(false)
    })
    .catch(function (err) {
      console.log(err)
      Sentry.setTag('appointment_id', appointment.id)
      Sentry.setTag('endpoint', url)
      if (err.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        Sentry.setTag('data', err.response.data)
        Sentry.setTag('headers', err.response.headers)
        Sentry.setTag('status_code', err.response.status)
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        Sentry.setTag('request', err.request)
        console.log(err.request)
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        Sentry.setTag('message', err.message)
        console.log('Error', err.message)
      }
      Sentry.captureException(err)
    })
}

export function organizationsFromMessage(msg: String, organizations: Array<Boldo.Organization>): Array<String> {
  let organizationsMatches = [] as Array<String>
  
  try {
    let organizationsIds = msg.match(/\d+/g)

    organizationsIds && organizationsIds.forEach((id)=>{
      organizationsMatches.push(organizations.find((organization) => organization.id === id).name)
    })
  } catch(err) {
    Sentry.captureMessage('Could not get match from backend message')
    Sentry.captureException(err)
  }

  return organizationsMatches
}

// uncomment if necessary
// this function merges the ids of the organizations separated by commas
// export function joinOrganizations(organizations: Array<Boldo.Organization>): String {
//   let mergedIds = ''
//   let arrayIds = [] as Array<String>

//   // we obtain ["id1", "id2", "id3", ... , "idn"]
//   if(organizations.length > 0) organizations.forEach((organization) => arrayIds.push(organization.id))
//   // we obtain a string like "id1,id2,id3,...,idn"
//   if(arrayIds.length > 0) mergedIds = arrayIds.join(',')
//   return mergedIds
// }

export function changeHours(date: Date, hours: number, operation: 'subtract' | 'add'): String {
  if(operation === 'subtract') {
    date.setHours(date.getHours() - hours)
  } else {
    date.setHours(date.getHours() + hours)
  }
  return date.toISOString()
}