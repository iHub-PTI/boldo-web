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
 * @param patientId
 * @param encounterId
 * @returns Encounter
 */
export function getEncounterById(encounterId: string, patientId: string) {
  const url = `/profile/doctor/patient/${patientId}/encounters/${encounterId}`
  return axios.get<Boldo.Encounter & { startTimeDate: string }>(url)
}

export function getStudyOrdersByEncounter(encounterId: string, patientId: string) {
  const url = `/profile/doctor/patient/${patientId}/encounter/${encounterId}/studyOrders`
  return axios.get<Boldo.OrderStudy[]>(url)
}
