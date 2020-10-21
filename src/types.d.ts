// Type definitions for Boldo
// Project: https://boldo.com.py/
// Definitions by: Björn Schmidtke <https://github.com/pa1nd>
// TypeScript Version: 3.9

export as namespace Boldo

export interface Doctor extends iHub.Doctor {
  openHours: OpenHours
}

interface OpenHours {
  mon: { start: number; end: number }[]
  tue: { start: number; end: number }[]
  wed: { start: number; end: number }[]
  thu: { start: number; end: number }[]
  fri: { start: number; end: number }[]
  sat: { start: number; end: number }[]
  sun: { start: number; end: number }[]
}
