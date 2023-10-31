import axios from 'axios'

export function getStudyOrdersByEncounter(encounterId: string, patientId: string) {
  const url = `/profile/doctor/patient/${patientId}/encounter/${encounterId}/studyOrders`
  return axios.get<Boldo.OrderStudy[]>(url)
}
