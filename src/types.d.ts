// Type definitions for Boldo
// Project: https://boldo.com.py/
// Definitions by: Björn Schmidtke <https://github.com/pa1nd>
// TypeScript Version: 3.9

export as namespace Boldo

export interface Doctor extends iHub.Doctor {
  blocks: Array<Block>
  new: boolean
}

type Interval = { start: number; end: number,appointmentType:string }

interface Block {
  openHours: OpenHours,
  idOrganization: string
}

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

//Boldo Multi-Organizations
export interface Organization {
  active: boolean,
  id: string,
  name: string,
  type: string,
  colorCode: string
}

export interface ServiceRequest {
  authoredDate?:      string;
  category?:          string;
  diagnosis?:         string;
  diagnosticReports?: any[];
  encounterId?:       string;
  id?:                string;
  identifier?:        string;
  studiesCodes?:      StudiesCode[];
  urgent?:            boolean;
}

export interface StudiesCode {
  display?: string;
}
