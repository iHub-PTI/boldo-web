import axios from 'axios'

/**
 *
 * @param id APPOINTMENT ID
 * @returns AppointmentWithPatient
 */
export function getAppointment(id: string) {
  const url = `/profile/doctor/appointments/${id}`
  return axios.get<Boldo.AppointmentWithPatient>(url)
}

/**
 *
 * @param id APPOINTMENT ID
 * @returns Encounter
 */
export function getEncounter(id: string) {
  const url = `/profile/doctor/appointments/${id}/encounter`
  return axios.get<Boldo.Encounter>(url)
}
