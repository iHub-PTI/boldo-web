export type InputValue = {id?: string, description: string, date?: Date, relationship?: string }

export type DataList = Array<InputValue>

export type Allergy = {
  id?: string,
  description: string,
}

export type Cardiopathy = {
  id?: string,
  description: string
}

export type Respiratory = {
  id?: string, 
  description: string
}

export type Procedure = {
  id?: string,
  description: string,
  date?: Date,
}

export type Digestive = {
  id?: string,
  description: string
}

export type Others = {
  id?: string,
  description: string,
  date?: Date,
  relationship?: string
}

export type Gynecology = {
  gestations_number: number,
  births_number: number,
  cesarean_number: number,
  abortions_number: number,
  menarche_age: number,
  last_menstruation: number,
}

export type HereditaryDiseas ={
  id?: string
  description: string,
  relationship?: string,
}

export type Personal = {
  allergies: Allergy[],
  cardiopathies: Cardiopathy[],
  respiratory: Respiratory[],
  digestive: Digestive[],
  procedures: Procedure[],
  others: Others[],
  gynecology: Gynecology,
}

export type Family = {
  hereditary_diseases: HereditaryDiseas[],
  others: Others[],
}

export type MedicalHistoryType ={
  personal: Personal,
  family: Family,
}