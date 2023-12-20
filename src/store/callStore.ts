import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICallConfigStore, ICallStore } from './types/types.store'
import { CONFIG_COTURN } from '../util/config/coturn'

// Crea el store de llamada con la persistencia
export const useCallStore = create<ICallStore>()(set => ({
  streamRemote: undefined,
  setStreamRemote: value => set(() => ({ streamRemote: value })),
  openPicture: true,
  setOpenPicture: (value: boolean) => set(() => ({ openPicture: value })),
  currentCallPath: '',
  setCurrentCallPath: (value: string) => set(() => ({ currentCallPath: value })),
  peerConnectionStore: new RTCPeerConnection(CONFIG_COTURN),
  setPeerConnectionStore: (value: RTCPeerConnection | null) => set(() => ({ peerConnectionStore: value })),
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
