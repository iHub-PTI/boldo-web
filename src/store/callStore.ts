import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICallConfigStore, ICallStore } from './types/types.store'

// Crea el store de llamada con la persistencia
export const useCallStore = create<ICallStore>()(set => ({
  streamRemote: undefined,
  setStreamRemote: value => set(() => ({ streamRemote: value })),
  cleanStream: () => {},
  setCleanStream: (cleanUp: () => void) => set(() => ({ cleanStream: cleanUp })),
  openPicture: true,
  setOpenPicture: (value: boolean) => set(() => ({ openPicture: value })),
  currentCallPath: '',
  setCurrentCallPath: (value: string) => set(() => ({ currentCallPath: value })),
}))

export const useCallConfigStore = create<ICallConfigStore>()(
  persist(
    set => ({
      audioEnabled: false,
      videoEnabled: false,
      setAudioEnabled: value => set(() => ({ audioEnabled: value })),
      setVideoEnabled: value => set(() => ({ videoEnabled: value })),
    }),
    {
      name: 'use-call-store-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
