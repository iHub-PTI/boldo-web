

export type StudiesWithIndication = {
  name: string
  select: boolean
  indication: string
}

export type TemplateStudies = {
  id: number
  name: string
  desc?: string
  studiesIndication?: Array<StudiesWithIndication>
}