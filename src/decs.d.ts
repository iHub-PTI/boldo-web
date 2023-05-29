// Type definitions for iHub
// Project: https://ihub.com.py/
// Definitions by: Björn Schmidtke <https://github.com/pa1nd>
// TypeScript Version: 3.9

export as namespace iHub

export interface Doctor {
  id: string
  photoUrl?: string
  givenName: string
  familyName: string
  birthDate: string
  gender: string
  email: string

  languages: string[]
  biography?: string
  phone?: string
  street?: string
  city?: string
  neighborhood?: string
  addressDescription?: string
  specializations: Specialization[]
  license?: string // not writable
}

export interface Patient {
  id: string
  identifier?:string
  photoUrl?: string
  givenName: string
  familyName: string
  birthDate: string
  gender: string
  email: string

  job: string
  phone: string
  street: string
  city: string
  neighborhood: string
  reference: string
}

export interface Specialization {
  id: string
  description: string
}

export interface Appointment {
  id: string
  start: Date
  end: Date
  patientId: Patient['id']
  doctorId: Doctor['id']
  description: string
  organizationId: string
}
