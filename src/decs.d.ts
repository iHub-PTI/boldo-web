// Type definitions for iHub
// Project: https://ihub.com.py/
// Definitions by: Björn Schmidtke <https://github.com/pa1nd>
// TypeScript Version: 3.9

export as namespace iHub

export interface Doctor {
  photo: string
  givenName: string
  familyName: string
  languages: string[]
  biography: string
  birthDate: string
  gender: string
  email: string
  phone: string
  street: string
  city: string
  neighborhood: string
  addressDescription: string
  specialtyId: string
  licenseId: string
}

export interface Patient {
  photo: string
  givenName: string
  familyName: string
  birthDate: string
  occupation: string
  gender: string
  email: string
  phone: string
  street: string
  city: string
  neighborhood: string
  reference: string
}
