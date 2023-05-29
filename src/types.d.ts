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

// organization for study update
export interface OrganizationInOrderStudy {
  active: boolean,
  id: string,
  name: string,
  type: string,
  typeList: string[]
}

export interface Encounter {
  appointmentId?:   string;
  diagnosis?:       string;
  doctorId?:        string;
  encounterClass?:  string;
  id?:              string;
  instructions?:    string;
  mainReason?:      string;
  patientId?:       string;
  prescriptions?:   Prescription[];
  serviceRequests?: ServiceRequest[];
  soep?:            Soep;
  startTimeDate?:   string;
  status?:          string;
  updatedDiagnosis: boolean;
}

export interface Prescription {
  authoredOn?:     string;
  doctorId?:       string;
  encounterId?:    string;
  id?:             string;
  instructions?:   string;
  medicationId?:   string;
  medicationName?: string;
  patientId?:      string;
  status?:         string;
}

export interface ServiceRequest {
  authoredDate?:          string;
  category?:              string;
  description?:           string;
  diagnosis?:             string;
  diagnosticReportCount?: number;
  encounterId?:           string;
  id?:                    string;
  identifier?:            string;
  notes?:                 string;
  urgent?:                boolean;
}

export interface Soep {
  evaluation?: string;
  objective?:  string;
  plan?:       string;
  subjective?: string;
}

export interface OrderStudy {
  authoredDate?: string
  category?: string
  diagnosis?: string
  diagnosticReports?: DiagnosticReport[]
  doctor: iHub.Doctor
  encounterId?: string
  id?: string
  identifier?: string
  orderNumber?: string
  organization?: OrganizationInOrderStudy
  studiesCodes?: StudiesCode[]
  urgent?: boolean
  notes?: string
}

export interface DiagnosticReport {
  attachmentNumber?: string
  attachmentUrls?: AttachmentUrl[]
  category?: string
  description?: string
  effectiveDate?: string
  id?: string
  patientId?: string
  source?: string
  sourceID?: string
  sourceType?: string
}

export interface AttachmentUrl {
  contentType?: string
  title?: string
  url?: string
}

export interface StudiesCode {
  display: string
}
