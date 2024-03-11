import { create } from "zustand"

interface encounter {
  encounterId: string
  setEncounterId: (value: string) => void
}

export const useEncounterStore = create<encounter> ((set) => ({
  encounterId: '',
  setEncounterId: (value) => set(() => ({ encounterId: value })),
}))