import axios from 'axios'

export function getStudyOrdersByEncounter(encounterId: string, patientId: string) {
  const url = `${process.env.REACT_APP_SERVER_ADDRESS_REINGENIERIA}doctors/encounters/${encounterId}/study/orders`
  return axios.get<Boldo.OrderStudy[]>(url, { withCredentials: false })
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
