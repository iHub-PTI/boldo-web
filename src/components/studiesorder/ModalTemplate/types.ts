

export type StudiesWithIndication = {
  id?: number
  name?: string
  status?: boolean
  select?: boolean
  indication?: string
  studyOrderTemplateId ?: number
}

export type TemplateStudies = {
  id?: number
  name: string
  status?: boolean
  description?: string
  studiesIndication?: Array<StudiesWithIndication>
}