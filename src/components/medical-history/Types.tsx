export type InputValue = { id?: string, description: string, performedDate?: Date, relationship?: string }

export type DataList = Array<InputValue>

export type Allergy = {
  id?: string,
  description: string,
}

export type Pathology = {
  id?: string,
  description: string
  category: "CDP" | "RPT" | "DGT"
}

export type Procedure = {
  id?: string,
  description: string,
  date?: Date,
}

export type Others = {
  id?: string,
  description: string,
  date?: Date,
  relationship?: string
}

export type GynecologyType = {
  code: 'CBG' | 'CBH' | 'CSN' | 'MCE' | 'MRE' | 'LMT'
  id?: string,
  value: number
}

export type HereditaryDiseas = {
  id?: string
  description: string,
  relationship?: string,
}

export type Personal = {
  allergies: Allergy[],
  pathologies: Pathology[]
  procedures: Procedure[],
  others: Others[],
  gynecology: GynecologyType[],
}

export type Family = {
  hereditary_diseases: HereditaryDiseas[],
  others: Others[],
}

export type MedicalHistoryType = {
  personal: Personal,
  family: Family,
}