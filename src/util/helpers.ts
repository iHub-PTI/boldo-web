import { makeStyles } from "@material-ui/core"
import axios from "axios"

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
  try {
    const res = await axios.get(`https://boldo-dev.pti.org.py/api/profile/doctor/appointments/${appointmentId}/encounter/reports`, {
      params: { 
        'reports': 'prescriptions',
      },
      responseType: 'blob'
    });
    console.log("res: ", res);
    console.log("data: ", res.data);
    console.log("name: ", res.headers['content-disposition']);
    const filename = 'prueba';
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${filename}-${+new Date()}.pdf`;
    link.click();
  } catch(err) {
    console.log(err);
  }
}