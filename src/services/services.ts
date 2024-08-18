import axios from 'axios'

export function getStudyOrdersByEncounter(encounterId: string, patientId: string) {
  //const url = `/profile/doctor/patient/${patientId}/encounter/${encounterId}/studyOrders`

  const url = `https://dev-web.boldo.pti.org.py/mcs.boldo.encounters/studies/orders?encounter_id=${encounterId}`

  return axios.get<Boldo.OrderStudy[]>(url)
}

interface ReasonPatient {
  id: number
  patientId: string
  encounterId: string
  reporterUsername: string
  commentReason: string
  creationDateTime: string
  notificationEmailSent: boolean
}


export function sendReportPatiend(patientId:string, encounterId:string, commentReason:string) {
  const url = `/profile/doctor/patient/${patientId}/report`
  return axios.post<ReasonPatient>(url,{
    patientId,
    encounterId,
    commentReason
  })
}
