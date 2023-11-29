import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICallStore } from './types/types.store'


// Crea el store de llamada con la persistencia
export const useCallStore = create<ICallStore>()(
  persist(
    (set) => ({
     audioEnabled: false,
     videoEnabled: false,
     setAudioEnabled: (value) => set(() => ({ audioEnabled: value })),   
     setVideoEnabled: (value) => set(() => ({ videoEnabled: value })), 
    }),
    {
      name: 'use-call-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)