// Type definitions for Boldo
// Project: https://boldo.com.py/
// Definitions by: Björn Schmidtke <https://github.com/pa1nd>
// TypeScript Version: 3.9

export as namespace Boldo

export interface Doctor extends iHub.Doctor {
  openHours: OpenHours
  new: boolean
}

type Interval = { start: number; end: number,appointmentType:string }

interface OpenHours {
  mon: Interval[]
  tue: Interval[]
  wed: Interval[]
  thu: Interval[]
  fri: Interval[]
  sat: Interval[]
  sun: Interval[]
}

export interface Appointment extends iHub.Appointment {
  name: string
  type: 'PrivateEvent' | 'CustomAppointment' | 'Appointment'
  status: 'upcoming' | 'open' | 'closed' | 'locked' | 'cancelled'
  appointmentType:string
}
